import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/states/auth.slice.js";
import producReducer from "../features/products/state/product.slice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: producReducer
  }
})
