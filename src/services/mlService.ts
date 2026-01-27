import axios from "axios";

const ML_API_URL = "http://127.0.0.1:8000";

export interface MLResponse {
  is_multi_section: boolean;
  color?: { r: number; g: number; b: number; brillo: number };
  sections?: Array<{ r: number; g: number; b: number; brillo: number }>;
  mode: string;
}

export const getColorRecommendation = async (event: string): Promise<MLResponse> => {
  const response = await axios.post(`${ML_API_URL}/predict`, { event });
  console.log("Datos brutos de la API:", response.data); // <--- DEBUG
  return response.data;
};