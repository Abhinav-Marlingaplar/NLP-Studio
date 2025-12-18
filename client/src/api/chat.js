import api from "./axiosClient";

export const sendChatMessage = async ({ message, sessionId }) => {
  const res = await api.post("/chat", {
    message,
    sessionId
  });
  return res.data;
};