<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-4">📚 Danh Sách Sách</h1>

    <!-- Nút tải danh sách sách -->
    <button @click="fetchBooks" class="btn mb-4">🔄 Tải danh sách</button>

    <!-- Chỉ Admin và Nhân viên mới được thêm sách -->
    <button v-if="isAdmin" @click="openModal" class="btn btn-add mb-4">➕ Thêm Sách</button>

    <!-- Bảng hiển thị sách -->
    <table class="w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border p-2">Mã Sách</th>
          <th class="border p-2">Tên Sách</th>
          <th class="border p-2">Đơn Giá</th>
          <th class="border p-2">Số Quyển</th>
          <th class="border p-2">Năm XB</th>
          <th class="border p-2">Mã NXB</th>
          <th class="border p-2">Nguồn Gốc/Tác Giả</th>
          <th class="border p-2">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in books" :key="book.MASACH" class="text-center">
          <td class="border p-2">{{ book.MASACH }}</td>
          <td class="border p-2">{{ book.TENSACH }}</td>
          <td class="border p-2">{{ book.DONGIA }} VNĐ</td>
          <td class="border p-2">{{ book.SOQUYEN }}</td>
          <td class="border p-2">{{ book.NAMXUATBAN }}</td>
          <td class="border p-2">{{ book.MANXB }}</td>
          <td class="border p-2">{{ book.TACGIA }}</td>
          <td class="border p-2">
            <!-- Chỉ Admin và Nhân viên mới có quyền sửa -->
            <button v-if="isAdmin" @click="editBook(book)" class="btn btn-edit">✏ Sửa</button>

            <!-- Chỉ Admin mới có quyền xóa -->
            <button v-if="isAdmin" @click="deleteBook(book.MASACH)" class="btn btn-delete">
              🗑 Xóa
            </button>
            <!-- 👀 Nếu là nhân viên, hiển thị trạng thái "Chỉ đọc" -->
            <span v-if="!isAdmin" class="text-gray-500">🔒 Chỉ đọc</span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Form thêm / sửa sách -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2 class="text-xl font-bold mb-4">
          {{ isEditing ? '✏ Chỉnh Sửa Sách' : '➕ Thêm Sách' }}
        </h2>
        <input v-model="newBook.MASACH" type="text" placeholder="Mã Sách" class="input" />
        <input v-model="newBook.TENSACH" type="text" placeholder="Tên Sách" class="input" />
        <input v-model="newBook.DONGIA" type="number" placeholder="Đơn Giá" class="input" />
        <input v-model="newBook.SOQUYEN" type="number" placeholder="Số Quyển" class="input" />
        <input
          v-model="newBook.NAMXUATBAN"
          type="number"
          placeholder="Năm Xuất Bản"
          class="input"
        />
        <input v-model="newBook.MANXB" type="text" placeholder="Mã NXB" class="input" />
        <input
          v-model="newBook.TACGIA"
          type="text"
          placeholder="Nguồn Gốc / Tác Giả"
          class="input"
        />

        <div class="flex justify-between">
          <button @click="isEditing ? updateBook() : addBook()" class="btn">✔ Lưu</button>
          <button @click="closeModal" class="btn btn-delete">✖ Hủy</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'

export default {
  name: 'Books',
  data() {
    return {
      books: [],
      showModal: false,
      isEditing: false,
      newBook: {
        MASACH: '',
        TENSACH: '',
        DONGIA: 0,
        SOQUYEN: 0,
        NAMXUATBAN: '',
        MANXB: '',
        TACGIA: '',
      },
    }
  },
  computed: {
    ...mapState(['ChucVu']),
    isAdmin() {
      return this.ChucVu === 'quanly'
    },
    isStaff() {
      return this.ChucVu === 'nhanvien'
    },
  },
  methods: {
    async fetchBooks() {
      try {
        const response = await axios.get('http://localhost:5000/api/sach')
        this.books = response.data
      } catch (error) {
        console.error('Lỗi tải sách:', error)
      }
    },
    async addBook() {
      try {
        await axios.post('http://localhost:5000/api/sach', this.newBook)
        this.fetchBooks()
        this.closeModal()
      } catch (error) {
        console.error('Lỗi khi thêm sách:', error)
      }
    },
    async deleteBook(id) {
      if (confirm('Bạn có chắc chắn muốn xóa sách này?')) {
        try {
          await axios.delete(`http://localhost:5000/api/sach/${id}`)
          this.fetchBooks()
        } catch (error) {
          console.error('Lỗi khi xóa sách:', error)
        }
      }
    },
    editBook(book) {
      this.isEditing = true
      this.newBook = { ...book }
      this.showModal = true
    },
    async updateBook() {
      try {
        if (
          !this.newBook.MASACH ||
          !this.newBook.TENSACH ||
          !this.newBook.DONGIA ||
          !this.newBook.SOQUYEN ||
          !this.newBook.NAMXUATBAN ||
          !this.newBook.MANXB ||
          !this.newBook.TACGIA
        ) {
          alert('Vui lòng nhập đầy đủ thông tin sách.')
          return
        }

        const updatedBook = {
          TENSACH: this.newBook.TENSACH,
          DONGIA: this.newBook.DONGIA,
          SOQUYEN: this.newBook.SOQUYEN,
          NAMXUATBAN: this.newBook.NAMXUATBAN,
          MANXB: this.newBook.MANXB,
          TACGIA: this.newBook.TACGIA,
        }

        await axios.put(`http://localhost:5000/api/sach/${this.newBook.MASACH}`, updatedBook)

        this.fetchBooks()
        this.closeModal()
        alert('Cập nhật sách thành công!')
      } catch (error) {
        console.error('Lỗi khi cập nhật sách:', error)
        alert('Có lỗi xảy ra khi cập nhật sách. Vui lòng thử lại!')
      }
    },
    openModal() {
      this.isEditing = false
      this.newBook = {
        MASACH: '',
        TENSACH: '',
        DONGIA: 0,
        SOQUYEN: 0,
        NAMXUATBAN: '',
        MANXB: '',
        TACGIA: '',
      }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
    },
  },
  mounted() {
    this.fetchBooks()
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
