<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="page">

    <m-breadcrumb :items="breadcrumb" />
    <user :data="info.applier_user_info" />
    <static-form :data="detail" />

    <m-section title="审批记录">
      <approval-steps :data="logs.approval_list" />
      <p
        style="margin: 0 20px 10px;"
        v-if="logs.approval_list.length > 1">
        说明：点击
        <el-button
          type="text"
          style="font-size: 14px;"
          @click="viewApprovalLogNodes">这里</el-button>
        查看前面所有节点审批记录详情。
      </p>
    </m-section>

    <m-section
      title="审批表单"
      is-form>

      <el-form
        class="m-section--form"
        label-width="140px"
        ref="form"
        :model="approvalResult"
        :rules="rules">

        <m-section-row>
          <m-section-cell
            title="审批日期"
            content="由系统自动生成" />
        </m-section-row>

        <el-form-item
          prop="approval_achievement_data"
          label="业绩数据填报"
          v-if="formType === '200017001'">
          <el-input
            autotest="approval_achievement_data"
            v-model="approvalResult.approval_achievement_data" />
        </el-form-item>

        <m-section-row
          v-if="formType === '200017002'">
          <m-section-cell
            title="流程说明"
            content="请审核员工业绩和基金资格是否符合转正要求，若不符合则“是否终止转正”选择“是”，并点击同意按钮终止流程，否则选择“否”，点击同意按钮继续下一步。" />
        </m-section-row>

        <!-- 运营经理岗 是否终止转正 -->
        <el-form-item
          prop="approval_is_end_zz"
          label="是否终止转正"
          v-if="formType === '200017002'">
          <el-select
            autotest="approval_is_end_zz"
            placeholder="请选择"
            v-model="approvalResult.approval_is_end_zz">
            <el-option
              value="1"
              label="是" />
            <el-option
              value="2"
              label="否" />
          </el-select>
        </el-form-item>

        <el-form-item
          prop="approval_subject"
          :label="formType === '200017003' ? '转正申请' : '审批意见'">
          <el-input
            autotest="approval_subject"
            style="width: 100%;"
            :rows="formType === '200017003' ? 3 : null"
            :maxlength="formType === '200017003' ? 300 : null"
            :type="formType === '200017003' ? 'textarea' : ''"
            v-model="approvalResult.approval_subject" />
        </el-form-item>
      </el-form>
    </m-section>

    <div class="page--approving-actions">
      <el-button
        type="primary"
        :loading="button.agree"
        @click="approval({ step: '2' })">{{ formType === '200017003' ? '提交' : '同意' }}</el-button>

      <el-button
        type="info"
        :loading="button.reject"
        @click="approval({ step: '4' })">退回</el-button>

      <el-button
        type="info"
        @click="cancel">取消</el-button>
    </div>

    <el-dialog
      title="审批记录详情"
      top="5vh"
      :visible.sync="showApprovalLogNodes">
      <log-nodes :nodes="approvalLogNodes" />
    </el-dialog>

  </div>
</template>

<script>
  import ApprovalSteps from '@/components/ApprovalSteps'
  import mixins from '~employee/mixins'
  import User from '../common/User'
  import LogNodes from './common/LogNodes'
  import StaticForm from './common/Form'

  export default {
    name: 'EmployeeBecomeRegularDetail',
    components: { User, ApprovalSteps, LogNodes, StaticForm },
    mixins: [mixins.flow, mixins.approving],

    data() {
      return {
        breadcrumb: [
          { name: '员工管理' },
          { name: '转正管理', to: '/become-regular/approving' },
          { name: '待我审批', to: '/become-regular/approving' },
        ],

        approvalResult: {
          approval_subject: '',
          approval_aids: '',
          approval_achievement_data: '',
          approval_is_end_zz: '',
        },

        rules: {
          approval_subject: [
            { required: true, trigger: 'blur', message: '请填写审批意见' },
          ],
          approval_achievement_data: [
            { required: true, trigger: 'blur', message: '请填写业绩数据填报' },
          ],
          approval_is_end_zz: [
            { required: true, trigger: 'blur', message: '请选择是否终止转正' },
          ],
        },

        // 是否打开审批记录详情 dialog
        showApprovalLogNodes: false,
        approvalLogNodes: [],
      }
    },

    computed: {
      formType() {
        return this.logs.approval_form_type
      },
    },

    methods: {
      viewApprovalLogNodes() {
        if (this.loading) return false

        this.loading = true
        return this.$axios
          .get(this.$api.employee.flow.approvalLogNodes, {
            params: { id: this.id },
          })
          .then(({ data }) => {
            this.approvalLogNodes = data.list
            this.showApprovalLogNodes = true
          })
          .catch(() => {})
          .then(() => {
            this.loading = false
          })
      },

      validator(success) {
        this.$refs.form.validate((valid) => {
          if (valid) success()
        })
      },

      paramsHandler({ step }) {
        const { approvalResult, id, formType } = this

        return {
          id,
          step,
          approval_form_data: JSON.stringify(Object.assign(approvalResult, {
            approval_form_type: formType,
          })),
        }
      },
    },
  }
</script>
