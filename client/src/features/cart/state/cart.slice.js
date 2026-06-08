import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    // items: [],
    cart: null
  },
  reducers: {
    setCart(state, action){
      state.cart = action.payload
    },
    setItems(state, action) {
      state.items = action.payload
    },
    addItem(state, action) {
      state.items.push(action.payload)
    },
    clearCart(state) {
      state.cart = null
      state.items = []
    }
  }
})

export const { setItems, addItem , setCart, clearCart} = cartSlice.actions
export default cartSlice.reducer