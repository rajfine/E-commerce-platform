import React from 'react'
import './app.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './app.routes'
import { useSelector } from 'react-redux'
import { useAuth } from '../features/auth/hooks/useAuth'
import { useEffect } from 'react'

const App = () => {

  const { handleGetMe } = useAuth()
  useEffect(()=>{
    handleGetMe()
  },[])

  const user = useSelector(state => state.auth.user)
  console.log(user)

  return (
    <RouterProvider router={router}/>
  )
}

export default App