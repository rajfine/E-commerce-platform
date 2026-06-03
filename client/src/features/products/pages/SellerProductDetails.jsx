import React, { useEffect, useState } from 'react'
import { useProduct } from '../hooks/useProduct'
import { useParams } from 'react-router'

const SellerProductDetails = () => {
  const productId = useParams().productId
  const [product, setProduct] = useState(null)
  const { handleGetProductById } = useProduct()

  console.log(productId)
  useEffect(() => {
      const fetch = async () => {
        // setLoading(true)
        const data = await handleGetProductById(productId)
        setProduct(data)
        // setLoading(false)
      }
      fetch()
    }, [productId])

    console.log(product)

  return (
    <div>SellerProductDetails</div>
  )
}

export default SellerProductDetails