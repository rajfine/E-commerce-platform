import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import { validateLoginUser, validateRegisterUser } from "../validators/auth.validator.js";

const authRouter = Router()

authRouter.post("/register",validateRegisterUser, register)
authRouter.post("/login",validateLoginUser, login)

export default authRouter
