
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
        title="请假类型"
        prop="kqqj_type_name" />

      <m-section-cell
        title="已休天数"
        :content="`${data.kqqj_rested_day_num / 2}天`" />
    </m-section-row>

    <m-section-row v-if="data.kqqj_type == '4096'">
      <m-section-cell
        title="上年度剩余天数"
        :content="`${data.kqqj_nj_last_day_num / 2}天`" />

      <m-section-cell
        title="本年度年假天数"
        :content="`${data.kqqj_nj_this_day_num / 2}天`" />
    </m-section-row>

    <m-section-row v-if="data.kqqj_type == '4096'">
      <m-section-cell
        title="年假余额"
        :content="`${data.kqqj_nj_count_day_num / 2}天`" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="开始时间"
        :content="beginTime" />

      <m-section-cell
        title="结束时间"
        :content="endTime" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="请假天数"
        :content="`${data.kqqj_day_num / 2}天`" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="请假原因"
        prop="kqqj_reason" />
    </m-section-row>

    <m-section-row
      v-if="data.kqqj_type != '4096'
        && data.kqqj_type != '2048'
        && data.kqqj_type != '524288'
      && data.kqqj_type != '32768'">
      <m-section-cell
        title="附件列表">
        <m-attachment :data="data.attachment_list" />
      </m-section-cell>
    </m-section-row>
  </m-section>
</template>

<script>
  export default {
    name: 'AskForLeaveForm',

    props: {
      data: {
        type: Object,
        default: () => ({}),
      },
    },

    computed: {
      beginTime() {
        return `${this.data.kqqj_start_date} ${this.data.kqqj_start_date_time_name}`
      },

      endTime() {
        return `${this.data.kqqj_end_date} ${this.data.kqqj_end_date_time_name}`
      },
    },
  }
</script>
