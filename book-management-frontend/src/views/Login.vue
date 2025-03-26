<template>
  <div class="login">
    <h2>Đăng nhập</h2>
    <input v-model="msnv" placeholder="Mã số nhân viên" />
    <input v-model="password" type="password" placeholder="Mật khẩu" />
    <button @click="login">Đăng nhập</button>
  </div>
</template>

<script>
import axios from 'axios'
import { mapMutations } from 'vuex'

export default {
  data() {
    return {
      msnv: '',
      password: '',
    }
  },
  methods: {
    ...mapMutations(['setAuth']), // Sử dụng Vuex Mutation
    async login() {
      try {
        const response = await axios.post('http://localhost:5000/login', {
          MSNV: this.msnv,
          Password: this.password,
        })

        this.setAuth({
          token: response.data.token,
          ChucVu: response.data.ChucVu,
        })

        if (response.data.ChucVu === 'nhanvien') {
          this.$router.push('/staff')
        } else {
          this.$router.push('/books')
        }
      } catch (error) {
        console.error('Đăng nhập thất bại:', error)
      }
    },
  },
}
</script>
