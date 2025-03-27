<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-4">📚 Danh Sách Độc Giả</h1>
    <!-- Ô tìm kiếm độc giả -->
    <input
      v-model="searchQuery"
      type="text"
      placeholder="🔍 Tìm kiếm độc giả..."
      class="input mb-4 w-full"
    />
    <!-- Nút tải danh sách độc giả -->
    <button @click="fetchReaders" class="btn mb-4">🔄 Tải danh sách</button>
    <button @click="openModal" class="btn btn-add mb-4">➕ Thêm Độc Giả</button>

    <!-- Bảng hiển thị độc giả -->
    <table class="w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border p-2">Mã</th>
          <th class="border p-2">Họ Lót</th>
          <th class="border p-2">Tên</th>
          <th class="border p-2">Ngày Sinh</th>
          <th class="border p-2">Phái</th>
          <th class="border p-2">Địa Chỉ</th>
          <th class="border p-2">Điện Thoại</th>
          <th class="border p-2">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="reader in filteredReaders" :key="reader.MADOCGIA" class="text-center">
          <td class="border p-2">{{ reader.MADOCGIA }}</td>
          <td class="border p-2">{{ reader.HOLOT }}</td>
          <td class="border p-2">{{ reader.TEN }}</td>
          <td class="border p-2">{{ formatDate(reader.NGAYSINH) }}</td>
          <td class="border p-2">{{ reader.PHAI === 'M' ? 'Nam' : 'Nữ' }}</td>
          <td class="border p-2">{{ reader.DIACHI }}</td>
          <td class="border p-2">{{ reader.DIENTHOAI }}</td>
          <td class="border p-2">
            <button @click="editReader(reader)" class="btn btn-edit">✏ Sửa</button>
            <button v-if="isAdmin" @click="deleteReader(reader.MADOCGIA)" class="btn btn-delete">
              🗑 Xóa
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Form thêm / sửa độc giả -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2 class="text-xl font-bold mb-4">
          {{ isEditing ? '✏ Chỉnh Sửa Độc Giả' : '➕ Thêm Độc Giả' }}
        </h2>
        <input v-model="newReader.MADOCGIA" type="text" placeholder="Mã Độc Giả" class="input" />
        <input v-model="newReader.HOLOT" type="text" placeholder="Họ Lót" class="input" />
        <input v-model="newReader.TEN" type="text" placeholder="Tên" class="input" />
        <input v-model="newReader.NGAYSINH" type="date" placeholder="Ngày Sinh" class="input" />
        <select v-model="newReader.PHAI" class="input">
          <option value="M">Nam</option>
          <option value="F">Nữ</option>
        </select>
        <input v-model="newReader.DIACHI" type="text" placeholder="Địa Chỉ" class="input" />
        <input
          v-model="newReader.DIENTHOAI"
          type="text"
          placeholder="Số Điện Thoại"
          class="input"
        />

        <div class="flex justify-between">
          <button @click="isEditing ? updateReader() : addReader()" class="btn">✔ Lưu</button>
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
