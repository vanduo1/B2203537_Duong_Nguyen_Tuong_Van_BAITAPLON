<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-4">📚 Theo Dõi Mượn Sách</h1>

    <!-- Nút tải danh sách và thêm mới -->
    <button @click="fetchBorrows" class="btn mb-4">🔄 Tải danh sách</button>
    <button @click="openModal" class="btn btn-add mb-4">➕ Thêm Lượt Mượn</button>

    <!-- Bảng hiển thị lịch sử mượn sách -->
    <table class="w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border p-2">Mã Độc Giả</th>
          <th class="border p-2">Mã Sách</th>
          <th class="border p-2">Ngày Mượn</th>
          <th class="border p-2">Ngày Trả</th>
          <th class="border p-2">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="borrow in borrows" :key="borrow._id" class="text-center">
          <td class="border p-2">{{ borrow.MADOCGIA }}</td>
          <td class="border p-2">{{ borrow.MASACH }}</td>
          <td class="border p-2">{{ formatDate(borrow.NGAYMUON) }}</td>
          <td class="border p-2">{{ borrow.NGAYTRA ? formatDate(borrow.NGAYTRA) : 'Chưa trả' }}</td>
          <td class="border p-2">
            <button @click="editBorrow(borrow)" class="btn btn-edit">✏ Cập nhật</button>
            <button @click="deleteBorrow(borrow.MADOCGIA, borrow.MASACH)" class="btn btn-delete">
              🗑 Xóa
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Form thêm / cập nhật lượt mượn -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2 class="text-xl font-bold mb-4">
          {{ isEditing ? '✏ Cập Nhật Lượt Mượn' : '➕ Thêm Lượt Mượn' }}
        </h2>
        <input v-model="newBorrow.MADOCGIA" type="text" placeholder="Mã Độc Giả" class="input" />
        <input v-model="newBorrow.MASACH" type="text" placeholder="Mã Sách" class="input" />
        <input v-model="newBorrow.NGAYMUON" type="date" class="input" />
        <input
          v-if="isEditing"
          v-model="newBorrow.NGAYTRA"
          type="date"
          class="input"
          placeholder="Ngày Trả"
        />

        <div class="flex justify-between">
          <button @click="isEditing ? updateBorrow() : addBorrow()" class="btn">✔ Lưu</button>
          <button @click="closeModal" class="btn btn-delete">✖ Hủy</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Borrows',
  data() {
    return {
      borrows: [],
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
  methods: {
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
        await axios.post('http://localhost:5000/api/theodoimuonsach', this.newBorrow)
        this.fetchBorrows()
        this.closeModal()
      } catch (error) {
        console.error('Lỗi khi thêm lượt mượn:', error)
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
        const updatedBorrow = {
          NGAYTRA: this.newBorrow.NGAYTRA,
        }

        await axios.put(
          `http://localhost:5000/api/theodoimuonsach/${this.newBorrow.MADOCGIA}/${this.newBorrow.MASACH}`,
          updatedBorrow,
        )

        this.fetchBorrows()
        this.closeModal()
        alert('Cập nhật lượt mượn thành công!')
      } catch (error) {
        console.error('Lỗi khi cập nhật lượt mượn:', error)
        alert('Có lỗi xảy ra khi cập nhật lượt mượn. Vui lòng thử lại!')
      }
    },
    formatDate(date) {
      return date ? new Date(date).toLocaleDateString('vi-VN') : 'Chưa trả'
    },
    openModal() {
      this.isEditing = false
      this.newBorrow = { MADOCGIA: '', MASACH: '', NGAYMUON: '', NGAYTRA: '' }
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
.btn {
  @apply bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition;
}

.btn-add {
  @apply bg-green-500 hover:bg-green-700;
}

.btn-edit {
  @apply bg-yellow-500 hover:bg-yellow-700 mx-1;
}

.btn-delete {
  @apply bg-red-500 hover:bg-red-700;
}

.input {
  @apply w-full border p-2 mb-2 rounded-lg;
}

.modal {
  @apply fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50;
}

.modal-content {
  @apply bg-white p-6 rounded-lg shadow-lg w-96;
}
</style>
