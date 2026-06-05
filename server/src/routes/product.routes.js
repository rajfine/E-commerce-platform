import {Router} from 'express'
import { verifySeller } from '../middleware/auth.middleware.js'
// import { validateProducts } from '../validators/product.validator.js'

import multer from 'multer'
import {  addProductVariantController, createProductController, getAllProductController, getProductDetailsController, getSellerProductsController, updateVariantController, deleteVariantController } from '../controllers/product.controller.js'
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


/**
 * @route PUT /:productId/variant
 * @description add a new variant to a product
 * @access Private (Seller only)
 */
productRouter.put("/:productId/variant", verifySeller, upload.array("images", 7), addProductVariantController )

/**
 * @route PUT /:productId/variant/:variantId
 * @description update variant stock or attributes (sizes)
 */
productRouter.put("/:productId/variant/:variantId", verifySeller, upload.array("images", 7), updateVariantController)

/**
 * @route DELETE /:productId/variant/:variantId
 * @description delete a variant
 */
productRouter.delete("/:productId/variant/:variantId", verifySeller, deleteVariantController)


export default productRouter
