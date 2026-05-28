import productModel from "../models/product.model.js"
import { uploadFile } from "../services/storage.service.js"



export const createProductController = async (req, res)=>{
  const {title, description, priceAmount, priceCurrency, imageAlts} = req.body

  const seller = req.user
  const alts = Array.isArray(imageAlts) ? imageAlts : [imageAlts]

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
    price: {
      amount : priceAmount,
      currency : priceCurrency || "INR"
    },
    images,
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