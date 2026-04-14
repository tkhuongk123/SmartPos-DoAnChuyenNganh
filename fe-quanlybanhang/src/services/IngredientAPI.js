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

export const checkIngredients = async (food_id, quantity) => {
  try {
    const response = await axios.post(`${api}/ingredient/checkIngredients`, {
      food_id,
      quantity
    });
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

export const createIngredient = async (data) => {
    try {
        const response = await axios.post(`${api}/ingredient/create`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Sửa nguyên liệu
export const updateIngredient = async (id, data) => {
    try {
        const response = await axios.put(`${api}/ingredient/update/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Xóa nguyên liệu
export const deleteIngredient = async (id) => {
    try {
        const response = await axios.delete(`${api}/ingredient/delete/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};


