import axios from "axios";
import { api } from "./config";

export const thanhToan = async ({ tongTien, redirectUrlFe }) => {
  try {
    const response = await axios.post(`${api}/payment/thanhToan`, {
      tongTien, 
      redirectUrlFe
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

