<template>
  <div class="page--pa-actions">
    <el-button
      type="primary"
      :loading="$parent.button.submit"
      @click="$parent.submit('submit')">提交</el-button>

    <el-button
      type="info"
      :loading="$parent.button.stash"
      @click="$parent.submit('stash')">暂存</el-button>

    <el-button
      type="info"
      @click="$parent.cancel">取消</el-button>
  </div>
</template>

<script>
  export default {
    name: 'ApplicationButton',
  }
</script>
