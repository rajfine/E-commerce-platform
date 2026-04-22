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


export const config = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  Node_ENV: process.env.Node_ENV || "development"
}
