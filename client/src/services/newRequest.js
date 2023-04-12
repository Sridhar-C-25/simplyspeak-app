import axios from "axios";

export const newRequest = axios.create({
  // baseURL: process.env.REACT_APP_BACKEND_BASE_URL + "/api",
  baseURL: "/api",
  withCredentials: true,
});
