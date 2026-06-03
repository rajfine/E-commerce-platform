import { createProduct, getSellerProducts, getAllProducts, getProductById } from '../services/product.api.js'
import { setSellerProducts, setProducts } from '../state/product.slice.js'
import { useDispatch } from 'react-redux'
import { useCallback } from 'react'

export const useProduct = ()=>{
  const dispatch = useDispatch()
  
  const handleCreateProduct = useCallback(async (formData) => {
    const data = await createProduct(formData)
    return data.product
  }, [])

  const handleGetSellerProducts = useCallback(async () => {
    const data = await getSellerProducts()
    dispatch(setSellerProducts(data.products))
    return data.products
  }, [dispatch])

  const handleGetAllProducts = useCallback(async () => {
    const data = await getAllProducts()
    dispatch(setProducts(data.products))
    return data.products
  }, [dispatch])

  const handleGetProductById = useCallback(async (productId) => {
    const data = await getProductById(productId)
    return data.product
  }, [])


  return { handleCreateProduct, handleGetSellerProducts, handleGetAllProducts, handleGetProductById}
}
