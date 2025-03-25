import { defineStore } from 'pinia'
import axios from 'axios'

export const useBookStore = defineStore('bookStore', {
  state: () => ({
    books: [],
  }),
  actions: {
    async fetchBooks() {
      const res = await axios.get('http://localhost:5000/api/sach')
      this.books = res.data
    },
    async addBook(book) {
      await axios.post('http://localhost:5000/api/sach', book)
      this.fetchBooks()
    },
    async deleteBook(id) {
      await axios.delete(`http://localhost:5000/api/sach/${id}`)
      this.fetchBooks()
    },
  },
})
