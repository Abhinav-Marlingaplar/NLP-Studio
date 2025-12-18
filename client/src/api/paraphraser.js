import api from "./axiosClient";

export const paraphraseText = async ({ text, tone, length, creativity }) => {
  const res = await api.post("/paraphrase", {
    text,
    tone,
    length,
    creativity
  });

  return res.data; // { output }
};
