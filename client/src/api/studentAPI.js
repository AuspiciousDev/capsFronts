import { axiosPrivate } from "./axios";

export const getAllStudents = async () => {
  const api = await axiosPrivate.get("/api/students");
  const json = await api.data;
  return json;
};
