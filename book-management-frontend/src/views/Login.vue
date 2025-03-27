<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Đăng Nhập</h2>

      <div class="space-y-4">
        <div>
          <label class="block text-gray-700 font-semibold mb-1">Mã số nhân viên</label>
          <input
            v-model="msnv"
            type="text"
            placeholder="Nhập mã số nhân viên"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-gray-700 font-semibold mb-1">Mật khẩu</label>
          <input
            v-model="password"
            type="password"
            placeholder="Nhập mật khẩu"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
      </div>

      <button
        @click="login"
        class="w-full mt-6 bg-c2 text-white py-2 rounded-lg font-bold hover:bg-c3 transition duration-200"
      >
        Đăng nhập
      </button>

      <p v-if="errorMessage" class="text-red-500 text-center mt-4 font-semibold">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<script>
import api from '../utils/axiosInstance'
import { mapMutations } from 'vuex'

export default {
  data() {
    return {
      msnv: '',
      password: '',
      errorMessage: '',
    }
  },
  methods: {
    ...mapMutations(['setAuth']),
    async login() {
      try {
        const response = await api.post('/login', {
          MSNV: this.msnv,
          Password: this.password,
        })

        this.setAuth({
          token: response.data.token,
          ChucVu: response.data.ChucVu,
          HoTenNV: response.data.HoTenNV,
        })

        this.$router.push(response.data.ChucVu === 'nhanvien' ? '/borrows' : '/books')
      } catch (error) {
        console.error('Đăng nhập thất bại:', error)
        this.errorMessage = 'Sai mã số nhân viên hoặc mật khẩu, vui lòng thử lại!'
      }
    },
  },
}
</script>
