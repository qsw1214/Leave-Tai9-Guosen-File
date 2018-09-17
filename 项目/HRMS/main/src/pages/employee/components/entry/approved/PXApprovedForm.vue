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
        title="申请链接"
        prop="approval_apply_url" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="账号"
        prop="approval_apply_id" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="附件列表">
        <m-attachment :data="result.attachment_list || []" />
      </m-section-cell>
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
    name: 'ITApprovedForm',

    mixins: [props],
  }
</script>
