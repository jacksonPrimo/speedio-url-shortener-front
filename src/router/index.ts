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
      path: "/:urlId",
      name: "redirect",
      component: () => import("../views/RedirectView.vue"),
    },
  ],
});

export default router;
