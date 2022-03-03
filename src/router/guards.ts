import { authStore } from "@/stores/auth";
export const userAuth = async (to: any, from: any, next: any) => {
  const auth = authStore();
  if (auth.authenticated) {
    next("/");
  } else {
    next();
  }
};
