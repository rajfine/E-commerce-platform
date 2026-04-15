import mongoose from 'mongoose'

const connectToDB = async (req,res)=>{
  try{
    await mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
      console.log("connected to DB")
    })
  }catch(err){
    console.error("Database connection failed", err.message)
    process.exit(1)
  }
}

export default connectToDB