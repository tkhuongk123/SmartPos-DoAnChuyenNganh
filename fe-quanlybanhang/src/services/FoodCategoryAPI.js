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

export const layDsLoaiSanPham = async () => {
  try {
    const response = await axios.get(`${api}/loaisanpham/layDsLoaiSanPham`);
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

export const themLoaiSanPham = async (data) => {
  try {
    const response = await axios.post(`${api}/loaisanpham/themLoaiSanPham`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const suaLoaiSanPham = async (data) => {
  try {
    const response = await axios.post(`${api}/loaisanpham/suaLoaiSanPham`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const xoaLoaiSanPham = async (data) => {
  try {
    // Dữ liệu truyền vào thường là object { food_category_id: id }
    const response = await axios.post(`${api}/loaisanpham/xoaLoaiSanPham`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
