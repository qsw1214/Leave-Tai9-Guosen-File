<template>
  <div class="record">
    <el-table
      border
      stripe
      :data="data">
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="100" />
      <el-table-column
        prop="approvaler_name"
        label="审批节点"
        align="center" />
      <el-table-column
        prop="approval_status_name"
        align="center"
        label="操作" />
      <el-table-column
        prop="approval_subject"
        align="center"
        width="180"
        label="审批意见" />
      <el-table-column
        prop="approval_time"
        align="center"
        label="操作时间" />
    </el-table>
  </div>
</template>

<script>
  export default {
    name: 'RecordList',
    props: {
      data: {
        type: Array,
        default: () => ([]),
      },
    },
  }
</script>
