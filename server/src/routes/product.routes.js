import {Router} from 'express'
import { verifySeller } from '../middleware/auth.middleware.js'
// import { validateProducts } from '../validators/product.validator.js'

import multer from 'multer'
import {  createProductController, getAllProductController, getProductDetailsController, getSellerProductsController } from '../controllers/product.controller.js'
import { validateProducts } from '../validators/product.validator.js'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
})

const productRouter = Router()

/**
 * @route POST /api/product/create
 * @description crate a new product 
 * @access Public
 */
productRouter.post("/create", verifySeller, upload.array("images", 7), validateProducts, createProductController )


/**
 * @route GET /api/product/myproducts/seller
 * @description show my all posted product
 * @access Private (Seller only)
 */
productRouter.get("/myproducts/seller", verifySeller, getSellerProductsController)


/**
 * @route
 */
productRouter.get("/", getAllProductController)


/**
 * @route
 */
productRouter.get('/details/:id', getProductDetailsController)


export default productRouter
