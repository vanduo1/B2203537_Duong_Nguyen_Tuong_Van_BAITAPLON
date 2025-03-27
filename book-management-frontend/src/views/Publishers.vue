<template>
  <div class="p-32">
    <h1 class="text-3xl font-bold text-gray-800 mb-4 text-center">
      <i class="fa-solid fa-building"></i> Danh Sách Nhà Xuất Bản
    </h1>

    <!-- Thanh tìm kiếm -->
    <input
      v-model="searchQuery"
      type="text"
      placeholder=" 🔎 Tìm kiếm theo Mã NXB hoặc Tên NXB..."
      class="input m-4 w-full p-3 rounded-full"
    />

    <!-- Nút tải danh sách -->
    <button
      @click="fetchPublishers"
      class="font-extrabold my-4 mx-8 p-2 border-2 rounded-full py-2 px-5 border-c3 hover:bg-c3 hover:text-c1 transition ease-in-out duration-300"
    >
      <i class="fa-solid fa-rotate pr-4"></i>Tải danh sách
    </button>

    <!-- Nút thêm Nhà Xuất Bản (Chỉ admin) -->
    <button
      v-if="isAdmin"
      @click="openModal"
      class="font-extrabold text-c4 my-4 p-2 border-2 rounded-full py-2 px-5 border-c4 hover:bg-c4 hover:text-white transition ease-in-out duration-300"
    >
      <i class="fa-solid fa-plus"></i> Thêm NXB
    </button>

    <!-- Bảng danh sách Nhà Xuất Bản -->
    <div class="overflow-x-auto m-8">
      <table class="w-full border border-gray-300 shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr class="bg-c1 text-c3 font-extrabold uppercase text-sm leading-normal">
            <th class="py-3 px-6 text-left">Mã NXB</th>
            <th class="py-3 px-6 text-left">Tên NXB</th>
            <th class="py-3 px-6 text-left">Địa Chỉ</th>
            <th class="py-3 px-6 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody class="text-gray-700 text-sm font-normal">
          <tr
            v-for="publisher in filteredPublishers"
            :key="publisher.MANXB"
            class="border-b border-gray-200 hover:bg-gray-100 transition duration-200"
          >
            <td class="py-3 px-6 text-left">{{ publisher.MANXB }}</td>
            <td class="py-3 px-6 text-left">{{ publisher.TENNXB }}</td>
            <td class="py-3 px-6 text-left">{{ publisher.DIACHI }}</td>
            <td class="py-3 px-6 text-center">
              <button
                v-if="isAdmin"
                @click="editPublisher(publisher)"
                class="text-c3 font-bold hover:text-blue-700 mx-2 border-2 p-2 rounded-2xl"
              >
                ✏ Sửa
              </button>
              <button
                v-if="isAdmin"
                @click="deletePublisher(publisher.MANXB)"
                class="text-red-700 font-bold hover:text-red-400 mx-2 p-2 border-2 rounded-2xl"
              >
                🗑 Xóa
              </button>
              <span v-if="!isAdmin" class="text-gray-500">🔒 Chỉ đọc</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Form thêm / sửa nhà xuất bản -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
    >
      <div class="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">
          {{ isEditing ? 'Chỉnh Sửa Nhà Xuất Bản' : 'Thêm Nhà Xuất Bản' }}
        </h2>

        <div class="space-y-4">
          <div v-if="!isEditing">
            <label class="block text-gray-700 font-bold">Mã NXB</label>
            <input
              v-model="newPublisher.MANXB"
              type="text"
              placeholder="Mã NXB"
              class="input-field"
            />
          </div>

          <label class="block text-gray-700 font-bold">Tên NXB</label>
          <input
            v-model="newPublisher.TENNXB"
            type="text"
            placeholder="Tên NXB"
            class="input-field"
          />

          <label class="block text-gray-700 font-bold">Địa Chỉ</label>
          <input
            v-model="newPublisher.DIACHI"
            type="text"
            placeholder="Địa Chỉ"
            class="input-field"
          />
        </div>

        <div class="flex justify-between mt-6">
          <button
            @click="isEditing ? updatePublisher() : addPublisher()"
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
import { mapState } from 'vuex'
import axios from 'axios'

export default {
  name: 'Publishers',
  data() {
    return {
      publishers: [],
      searchQuery: '',
      showModal: false,
      isEditing: false,
      newPublisher: { MANXB: '', TENNXB: '', DIACHI: '' },
    }
  },
  computed: {
    ...mapState(['ChucVu']),
    isAdmin() {
      return this.ChucVu === 'quanly'
    },
    filteredPublishers() {
      return this.publishers.filter(
        (publisher) =>
          publisher.MANXB.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          publisher.TENNXB.toLowerCase().includes(this.searchQuery.toLowerCase()),
      )
    },
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
      try {
        await axios.post('http://localhost:5000/api/nhaxuatban', this.newPublisher)
        this.fetchPublishers()
        this.closeModal()
      } catch (error) {
        console.error('Lỗi khi thêm nhà xuất bản:', error)
      }
    },
    async deletePublisher(id) {
      if (confirm('Bạn có chắc chắn muốn xóa nhà xuất bản này?')) {
        try {
          await axios.delete(`http://localhost:5000/api/nhaxuatban/${id}`)
          this.fetchPublishers()
        } catch (error) {
          console.error('Lỗi khi xóa nhà xuất bản:', error)
        }
      }
    },
    editPublisher(publisher) {
      this.isEditing = true
      this.newPublisher = { ...publisher }
      this.showModal = true
    },
    openModal() {
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
.input-field {
  @apply w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition;
}
</style>
