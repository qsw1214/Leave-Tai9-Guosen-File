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
        content="异动"
        title="操作类型" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        prop="rsddgl_job_reason_name"
        title="异动类型" />
      <m-section-cell
        prop="rsddgl_date"
        title="计划调动日期" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        prop="rsddgl_org_name"
        title="拟调入部门" />
      <m-section-cell
        prop="rsddgl_line_name"
        title="调入部门所属条线" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        prop="rsddgl_job_name"
        title="拟任职职位" />
      <m-section-cell
        prop="rsddgl_is_cross_service_name"
        title="是否跨业务线" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        prop="rsddgl_reason"
        title="申请原因" />
    </m-section-row>
  </m-section>
</template>

<script>
  export default {
    name: 'StaticForm',
    props: {
      data: {
        type: Object,
        required: true,
      },
    },
  }
</script>
