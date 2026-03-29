import axios from "axios";
import { api } from "./config";

export const layDsSupplier = async () => {
  try {
    const response = await axios.get(`${api}/supplier/layDsSupplier`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const laySupplier = async (supplier_id) => {
  try {
    const response = await axios.get(`${api}/supplier/laySupplier/${supplier_id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const themSupplier = async (data) => {
  try {
    const response = await axios.post(`${api}/supplier/them`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const suaSupplier = async (data) => {
  try {
    const response = await axios.post(`${api}/supplier/sua`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const xoaSupplier = async (supplier_id) => {
  try {
    const response = await axios.post(`${api}/supplier/xoa`, { supplier_id });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const tongSupplier = async () => {
  try {
    const response = await axios.get(`${api}/supplier/tongSupplier`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
