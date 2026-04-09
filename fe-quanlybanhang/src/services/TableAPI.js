import axios from "axios";
import { api } from "./config";

export const getTables= async () => {
  try {
    const response = await axios.get(`${api}/table/getTables`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAreas= async () => {
  try {
    const response = await axios.get(`${api}/table/getAreas`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTableById = async (table_id) => {
  try {
    const response = await axios.get(`${api}/table/getTableById/:tableId`, {
        params: { table_id }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTableAreaByTableId = async (table_id) => {
  try {
    const response = await axios.get(`${api}/table/getTableAreaByTableId/:tableId`, {
        params: { table_id }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTableStatus = async ({table_id, table_status}) => {
  try {
    const response = await axios.post(`${api}/table/updateTableStatus`, {
        table_id,
        table_status
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createTable = async (data) => {
  try {
    const response = await axios.post(`${api}/table/createTable`, {
      table_name: data.table_name,
      table_area_id: data.table_area_id
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTable = async (data) => {
  try {
    const response = await axios.put(`${api}/table/updateTable`, {
      table_id: data.table_id,
      table_name: data.table_name,
      table_area_id: data.table_area_id
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTable = async (table_id) => {
  try {
    const response = await axios.delete(`${api}/table/deleteTable/${table_id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createArea = async (data) => {
    const res = await axios.post(`${api}/table/createArea`, data);
    return res.data;
};

export const updateArea = async (data) => {
    const res = await axios.post(`${api}/table/updateArea`, data);
    return res.data;
};

export const deleteArea = async (id) => {
    const res = await axios.delete(`${api}/table/deleteArea/${id}`);
    return res.data;
};