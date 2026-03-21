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

export const layDsSanPhamPhoBien = async () => {
  try {
    const response = await axios.get(`${api}/sanpham/layDsSanPhamPhoBien`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkSanPham = async ({ id }) => {
  try {
    const response = await axios.post(`${api}/sanpham/checksanpham`, {
      id
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const them = async ({ idloaisanpham, ten, dongia, mota, image }) => {
  try {
    const response = await axios.post(`${api}/sanpham/them`, {
      idloaisanpham,
      ten,
      dongia,
      mota,
      image
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sua = async ({ idloaisanpham, ten, dongia, mota, id, image }) => {
  try {
    const response = await axios.post(`${api}/sanpham/sua`, {
      idloaisanpham,
      ten,
      dongia,
      mota,
      id,
      image
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const xoa = async ({ id }) => {
  try {
    const response = await axios.post(`${api}/sanpham/xoa`, { id });
    return response.data;
  } catch (error) {
    throw error;
  }
};
