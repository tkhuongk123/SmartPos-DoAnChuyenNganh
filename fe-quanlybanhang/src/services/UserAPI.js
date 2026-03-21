import axios from "axios";
import { api } from "./config";

export const LoginAPI = async ({ username, password }) => {
  try {
    const response = await axios.post(`${api}/taikhoan/login`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const layTaiKhoan = async ({ id }) => {
  try {
    const response = await axios.post(`${api}/taikhoan/layTaiKhoan`, {
      id,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const layDsTaiKhoan = async () => {
  try {
    const response = await axios.get(`${api}/taikhoan/layDsTaiKhoan`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const tongTaiKhoan = async () => {
  try {
    const response = await axios.get(`${api}/taikhoan/tongTaiKhoan`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const capNhatDiaChi = async (id, diachi) => {
  try {
    const response = await axios.post(`${api}/taikhoan/capNhatDiaChi`, {
      id,
      diachi
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};



export const them = async ({
  tendangnhap,
  tennguoidung,
  email,
  sodienthoai,
  idquyen,
}) => {
  try {
    const response = await axios.post(`${api}/taikhoan/them`, {
      tendangnhap,
      tennguoidung,
      email,
      sodienthoai,
      idquyen,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sua = async ({ id, tennguoidung, email, sodienthoai }) => {
  try {
    const response = await axios.post(`${api}/taikhoan/sua`, {
      id,
      tennguoidung,
      email,
      sodienthoai,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const xoa = async ({ id }) => {
  try {
    const response = await axios.post(`${api}/taikhoan/xoa`, { id });
    return response.data;
  } catch (error) {
    throw error;
  }
};
