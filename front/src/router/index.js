import { createRouter, createWebHistory } from "vue-router";



import Home from "../views/Home";
import About from "../views/About";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import Posts from "../components/Posts";
import Post from "../components/Post";
import ProfilePage from "../views/ProfilePage";








const routes = [
  {
    path: "/home",
    name: "home",
    component: Home,
  },

  {
    path: "/profile",
    name: "profile",
    component: ProfilePage,
  },

  {
    path: "/posts",
    name: "posts",
    component: Posts,
  },

  {
    path: "/post",
    name: "post",
    component: Post,
  },

  {
    path: "/login",
    name: "login",
    component: Login,
  },

  {
    path: "/SignUp",
    name: "signUp",
    component: SignUp,
  },

  {
    path: "/About",
    name: "about",
    component: About,
  },
];

const router = new createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
