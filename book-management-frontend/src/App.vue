<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-blue-600 text-white p-4 flex justify-between">
      <h1 class="text-xl font-bold">Quản lý Mượn Sách</h1>
      <div>
        <router-link to="/" class="px-4 hover:underline">Trang chủ</router-link>
        <router-link v-if="isAuthenticated" to="/books" class="px-4 hover:underline"
          >Sách</router-link
        >
        <router-link v-if="isAuthenticated" to="/borrows" class="px-4 hover:underline"
          >Mượn sách</router-link
        >

        <span v-if="isAuthenticated" class="px-4 font-semibold">👤 {{ HoTenNV }}</span>

        <button
          v-if="isAuthenticated"
          @click="handleLogout"
          class="px-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 rounded"
        >
          🚪 Đăng xuất
        </button>

        <router-link v-else to="/login" class="px-4 hover:underline">Đăng nhập</router-link>
      </div>
    </nav>

    <div class="container mx-auto p-6">
      <router-view />
    </div>

    <footer class="text-center py-4 mt-6 bg-gray-200">
      <p>© 2025 - Quản lý mượn sách</p>
    </footer>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState(['token', 'ChucVu']),
    isAuthenticated() {
      return !!this.token // Kiểm tra nếu có token thì đã đăng nhập
    },
    HoTenNV() {
      return localStorage.getItem('HoTenNV') || 'Người dùng'
    },
  },
  methods: {
    ...mapMutations(['logout']),
    handleLogout() {
      this.logout() // Gọi mutation đăng xuất
      this.$router.push('/login')
    },
  },
}
</script>
