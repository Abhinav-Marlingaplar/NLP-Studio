import api from "./axiosClient";

export const uploadFilesForIndexing = async (files) => {
  const form = new FormData();

  for (const file of files) {
    form.append("files", file); // 🔑 MUST be "files"
  }

  const res = await api.post("/upload", form, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  return res.data;
};
