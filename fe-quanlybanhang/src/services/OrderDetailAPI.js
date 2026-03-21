import axios from "axios";
import { api } from "./config";

export const taoChiTiet = async ({ order_id, food_id, quantity, price, note }) => {
  try {
    const response = await axios.post(`${api}/chitietdonhang/taoChiTiet`, {
      order_id, 
      food_id, 
      quantity, 
      price, 
      note
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const layChiTietTheoDon = async (order_id) => {
    try {
      const response = await axios.post(`${api}/chitietdonhang/layChiTietTheoDon`, {
        order_id
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
