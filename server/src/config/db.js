import mongoose from 'mongoose'
import { config } from './config.js'


const connectToDB = async (req,res)=>{
  try{
    await mongoose.connect(config.MONGO_URI)
    .then(()=>{
      console.log("connected to DB")
    })
  }catch(err){
    console.error("Database connection failed", err.message)
    process.exit(1)
  }
}

export default connectToDB