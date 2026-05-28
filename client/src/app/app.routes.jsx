import { createBrowserRouter } from 'react-router-dom'
import Register from '../features/auth/pages/Register'
import Login from '../features/auth/pages/Login'
import CreateProduct from '../features/products/pages/CreateProduct'
import Dashboard from '../features/products/pages/Dashboard'

export const router = createBrowserRouter([
  {
    path: "/",
    element: <h1>HOME</h1>
  },
  {
    path: "/register",
    element: <Register/>
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/seller",
    children: [
      {
        path: "/seller/createproduct",
        element: <CreateProduct/>
      },
      {
        path: "/seller/Dashboard",
        element: <Dashboard/>
      }
    ]
  },
])