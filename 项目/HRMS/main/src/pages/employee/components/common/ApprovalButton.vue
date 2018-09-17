<template>
  <div class="page--approving-actions">
    <el-button
      type="primary"
      :loading="$parent.button.agree"
      @click="$parent.approval({ step: '2' })">同意</el-button>

    <el-button
      type="info"
      :loading="$parent.button.reject"
      @click="$parent.approval({ step: '4' })">退回</el-button>

    <el-button
      type="info"
      @click="$parent.cancel()">取消</el-button>
  </div>
</template>

<script>
  export default {
    name: 'ApprovalButton',
  }
</script>
