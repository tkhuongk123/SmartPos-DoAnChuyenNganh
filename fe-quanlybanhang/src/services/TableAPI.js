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

