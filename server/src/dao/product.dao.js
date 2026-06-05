/**
 * In a MERN (MongoDB, Express, React, Node.js) stack application,
 *  a DAO (Data Access Object) file is a backend file that encapsulates all the raw database queries 
 *    and CRUD operations for a specific data resource
 */

import productModel from '../models/product.model.js'

export const stockOfVariant = async (productId, variantId)=>{
  const product = await productModel.findOne({
    _id: productId,
    "variant._id": variantId
  })
  
  const stock = product.variant.find(v => v._id.toString() === variantId).stock
  return stock
}
