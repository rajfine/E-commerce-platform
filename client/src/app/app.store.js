import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "../features/auth/states/auth.slice";

export const store = configureStore({
  reducer: {
    authSlice
  }
})