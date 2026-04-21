import axios from 'axios'

const authApiInstance = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
})

export const register = async ({email, contact, password, fullname, isSeller})=>{
  try{
    const response = await authApiInstance.post("/register", {
      email,
      contact, 
      password,
      fullname,
      isSeller
    })
    console.log(response)
    return response.data // user is inside this
  }catch(err){
    console.error(err.message)
    throw err
  }
}

export const login = async ({email, contact, password})=>{
  try{
    const response = await authApiInstance.post("/login", {
      email,
      contact,
      password
    })
    return response.data
  }catch(err){
    console.error(err.message)
    throw err
  }
}
