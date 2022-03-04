import axios from "axios";
import { createPinia } from "pinia";
import { authStore } from "@/stores/auth";
const pinia = createPinia();
const authS = authStore(pinia);

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
axiosService.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalConfig = error.config;
    if (originalConfig.url !== "/auth/signin" && error.response) {
      if (error.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const resp = await axiosService.post("/auth/refreshtoken", {
            refreshToken: localStorage.getItem("refreshToken"),
          });
          const { accessToken } = resp.data;
          authS.makeRefreshToken(accessToken);
          return axiosService(originalConfig);
        } catch (_error: any) {
          if (_error.status && _error.status == 403) {
            authS.signOut();
          }
          return Promise.reject(_error);
        }
      }
    }
    return Promise.reject(error);
  }
);
export default axiosService;
