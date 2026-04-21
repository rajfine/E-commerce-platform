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
    required: true
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

userSchema.pre('save', async function (){
  if(!this.isModified("password")) return

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(this.password, salt)
  this.password = hash
})


// we created a method to compare password
userSchema.methods.comparePassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password)
}

const userModel = mongoose.model("user", userSchema)

export default userModel
