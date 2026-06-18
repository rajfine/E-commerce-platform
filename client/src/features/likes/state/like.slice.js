import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  likedProducts: [],
  loading: false
}

const likeSlice = createSlice({
  name: 'like',
  initialState,
  reducers: {
    setLikedProducts: (state, action) => {
      state.likedProducts = action.payload
    },
    addLikedProduct: (state, action) => {
      // Prevent duplicates just in case
      if (!state.likedProducts.find(p => p._id === action.payload._id)) {
        state.likedProducts.push(action.payload)
      }
    },
    removeLikedProduct: (state, action) => {
      state.likedProducts = state.likedProducts.filter(p => p._id !== action.payload)
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    clearLikes: (state) => {
      state.likedProducts = []
    }
  }
})

export const { setLikedProducts, addLikedProduct, removeLikedProduct, setLoading, clearLikes } = likeSlice.actions
export default likeSlice.reducer
