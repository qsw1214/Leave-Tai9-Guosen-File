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
        prop="zsgpsq_reason_name"
        title="申请原因" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="附件列表"
        v-if="data.attachment_list">
        <m-attachment :data="data.attachment_list" />
      </m-section-cell>
    </m-section-row>
  </m-section>
</template>

<script>
  export default {
    name: 'OfficialCardForm',

    props: {
      data: {
        type: Object,
        default: () => ({}),
      },
    },
  }
</script>
