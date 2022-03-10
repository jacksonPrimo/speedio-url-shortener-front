import { createRouter, createWebHistory } from "vue-router";
import { userAuth } from "./guards";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/login",
      name: "login",
      beforeEnter: userAuth,
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/top100",
      name: "top100",
      component: () => import("../views/Top100View.vue"),
    },
    {
      path: "/:urlId",
      name: "redirect",
      component: () => import("../views/RedirectView.vue"),
    },
  ],
});

export default router;
