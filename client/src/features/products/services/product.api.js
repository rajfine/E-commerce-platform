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


