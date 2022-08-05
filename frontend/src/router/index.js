import { createRouter, createWebHistory } from "vue-router";
import store from "../store";
import HomeView from "../views/HomeView.vue";
import Signup from "../components/Signup.vue";
import Login from "../components/Login.vue";
import ViewProfile from "../components/ViewProfile.vue";
import ModifyProfile from "../components/ModifyProfile.vue";
import ModifyPassword from "../components/ModifyPassword.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/signup",
    name: "signup",
    component: Signup,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/view-profile/:id",
    name: "view-profile",
    component: ViewProfile,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/modify-profile/:id",
    name: "modify-profile",
    component: ModifyProfile,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/modify-password/:id",
    name: "modify-password",
    component: ModifyPassword,
    meta: {
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ["/login", "/signup"];
  //  const authRequired = !publicPages.includes(to.path);

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.getters.loggedIn) {
      next({ name: "login" });
    } else {
      next();
    }
  } else {
    if (store.getters.loggedIn) {
      if (publicPages.includes(to.path)) {
        next({ name: "home" });
      }
    }
    next(); // does not require auth, make sure to always call next()!
  }
});

export default router;
