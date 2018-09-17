<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="page page--approving-high-speed-market">

    <m-breadcrumb :items="breadcrumb" />
    <userinfo :data="info.applier_user_info" />
    <detail
      from="approving"
      ref="detail"
      :data="detail"
      :is-operate="logs.is_operate"
      @emitForm="emitApprovalOrderNum" />

    <m-section title="审批记录">
      <approval-steps :data="logs.approval_list" />
    </m-section>

    <m-section
      title="审批表单"
      is-form>

      <m-section-row>
        <m-section-cell
          title="审批日期"
          content="由系统自动生成" />
      </m-section-row>

      <el-form
        class="m-section--form"
        label-width="140px"
        ref="approvalForm"
        :model="result"
        :rules="rules">

        <el-form-item
          label="审批意见"
          prop="approval_subject">
          <el-input
            style="width: 100%;"
            v-model="result.approval_subject" />
        </el-form-item>
      </el-form>
    </m-section>

    <div class="page--approving-actions">
      <el-button
        type="primary"
        :loading="button.agree"
        @click="approval({ step: '2' })">同意</el-button>

      <el-button
        type="info"
        :loading="button.reject"
        @click="approval({ step: '4' })">退回</el-button>

      <el-button
        type="info"
        @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
  import mixin from '~services/mixin'
  import ApprovalSteps from '@/components/ApprovalSteps'
  import Detail from '../common/HighSpeedMarketForm'
  import Userinfo from '../common/Userinfo'

  export default {
    name: 'ApprovingHighSpeedMarket',
    components: { Detail, ApprovalSteps, Userinfo },
    mixins: [mixin.flow, mixin.approving, mixin.router],

    data() {
      return {
        rules: {
          approval_subject: [
            { required: true, message: '请填写审批意见', trigger: 'blur' },
          ],
        },

        breadcrumb: this.$breadcrumb([
          { name: '待我审批', to: '/approving/index' },
          { name: '高速行情采购' },
        ]),
      }
    },

    methods: {
      paramsHandler({ step }) {
        const { id, result } = this
        const {
          approval_order_num,
          approval_subject,
        } = result

        return {
          id,
          step,
          approval_form_data: JSON.stringify({
            approval_subject,
            approval_order_num: approval_order_num || '',
          }),
        }
      },

      validator(success) {
        const $orderNum = this.$refs.detail.$refs.form

        if ($orderNum) {
          $orderNum
            .validate()
            .then(() => {
              this.$refs.approvalForm
                .validate()
                .then(success)
                .catch(() => {})
            })
            .catch(() => {
              window.scrollTo(0, $orderNum.$el.offsetTop)
            })
        } else {
          this.$refs.approvalForm
            .validate()
            .then(success)
            .catch(() => {})
        }
      },

      emitApprovalOrderNum(val) {
        this.result.approval_order_num = val
      },
    },
  }
</script>
