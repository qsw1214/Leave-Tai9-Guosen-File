<template>
  <m-section title="交接事项">
    <div class="transferir">
      <el-table
        style="width: 100%;"
        border
        :data="data">
        <el-table-column
          type="index"
          width="80"
          align="center"
          label="序号" />

        <el-table-column
          prop="transfer_user_name"
          width="140"
          align="center"
          label="拟离职交接人" />

        <el-table-column
          prop="transfer_matters"
          label="拟交接工作事项" />
      </el-table>
    </div>
  </m-section>
</template>

<script>
  export default {
    name: 'Transferir',
    props: {
      data: {
        required: true,
        type: Array,
        default() { return [] },
      },
    },
  }
</script>

<style lang="scss" scoped>
  .transferir {
    margin: 22px 20px;
  }
</style>
