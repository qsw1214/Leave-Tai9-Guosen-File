<template>
  <m-section
    title="申请表单"
    :data="data">

    <m-section-row>
      <m-section-cell
        title="流程编码"
        prop="code" />

      <m-section-cell
        title="申请日期"
        prop="apply_date" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="流程状态"
        prop="status_name" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="故障类别"
        prop="itfw_type_name" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="故障描述"
        prop="itfw_describe" />
    </m-section-row>

    <m-section-row>
      <m-section-cell title="附件列表">
        <m-attachment :data="data.attachment_list || []" />
      </m-section-cell>
    </m-section-row>

  </m-section>
</template>

<script>
  export default {
    name: 'ITForm',
    props: {
      data: {
        type: Object,
        default: () => ({}),
      },
    },
  }
</script>
