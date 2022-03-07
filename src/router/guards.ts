import { AuthStore } from "@/stores/auth";
export const userAuth = async (to: any, from: any, next: any) => {
  const authStore = AuthStore();
  if (authStore.authenticated) {
    next("/");
  } else {
    next();
  }
};
