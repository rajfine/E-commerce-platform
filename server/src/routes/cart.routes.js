import express from 'express'
const cartRouter = express.Router()
import { authenticateUser } from '../middleware/auth.middleware.js'
import { ValidateAddToCart } from '../validators/cart.validator.js'
import { addToCartController, getCartController, updateCartItemSizeController, removeFromCartController, updateCartItemQuantityController, createOrderController, verifyOrderController } from '../controllers/cart.controller.js'




/**
 * @route POST /api/cart/add/:productId/:variantId
 * @desc Add a product to the cart
 * @access Public
 * @argument productId - ID of the product to add
 * @argument variantId - ID of the product variant to add
 * @quantity - Quantity of the product to add (passed in request body)
 * @returns The updated cart object
 */
cartRouter.post("/add/:productId/:variantId", authenticateUser , ValidateAddToCart, addToCartController)


/**
 * @route GET /api/cart
 * @desc Get the current user's cart
 * @access Private
 * @returns The current user's cart object  
 */
cartRouter.get("/", authenticateUser, getCartController)

/**
 * @route PUT /api/cart/update-size/:itemId
 * @desc Update the size of a cart item
 * @access Private
 * @returns Success message
 */
cartRouter.put("/update-size/:itemId", authenticateUser, updateCartItemSizeController)


/**
 * @route DELETE /api/cart/remove/:itemId
 * @desc Remove a cart item
 * @access Private
 * @returns Success message
 */
cartRouter.delete("/remove/:itemId", authenticateUser, removeFromCartController)

/**
 * @route PUT /api/cart/update-quantity/:itemId
 * @desc Update the quantity of a cart item
 * @access Private
 * @returns Success message
 */
cartRouter.put("/update-quantity/:itemId", authenticateUser, updateCartItemQuantityController)


/**
 * @route POST /api/cart/payment/create-order
 * @desc Create a payment order
 * @access Private
 * @returns The payment order object
 */
cartRouter.post("/payment/create-order", authenticateUser, createOrderController)


/**
 * @route POST /api/cart/payment/verify-order
 * @desc Verify a payment order
 * @access Private
 * @returns The payment order object
 */
cartRouter.post("/payment/verify-order", authenticateUser, verifyOrderController)


export default cartRouter