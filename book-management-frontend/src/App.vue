<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navbar -->
    <nav class="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 class="text-xl font-bold">Quản lý Mượn Sách</h1>
      <div>
        <router-link to="/" class="px-4 hover:underline">Trang chủ</router-link>
        <router-link to="/books" class="px-4 hover:underline">Sách</router-link>
        <router-link to="/borrows" class="px-4 hover:underline">Theo dõi mượn</router-link>
      </div>
    </nav>

    <!-- Nội dung -->
    <div class="container mx-auto p-6">
      <router-view />
    </div>

    <!-- Footer -->
    <footer class="text-center py-4 mt-6 bg-gray-200">
      <p>© 2025 - Quản lý mượn sách</p>
    </footer>
  </div>
</template>

<script setup>
// Không cần script nếu chỉ hiển thị layout
</script>

<style scoped>
/* Tuỳ chỉnh thêm CSS nếu cần */
</style>
