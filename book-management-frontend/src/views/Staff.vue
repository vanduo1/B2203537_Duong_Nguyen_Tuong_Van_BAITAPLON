<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-4">📋 Danh Sách Nhân Viên</h1>

    <!-- Ô tìm kiếm nhân viên -->
    <input
      v-model="searchQuery"
      type="text"
      placeholder="🔍 Tìm kiếm nhân viên..."
      class="input mb-4 w-full"
    />

    <!-- Nút thêm nhân viên -->
    <button @click="openModal" class="btn mb-4">➕ Thêm Nhân Viên</button>

    <!-- Bảng hiển thị nhân viên -->
    <table class="w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border p-2">Mã NV</th>
          <th class="border p-2">Họ Tên</th>
          <th class="border p-2">Chức Vụ</th>
          <th class="border p-2">Số Điện Thoại</th>
          <th class="border p-2">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="staff in filteredStaffs" :key="staff._id" class="text-center">
          <td class="border p-2">{{ staff.MSNV }}</td>
          <td class="border p-2">{{ staff.HoTenNV }}</td>
          <td class="border p-2">{{ staff.ChucVu }}</td>
          <td class="border p-2">{{ staff.SoDienThoai }}</td>
          <td class="border p-2">
            <button @click="editStaff(staff)" class="btn btn-edit">✏ Sửa</button>
            <button @click="deleteStaff(staff.MSNV)" class="btn btn-delete">🗑 Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Form thêm nhân viên (Hiển thị khi openModal = true) -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2 class="text-xl font-bold mb-4">➕ Thêm Nhân Viên</h2>
        <input v-model="newStaff.MSNV" type="text" placeholder="Mã NV" class="input" />
        <input v-model="newStaff.HoTenNV" type="text" placeholder="Họ Tên" class="input" />
        <input v-model="newStaff.Password" type="password" placeholder="Mật khẩu" class="input" />
        <input v-model="newStaff.ChucVu" type="text" placeholder="Chức Vụ" class="input" />
        <input v-model="newStaff.DiaChi" type="text" placeholder="Địa Chỉ" class="input" />
        <input
          v-model="newStaff.SoDienThoai"
          type="text"
          placeholder="Số Điện Thoại"
          class="input"
        />

        <div class="flex justify-between">
          <button @click="isEditing ? updateStaff() : addStaff()" class="btn">✔ Lưu</button>
          <button @click="closeModal" class="btn btn-delete">✖ Hủy</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Staff',
  data() {
    return {
      staffs: [],
      searchQuery: '', // Biến tìm kiếm
      showModal: false,
      isEditing: false,
      newStaff: {
        MSNV: '',
        HoTenNV: '',
        Password: '',
        ChucVu: '',
        DiaChi: '',
        SoDienThoai: '',
      },
    }
  },
  computed: {
    filteredStaffs() {
      return this.staffs.filter(
        (staff) =>
          staff.MSNV.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          staff.HoTenNV.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          staff.ChucVu.toLowerCase().includes(this.searchQuery.toLowerCase()),
      )
    },
  },
  methods: {
    async fetchStaffs() {
      try {
        const response = await axios.get('http://localhost:5000/api/nhanvien')
        this.staffs = response.data
      } catch (error) {
        console.error('Lỗi khi tải danh sách nhân viên:', error)
      }
    },
    async addStaff() {
      try {
        await axios.post('http://localhost:5000/api/nhanvien', this.newStaff)
        this.fetchStaffs()
        this.closeModal()
      } catch (error) {
        console.error('Lỗi khi thêm nhân viên:', error)
      }
    },
    async deleteStaff(msnv) {
      if (confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
        try {
          await axios.delete(`http://localhost:5000/api/nhanvien/${msnv}`)
          this.fetchStaffs()
        } catch (error) {
          console.error('Lỗi khi xóa nhân viên:', error)
        }
      }
    },
    editStaff(staff) {
      this.isEditing = true
      this.newStaff = { ...staff }
      this.showModal = true
    },

    async updateStaff() {
      try {
        if (
          !this.newStaff.MSNV ||
          !this.newStaff.HoTenNV ||
          !this.newStaff.ChucVu ||
          !this.newStaff.DiaChi ||
          !this.newStaff.SoDienThoai
        ) {
          alert('Vui lòng nhập đầy đủ thông tin nhân viên.')
          return
        }

        const updatedStaff = {
          HoTenNV: this.newStaff.HoTenNV,
          ChucVu: this.newStaff.ChucVu,
          DiaChi: this.newStaff.DiaChi,
          SoDienThoai: this.newStaff.SoDienThoai,
        }

        await axios.put(`http://localhost:5000/api/nhanvien/${this.newStaff.MSNV}`, updatedStaff)

        this.fetchStaffs()
        this.closeModal()
        alert('Cập nhật nhân viên thành công!')
      } catch (error) {
        console.error('Lỗi khi cập nhật nhân viên:', error)
        alert('Có lỗi xảy ra khi cập nhật nhân viên. Vui lòng thử lại!')
      }
    },
    openModal() {
      this.isEditing = false
      this.newStaff = {
        MSNV: '',
        HoTenNV: '',
        Password: '',
        ChucVu: '',
        DiaChi: '',
        SoDienThoai: '',
      }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
    },
  },
  mounted() {
    this.fetchStaffs()
  },
}
</script>

<style scoped>
.btn {
  @apply bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition;
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
