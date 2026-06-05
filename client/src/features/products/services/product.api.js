import axios from 'axios'


const productApiInstance = axios.create({
  baseURL: '/api/product',
  withCredentials: true
})

export const createProduct = async (formData)=>{

  const response = await productApiInstance.post("/create", formData)

  return response.data
}


export const getSellerProducts = async ()=>{

  const response = await productApiInstance.get('/myproducts/seller')

  return response.data
}


export const getAllProducts = async ()=>{

  const response = await productApiInstance.get('/')

  return response.data
}

export const getProductById  = async (productId)=>{
  const response = await productApiInstance.get(`/details/${productId}`)

  return response.data
}

//* variants 
export const addVariant = async (productId, formData)=>{
  const response = await productApiInstance.put(`/${productId}/variant`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}


//! not added yet 
export const updateProduct = async (productId, data)=>{
  const response = await productApiInstance.put(`/${productId}`, data)
  return response.data
}

export const updateVariant = async (productId, variantId, variantData)=>{
  const response = await productApiInstance.put(`/${productId}/variant/${variantId}`, variantData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export const deleteVariant = async (productId, variantId)=>{
  const response = await productApiInstance.delete(`/${productId}/variant/${variantId}`)
  return response.data
}