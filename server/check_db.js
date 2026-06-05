import mongoose from 'mongoose'
import productModel from './src/models/product.model.js'

async function check() {
  await mongoose.connect('mongodb+srv://raj:Raj%402375@snitch0.tgh80vj.mongodb.net/')
  const p = await productModel.findById('6a215bcb22f5b2d29783c73d')
  console.log("Product:", p)
  process.exit(0)
}
check()
