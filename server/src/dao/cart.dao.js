import cartModel from '../models/cart.model.js'
import mongoose from 'mongoose'

export const getCartDetails = async (userId)=>{

  let cart = await cartModel.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId)
          }
        },
        { $unwind: { path: '$items' } },
        {
          $lookup: {
            from: 'products',
            localField: 'items.product',
            foreignField: '_id',
            as: 'items.product'
          }
        },
        { $unwind: { path: '$items.product' } },
        {
          $unwind: { path: '$items.product.variant' }
        },
        {
          $match: {
            $expr: {
              $eq: [
                '$items.variant',
                '$items.product.variant._id'
              ]
            }
          }
        },
        {
          $addFields: {
            itemPrice: {
              price: {
                $multiply: [
                  '$items.quantity',
                  '$items.product.variant.price.amount'
                ]
              },
              currency:
                '$items.product.variant.price.currency'
            }
          }
        },
        {
          $group: {
            _id: '$_id',
            totalPrice: { $sum: '$itemPrice.price' },
            currency: {
              $first: '$itemPrice.currency'
            },
            items: { $push: '$items' }
          }
        }
      ])

  return cart
}