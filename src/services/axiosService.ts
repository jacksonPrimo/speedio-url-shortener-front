import axios from "axios";
const axiosService = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string) || "http://localhost:3000/",
  timeout: 5000,
});
axiosService.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

export default axiosService;
