import productModel from "../models/product.model.js"
import { uploadFile } from "../services/storage.service.js"



export const createProduct = async (req, res)=>{
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
