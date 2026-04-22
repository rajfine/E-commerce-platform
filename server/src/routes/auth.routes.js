import { Router } from "express";
import { googleCallback, login, register } from "../controllers/auth.controller.js";
import { validateLoginUser, validateRegisterUser } from "../validators/auth.validator.js";
import passport from "passport";
import { config } from "../config/config.js";

const authRouter = Router()

authRouter.post("/register",validateRegisterUser, register)
authRouter.post("/login",validateLoginUser, login)

authRouter.get('/google',
  passport.authenticate('google',{ scope:['profile', "email"]})
)

authRouter.get('/google/callback',
  passport.authenticate('google',{
    session: false,
    failureRedirect: config.Node_ENV == "development"? "http://localhost:5173/login" : "/login"
  }),
  googleCallback
)

export default authRouter
