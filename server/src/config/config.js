import dotenv from 'dotenv'
dotenv.config()

if(!process.env.MONGO_URI){
  throw new Error("MONGO_URI is not defined in environmental variables")
}
if(!process.env.JWT_SECRET){
  throw new Error("JWT_SECRET not present")
}

if(!process.env.GOOGLE_CLIENT_ID){
  throw new Error("GOOGLE_CLIENT_ID not present")
}
if(!process.env.GOOGLE_CLIENT_SECRET){
  throw new Error("GOOGLE_CLIENT_SECRET not present")
}

if(!process.env.IMAGEKIT_PRIVATE_KEY){
  throw new Error("IMAGEKIT_PRIVATE_KEY not found")
}

if(!process.env.RAZORPAY_KEY_ID){
  throw new Error("RAZORPAY_KEY_ID not found")
}
if(!process.env.RAZORPAY_KEY_SECRET){
  throw new Error("RAZORPAY_KEY_SECRET not found")
}

export const config = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  Node_ENV: process.env.Node_ENV || "development",
  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET
}
