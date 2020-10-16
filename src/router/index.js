import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Players",
    component: () => import("../views/Players.vue"),
  },
  {
    path: "/plays",
    name: "Plays",
    component: () => import("../views/Plays.vue"),
  },
  {
    path: "/info",
    name: "Info",
    component: () => import("../views/Info.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
