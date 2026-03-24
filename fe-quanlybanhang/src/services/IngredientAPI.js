import axios from "axios";
import { api } from "./config";

export const deductIngredients = async (order_id) => {
  try {
    const response = await axios.post(`${api}/ingredient/deductIngredients`, {
      order_id
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


