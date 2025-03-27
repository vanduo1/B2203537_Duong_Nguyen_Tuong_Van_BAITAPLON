import { createStore } from 'vuex'

const store = createStore({
  state: {
    token: localStorage.getItem('token') || null,
    ChucVu: localStorage.getItem('ChucVu') || '',
  },
  mutations: {
    setAuth(state, payload) {
      state.token = payload.token
      state.ChucVu = payload.ChucVu
      localStorage.setItem('token', payload.token)
      localStorage.setItem('ChucVu', payload.ChucVu)
      localStorage.setItem('HoTenNV', payload.HoTenNV) // Lưu tên nhân viên
    },
    logout(state) {
      state.token = null
      state.ChucVu = ''
      localStorage.removeItem('token')
      localStorage.removeItem('ChucVu')
      localStorage.removeItem('HoTenNV')
    },
  },
})

export default store
