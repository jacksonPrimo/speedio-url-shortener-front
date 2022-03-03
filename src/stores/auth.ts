import { defineStore } from "pinia";
import jwt_decode from "jwt-decode";
export const authStore = defineStore("auth", {
  state: () => ({
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
  }),
  getters: {
    authenticated: (state) => !!state.accessToken,
    tokens: (state) => ({
      accessToken: state.accessToken,
      refreshToken: state.refreshToken,
    }),
    userAuthenticated: (state) => {
      if (state.accessToken) {
        const data = jwt_decode(state.accessToken);
        return data;
      }
    },
  },
  actions: {
    async signIn(userSignin: any) {
      try {
        this.accessToken = userSignin.accessToken;
        this.refreshToken = userSignin.refreshToken;
        localStorage.setItem("accessToken", userSignin.accessToken);
        localStorage.setItem("refreshToken", userSignin.refreshToken);
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    signOut() {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      this.accessToken = null;
      this.refreshToken = null;
    },
    refreshToken(accessToken: string) {
      this.accessToken = accessToken;
      localStorage.setItem("accessToken", accessToken);
    },
  },
});
