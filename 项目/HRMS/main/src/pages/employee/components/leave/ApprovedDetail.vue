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
          prop="approval_quit_status_name"
          title="离职状态确认"
          v-if="formType === '200015018'"
          :span="12" />
      </m-section-row>

      <template v-if="formType === '200015001'">
        <m-section-row>
          <m-section-cell
            prop="approval_is_all_transfer_name"
            title="交接事项是否完整" />

          <m-section-cell
            prop="approval_last_date"
            title="确认最后工作日期" />
        </m-section-row>

        <m-section-row>
          <m-section-cell
            title="离职面谈"
            prop="approval_chat_log" />
        </m-section-row>
      </template>

      <template v-if="formType === '200015002'">
        <m-section-row>
          <m-section-cell title="流程说明">
            1. 请核查员工工作交接情况，并为员工提起《客户关系划拨申请》；<br>
            2. 确认待离职员工名下客户调佣申请已办结，如未办结，务必添加并列明在下表中；<br>
            3. 督促员工退出相关工作微信群。
          </m-section-cell>
        </m-section-row>

        <m-section-row>
          <m-section-cell>
            <el-table
              border
              :data="JSON.parse(result.approval_transfer_json)">
              <el-table-column
                width="80"
                type="index"
                align="center"
                label="序号" />
              <el-table-column
                prop="transfer_user_name"
                align="center"
                width="140"
                label="拟离职交接人" />
              <el-table-column
                prop="transfer_matters"
                label="拟交接工作事项" />

              <el-table-column
                prop="status"
                align="center"
                width="160"
                label="是否已完成工作交接">
                <template slot-scope="scope">
                  <el-checkbox
                    disabled
                    v-model="scope.row.status" />
                </template>
              </el-table-column>
            </el-table>
          </m-section-cell>
        </m-section-row>
      </template>

      <m-section-row
        v-if="result[`approval_${jsonMap[formType]}_json`] && formType !== '200015002'">
        <m-section-cell>
          <check-list
            ref="checkList"
            :checkable="false"
            :list="result[`approval_${jsonMap[formType]}_json`]" />
        </m-section-cell>
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="审批意见"
          prop="approval_subject" />
      </m-section-row>
    </m-section>

  </div>
</template>

<script>
  import mixins from '~employee/mixins'
  import User from '../common/User'
  import StaticForm from './common/Form'
  import CheckList from '../common/ApprovalCheckList'
  import jsondata from './json'

  export default {
    name: 'EmployeeLeaveApprovedDetail',
    components: { User, StaticForm, CheckList },
    mixins: [mixins.flow, mixins.approved, mixins.breadcrumb],

    data() {
      return {
        breadcrumb: [
          { name: '员工管理' },
          { name: '离职管理', to: '/leave/approved' },
          { name: '我已审批', to: '/leave/approved' },
        ],
        approvalLogNodes: null,
        json: jsondata.data,
        jsonMap: jsondata.map,
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
