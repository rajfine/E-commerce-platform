import { register } from '../services/auth.api'
import {setError, setLoading, setUser } from '../states'
import {useDispatch} from 'react-redux'

export const useAuth = ()=>{

  const dispatch = useDispatch()

  const handleRegister = async ({email, contact, password, fullname , isSeller = false})=>{
    
    const data = await register({email, 
      contact, 
      password, 
      fullname,
      isSeller 
    })
    dispatch(setUser(data.user))
  }


  return{
    handleRegister
  }
}