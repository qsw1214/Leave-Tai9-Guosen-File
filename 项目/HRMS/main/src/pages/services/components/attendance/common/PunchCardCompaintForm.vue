
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
        title="未打卡日期"
        :content="beginTime" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="未打卡原因"
        prop="kqwdkss_reason_name" />
    </m-section-row>

    <m-section-row v-if="data.kqwdkss_reason == '64'">
      <m-section-cell
        title="附件列表">
        <m-attachment :data="data.attachment_list || []" />
      </m-section-cell>
    </m-section-row>
  </m-section>
</template>

<script>
  export default {
    name: 'PunchCardCompaintForm',

    props: {
      data: {
        type: Object,
        default: () => ({}),
      },
    },

    computed: {
      beginTime() {
        return `${this.data.kqwdkss_date} ${this.data.kqwdkss_date_time_name}`
      },
    },
  }
</script>
