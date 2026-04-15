import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true
  },
  contact: {
    type: String, 
    required: true, 
    unique: true
  },
  password: { 
    type: String, 
    requires: true
  },
  role: {
    type: String,
    enum: ["buyer", "seller"],
    default: "buyer"
  },
  fullname: {
    type: String,
    required: true
  }
})

userSchema.pre('save', async (next)=>{
  if(!this.isModified("password")) return next()
  
  try{
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(this.password, salt)
    this.password = hash
    next()
  }catch(err){
    next(err)
  }
})

userSchema.methods.comparePassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password)
}

const userModel = mongoose.model("user", userSchema)

export default userModel