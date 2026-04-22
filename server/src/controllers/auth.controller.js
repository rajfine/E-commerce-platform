import userModel from "../models/user.model.js"
import jwt from 'jsonwebtoken'
import {config} from '../config/config.js'
// import cookieParse from 'cookie-parser'

const sendTokenResponse = async (user, res, message)=>{
  const token = await jwt.sign({
    id: user._id
  }, config.JWT_SECRET,{expiresIn: "7d"})

  res.cookie("token", token)

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
    const existingUser = await userModel.findOne({
      $or: [
        {email},
        {contact}
      ]
    })
    if(existingUser){
      return res.status(400).json("user with this email or contact is already exists")
    }

    const user = await userModel.create({
      email,
      contact,
      password,
      fullname,
      role: isSeller? "seller" : "buyer" 
    })

    await sendTokenResponse(user, res, "user registered successfully")

  }catch(err){
    console.error("Register error:", err)
    if (err.code === 11000) {
      return res.status(400).json({
        message: "user with this email or contact is already exists"
      })
    }
    return res.status(500).json({
      message: err.message || "server error"
    })
  }

} 


export const login = async (req, res)=>{
  const {email, contact, password} = req.body

  try{
    const user = await userModel.findOne({
      $or:[
        {email},
        {contact}
      ]
    })
    if(!user){
      return res.status(404).json({
        message: "invalid email or contact"
      })
    }

    const isMatch = await user.comparePassword(password)
    if(!isMatch){
      return res.status(400).json({
        message: "invalid password"
      })
    }
    await sendTokenResponse(user, res, "user logged in successfully")

  }catch(err){
    console.error(err.message)
    return res.status(500).json("server error")
  }
}


export const googleCallback  = async (req, res)=>{
  const {id, displayName, emails, photos} = req.user
  const email = emails[0].value
  const profile = photos[0].value

  let user = await userModel.findOne({
    email
  })
  if(!user){
    const user = await userModel.create({
      email: email,
      googleId: id,
      fullname: displayName
    })
  }

  const token = await jwt.sign({
    id: user._id
  }, config.JWT_SECRET, {expiresIn: "7d"})

  res.cookie("token", token)
  
  res.redirect('http://localhost:5173/')
}