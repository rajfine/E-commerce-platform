import { addToCart , getCart, updateCartItemSize, removeFromCart, updateCartItemQuantity, createOrder , verifyOrder} from '../service/cart.api.js'
import { useDispatch } from 'react-redux'
import {addItem, setItems, setCart, clearCart } from '../state/cart.slice.js'


export const useCart = ()=>{
  const dispatch = useDispatch()

  async function handleAddItem({productId, variantId, size}) {
    const data = await addToCart({
      productId: productId,
      variantId: variantId,
      size: size
    })
    // Refresh cart state to update the Navbar badge
    if (data && data.success !== false) {
      await handleGetCart()
    }
    return data.cart
  }

  async function handleGetCart(){
    const data = await getCart()
    dispatch(setItems(data.cart.items))
    dispatch(setCart(data.cart))
    return data.cart
  }

  async function handleUpdateSize(itemId, size) {
    const data = await updateCartItemSize({ itemId, size })
    if (data.success) {
      await handleGetCart() // Refresh cart after update
    }
    return data
  }

  async function handleRemoveFromCart(itemId) {
    const data = await removeFromCart(itemId)
    if (data.success) {
      await handleGetCart()
    }
    return data
  }

  async function handleUpdateQuantity(itemId, quantity) {
    const data = await updateCartItemQuantity({ itemId, quantity })
    if (data.success) {
      await handleGetCart()
    }
    return data
  }

  async function handleCreateOrder(){
    const data = await createOrder()
    return data
  }

  async function handleVerifyOrder(orderId, paymentId, signature){
    const data = await verifyOrder({orderId, paymentId, signature})
    return data.success
  }

  function handleClearLocalCart() {
    dispatch(clearCart())
  }

  return {handleAddItem, handleGetCart, handleUpdateSize, handleRemoveFromCart, handleUpdateQuantity, handleCreateOrder, handleVerifyOrder, handleClearLocalCart}
}
