<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-4">🏢 Danh Sách Nhà Xuất Bản</h1>
    <!-- Ô tìm kiếm -->
    <input
      v-model="searchQuery"
      type="text"
      placeholder="🔍 Tìm kiếm nhà xuất bản..."
      class="input mb-4 w-full"
    />
    <!-- 🔒 Chỉ admin mới thấy nút thêm -->
    <button v-if="isAdmin" @click="openModal" class="btn btn-add mb-4">➕ Thêm Nhà Xuất Bản</button>

    <table class="w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border p-2">Mã NXB</th>
          <th class="border p-2">Tên NXB</th>
          <th class="border p-2">Địa Chỉ</th>
          <th class="border p-2">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="publisher in filteredPublishers" :key="publisher.MANXB" class="text-center">
          <td class="border p-2">{{ publisher.MANXB }}</td>
          <td class="border p-2">{{ publisher.TENNXB }}</td>
          <td class="border p-2">{{ publisher.DIACHI }}</td>
          <td class="border p-2">
            <!-- 🔒 Chỉ admin mới thấy các nút sửa / xóa -->
            <button v-if="isAdmin" @click="editPublisher(publisher)" class="btn btn-edit">
              ✏ Sửa
            </button>
            <button v-if="isAdmin" @click="deletePublisher(publisher.MANXB)" class="btn btn-delete">
              🗑 Xóa
            </button>

            <!-- 👀 Nếu là nhân viên, hiển thị trạng thái "Chỉ đọc" -->
            <span v-if="!isAdmin" class="text-gray-500">🔒 Chỉ đọc</span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Form thêm / sửa nhà xuất bản (chỉ admin mới mở được) -->
    <div v-if="showModal && isAdmin" class="modal">
      <div class="modal-content">
        <h2 class="text-xl font-bold mb-4">
          {{ isEditing ? '✏ Chỉnh Sửa Nhà Xuất Bản' : '➕ Thêm Nhà Xuất Bản' }}
        </h2>
        <input
          v-model="newPublisher.MANXB"
          type="text"
          placeholder="Mã NXB"
          class="input"
          :disabled="isEditing"
        />
        <input v-model="newPublisher.TENNXB" type="text" placeholder="Tên NXB" class="input" />
        <input v-model="newPublisher.DIACHI" type="text" placeholder="Địa Chỉ" class="input" />

        <div class="flex justify-between">
          <button @click="isEditing ? updatePublisher() : addPublisher()" class="btn">
            ✔ Lưu
          </button>
          <button @click="closeModal" class="btn btn-delete">✖ Hủy</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'

export default {
  name: 'Publishers',
  computed: {
    ...mapState(['ChucVu']),
    isAdmin() {
      return this.ChucVu === 'quanly' // ✅ Kiểm tra quyền admin
    },
    filteredPublishers() {
      return this.publishers.filter(
        (publisher) =>
          publisher.MANXB.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          publisher.TENNXB.toLowerCase().includes(this.searchQuery.toLowerCase()),
      )
    },
  },
  data() {
    return {
      publishers: [],
      searchQuery: '', // Biến tìm kiếm
      showModal: false,
      isEditing: false,
      newPublisher: { MANXB: '', TENNXB: '', DIACHI: '' },
    }
  },
  methods: {
    async fetchPublishers() {
      try {
        const response = await axios.get('http://localhost:5000/api/nhaxuatban')
        this.publishers = response.data
      } catch (error) {
        console.error('Lỗi tải nhà xuất bản:', error)
      }
    },
    async addPublisher() {
      if (!this.newPublisher.MANXB || !this.newPublisher.TENNXB || !this.newPublisher.DIACHI) {
        alert('Vui lòng nhập đầy đủ thông tin.')
        return
      }
      try {
        await axios.post('http://localhost:5000/api/nhaxuatban', this.newPublisher)
        this.fetchPublishers()
        this.closeModal()
        alert('Thêm nhà xuất bản thành công!')
      } catch (error) {
        console.error('Lỗi khi thêm nhà xuất bản:', error)
        alert('Có lỗi xảy ra khi thêm nhà xuất bản!')
      }
    },
    async deletePublisher(id) {
      if (!this.isAdmin) return // 🔒 Chặn nhân viên thực hiện xóa
      if (confirm('Bạn có chắc chắn muốn xóa nhà xuất bản này?')) {
        try {
          await axios.delete(`http://localhost:5000/api/nhaxuatban/${id}`)
          this.fetchPublishers()
          alert('Xóa nhà xuất bản thành công!')
        } catch (error) {
          console.error('Lỗi khi xóa nhà xuất bản:', error)
          alert('Có lỗi xảy ra khi xóa nhà xuất bản!')
        }
      }
    },
    editPublisher(publisher) {
      if (!this.isAdmin) return // 🔒 Chặn nhân viên sửa
      this.isEditing = true
      this.newPublisher = { ...publisher }
      this.showModal = true
    },
    openModal() {
      if (!this.isAdmin) return // 🔒 Chặn nhân viên mở form thêm
      this.isEditing = false
      this.newPublisher = { MANXB: '', TENNXB: '', DIACHI: '' }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
    },
  },
  mounted() {
    this.fetchPublishers()
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
