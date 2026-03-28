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

// ==================== API MỚI CHO USER ====================


export const layDsUser = async () => {
  try {
    const response = await axios.get(`${api}/user/layDsUser`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const layUser = async (user_id) => {
  try {
    const response = await axios.get(`${api}/user/layUser/${user_id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const themUser = async ({ name, username, password, role, is_active }) => {
  try {
    const response = await axios.post(`${api}/user/them`, {
      name,
      username,
      password,
      role,
      is_active,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const suaUser = async ({ user_id, name, role, is_active }) => {
  try {
    const response = await axios.post(`${api}/user/sua`, {
      user_id,
      name,
      role,
      is_active,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const xoaUser = async (user_id) => {
  try {
    const response = await axios.post(`${api}/user/xoa`, { user_id });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const doiMatKhau = async ({ user_id, password_old, password_new }) => {
  try {
    const response = await axios.post(`${api}/user/doiMatKhau`, {
      user_id,
      password_old,
      password_new,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const resetMatKhau = async ({ user_id, password_new }) => {
  try {
    const response = await axios.post(`${api}/user/resetMatKhau`, {
      user_id,
      password_new,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const tongUser = async () => {
  try {
    const response = await axios.get(`${api}/user/tongUser`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const tongUserTheoRole = async () => {
  try {
    const response = await axios.get(`${api}/user/tongUserTheoRole`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
