import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Books from '../views/Books.vue'
import Borrows from '../views/Borrows.vue'
import Publishers from '../views/Publishers.vue'
import Readers from '../views/Readers.vue'
import Staff from '../views/Staff.vue'
import Login from '@/views/Login.vue'
import store from '@/store'

const routes = [
  { path: '/', component: Home },
  { path: '/books', component: Books },
  {
    path: '/borrows',
    component: Borrows,
  },

  {
    path: '/publishers',
    component: Publishers,
    meta: { requiresAuth: true, role: ['quanly', 'nhanvien'] },
  },
  {
    path: '/readers',
    component: Readers,
    meta: { requiresAuth: true, role: ['quanly', 'nhanvien'] },
  },
  { path: '/staff', component: Staff, meta: { requiresAuth: true, role: ['quanly'] } },
  { path: '/login', component: Login },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 🛡 Navigation Guard kiểm tra đăng nhập & quyền hạn
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!store.state.token
  const userRole = store.state.ChucVu

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      alert('Bạn cần đăng nhập trước!')
      return next('/login') // Nếu chưa đăng nhập, chuyển hướng về Login
    }

    if (!to.meta.role.includes(userRole)) {
      alert('Bạn không có quyền truy cập!')
      return next('/') // Nếu không có quyền, chuyển về trang chủ
    }
  }

  next()
})

export default router
