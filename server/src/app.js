import express from 'express'
import authRouter from './routes/auth.routes.js'
import cors from 'cors'
import passport, { strategies } from 'passport'
import {Strategy as GoogleStretegy} from 'passport-google-oauth20'
import { config } from './config/config.js'
import productRouter from './routes/product.routes.js'
import cookieParser from 'cookie-parser'
import cartRouter from './routes/cart.routes.js'
import likeRouter from './routes/like.routes.js'
import path from "path";
import { fileURLToPath } from "url";


const app = express()
app.use(express.json())

app.use(passport.initialize())

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(cookieParser())

passport.use(new GoogleStretegy({
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback'
},(accsessToken, refreshToken, profile, done)=>{
  return done(null, profile)
}))


app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true,
}))


app.use("/api/auth", authRouter)
app.use("/api/product", productRouter)
app.use("/api/cart", cartRouter)
app.use("/api/like", likeRouter)


app.use(express.static(path.join(__dirname, "../dist")));

app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});





export default app