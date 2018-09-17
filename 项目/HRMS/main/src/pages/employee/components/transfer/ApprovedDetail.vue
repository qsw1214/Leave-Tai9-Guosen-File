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
          prop="approval_move_date"
          title="调动日期"
          v-if="formType === '200016004' || formType === '200016005'"
          :span="12" />

        <m-section-cell
          prop="approval_is_need_move_customers_name"
          title="是否需要划转客户"
          v-if="formType === '200016010'"
          :span="12" />

        <m-section-cell
          prop="approval_is_move_customers_name"
          title="客户是否完成划转"
          v-if="formType === '200016011'"
          :span="12" />

        <m-section-cell
          prop="approval_is_move_fee_name"
          title="费用是否清算划转"
          v-if="formType === '200016013'"
          :span="12" />

        <m-section-cell
          prop="approval_is_move_fee_recheck_name"
          title="资产是否完成复核"
          v-if="formType === '200016014'"
          :span="12" />

        <m-section-cell
          prop="approval_is_confirm_salary_level_name"
          title="是否完成定薪定级"
          v-if="formType === '200016015'"
          :span="12" />

        <m-section-cell
          prop="approval_move_status_name"
          title="调动状态"
          v-if="formType === '200016016'"
          :span="12" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          prop="approval_subject"
          title="审批意见" />
      </m-section-row>

      <m-section-row
        v-if="formType === '200016016'">
        <m-section-cell>
          <check-list
            :list="result.approval_hr_json"
            :checkable="false" />
        </m-section-cell>
      </m-section-row>

      <m-section-row v-if="formType === '200016004'">
        <m-section-cell title="附件列表">
          <m-attachment :data="result.attachment_list" />
        </m-section-cell>
      </m-section-row>
    </m-section>

  </div>
</template>

<script>
  import mixins from '~employee/mixins'
  import User from '../common/User'
  import StaticForm from './common/Form'
  import CheckList from '../common/ApprovalCheckList'

  export default {
    name: 'EmployeeTransferApprovedDetail',
    components: { User, StaticForm, CheckList },
    mixins: [mixins.flow, mixins.approved, mixins.breadcrumb],

    data() {
      return {
        breadcrumb: [
          { name: '员工管理' },
          { name: '调动管理', to: '/transfer/approved' },
          { name: '我已审批', to: '/transfer/approved' },
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

<style lang="scss">
  @import '../../assets/scss/tabs-panel.scss';
</style>
