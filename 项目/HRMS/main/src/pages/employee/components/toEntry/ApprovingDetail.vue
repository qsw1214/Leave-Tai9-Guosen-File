<template>
  <section
    v-loading.fullscreen.lock="loading"
    class="page page--approving-fixed__assets">

    <m-breadcrumb :items="breadcrumb" />

    <to-entry-form :data="detail" />

    <m-section
      title="审批记录">
      <ApprovalSteps
        :data="logs.approval_list" />

      <p
        style="margin: 0 20px 10px;"
        v-if="logs.approval_list.length > 1">
        说明：点击
        <el-button
          type="text"
          style="font-size: 14px;"
          @click="viewApprovalLogs">这里</el-button>
        查看前面所有节点审批记录详情。
      </p>
    </m-section>

    <m-section
      title="审批表单"
      is-form>

      <component
        ref="view"
        :result="form"
        :is="currentView" />
    </m-section>

    <ApprovalButton />

    <ToEntryApprovedDialog
      ref="dialog"
      :data="detail" />
  </section>
</template>

<script>
  import mixins from '~employee/mixins'
  import ApprovalSteps from '@/components/ApprovalSteps'
  import ToEntryForm from '../common/ToEntryForm'
  import ApprovalButton from '../common/ApprovalButton'
  import GTApprovingForm from './approving/GTApprovingForm'
  import RSApprovingForm from './approving/RSApprovingForm'
  import YYApprovingForm from './approving/YYApprovingForm'
  import ZPApprovingForm from './approving/ZPApprovingForm'
  import ToEntryApprovedDialog from '../common/ToEntryApprovedDialog'

  export default {
    name: 'ToEntryApprovingDetail',

    components: {
      ToEntryForm,
      ApprovalSteps,
      ApprovalButton,
      GTApprovingForm,
      RSApprovingForm,
      YYApprovingForm,
      ZPApprovingForm,
      ToEntryApprovedDialog,
    },

    mixins: [
      mixins.approving,
      mixins.flow,
      mixins.routerHook,
      mixins.formType.toEntryApproving,
    ],

    data() {
      return {
        form: {
          approval_org: '', // 入职部门
          approval_job: '', // 入职职位
          approval_subject: '', // 审批意见
          approval_is_seat: '', // 是否已安排座位，1-是、0-否
          approval_rz_date: '', // 入职日期
          approval_form_type: '', // 审批表单类型
          approval_rz_status: '', // 入职状态确认，1-放弃入职、2-已入职
          approval_is_data_pass: '', // 材料审核是否通过，1-是、0-否
          approval_is_cancel_a_stock: '', // A股是否完成销户，1-是、0-否
        },
        rules: {
          approval_org: [
            { required: true, message: '请选择入职部门', trigger: 'blur' },
          ],
          approval_job: [
            { required: true, message: '请选择入职职位', trigger: 'blur' },
          ],
          approval_subject: [
            { required: true, message: '请填写审批意见', trigger: 'blur' },
          ],
          approval_is_seat: [
            { required: true, message: '请选择是否安排座位', trigger: 'blur' },
          ],
          approval_rz_date: [
            { required: true, message: '请填写入职日期', trigger: 'blur' },
          ],
          approval_rz_status: [
            { required: true, message: '请选择入职状态', trigger: 'blur' },
          ],
          approval_is_data_pass: [
            { required: true, message: '请选择材料审核是否通过', trigger: 'blur' },
            { type: 'enum', enum: ['1'], message: '材料审核未通过不能继续下一步流程' },
          ],
          approval_is_cancel_a_stock: [
            { required: true, message: '请选择A股是否完成销户', trigger: 'blur' },
            { type: 'enum', enum: ['1'], message: '未完成销户不能继续下一步流程' },
          ],
        },
        showDialog: false,
      }
    },

    computed: {
      currentView() {
        const type = this.logs.approval_form_type
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.form.approval_form_type = type

        return this.formType[type]
      },

      breadcrumb() {
        let applierName = ''
        if (this.info.applier_user_info) {
          applierName = this.info.applier_user_info.name
        }

        return [
          { name: '员工服务' },
          { name: '待入职管理', to: '/to-entry/application' },
          { name: '待我审批', to: '/to-entry/approving' },
          { name: applierName },
        ]
      },
    },

    watch: {
      /* eslint func-names:0 */
      'form.approval_form_type': function (val) {
        if (val === '200013004') {
          const {
            rsdrzgl_org,
            rsdrzgl_job,
            rsdrzgl_nrz_date,
          } = this.info.flow_form_data

          this.form.approval_org = rsdrzgl_org
          this.form.approval_job = rsdrzgl_job
          this.form.approval_rz_date = rsdrzgl_nrz_date
        }
      },
    },

    methods: {
      viewApprovalLogs() {
        this.$refs.dialog.show = true
      },

      validator(success, { step }) {
        const $form = this.$refs.view.$refs.approvalForm

        if (step === '4') {
          $form
            .validateField('approval_subject', (error) => {
              if (!error) success()
            })
        } else {
          $form
            .validate()
            .then(success)
            .catch(() => {})
        }
      },

      paramsHandler({ step }) {
        const { id, form } = this

        return {
          id,
          step,
          approval_form_data: JSON.stringify(form),
        }
      },
    },
  }
</script>
