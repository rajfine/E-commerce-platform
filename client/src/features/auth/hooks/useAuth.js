import { register, login , getMe, logout as logoutApi } from '../services/auth.api.js'
import {setError, setLoading, setUser } from '../states/auth.slice.js'
import {useDispatch} from 'react-redux'

export const useAuth = ()=>{

  const dispatch = useDispatch()

  const handleRegister = async ({email, contact, password, fullname , isSeller = false})=>{
    dispatch(setLoading(true))
    dispatch(setError(null))
    try{
      const data = await register({
        email, 
        contact, 
        password, 
        fullname,
        isSeller 
      })
      if(data?.user){
        dispatch(setUser(data.user))
      }
      return data.user
    }catch(err){
      const message = err?.response?.data?.message || err?.response?.data?.errors?.[0]?.msg || err.message || "Registration failed"
      dispatch(setError(message))
      throw err
    }finally{
      dispatch(setLoading(false))
    }
  }


  const handleLogin = async ({email, contact, password})=>{ 
    dispatch(setLoading(true))
    dispatch(setError(null))
    try{
      const data = await login({
        email,
        contact, 
        password
      })
      if(data?.user){
        dispatch(setUser(data.user))
      }
      return data.user
    }catch(err){
      const message = err?.response?.data?.message || err?.response?.data?.errors?.[0]?.msg || err.message || "Login failed"
      dispatch(setError(message))
      throw err
    }finally{
      dispatch(setLoading(false))
    }
  }


  const handleGetMe = async ()=>{

    try{
      dispatch(setLoading(true))
      const data = await getMe()
      dispatch(setUser(data.user))
    }catch(err){
      console.log(err)
    }finally{
      dispatch(setLoading(false))
    }
  }

  const handleLogout = async () => {
    try {
      dispatch(setLoading(true))
      await logoutApi()
      dispatch(setUser(null))
    } catch (err) {
      console.error("Logout failed", err)
    } finally {
      dispatch(setLoading(false))
    }
  }

  return{
    handleRegister,
    handleLogin,
    handleGetMe,
    handleLogout
  }
}
