<template>
  <div class="login">
    <h2>Đăng nhập</h2>
    <input v-model="msnv" placeholder="Mã số nhân viên" />
    <input v-model="password" type="password" placeholder="Mật khẩu" />
    <button @click="login">Đăng nhập</button>
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
      hotennv: '',
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

        this.$router.push(response.data.ChucVu === 'nhanvien' ? '/staff' : '/books')
      } catch (error) {
        console.error('Đăng nhập thất bại:', error)
      }
    },
  },
}
</script>
