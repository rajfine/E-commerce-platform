import userModel from "../models/user.model.js"
import jwt from 'jsonwebtoken'
import {config} from '../config/config.js'
// import cookieParse from 'cookie-parser'

const sendTokenResponse = async (user, res)=>{
  const token = await jwt.sign({
    id: user._id
  }, config.JWT_SECRET,{expiresIn: "7d"})

  res.cookies("token", token)

  return res.status(200).json({
    message,
    success: true,
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullname: user.fullname,
      role: user.role
    },
  })
}

export const register = async (req, res)=>{
  const {email, contact, password, fullname, isSeller} = req.body

  try{
    const existingUser = userModel.findOne({
      $or: [
        {email},
        {contact}
      ]
    })
    if(existingUser){
      return res.status(400).json("user with this email or contact is already exists")
    }

    const user = userModel.create({
      email,
      contact,
      password,
      fullname,
      role: isSeller? "seller" : "buyer" 
    })

    await sendTokenResponse(user, res, "user registered successfully")

  }catch(err){
    console.log(err.message)
    return res.status(500).json("server error")
  }

} 