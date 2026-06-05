import mongoose from 'mongoose'
import priceSchema from './price.schema.js'

const productSchema = new mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  category:{
    type: String,
    required: true
  },
  seller:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  price:{
    type: priceSchema,
    required: true
  },
  images:[
    {
      url:{
        type: String,
        required: true
      },
      alt:{
        type: String,
        required: true
      }
    }
  ],
  variant:[
    {
      images: [
        {
          url: {
            type: String,
            required: true
          }
        }
      ],
      category:{
        type: String
      },
      stock:{
        type: Number,
        required: true,
        min: 0,
        default: 0
      },
      attributes:{
        type: mongoose.Schema.Types.Mixed,
        default: {}
      },
      price:{
        type: priceSchema,
      }
    }
  ]
},{timestamps: true})


const productModel = mongoose.model("products", productSchema)

export default productModel