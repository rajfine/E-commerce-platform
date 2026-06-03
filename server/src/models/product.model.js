import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  seller:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  price:{
    amount:{
      type: Number,
      required: true
    },
    currency:{
      type: String,
      enum: ["INR", "USD", "EUR", "GBP", "JPY"],
      default: "INR"
    }
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
      stock:{
        type: Number,
        required: true,
        min: 0,
        default: 0
      },
      attributes:{
        type: Map,
        of: String
      },
      price:{
        amount:{
          type: Number,
          required: true
        },
        currency:{
          type: String,
          enum: ["INR", "USD", "EUR", "GBP", "JPY"],
          default: "INR"
        }
      }
    }
  ]
},{timestamps: true})


const productModel = mongoose.model("products", productSchema)

export default productModel