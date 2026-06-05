import { createProduct, getSellerProducts, getAllProducts, getProductById, updateProduct, addVariant, updateVariant, deleteVariant } from '../services/product.api.js'
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


//!!!!!!

  const handleUpdateProduct = useCallback(async (productId, data) => {
    const result = await updateProduct(productId, data)
    return result.product
  }, [])

  const handleAddVariant = useCallback(async (productId, variantData) => {
    const result = await addVariant(productId, variantData)
    return result
  }, [])

  const handleUpdateVariant = useCallback(async (productId, variantId, variantData) => {
    const result = await updateVariant(productId, variantId, variantData)
    return result
  }, [])

  const handleDeleteVariant = useCallback(async (productId, variantId) => {
    const result = await deleteVariant(productId, variantId)
    return result
  }, [])


  return { handleCreateProduct, handleGetSellerProducts, handleGetAllProducts, handleGetProductById, handleUpdateProduct, handleAddVariant, handleUpdateVariant, handleDeleteVariant}
}
