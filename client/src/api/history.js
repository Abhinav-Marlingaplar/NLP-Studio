import api from "./axiosClient";

export const fetchHistory = async () => {
  const res = await api.get("/history/get");
  return res.data.history;
};
