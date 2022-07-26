import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Signup from '../components/Signup.vue'
import Login from '../components/Login.vue'
import ViewProfile from '../components/ViewProfile.vue'
import ModifyProfile from '../components/ModifyProfile.vue'
import ModifyPassword from '../components/ModifyPassword.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/view-profile/:id',
    name: 'view-profile',
    component: ViewProfile
  },
  {
    path: '/modify-profile/:id',
    name: 'modify-profile',
    component: ModifyProfile
  },
  {
    path: '/modify-password/:id',
    name: 'modify-password',
    component: ModifyPassword
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
