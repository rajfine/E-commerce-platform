import axios from 'axios'

const cartApiInstance =  axios.create({
    baseURL: '/api/cart',
    withCredentials: true
})

export const addToCart = async ({productId, variantId}) => {

  const response = await cartApiInstance.post(`/add/${productId}/${variantId}`,{
    quantity: 1
  })
  return response.data
  
}


export const getCart = async () => {
  const response = await cartApiInstance.get("/",{withCredentials: true})
  return response.data
}

export const updateCartItemSize = async ({ itemId, size }) => {
  const response = await cartApiInstance.put(`/update-size/${itemId}`, { size })
  return response.data
}

export const removeFromCart = async (itemId) => {
  const response = await cartApiInstance.delete(`/remove/${itemId}`)
  return response.data
}

export const updateCartItemQuantity = async ({ itemId, quantity }) => {
  const response = await cartApiInstance.put(`/update-quantity/${itemId}`, { quantity })
  return response.data
}