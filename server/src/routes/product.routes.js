import {Router} from 'express'
import { verifySeller } from '../middleware/auth.middleware.js'
// import { validateProducts } from '../validators/product.validator.js'

import multer from 'multer'
import { createProduct } from '../controllers/product.controller.js'
import { validateProducts } from '../validators/product.validator.js'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
})

const productRouter = Router()

productRouter.post("/create", verifySeller, upload.array("images", 7), validateProducts, createProduct )



export default productRouter
