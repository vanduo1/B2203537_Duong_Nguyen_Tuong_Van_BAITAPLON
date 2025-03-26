import { createStore } from 'vuex'

const store = createStore({
  state: {
    token: null,
    ChucVu: '',
  },
  mutations: {
    setAuth(state, payload) {
      state.token = payload.token
      state.ChucVu = payload.ChucVu
    },
  },
})

export default store
