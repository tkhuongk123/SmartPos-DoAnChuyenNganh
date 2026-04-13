import axios from "axios";
import { api } from "./config";

export const laySanPhamTheoLoai = async ({ idloaisanpham }) => {
  try {
    const response = await axios.post(`${api}/sanpham/laySanPhamTheoLoai`, {
      idloaisanpham,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const laySanPhamTheoId = async ({food_id}) => {
  try {
    const response = await axios.post(`${api}/sanpham/laySanPhamTheoId`, {
      food_id,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const layDsSanPham = async () => {
  try {
    const response = await axios.get(`${api}/sanpham/layDsSanPham`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const tongSanPham = async () => {
  try {
    const response = await axios.get(`${api}/sanpham/tongSanPham`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const tongDonHangTheoSanPham = async ({ idsanpham }) => {
  try {
    const response = await axios.post(`${api}/sanpham/tongDonHangTheoSanPham`, {
      idsanpham
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
;

export const updateFoodStatus = async () => {
  try {
    const response = await axios.post(`${api}/sanpham/updateFoodStatus`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createFood = async (data) => {
    const response = await axios.post(`${api}/sanpham/create`, data);
    return response.data;
};

export const updateFood = async (id, data) => {
    const response = await axios.put(`${api}/sanpham/update/${id}`, data);
    return response.data;
};

export const deleteFood = async (id) => {
    const response = await axios.delete(`${api}/sanpham/delete/${id}`);
    return response.data;
};




