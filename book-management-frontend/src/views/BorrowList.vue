<template>
  <div class="p-6">
    <h2 class="text-2xl font-semibold text-gray-700">Theo dõi mượn sách</h2>
    <button @click="fetchBorrows" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
      Làm mới
    </button>

    <div v-if="borrows.length > 0" class="mt-4">
      <table class="w-full border-collapse border border-gray-300">
        <thead>
          <tr class="bg-gray-200">
            <th class="border p-2">Mã Độc Giả</th>
            <th class="border p-2">Mã Sách</th>
            <th class="border p-2">Ngày Mượn</th>
            <th class="border p-2">Ngày Trả</th>
            <th class="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="borrow in borrows" :key="borrow.MADOCGIA" class="text-center">
            <td class="border p-2">{{ borrow.MADOCGIA }}</td>
            <td class="border p-2">{{ borrow.MASACH }}</td>
            <td class="border p-2">{{ borrow.NGAYMUON }}</td>
            <td class="border p-2">{{ borrow.NGAYTRA || 'Chưa trả' }}</td>
            <td class="border p-2">
              <button
                @click="updateReturnDate(borrow.MADOCGIA, borrow.MASACH)"
                class="bg-green-500 text-white px-2 py-1 rounded"
              >
                Trả sách
              </button>
              <button
                @click="deleteBorrow(borrow.MADOCGIA, borrow.MASACH)"
                class="bg-red-500 text-white px-2 py-1 rounded ml-2"
              >
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="mt-4 text-gray-500">Chưa có lịch sử mượn sách.</div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useBookStore } from '../stores/bookStore'

const bookStore = useBookStore()
const { borrows, fetchBorrows, updateReturnDate, deleteBorrow } = bookStore

onMounted(fetchBorrows)
</script>
