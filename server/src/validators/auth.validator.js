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
  .withMessage("Contact must be exactly 10 digits"),

  body("password")
  .trim()
  .isLength({min:6}).withMessage("Password must be at least 6 characters")
  .bail()
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/)
  .withMessage(
    "Password must be at least 6 chars, include uppercase, lowercase, number, and special character"
  ),
  
  body("fullname")
  .notEmpty().withMessage("name should not be empty")
  .isLength({min:3}).withMessage("contain atleast 3 character"),

  body("isSeller")
  .isBoolean().withMessage("isSeller must be a boolean value"),

  validateResult
]

export const validateLoginUser = [
  body("email")
    .optional({ checkFalsy: true })
    .trim()
    .isEmail().withMessage("invalid Email"),

  body("contact")
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^\d{10}$/)
    .withMessage("Contact must be exactly 10 digits"),

  body()
    .custom((value) => {
      if (!value.email && !value.contact) {
        throw new Error("email or contact is required")
      }
      return true
    }),

  body("password")
    .notEmpty().withMessage("password is required"),

  validateResult
]
