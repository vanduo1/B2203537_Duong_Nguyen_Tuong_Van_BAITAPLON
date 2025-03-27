<template>
  <div class="p-32">
    <h1 class="text-3xl font-bold text-gray-800 mb-4 text-center">
      <i class="fa-solid fa-book"></i> Danh Sách Sách
    </h1>
    <!-- Thanh tìm kiếm -->

    <input
      v-model="searchQuery"
      type="text"
      placeholder=" 🔎 Tìm kiếm theo Mã Sách hoặc Tên Sách..."
      class="input m-4 w-full p-3 rounded-full"
    />

    <!-- Nút tải danh sách sách -->
    <button
      @click="fetchBooks"
      class="font-extrabold my-4 mx-8 p-2 border-2 rounded-full py-2 px-5 border-c3 hover:bg-c3 hover:text-c1 transition ease-in-out duration-300"
    >
      <i class="fa-solid fa-rotate pr-4"></i>Tải danh sách
    </button>

    <!-- Chỉ Admin và Nhân viên mới được thêm sách -->
    <button
      v-if="isAdmin"
      @click="openModal"
      class="font-extrabold text-c4 my-4 p-2 border-2 rounded-full py-2 px-5 border-c4 hover:bg-c4 hover:text-white transition ease-in-out duration-300"
    >
      <i class="fa-solid fa-plus"></i> Thêm Sách
    </button>

    <!-- Bảng hiển thị sách -->
    <div class="overflow-x-auto m-8">
      <table class="w-full border border-gray-300 shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr class="bg-c1 text-c3 font-extrabold uppercase text-sm leading-normal">
            <th class="py-3 px-6 text-left">Mã Sách</th>
            <th class="py-3 px-6 text-left">Tên Sách</th>
            <th class="py-3 px-6 text-center">Đơn Giá</th>
            <th class="py-3 px-6 text-center">Số Quyển</th>
            <th class="py-3 px-6 text-center">Năm XB</th>
            <th class="py-3 px-6 text-center">Mã NXB</th>
            <th class="py-3 px-6 text-center">Tác Giả</th>
            <th class="py-3 px-6 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody class="text-gray-700 text-sm font-normal">
          <tr
            v-for="book in filteredBooks"
            :key="book.MASACH"
            class="border-b border-gray-200 hover:bg-gray-100 transition duration-200"
          >
            <td class="py-3 px-6 text-left">{{ book.MASACH }}</td>
            <td class="py-3 px-6 text-left">{{ book.TENSACH }}</td>
            <td class="py-3 px-6 text-center">{{ book.DONGIA }} VNĐ</td>
            <td class="py-3 px-6 text-center">
              <span v-if="book.SOQUYEN === 0" class="text-red-500">Hết sách</span>
              <span v-else>{{ book.SOQUYEN }}</span>
            </td>
            <td class="py-3 px-6 text-center">{{ book.NAMXUATBAN }}</td>
            <td class="py-3 px-6 text-center">{{ book.MANXB }}</td>
            <td class="py-3 px-6 text-center">{{ book.TACGIA }}</td>
            <td class="py-3 px-6 text-center">
              <!-- Chỉ Admin mới có quyền sửa -->
              <button
                v-if="isAdmin"
                @click="editBook(book)"
                class="text-c3 font-bold hover:text-blue-700 mx-2 border-2 p-2 rounded-2xl"
              >
                ✏ Sửa
              </button>

              <!-- Chỉ Admin mới có quyền xóa -->
              <button
                v-if="isAdmin"
                @click="deleteBook(book.MASACH)"
                class="text-red-700 font-bold hover:text-red-400 mx-2 p-2 border-2 rounded-2xl"
              >
                🗑 Xóa
              </button>

              <!-- Nhân viên chỉ có quyền xem -->
              <span v-if="!isAdmin" class="text-gray-500">🔒 Chỉ đọc</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Form thêm / sửa sách -->
    <!-- Form thêm / sửa sách -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
    >
      <div class="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">
          {{ isEditing ? 'Chỉnh Sửa Sách' : 'Thêm Sách' }}
        </h2>

        <div class="space-y-4">
          <div class="relative" v-if="!isEditing">
            <label class="font-semibold block mb-1">Mã Sách</label>
            <input v-model="newBook.MASACH" type="text" placeholder="Mã Sách" class="input-field" />
          </div>

          <div class="relative">
            <label class="font-semibold block mb-1">Tên Sách</label>
            <input
              v-model="newBook.TENSACH"
              type="text"
              placeholder="Tên Sách"
              class="input-field"
            />
          </div>

          <div class="relative">
            <label class="font-semibold block mb-1">Đơn Giá</label>
            <input
              v-model="newBook.DONGIA"
              type="number"
              placeholder="Đơn Giá"
              class="input-field"
            />
          </div>

          <div class="relative">
            <label class="font-semibold block mb-1">Số Quyển</label>
            <input
              v-model="newBook.SOQUYEN"
              type="number"
              placeholder="Số Quyển"
              class="input-field"
            />
          </div>

          <div class="relative">
            <label class="font-semibold block mb-1">Năm Xuất Bản</label>
            <input
              v-model="newBook.NAMXUATBAN"
              type="number"
              placeholder="Năm Xuất Bản"
              class="input-field"
            />
          </div>

          <div class="relative">
            <label class="font-semibold block mb-1">Mã NXB</label>
            <input v-model="newBook.MANXB" type="text" placeholder="Mã NXB" class="input-field" />
          </div>

          <div class="relative">
            <label class="font-semibold block mb-1">Tác Giả</label>
            <input v-model="newBook.TACGIA" type="text" placeholder="Tác Giả" class="input-field" />
          </div>
        </div>

        <div class="flex justify-between mt-6">
          <button
            @click="isEditing ? updateBook() : addBook()"
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
  name: 'Books',
  data() {
    return {
      books: [], // Danh sách sách gốc từ API
      searchQuery: '', // Từ khóa tìm kiếm
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
    // Lọc danh sách sách theo từ khóa tìm kiếm
    filteredBooks() {
      return this.books.filter(
        (book) =>
          book.MASACH.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          book.TENSACH.toLowerCase().includes(this.searchQuery.toLowerCase()),
      )
    },
  },
  methods: {
    formatDate(date) {
      return date ? new Date(date).toLocaleDateString('vi-VN') : 'Chưa trả'
    },

    async fetchBooks() {
      try {
        const response = await axios.get('http://localhost:5000/api/sach')
        this.books = response.data

        // Nếu sách hết (SOQUYEN === 0), gọi API để lấy ngày trả gần nhất
        for (let book of this.books) {
          if (book.SOQUYEN === 0) {
            const returnDateRes = await axios.get(
              `http://localhost:5000/api/theodoimuonsach/next-return/${book.MASACH}`,
            )
            book.NGAYTRA = returnDateRes.data.nextReturnDate || 'Chưa có lịch trả sách sắp tới'
          }
        }
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
.input-field {
  @apply w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition;
}
</style>
