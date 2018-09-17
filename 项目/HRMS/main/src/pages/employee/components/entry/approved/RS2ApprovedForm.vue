<template>
  <m-section
    :title="title"
    :style-object="styleObject"
    :data="result">
    <m-section-row>
      <m-section-cell
        title="审批日期"
        prop="approval_time" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="是否已发放密钥"
        prop="approval_is_send_key_name" />

      <m-section-cell
        title="是否录入指/掌纹"
        prop="approval_is_hand_print_name" />
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
    name: 'HGApprovedForm',

    mixins: [props],
  }
</script>
