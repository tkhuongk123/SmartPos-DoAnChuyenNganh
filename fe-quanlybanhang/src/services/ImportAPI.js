import axios from "axios";
import { api } from "./config";

// TODO: Backend cần tạo các API endpoints sau

// Lấy danh sách phiếu nhập
export const layDsImport = async () => {
  try {
    const response = await axios.get(`${api}/import/layDsImport`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Lấy chi tiết một phiếu nhập
export const layImport = async (import_id) => {
  try {
    const response = await axios.get(`${api}/import/layImport/${import_id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const taoPhieuNhap = async (data) => {
  try {
    const response = await axios.post(`${api}/import/tao`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

