<template>
  <div class="container">
    <m-header />
    <m-sidebar />

    <el-row class="page">
      <h2 class="page--title">组织管理</h2>

      <el-breadcrumb
        separator=">"
        class="page--breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        <el-breadcrumb-item>活动列表</el-breadcrumb-item>
        <el-breadcrumb-item>活动详情</el-breadcrumb-item>
      </el-breadcrumb>

      <div style="height: 1800px;" />
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'Sidebar',

    data() {
      return { input: { search: '' } }
    },

    mounted() {
      this.$utils.config.init()
    },
  }

</script>
