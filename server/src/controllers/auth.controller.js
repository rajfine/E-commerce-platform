import userModel from "../models/user.model.js"
import jwt from 'jsonwebtoken'
import {config} from '../config/config.js'

const sendTokenResponse = async (user, res)=>{
  const token = await jwt.sign({
    id: user._id
  }, config.JWT_SECRET)
}

export const register = async (req, res)=>{
  const {email, contact, password, fullname, role} = req.body

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
      role
    })

  }catch(err){
    console.log(err.message)
    return res.status(500).json("server error")
  }

} 