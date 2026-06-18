import likeModel from '../models/like.model.js'

export const toggleLike = async (req, res) => {
  try {
    const userId = req.user._id
    const { productId } = req.body

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' })
    }

    let likeDoc = await likeModel.findOne({ user: userId })

    if (!likeDoc) {
      // Create new like document with this product
      likeDoc = await likeModel.create({
        user: userId,
        products: [productId]
      })
      return res.status(200).json({ success: true, message: 'Product liked', liked: true, like: likeDoc })
    }

    const productIndex = likeDoc.products.findIndex(id => id.toString() === productId.toString())

    if (productIndex > -1) {
      // Remove from likes
      likeDoc.products.splice(productIndex, 1)
      await likeDoc.save()
      return res.status(200).json({ success: true, message: 'Product unliked', liked: false, like: likeDoc })
    } else {
      // Add to likes
      likeDoc.products.push(productId)
      await likeDoc.save()
      return res.status(200).json({ success: true, message: 'Product liked', liked: true, like: likeDoc })
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

export const getLikes = async (req, res) => {
  try {
    const userId = req.user._id
    
    // Populate products to get image, title, price, etc.
    const likeDoc = await likeModel.findOne({ user: userId }).populate('products')

    if (!likeDoc) {
      return res.status(200).json({ success: true, products: [] })
    }

    return res.status(200).json({ success: true, products: likeDoc.products })
  } catch (error) {
    console.error('Error fetching likes:', error)
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
}
