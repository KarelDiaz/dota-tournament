import { createRouter, createWebHistory } from "vue-router";
import Players from "../views/Players.vue";

const routes = [
  {
    path: "/",
    name: "Players",
    component: Players
  },
  {
    path: "/plays",
    name: "Plays",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Plays.vue")
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
