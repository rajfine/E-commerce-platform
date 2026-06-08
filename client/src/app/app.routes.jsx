import { createBrowserRouter, Outlet, useLocation } from 'react-router-dom'
import Register from '../features/auth/pages/Register'
import Login from '../features/auth/pages/Login'
import CreateProduct from '../features/products/pages/CreateProduct'
import Dashboard from '../features/products/pages/Dashboard'
import Protected from '../features/auth/components/Protected'
import Home from '../features/products/pages/Home'
import ProductDetail from '../features/products/pages/ProductDetail'
import SellerProductDetails from '../features/products/pages/SellerProductDetails'
import Navbar from '../features/products/components/Navbar'
import Cart from '../features/cart/pages/Cart'
import Ordersuccess from '../features/cart/pages/Ordersuccess'

const AppLayout = () => {
  const location = useLocation()
  const hideNavbarPaths = ['/login', '/register']
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname)

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Outlet />
    </>
  )
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home/>
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
        path: "/product/:productId",
        element: <ProductDetail/>
      },
      {
        path: "/cart",
        element: <Protected allowedRoles={["seller","buyer"]}>
          <Cart/>
          </Protected>
      },
      {
        path: "/order-success",
        element: <Protected allowedRoles={["seller","buyer"]}>
          <Ordersuccess/>
          </Protected>
      }
    ]
  },
  {
    path: "/seller",
    children: [
      {
        path: "/seller/createproduct",
        element: <Protected
          allowedRoles={["seller"]}
        > <CreateProduct/></Protected>
      },
      {
        path: "/seller/Dashboard",
        element: <Protected allowedRoles={["seller"]}>
          <Dashboard/>
        </Protected>
      },
      {
        path: "/seller/product/:productId",
        element: <Protected allowedRoles={["seller"]}>
          <SellerProductDetails/>
        </Protected>
      }
    ]
  },
])