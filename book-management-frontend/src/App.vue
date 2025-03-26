<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-blue-600 text-white p-4 flex justify-between">
      <h1 class="text-xl font-bold">Quản lý Mượn Sách</h1>
      <div>
        <router-link to="/" class="px-4 hover:underline">Trang chủ</router-link>
        <router-link to="/books" class="px-4 hover:underline">Sách</router-link>
        <router-link to="/borrows" class="px-4 hover:underline">Mượn sách</router-link>
        <router-link to="/login" class="px-4 hover:underline">Login</router-link>
      </div>
    </nav>

    <div class="container mx-auto p-6">
      <router-view />
    </div>

    <footer class="text-center py-4 mt-6 bg-gray-200">
      <p>© 2025 - Quản lý mượn sách</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>
