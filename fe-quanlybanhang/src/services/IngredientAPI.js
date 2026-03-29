import axios from "axios";
import { api } from "./config";

export const layDsIngredient = async () => {
  try {
    const response = await axios.get(`${api}/ingredient/layDsIngredient`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

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


