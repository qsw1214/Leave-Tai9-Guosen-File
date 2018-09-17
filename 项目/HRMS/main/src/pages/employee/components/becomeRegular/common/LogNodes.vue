<template>
  <div>
    <m-section
      v-for="(log, index) in nodes"
      :key="index"
      :data="log"
      :style-object="{ fontSize: '14px' }"
      :title="`审批表单-${log.approvaler_name}`">

      <m-section-row>
        <m-section-cell
          prop="approval_time"
          title="审批日期" />

        <m-section-cell
          prop="approval_achievement_data"
          title="业绩数据填报"
          v-if="log.approval_achievement_data" />

        <m-section-cell
          prop="approval_is_end_zz_name"
          title="是否终止转正"
          v-if="log.approval_is_end_zz_name" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          prop="approval_subject"
          :title="log.approval_form_type === '200017003' ? '转正申请' : '审批意见'" />
      </m-section-row>
    </m-section>
  </div>
</template>

<script>
  export default {
    name: 'ApprovalLogNodes',

    props: {
      nodes: {
        type: Array,
        default: () => ([]),
      },
    },
  }
</script>
