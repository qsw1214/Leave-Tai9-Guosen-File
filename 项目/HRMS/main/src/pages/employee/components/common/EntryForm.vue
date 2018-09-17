<template>
  <section class="to-entry--form">
    <entry-flow-info
      :data="data" />

    <m-section
      :title="title"
      :data="data">

      <m-section-row>
        <m-section-cell
          title="系统编码"
          prop="rsrzgl_code" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="姓名"
          prop="rsrzgl_name" />

        <m-section-cell
          title="入职部门"
          prop="rsrzgl_org_name" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="任职职位"
          prop="rsrzgl_job_name" />

        <m-section-cell
          title="入职日期"
          prop="rsrzgl_rz_date" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="是否通过从业考试"
          prop="rsrzgl_is_pass_exam_name" />

        <m-section-cell
          title="证件类型"
          prop="rsrzgl_credential_type_name" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="证件号码"
          prop="rsrzgl_credential_num" />

        <m-section-cell
          title="操作类型"
          content="入职" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="操作原因"
          prop="rsrzgl_reason_name" />

        <m-section-cell
          title="员工状态"
          prop="rsrzgl_user_status_name" />
      </m-section-row>
    </m-section>
  </section>
</template>

<script>
  import EntryFlowInfo from './EntryFlowInfo'

  export default {
    name: 'ToEntryForm',

    components: {
      EntryFlowInfo,
    },

    props: {
      data: {
        type: Object,
        required: true,
      },
      title: {
        type: String,
        default: '申请表单',
      },
    },

    data() {
      return {
        test: 'test',
      }
    },
  }
</script>
