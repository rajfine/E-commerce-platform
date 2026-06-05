import {param, body, validationResult} from 'express-validator'

const validateRequest = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

export const ValidateAddToCart = [
  param('productId').isMongoId().withMessage('Invalid product ID'),
  param('variantId').isMongoId().withMessage('Invalid variant ID'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive more than 0'),
  body('size').optional().isString().withMessage('Size must be a string'),
  validateRequest
]