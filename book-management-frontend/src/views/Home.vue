<template>
  <div class="text-center p-10">
    <h1 class="text-3xl font-bold text-blue-600 mb-4">
      Chào mừng đến với hệ thống Quản lý Mượn Sách
    </h1>
    <p class="text-lg text-gray-700 mb-6">
      Dễ dàng quản lý sách, độc giả, nhân viên và quá trình mượn trả sách.
    </p>

    <div class="flex flex-wrap justify-center gap-4">
      <router-link to="/books" class="btn">📚 Quản lý Sách</router-link>
      <router-link to="/borrows" class="btn">🔄 Theo dõi Mượn Sách</router-link>
      <router-link to="/publishers" class="btn">🏢 Nhà Xuất Bản</router-link>
      <router-link to="/readers" class="btn">👤 Độc Giả</router-link>
      <router-link to="/staff" class="btn">👨‍💼 Nhân Viên</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
}
</script>

<style scoped>
.btn {
  @apply bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition;
}
</style>
