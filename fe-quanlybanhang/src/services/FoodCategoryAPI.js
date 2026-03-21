import axios from "axios";
import { api } from "./config";

export const layDs = async () => {
  try {
    const response = await axios.get(`${api}/loaisanpham/layDs`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const tongLoaiSanPham = async () => {
  try {
    const response = await axios.get(`${api}/loaisanpham/tongLoaiSanPham`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const them = async ({ ten, mota }) => {
  try {
    const response = await axios.post(`${api}/loaisanpham/them`, {
      ten,
      mota,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sua = async ({ ten, mota, id }) => {
  try {
    const response = await axios.post(`${api}/loaisanpham/sua`, {
      ten,
      mota,
      id,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const xoa = async ({ id }) => {
  try {
    const response = await axios.post(`${api}/loaisanpham/xoa`, { id });
    return response.data;
  } catch (error) {
    throw error;
  }
};
