import axios from "axios";
import { createPinia } from "pinia";
import { AuthStore } from "@/stores/auth";
const pinia = createPinia();
const authStore = AuthStore(pinia);

const axiosPlugin = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string) || "http://localhost:3000/",
  timeout: 5000,
});
axiosPlugin.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);
axiosPlugin.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalConfig = error.config;
    if (originalConfig.url !== "/auth/signin" && error.response) {
      if (error.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const resp = await axiosPlugin.post("/auth/refreshtoken", {
            refreshToken: localStorage.getItem("refreshToken"),
          });
          const { accessToken } = resp.data;
          authStore.makeRefreshToken(accessToken);
          return axiosPlugin(originalConfig);
        } catch (_error: any) {
          if (_error.status && _error.status == 403) {
            authStore.signOut();
          }
          return Promise.reject(_error);
        }
      }
    }
    return Promise.reject(error);
  }
);
export default axiosPlugin;
