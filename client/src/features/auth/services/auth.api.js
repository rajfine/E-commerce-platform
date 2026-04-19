import axios from 'axios'

const authApiInstance = axios.create({
  baseURL: "http://localhost:3000/",
  withCredentials: true,
})

export const register = async ({email, contact, password, fullname, isSeller})=>{
  try{
    const response = await authApiInstance.post("api/auth/register", {
      email,
      contact, 
      password,
      fullname,
      isSeller
    })

    return response.data // user is inside this
  }catch(err){
    console.error(err.message)
  }
}

