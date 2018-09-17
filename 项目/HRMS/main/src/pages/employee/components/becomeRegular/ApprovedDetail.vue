<template>
  <div class="page">

    <m-breadcrumb :items="breadcrumb" />
    <user :data="info.applier_user_info" />
    <static-form :data="detail" />

    <m-section
      title="审批表单"
      :data="result">

      <m-section-row>
        <m-section-cell
          prop="approval_time"
          title="审批日期"
          :span="12" />

        <m-section-cell
          prop="approval_achievement_data"
          title="业绩数据填报"
          v-if="formType === '200017001'"
          :span="12" />

        <m-section-cell
          prop="approval_is_end_zz_name"
          title="是否终止转正"
          v-if="formType === '200017002'"
          :span="12" />

      </m-section-row>

      <m-section-row>
        <m-section-cell
          prop="approval_subject"
          :title="result.approval_form_type === '200017003' ? '转正申请' : '审批意见'" />
      </m-section-row>
    </m-section>

  </div>
</template>

<script>
  import mixins from '~employee/mixins'
  import User from '../common/User'
  import StaticForm from './common/Form'

  export default {
    name: 'EmployeeBecomeRegularApprovedDetail',
    components: { User, StaticForm },
    mixins: [mixins.flow, mixins.approved, mixins.breadcrumb],

    data() {
      return {
        breadcrumb: [
          { name: '员工管理' },
          { name: '转正管理', to: '/become-regular/approved' },
          { name: '我已审批', to: '/become-regular/approved' },
        ],
        approvalLogNodes: null,
      }
    },

    computed: {
      formType() {
        return (this.result && this.result.approval_form_type)
      },
    },
  }
</script>
