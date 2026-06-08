import mongoose from "mongoose";
import priceSchema from "./price.schema.js";


const paymentSchema = new mongoose.Schema({
  status:{
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending"
  },
  price:{
    type: priceSchema,
    required: true
  },
  razorpay:{
    orderId: {
      type: String,
      required: true
    },
    paymentId: {
      type: String
    },
    signature: {
      type: String
    }
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  orderItems:[
    {
        title: String,
        productId: mongoose.Schema.Types.ObjectId,
        variantId: mongoose.Schema.Types.ObjectId,
        quantity: Number,
        images: [{url:String}],
        price:priceSchema
    }
  ]
  
})

const paymentModel = new mongoose.model("Payment",paymentSchema)
export default paymentModel
