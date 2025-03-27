<template>
  <div class="p-32">
    <h1 class="text-3xl font-bold text-gray-800 mb-4 text-center">
      <i class="fa-solid fa-users"></i> Danh Sách Độc Giả
    </h1>

    <!-- Thanh tìm kiếm -->
    <input
      v-model="searchQuery"
      type="text"
      placeholder=" 🔎 Tìm kiếm theo Mã Độc Giả hoặc Tên..."
      class="input m-4 w-full p-3 rounded-full"
    />

    <!-- Nút tải danh sách độc giả -->
    <button
      @click="fetchReaders"
      class="font-extrabold my-4 mx-8 p-2 border-2 rounded-full py-2 px-5 border-c3 hover:bg-c3 hover:text-c1 transition ease-in-out duration-300"
    >
      <i class="fa-solid fa-rotate pr-4"></i> Tải danh sách
    </button>

    <!-- Chỉ Admin mới được thêm độc giả -->
    <button
      v-if="isAdmin"
      @click="openModal"
      class="font-extrabold text-c4 my-4 p-2 border-2 rounded-full py-2 px-5 border-c4 hover:bg-c4 hover:text-white transition ease-in-out duration-300"
    >
      <i class="fa-solid fa-plus"></i> Thêm Độc Giả
    </button>

    <!-- Bảng hiển thị độc giả -->
    <div class="overflow-x-auto m-8">
      <table class="w-full border border-gray-300 shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr class="bg-c1 text-c3 font-extrabold uppercase text-sm leading-normal">
            <th class="py-3 px-6 text-left">Mã</th>
            <th class="py-3 px-6 text-left">Họ Lót</th>
            <th class="py-3 px-6 text-left">Tên</th>
            <th class="py-3 px-6 text-center">Ngày Sinh</th>
            <th class="py-3 px-6 text-center">Phái</th>
            <th class="py-3 px-6 text-center">Địa Chỉ</th>
            <th class="py-3 px-6 text-center">Điện Thoại</th>
            <th class="py-3 px-6 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody class="text-gray-700 text-sm font-normal">
          <tr
            v-for="reader in filteredReaders"
            :key="reader.MADOCGIA"
            class="border-b border-gray-200 hover:bg-gray-100 transition duration-200"
          >
            <td class="py-3 px-6 text-left">{{ reader.MADOCGIA }}</td>
            <td class="py-3 px-6 text-left">{{ reader.HOLOT }}</td>
            <td class="py-3 px-6 text-left">{{ reader.TEN }}</td>
            <td class="py-3 px-6 text-center">{{ formatDate(reader.NGAYSINH) }}</td>
            <td class="py-3 px-6 text-center">
              {{ reader.PHAI === 'M' ? 'Nam' : 'Nữ' }}
            </td>
            <td class="py-3 px-6 text-center">{{ reader.DIACHI }}</td>
            <td class="py-3 px-6 text-center">{{ reader.DIENTHOAI }}</td>
            <td class="py-3 px-6 text-center">
              <!-- Chỉ Admin mới có quyền sửa -->
              <button
                v-if="isAdmin"
                @click="editReader(reader)"
                class="text-c3 font-bold hover:text-blue-700 mx-2 border-2 p-2 rounded-2xl"
              >
                ✏ Sửa
              </button>

              <!-- Chỉ Admin mới có quyền xóa -->
              <button
                v-if="isAdmin"
                @click="deleteReader(reader.MADOCGIA)"
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

    <!-- Form thêm / sửa độc giả -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
    >
      <div class="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">
          {{ isEditing ? 'Chỉnh Sửa Độc Giả' : 'Thêm Độc Giả' }}
        </h2>

        <div class="space-y-4">
          <div v-if="!isEditing">
            <label class="font-bold text-gray-700">Mã Độc Giả</label>
            <input v-model="newReader.MADOCGIA" type="text" class="input-field" />
          </div>

          <div>
            <label class="font-bold text-gray-700">Họ Lót</label>
            <input v-model="newReader.HOLOT" type="text" class="input-field" />
          </div>

          <div>
            <label class="font-bold text-gray-700">Tên</label>
            <input v-model="newReader.TEN" type="text" class="input-field" />
          </div>

          <div>
            <label class="font-bold text-gray-700">Ngày Sinh</label>
            <input v-model="newReader.NGAYSINH" type="date" class="input-field" />
          </div>

          <div>
            <label class="font-bold text-gray-700">Giới Tính</label>
            <select v-model="newReader.PHAI" class="input-field">
              <option value="M">Nam</option>
              <option value="F">Nữ</option>
            </select>
          </div>

          <div>
            <label class="font-bold text-gray-700">Địa Chỉ</label>
            <input v-model="newReader.DIACHI" type="text" class="input-field" />
          </div>

          <div>
            <label class="font-bold text-gray-700">Số Điện Thoại</label>
            <input v-model="newReader.DIENTHOAI" type="text" class="input-field" />
          </div>
        </div>

        <div class="flex justify-between mt-6">
          <button
            @click="isEditing ? updateReader() : addReader()"
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
  name: 'Readers',
  computed: {
    ...mapState(['ChucVu']),
    isAdmin() {
      return this.ChucVu === 'quanly' // ✅ Chỉ admin có quyền xóa
    },
    filteredReaders() {
      return this.readers.filter(
        (reader) =>
          reader.MADOCGIA.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          reader.HOLOT.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          reader.TEN.toLowerCase().includes(this.searchQuery.toLowerCase()),
      )
    },
  },
  data() {
    return {
      readers: [],
      searchQuery: '', // Biến tìm kiếm
      showModal: false,
      isEditing: false,
      newReader: {
        MADOCGIA: '',
        HOLOT: '',
        TEN: '',
        NGAYSINH: '',
        PHAI: 'Nu',
        DIACHI: '',
        DIENTHOAI: '',
      },
    }
  },
  methods: {
    async fetchReaders() {
      try {
        const response = await axios.get('http://localhost:5000/api/docgia')
        this.readers = response.data
      } catch (error) {
        console.error('Lỗi tải độc giả:', error)
      }
    },
    async addReader() {
      try {
        await axios.post('http://localhost:5000/api/docgia', this.newReader)
        this.fetchReaders()
        this.closeModal()
      } catch (error) {
        console.error('Lỗi khi thêm độc giả:', error)
      }
    },
    async deleteReader(madocgia) {
      if (confirm('Bạn có chắc chắn muốn xóa độc giả này?')) {
        try {
          await axios.delete(`http://localhost:5000/api/docgia/${madocgia}`)
          this.fetchReaders()
        } catch (error) {
          console.error('Lỗi khi xóa độc giả:', error)
        }
      }
    },
    editReader(reader) {
      this.isEditing = true
      this.newReader = { ...reader }
      this.showModal = true
    },
    async updateReader() {
      try {
        if (
          !this.newReader.MADOCGIA ||
          !this.newReader.HOLOT ||
          !this.newReader.TEN ||
          !this.newReader.NGAYSINH ||
          !this.newReader.PHAI ||
          !this.newReader.DIACHI ||
          !this.newReader.DIENTHOAI
        ) {
          alert('Vui lòng nhập đầy đủ thông tin độc giả.')
          return
        }

        const updatedReader = {
          HOLOT: this.newReader.HOLOT,
          TEN: this.newReader.TEN,
          NGAYSINH: this.newReader.NGAYSINH,
          PHAI: this.newReader.PHAI,
          DIACHI: this.newReader.DIACHI,
          DIENTHOAI: this.newReader.DIENTHOAI,
        }

        await axios.put(
          `http://localhost:5000/api/docgia/${this.newReader.MADOCGIA}`,
          updatedReader,
        )

        this.fetchReaders()
        this.closeModal()
        alert('Cập nhật độc giả thành công!')
      } catch (error) {
        console.error('Lỗi khi cập nhật độc giả:', error)
        alert('Có lỗi xảy ra khi cập nhật độc giả. Vui lòng thử lại!')
      }
    },
    openModal() {
      this.isEditing = false
      this.newReader = {
        MADOCGIA: '',
        HOLOT: '',
        TEN: '',
        NGAYSINH: '',
        PHAI: 'Nu',
        DIACHI: '',
        DIENTHOAI: '',
      }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
    },
    formatDate(date) {
      return date ? new Date(date).toLocaleDateString('vi-VN') : ''
    },
  },
  mounted() {
    this.fetchReaders()
  },
}
</script>

<style scoped>
.input-field {
  @apply w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition;
}
</style>
