<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="page page--approving-material-printing">

    <m-breadcrumb :items="breadcrumb" />
    <userinfo :data="info.applier_user_info" />

    <detail
      from="approving"
      ref="detail"
      :data="detail"
      :is-operate="logs.is_operate"
      @emitForm="emitApprovalMoney" />

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

        <m-section-row>
          <el-form-item
            label="附件上传">
            <m-upload
              ref="upload"
              :accept="upload.accept"
              :file-list="lastFiles"
              :before-remove="beforeRemove"
              :action="upload.action" />
          </el-form-item>
        </m-section-row>

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
  import Detail from '../common/MaterialPrintingForm'
  import Userinfo from '../common/Userinfo'

  export default {
    name: 'ApprovingMaterialPrinting',
    components: { Detail, ApprovalSteps, Userinfo },
    mixins: [mixin.approving, mixin.flow, mixin.router],

    data() {
      return {
        rules: {
          approval_subject: [
            { required: true, message: '请填写审批意见', trigger: 'blur' },
          ],
        },

        breadcrumb: this.$breadcrumb([
          { name: '待我审批', to: '/approving/index' },
          { name: '宣传品印刷制作' },
        ]),
      }
    },

    computed: {
      lastFiles() {
        const lastForm = this.logs.last_approval_form_data
        return (lastForm && lastForm.attachment_list) || []
      },
    },

    methods: {
      paramsHandler({ step }) {
        const { id, result, logs } = this
        const { approval_aids } = logs.last_approval_form_data
        const {
          approval_money,
          approval_subject,
        } = result

        let money = ''
        let aids = ''

        // 如果上次审批结果已有核价结果，则无需处理
        if (logs.last_approval_form_data &&
          logs.last_approval_form_data.approval_money) {
            money = approval_money
        } else if (approval_money) {
          money = approval_money * 100
        }

        // upload files handler
        if (this.$refs.upload.uploadFiles.length) {
          aids = this.$refs.upload.getFiles()
            .filter(file => !(approval_aids && approval_aids.includes(file.id)))

          aids = aids.map(file => file.id).join(',')
        }

        return {
          id,
          step,
          approval_form_data: JSON.stringify({
            approval_subject,
            approval_money: money,
            approval_aids: aids,
          }),
        }
      },

      validator(success) {
        const $approvalMoney = this.$refs.detail.$refs.form

        if ($approvalMoney && this.logs.is_operate === '1') {
          $approvalMoney
            .validate()
            .then(() => {
              this.$refs.approvalForm
                .validate()
                .then(success)
                .catch(() => {})
            })
            .catch(() => {
              window.scrollTo(0, $approvalMoney.$el.offsetTop)
            })
        } else {
          this.$refs.approvalForm
            .validate()
            .then(success)
            .catch(() => {})
        }
      },

      beforeRemove(file) {
        let flag = true

        this.upload.files.some((item) => {
          if (item.id === file.id) {
            flag = false
            return true
          }
          return false
        })

        return flag
      },

      emitApprovalMoney(val) {
        this.result.approval_money = val
      },
    },
  }
</script>
