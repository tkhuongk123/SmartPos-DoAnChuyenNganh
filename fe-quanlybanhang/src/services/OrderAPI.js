import axios from "axios";
import { api } from "./config";

export const taoDonHang = async ({
  table_id,
  total_amount,
  order_method,
  note
}) => {
  try {
    const response = await axios.post(`${api}/donhang/taoDonHang`, {
      table_id,
      total_amount,
      order_method,
      note
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const layDanhSach = async () => {
  try {
    const response = await axios.get(`${api}/donhang/layDanhSach`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const layDonHangTheoId = async (order_id ) => {
  try {
    const response = await axios.post(`${api}/donhang/layDonHangTheoId`, {
      order_id,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};



export const updateOrderStatus = async (order_id, order_status) => {
  try {
    const response = await axios.post(`${api}/donhang/updateOrderStatus`, {
      order_id,
      order_status
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
