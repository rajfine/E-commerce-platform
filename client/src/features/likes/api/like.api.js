import axios from "axios";

const API_URL = "/api/like";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getLikes = async () => {
  try {
    const res = await api.get("/");
    return res.data;
  } catch (error) {
    return error.response?.data || { success: false, message: 'Network error' };
  }
};

export const toggleLike = async (productId) => {
  try {
    const res = await api.post("/toggle", { productId });
    return res.data;
  } catch (error) {
    return error.response?.data || { success: false, message: 'Network error' };
  }
};
