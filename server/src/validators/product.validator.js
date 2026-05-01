import {body, validationResult} from 'express-validator'

function validateImages(req, res, next){
  if(!req.files || req.files.length === 0){
    return res.status(400).json({errors: [{msg: "At least one image is required"}]})
  }
  next()
}

function validateResult(req, res, next){
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
  }
  next()
}



export const validateProducts = [

  // 🔹 Title
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3-100 characters"),

  // 🔹 Description
  body("description")
    .trim()
    .notEmpty().withMessage("Description is required")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),

  // 🔹 Price amount
  body("priceAmount")
    .notEmpty().withMessage("Price amount is required")
    .isFloat({ gt: 0 })
    .withMessage("Price must be greater than 0"),

  // 🔹 Currency
  body("priceCurrency")
    .optional()
    .isIn(["INR", "USD", "EUR", "GBP", "JPY"])
    .withMessage("Invalid currency"),

  // 🔹 Image ALT
  body("imageAlts")
    .optional()
    .custom((value) => {
      const alts = Array.isArray(value) ? value : [value]
      return alts.every((alt) => typeof alt === "string" && alt.trim().length >= 3)
    })
    .withMessage("Alt text too short"),

  validateImages,
  validateResult
];
