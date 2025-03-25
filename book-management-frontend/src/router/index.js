import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BookList from '../views/BookList.vue'
import BorrowList from '../views/BorrowList.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/books', component: BookList },
  { path: '/borrows', component: BorrowList },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
