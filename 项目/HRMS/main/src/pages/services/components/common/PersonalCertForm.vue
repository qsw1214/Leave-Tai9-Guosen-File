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
      <m-section-cell
        prop="rszm_type_name"
        title="证明类型" />
    </m-section-row>

    <m-section-row v-if="data.rszm_internship_template == '2'">
      <m-section-cell
        title="模板上传">
        <m-attachment :data="data.attachment_list || []" />
      </m-section-cell>
    </m-section-row>
  </m-section>
</template>

<script>
  export default {
    name: 'PersonalCertForm',

    props: {
      data: {
        type: Object,
        default: () => ({}),
      },
    },
  }
</script>
