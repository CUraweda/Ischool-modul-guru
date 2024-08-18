import axios from "axios";
const instance = axios.create({
  baseURL: import.meta.env.VITE_REACT_API_HRD_URL,
});
