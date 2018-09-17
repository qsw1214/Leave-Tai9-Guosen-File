<template>
  <m-section
    title="流程信息">

    <m-section-row>
      <m-section-cell
        title="流程编码"
        :content="data.code || '提交后由系统生成'" />

      <m-section-cell
        title="流程状态"
        :content="data.status_name || '草稿'" />
    </m-section-row>
  </m-section>
</template>

<script>
  export default {
    name: 'FlowForm',

    props: {
      data: {
        type: Object,
        required: true,
      },
    },
  }
</script>
