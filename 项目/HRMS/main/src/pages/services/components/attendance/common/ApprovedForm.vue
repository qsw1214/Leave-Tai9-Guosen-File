<template>
  <m-section
    title="审批结果"
    :data="data">
    <m-section-row>
      <m-section-cell
        prop="approval_time"
        title="审批日期" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        prop="approval_subject"
        title="审批意见" />
    </m-section-row>
  </m-section>
</template>

<script>
  export default {
    name: 'ApprovedForm',

    props: {
      data: {
        type: Object,
        default: () => ({}),
      },
    },
  }
</script>
