<template>
  <div class="m-logs-and-path">
    <el-tabs type="border-card">

      <el-tab-pane label="审批记录">
        <approval-steps :data="data.approval_log_list" />
      </el-tab-pane>
      <el-tab-pane label="流程路径">
        <approval-path
          v-if="data.approval_path_list"
          :data="data.approval_path_list" />
        <div
          class="m-logs-and-path--empty"
          v-else>暂无流程路径</div>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
  import ApprovalSteps from '../ApprovalSteps'
  import ApprovalPath from '../approvalPath'

  export default {
    name: 'LogsAndPath',
    components: {
      ApprovalSteps,
      ApprovalPath,
    },

    props: {
      data: {
        type: Object,
        required: true,
        default: () => ({}),
      },
    },
  }
</script>

<style type="text/scss" lang="scss">
  .m-logs-and-path {
    margin: 14px 0;

    .el-tabs {
      &__content {
        padding: 0;
      }
    }

    &--empty {
      padding: 14px 20px;
    }
  }
</style>
