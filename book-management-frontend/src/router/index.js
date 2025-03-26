import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Books from '../views/Books.vue'
import Borrows from '../views/Borrows.vue'
import Publishers from '../views/Publishers.vue'
import Readers from '../views/Readers.vue'
import Staff from '../views/Staff.vue'
import Login from '@/views/Login.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/books', component: Books },
  { path: '/borrows', component: Borrows },
  { path: '/publishers', component: Publishers },
  { path: '/readers', component: Readers },
  { path: '/staff', component: Staff },
  { path: '/login', component: Login },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
