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
        title="入职状态确认"
        prop="approval_rz_status_name" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="入职部门"
        prop="approval_org_name" />

      <m-section-cell
        title="任职职位"
        prop="approval_job_name" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="入职日期"
        prop="approval_rz_date" />
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
