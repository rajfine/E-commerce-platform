import express from 'express'
import authRouter from './routes/auth.routes.js'
import cors from 'cors'

const app = express()
app.use(express.json())


app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true,
}))


app.use("/api/auth", authRouter)

export default app