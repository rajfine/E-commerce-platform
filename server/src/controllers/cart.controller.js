import cartModel from '../models/cart.model.js'
import { stockOfVariant } from '../dao/product.dao.js'
import productModel from '../models/product.model.js'
import mongoose from 'mongoose'

export const addToCartController = async (req, res)=>{
  console.log("addToCartController hit")
  const {productId, variantId} = req.params
  const {quantity = 1, size} = req.body
  const user = req.user

  const product = await productModel.findOne({
    _id: productId,
    "variant._id": variantId
  })

  // console.log(product)

  if(!product){
    return res.status(404).json({
      message: "Product or variant not found",
      success: false
    })
  }
  
  const stock = await stockOfVariant(productId, variantId)
  const cart = (await cartModel.findOne({user: user._id}))  || await cartModel.create({user: user._id, items: []})

  const isProductAlreadyInCart = cart.items.some(item => item.product.toString() === productId && item.variant.toString() === variantId && item.size === size)

  if(isProductAlreadyInCart){
    const QuantityOfProductInCart = cart.items.find(item => item.product.toString() === productId && item.variant.toString() === variantId && item.size === size).quantity
    if(QuantityOfProductInCart + quantity > stock){
      return res.status(400).json({
        message: `Only ${stock - QuantityOfProductInCart} items left in stock and you already have ${QuantityOfProductInCart} items in your cart`,
        success: false
      })
    }
    await cartModel.findOneAndUpdate(
      {_id: cart._id, "items.product": productId, "items.variant": variantId, "items.size": size},
      {$inc: {"items.$.quantity": quantity}},
      {returnDocument: 'after' }
    )

    return res.status(200).json({
      message: "Product quantity updated in cart",
      success: true
    })
  }

  if(quantity > stock){
    return res.status(400).json({
      message: `Only ${stock} items left in stock`,
      success: false
    })
  }

  const variant = product.variant.find(v => v._id.toString() === variantId)
  cart.items.push({
    product: productId,
    variant: variantId,
    size,
    quantity,
    price: variant.price || product.price 
  })

  await cart.save()

  return res.status(200).json({
    message: "Product added to cart",
    success: true
  })

}

export const removeFromCartController = async (req, res)=>{
  try {
    const { itemId } = req.params;
    const user = req.user;

    const cart = await cartModel.findOneAndUpdate(
      { user: user._id },
      { $pull: { items: { _id: itemId } } },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    return res.status(200).json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    console.error("removeFromCartController error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export const getCartController = async (req, res) => {
  try {
    const user = req.user
    // let cart = await cartModel.findOne({user: user._id}).populate("items.product") 
    let cart = await cartModel.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(user._id)
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
    // console.log(cart[0])

    if (cart.length === 0) {
      let existingCart = await cartModel.findOne({ user: user._id });
      if (!existingCart) {
        existingCart = await cartModel.create({ user: user._id, items: [] });
      }
      return res.status(200).json({
        message: "Cart fetched successfully",
        success: true,
        cart: existingCart.toObject()
      });
    }

    const cartObj = cart[0];
    console.log(cartObj)

    // cart = cartObj.items.map(item => {
    //   if (item.product && item.product.variant) {
    //     // Due to $unwind in the pipeline, item.product.variant is already the single matched variant object, not an array.
    //     item.variant = item.product.variant;
    //   }
    //   return item;
    // });

    return res.status(200).json({
      message: "Cart fetched successfully",
      success: true,
      cart: cartObj
    })
  } catch (error) {
    console.error("getCartController error:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
}

export const updateCartItemSizeController = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { size } = req.body;
    const user = req.user;

    const cart = await cartModel.findOne({ user: user._id });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) return res.status(404).json({ success: false, message: "Item not found in cart" });

    const currentItem = cart.items[itemIndex];

    // Check if another item already exists with the same product, variant, and NEW size
    const existingItemIndex = cart.items.findIndex(item => 
      item.product.toString() === currentItem.product.toString() &&
      item.variant.toString() === currentItem.variant.toString() &&
      item.size === size &&
      item._id.toString() !== itemId
    );

    if (existingItemIndex !== -1) {
      // Merge items if they match
      cart.items[existingItemIndex].quantity += currentItem.quantity;
      cart.items.splice(itemIndex, 1);
    } else {
      // Just update the size
      cart.items[itemIndex].size = size;
    }

    await cart.save();
    return res.status(200).json({ success: true, message: "Size updated successfully" });

  } catch (error) {
    console.error("updateCartItemSizeController error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export const updateCartItemQuantityController = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const user = req.user;

    const cart = await cartModel.findOne({ user: user._id });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) return res.status(404).json({ success: false, message: "Item not found in cart" });

    const currentItem = cart.items[itemIndex];
    
    // Check stock
    const stock = await stockOfVariant(currentItem.product.toString(), currentItem.variant.toString());
    if (quantity > stock) {
      return res.status(400).json({ success: false, message: `Only ${stock} items left in stock` });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    return res.status(200).json({ success: true, message: "Quantity updated successfully" });

  } catch (error) {
    console.error("updateCartItemQuantityController error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}