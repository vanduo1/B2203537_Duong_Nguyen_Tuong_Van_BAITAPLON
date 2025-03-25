<template>
  <div class="p-6">
    <h2 class="text-2xl font-semibold text-gray-700">Danh sách sách</h2>
    <button @click="fetchBooks" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
      Làm mới
    </button>

    <div v-if="books.length > 0" class="mt-4">
      <table class="w-full border-collapse border border-gray-300">
        <thead>
          <tr class="bg-gray-200">
            <th class="border p-2">Mã sách</th>
            <th class="border p-2">Tên sách</th>
            <th class="border p-2">Tác giả</th>
            <th class="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book.id" class="text-center">
            <td class="border p-2">{{ book.MASACH }}</td>
            <td class="border p-2">{{ book.TENSACH }}</td>
            <td class="border p-2">{{ book.NGUON_GOC_TACGIA }}</td>
            <td class="border p-2">
              <button @click="deleteBook(book.id)" class="bg-red-500 text-white px-2 py-1 rounded">
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="mt-4 text-gray-500">Chưa có sách nào.</div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useBookStore } from '../stores/bookStore'

const bookStore = useBookStore()
const { books, fetchBooks, deleteBook } = bookStore

onMounted(fetchBooks)
</script>
