import express from 'express'
import authRouter from './routes/auth.routes.js'
import cors from 'cors'
import passport, { strategies } from 'passport'
import {Strategy as GoogleStretegy} from 'passport-google-oauth20'
import { config } from './config/config.js'

const app = express()
app.use(express.json())

app.use(passport.initialize())

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

export default app