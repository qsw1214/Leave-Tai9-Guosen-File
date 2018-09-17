<template>
  <div class="container">
    <m-breadcrumb :items="items" />
  </div>
</template>

<script>
  export default {
    name: 'Breadcrumb',
    data() {
      return {
        items: [
          { name: '员工管理' },
          { name: '侧边栏', to: '/sidebar', replace: true },
          { name: '面包屑' },
        ],
      }
    },
  }
</script>
