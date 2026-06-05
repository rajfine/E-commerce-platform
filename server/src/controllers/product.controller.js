import productModel from "../models/product.model.js"
import { uploadFile } from "../services/storage.service.js"

const parseAttributes = (attributes) => {
  if (!attributes) return {}

  const parsed = typeof attributes === "string"
    ? JSON.parse(attributes)
    : attributes

  if (Array.isArray(parsed)) {
    return parsed.reduce((acc, item) => {
      if (item && typeof item === "object" && !Array.isArray(item)) {
        return { ...acc, ...item }
      }
      return acc
    }, {})
  }

  if (typeof parsed === "object") return parsed

  return {}
}



export const createProductController = async (req, res)=>{
  const {title, description, category, priceAmount, priceCurrency, imageAlts, stock, attributes} = req.body

  const seller = req.user
  const alts = Array.isArray(imageAlts) ? imageAlts : [imageAlts]

  let parsedAttributes = {}
  try {
    if (attributes) {
      parsedAttributes = JSON.parse(attributes)
    }
  } catch (error) {
    console.error("Error parsing attributes", error)
  }

  const images = await Promise.all(req.files.map( async (file, index)=>{
    const uploadedImage = await uploadFile({
      buffer: file.buffer,
      filename: file.originalname
    })

    return {
      url: uploadedImage.url,
      alt: alts[index] || title
    }
  }))

  const product = await productModel.create({
    title,
    description,
    category,
    price: {
      amount : priceAmount,
      currency : priceCurrency || "INR"
    },
    images,
    variant: [{
      images,
      category,
      stock: stock ? Number(stock) : 0,
      attributes: parsedAttributes,
      price: {
        amount: priceAmount,
        currency: priceCurrency || "INR"
      }
    }],
    seller: seller._id
  })

  return res.status(201).json({
    message: "product created successfully",
    sucess: true,
    product,
  })
}


export const getSellerProductsController = async (req, res)=>{
  const seller = req.user

  const products = await productModel.find({seller: seller._id})
  if(!products){
    return res.status(400).json({
      message: "you dont have any products right now"
    })
  }

  return res.status(201).json({
    message : "products fetched successfully",
    success: true,
    products
  })
}


export const getAllProductController = async (req, res)=>{
  const products = await productModel.find()
  
  return res.status(200).json({
    message: "products fetched successfully",
    success: true,
    products
  })
}


export const getProductDetailsController = async (req, res)=>{
  const {id} = req.params
  const product = await productModel.findById(id)

  if(!product){
    return res.status(404).json({
      messsage: "product not found",
      success: false,
    })
  }

  return res.status(200).json({
    message: "product details fetched successfully",
    success: true,
    product
  })
}

export const addProductVariantController = async (req, res)=>{
  const {productId} = req.params
  const {stock, attributes, priceAmount, priceCurrency} = req.body

  const product = await productModel.findOne({
    _id: productId,
    seller: req.user._id 
  })
  if(!product){
    return res.status(404).json({
      message: "product not found",
      success: false,
    })
  }
  
  const files = req.files || []
  const images = await Promise.all(files.map(async (file) => {
    const image = await uploadFile({
        buffer: file.buffer,
        filename: file.originalname
      })
    return { url: image.url }
  }))

  let parsedAttributes
  try {
    parsedAttributes = parseAttributes(attributes)
  } catch {
    return res.status(400).json({
      message: "attributes must be a valid object",
      success: false,
    })
  }

  product.variant.push({
    images,
    category: product.category,
    stock,
    attributes: parsedAttributes,
    price: {
      amount: priceAmount,
      currency: priceCurrency || product.price.currency
    }
  })

  const validPrices = product.variant.map(v => v.price?.amount).filter(amt => typeof amt === 'number' && !isNaN(amt))
  if (validPrices.length > 0) {
    product.price.amount = Math.min(...validPrices)
  }

  await product.save()
  
  return res.status(200).json({
    message: "variant added successfully",
    success: true,
    product
  })
}

export const updateVariantController = async (req, res) => {
  const { productId, variantId } = req.params
  const { stock, attributes, priceAmount, priceCurrency, existingImages } = req.body

  const product = await productModel.findOne({
    _id: productId,
    seller: req.user._id
  })
  if (!product) return res.status(404).json({ message: 'product not found', success: false })

  const variant = product.variant.id(variantId)
  if (!variant) return res.status(404).json({ message: 'variant not found', success: false })

  if (stock !== undefined) variant.stock = Math.max(0, Number(stock))
  if (attributes !== undefined) {
    const parsed = typeof attributes === 'string' ? JSON.parse(attributes) : attributes
    variant.attributes = parsed
    variant.markModified('attributes')
  }

  // Handle price
  if (priceAmount !== undefined) {
    if (!variant.price) variant.price = {}
    variant.price.amount = Number(priceAmount)
    if (priceCurrency) variant.price.currency = priceCurrency
  }

  // Handle images
  let finalImages = []
  if (existingImages) {
    const exImgs = Array.isArray(existingImages) ? existingImages : [existingImages]
    finalImages = exImgs.map(imgStr => {
      const parsed = typeof imgStr === 'string' ? JSON.parse(imgStr) : imgStr
      return { url: parsed.url, alt: parsed.alt || product.title }
    })
  }

  const files = req.files || []
  if (files.length > 0) {
    const newImages = await Promise.all(files.map(async (file) => {
      const image = await uploadFile({
          buffer: file.buffer,
          filename: file.originalname
        })
      return { url: image.url, alt: product.title }
    }))
    finalImages = [...finalImages, ...newImages]
  }

  // Only override images if either new files or existing images were explicitly sent.
  // This allows partial updates if images aren't included in the payload.
  if (existingImages !== undefined || files.length > 0) {
    variant.images = finalImages
  }

  const validPrices = product.variant.map(v => v.price?.amount).filter(amt => typeof amt === 'number' && !isNaN(amt))
  if (validPrices.length > 0) {
    product.price.amount = Math.min(...validPrices)
  }

  await product.save()
  return res.status(200).json({ message: 'variant updated', success: true, product })
}

export const deleteVariantController = async (req, res) => {
  const { productId, variantId } = req.params

  const product = await productModel.findOne({
    _id: productId,
    seller: req.user._id
  })
  if (!product) return res.status(404).json({ message: 'product not found', success: false })

  product.variant = product.variant.filter(v => v._id.toString() !== variantId)
  await product.save()
  return res.status(200).json({ message: 'variant deleted', success: true, product })
}
