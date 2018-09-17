<template>
  <m-section
    title="申请表单"
    :data="data">

    <m-section-row>
      <m-section-cell
        prop="code"
        title="流程编码" />
      <m-section-cell
        prop="apply_date"
        title="申请日期" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        prop="status_name"
        title="流程状态" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        prop="rszzgl_type_name"
        title="转正类型" />
      <m-section-cell
        prop="rszzgl_date"
        title="拟转正日期" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        prop="rszzgl_reason"
        title="转正原因" />
    </m-section-row>
  </m-section>
</template>

<script>
  export default {
    name: 'StaticForm',

    props: {
      data: {
        type: Object,
        required: true,
      },
    },
  }
</script>
