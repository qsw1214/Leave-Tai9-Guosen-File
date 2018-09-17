<template>
  <div class="process">
    此处需要UI画好图
    <pre>{{ data }}</pre>
    <el-steps
      align-center
      :active="2">
      <el-step
        description="这是一段很长很长很长的描述性文字"
        v-for="(item, index) in data"
        :title="item.title"
        :key="index" />
    </el-steps>
  </div>
</template>

<script>
  export default {
    name: 'Process',
    props: {
      data: {
        type: Array,
        default: () => ([]),
      },
    },
  }
</script>
