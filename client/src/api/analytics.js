import api from "./axiosClient";

export const analyzeText = async ({ text }) => {
  const res = await api.post("/analyze", { text });
  return res.data;
};
