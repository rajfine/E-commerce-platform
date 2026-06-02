import jwt from 'jsonwebtoken'
import { config } from '../config/config.js'
import userModel from '../models/user.model.js'

export const verifySeller =  async (req, res, next)=>{
  const token = req.cookies.token
  if(!token){
    return res.status(400).json({
      message: "token not found!"
    })
  }

  try{
    const decoded = await jwt.verify(token, config.JWT_SECRET)
    const user = await userModel.findById(decoded.id)
    // console.log(user)
    if(user.role != "seller"){
      return res.status(401).json({
        message: "u r not seller"
      })
    }

    req.user = user
    next()

  }catch(err){
    return res.status(401).json({
      message: "invalid token"
    })
  }
}


export const authenticateUser = async (req, res, next)=>{
  const token = req.cookies.token
  if(!token){
    return res.status(404).json({
      message: "token not found u need to login"
    })
  }

  try{
    const decoded = await jwt.verify(token, config.JWT_SECRET)
    const user = await userModel.findById(decoded.id)

    if(!user){
      return res.status(401).json({message: "unauthorized"})
    }
    req.user = user
    next()
    
  }catch(err){
    return res.status(401).json({
      message : "invalid token "
    })
  }
}