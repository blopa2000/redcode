import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/login.vue")
  },
  {
    path: "/profile/:id",
    name: "profile",
    component: () => import("../views/profile.vue")
  },
  {
    path: "*",
    name: "login2",
    component: () => import("../views/login.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, from, next) => {
  const user = localStorage.getItem("session");
  if (user == null && to.matched.some(record => record.meta.requiresAuth)) {
    next({ name: "login" }); // make sure to always call next()!
  } else {
    next();
  }
});

export default router;
