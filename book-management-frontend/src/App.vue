<template>
  <div class="min-h-screen bg-gray-100 font-roboto flex flex-col">
    <nav class="bg-c3 text-c1 p-4 flex justify-between items-center">
      <h1 class="text-xl font-extrabold"><i class="fa-solid fa-book px-2"></i>Quản lý Mượn Sách</h1>
      <div>
        <router-link to="/" class="px-4 hover:underline">Trang chủ</router-link>
        <router-link v-if="isAuthenticated" to="/books" class="px-4 hover:underline"
          >Sách</router-link
        >
        <router-link v-if="isAuthenticated" to="/borrows" class="px-4 hover:underline"
          >Mượn sách</router-link
        >

        <span v-if="isAuthenticated" class="px-4 font-semibold text-c4"
          ><i class="fa-regular fa-user px-2"></i>{{ HoTenNV }}</span
        >

        <button
          v-if="isAuthenticated"
          @click="handleLogout"
          class="px-4 rounded-full border border-c1 font-bold py-2 text-c1 hover:bg-c1 hover:text-c3 transition ease-in-out duration-300"
        >
          Đăng xuất
        </button>

        <router-link v-else to="/login" class="px-4 hover:underline">Đăng nhập</router-link>
      </div>
    </nav>

    <div class="flex-grow">
      <router-view />
    </div>

    <footer class="text-white text-center bg-c3 h-60 flex justify-center items-center">
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
