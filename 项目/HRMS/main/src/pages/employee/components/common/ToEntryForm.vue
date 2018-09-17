<template>
  <section class="to-entry--form">
    <flow-form
      :data="data" />

    <m-section
      title="申请表单"
      :data="data">

      <m-section-row>
        <m-section-cell
          title="姓名"
          prop="rsdrzgl_name" />

        <m-section-cell
          title="拟入职部门"
          prop="rsdrzgl_org_name" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="拟任职职位"
          prop="rsdrzgl_job_name" />

        <m-section-cell
          title="拟入职日期"
          prop="rsdrzgl_nrz_date" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="是否通过从业考试"
          prop="rsdrzgl_is_pass_exam_name" />

        <m-section-cell
          title="证件类型"
          prop="rsdrzgl_credential_type_name" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="证件号码"
          prop="rsdrzgl_credential_num" />

        <m-section-cell
          title="操作类型"
          content="入职" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="操作原因"
          prop="rsdrzgl_reason_name" />

        <m-section-cell
          title="员工状态"
          prop="rsdrzgl_user_status_name" />
      </m-section-row>
    </m-section>
  </section>
</template>

<script>
  import FlowForm from './ToEntryFlowForm'

  export default {
    name: 'ToEntryForm',

    components: {
      FlowForm,
    },

    props: {
      data: {
        type: Object,
        required: true,
      },
    },
  }
</script>
