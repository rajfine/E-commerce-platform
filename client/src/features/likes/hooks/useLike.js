import { useDispatch, useSelector } from 'react-redux'
import { getLikes, toggleLike } from '../api/like.api.js'
import { setLikedProducts, setLoading, clearLikes, addLikedProduct, removeLikedProduct } from '../state/like.slice.js'

export const useLike = () => {
  const dispatch = useDispatch()
  const likedProducts = useSelector(state => state.like?.likedProducts || [])
  const loading = useSelector(state => state.like?.loading || false)

  const handleGetLikes = async () => {
    dispatch(setLoading(true))
    const data = await getLikes()
    if (data.success) {
      dispatch(setLikedProducts(data.products || []))
    }
    dispatch(setLoading(false))
    return data
  }

  const handleToggleLike = async (product) => {
    // Optimistic UI Update
    const isLiked = likedProducts.some(p => p._id === product._id)
    if (isLiked) {
      dispatch(removeLikedProduct(product._id))
    } else {
      dispatch(addLikedProduct(product))
    }

    const data = await toggleLike(product._id)
    if (!data.success) {
      // Revert if API fails
      if (isLiked) {
        dispatch(addLikedProduct(product))
      } else {
        dispatch(removeLikedProduct(product._id))
      }
    } else {
      // If server returned the full populated product differently, we might want to update it.
      // For now, optimistic update is sufficient.
      // But we can call handleGetLikes() to sync if needed.
    }
    return data
  }

  const handleClearLikes = () => {
    dispatch(clearLikes())
  }

  return { handleGetLikes, handleToggleLike, handleClearLikes, likedProducts, loading }
}
