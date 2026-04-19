import { body, validationResult} from 'express-validator'


function validateResult (req, res, next){
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json( {errors: errors.array()} )
  }
  next()
}


export const validateRegisterUser = [
  body("email")
  .trim()
  .isEmail().withMessage("invalid Email"),

  body("contact")
  .trim()
  .notEmpty().withMessage("contact is required")
  .matches(/^\d{10}$/)
  .withMessage("Password must be exactly 10 digits"),

  body("password")
  .trim()
  .isLength({min:6})
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{10,}$/)
  .withMessage(
    "Password must be at least 10 chars, include uppercase, lowercase, number, and special character"
  ),
  
  body("fullname")
  .notEmpty().withMessage("name should not be empty")
  .isLength({min:3}).withMessage("contain atleast 3 character"),

  body("isSeller")
  .isBoolean().withMessage("isSeller must be a boolean value"),

  validateResult
]