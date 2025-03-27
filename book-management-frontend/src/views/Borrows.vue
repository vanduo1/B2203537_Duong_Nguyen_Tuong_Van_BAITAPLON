<template>
  <div class="p-32">
    <h1 class="text-3xl font-bold text-gray-800 mb-4 text-center">
      <i class="fa-solid fa-book-open"></i> Theo Dõi Mượn Sách
    </h1>

    <!-- Thanh tìm kiếm -->
    <input
      v-model="searchQuery"
      type="text"
      placeholder="🔎 Tìm kiếm theo Mã Độc Giả..."
      class="input m-4 w-full p-3 rounded-full"
    />

    <!-- Nút tải danh sách và thêm mới -->
    <button
      @click="fetchBorrows"
      class="font-extrabold my-4 mx-8 p-2 border-2 rounded-full py-2 px-5 border-c3 hover:bg-c3 hover:text-c1 transition ease-in-out duration-300"
    >
      <i class="fa-solid fa-rotate pr-4"></i>Tải danh sách
    </button>

    <button
      v-if="isLoggedIn"
      @click="openModal"
      class="font-extrabold text-c4 my-4 p-2 border-2 rounded-full py-2 px-5 border-c4 hover:bg-c4 hover:text-white transition ease-in-out duration-300"
    >
      <i class="fa-solid fa-plus"></i> Thêm Lượt Mượn
    </button>

    <!-- Bảng hiển thị lịch sử mượn sách -->
    <div class="overflow-x-auto m-8">
      <table class="w-full border border-gray-300 shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr class="bg-c1 text-c3 font-extrabold uppercase text-sm leading-normal">
            <th class="py-3 px-6 text-left">Mã Độc Giả</th>
            <th class="py-3 px-6 text-left">Mã Sách</th>
            <th class="py-3 px-6 text-center">Ngày Mượn</th>
            <th class="py-3 px-6 text-center">Ngày Trả</th>
            <th v-if="isLoggedIn" class="py-3 px-6 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody class="text-gray-700 text-sm font-normal">
          <tr
            v-for="borrow in filteredBorrows"
            :key="borrow._id"
            class="border-b border-gray-200 hover:bg-gray-100 transition duration-200"
          >
            <td class="py-3 px-6 text-left">{{ borrow.MADOCGIA }}</td>
            <td class="py-3 px-6 text-left">{{ borrow.MASACH }}</td>
            <td class="py-3 px-6 text-center">{{ formatDate(borrow.NGAYMUON) }}</td>
            <td class="py-3 px-6 text-center">
              <span v-if="!borrow.NGAYTRA" class="text-red-500">Chưa trả</span>
              <span v-else>{{ formatDate(borrow.NGAYTRA) }}</span>
            </td>
            <td v-if="isLoggedIn" class="py-3 px-6 text-center">
              <button
                @click="editBorrow(borrow)"
                class="text-c3 font-bold hover:text-blue-700 mx-2 border-2 p-2 rounded-2xl"
              >
                ✏ Cập nhật
              </button>
              <button
                @click="deleteBorrow(borrow.MADOCGIA, borrow.MASACH)"
                class="text-red-700 font-bold hover:text-red-400 mx-2 p-2 border-2 rounded-2xl"
              >
                🗑 Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Form thêm / cập nhật lượt mượn -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
    >
      <div class="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">
          {{ isEditing ? 'Cập Nhật Lượt Mượn' : 'Thêm Lượt Mượn' }}
        </h2>

        <div class="space-y-4">
          <div class="relative">
            <input
              v-model="newBorrow.MADOCGIA"
              type="text"
              placeholder="Mã Độc Giả"
              class="input-field"
            />
          </div>

          <div class="relative">
            <input
              v-model="newBorrow.MASACH"
              type="text"
              placeholder="Mã Sách"
              class="input-field"
            />
          </div>

          <div class="relative">
            <input v-model="newBorrow.NGAYMUON" type="date" class="input-field" />
          </div>

          <div class="relative" v-if="isEditing">
            <input v-model="newBorrow.NGAYTRA" type="date" class="input-field" />
          </div>
        </div>

        <div class="flex justify-between mt-6">
          <button
            @click="isEditing ? updateBorrow() : addBorrow()"
            class="bg-c2 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
          >
            ✔ Lưu
          </button>
          <button
            @click="closeModal"
            class="bg-red-700 text-white px-4 py-2 rounded-full hover:bg-red-800 transition"
          >
            ✖ Hủy
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'

export default {
  name: 'Borrows',
  data() {
    return {
      borrows: [],
      searchQuery: '',
      showModal: false,
      isEditing: false,
      newBorrow: {
        MADOCGIA: '',
        MASACH: '',
        NGAYMUON: '',
        NGAYTRA: '',
      },
    }
  },
  computed: {
    ...mapState(['ChucVu']),
    isLoggedIn() {
      return this.ChucVu === 'quanly' || this.ChucVu === 'nhanvien'
    },
    filteredBorrows() {
      return this.borrows.filter((borrow) =>
        borrow.MADOCGIA.toLowerCase().includes(this.searchQuery.toLowerCase()),
      )
    },
  },
  methods: {
    formatDate(date) {
      return date ? new Date(date).toLocaleDateString('vi-VN') : 'Chưa trả'
    },
    async fetchBorrows() {
      try {
        const response = await axios.get('http://localhost:5000/api/theodoimuonsach')
        this.borrows = response.data
      } catch (error) {
        console.error('Lỗi tải danh sách mượn sách:', error)
      }
    },
    async addBorrow() {
      try {
        await axios.post('http://localhost:5000/api/theodoimuonsach/', this.newBorrow)
        this.fetchBorrows()
        this.closeModal()
        alert('Mượn sách thành công!')
      } catch (error) {
        console.error('Lỗi khi thêm lượt mượn:', error)
        alert('Có lỗi xảy ra, vui lòng thử lại!')
      }
    },
    async deleteBorrow(MADOCGIA, MASACH) {
      if (confirm('Bạn có chắc chắn muốn xóa lượt mượn này?')) {
        try {
          await axios.delete(`http://localhost:5000/api/theodoimuonsach/${MADOCGIA}/${MASACH}`)
          this.fetchBorrows()
        } catch (error) {
          console.error('Lỗi khi xóa lượt mượn:', error)
        }
      }
    },
    editBorrow(borrow) {
      this.isEditing = true
      this.newBorrow = { ...borrow }
      this.showModal = true
    },
    async updateBorrow() {
      try {
        await axios.put(
          `http://localhost:5000/api/theodoimuonsach/${this.newBorrow.MADOCGIA}/${this.newBorrow.MASACH}`,
          this.newBorrow,
        )
        this.fetchBorrows()
        this.closeModal()
        alert('Cập nhật lượt mượn thành công!')
      } catch (error) {
        console.error('Lỗi khi cập nhật lượt mượn:', error)
      }
    },
    openModal() {
      this.isEditing = false
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
    },
  },
  mounted() {
    this.fetchBorrows()
  },
}
</script>

<style scoped>
.input-field {
  @apply w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition;
}
</style>
