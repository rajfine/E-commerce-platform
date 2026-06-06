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
    }
  }
})

export const { setItems, addItem , setCart} = cartSlice.actions
export default cartSlice.reducer