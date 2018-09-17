<template>
  <m-section
    :title="title"
    :style-object="styleObject"
    :data="result">
    <m-section-row>
      <m-section-cell
        title="审批日期"
        prop="approval_time" />

      <m-section-cell
        title="是否已安排座位"
        prop="approval_is_seat_name" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="审批意见"
        prop="approval_subject" />
    </m-section-row>
  </m-section>
</template>

<script>
  import props from './props'

  export default {
    name: 'GTApprovedForm',

    mixins: [props],
  }
</script>
