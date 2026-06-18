import mongoose from 'mongoose'

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products',
      required: true
    }
  ]
})

const likeModel = mongoose.model('like', likeSchema)

export default likeModel
