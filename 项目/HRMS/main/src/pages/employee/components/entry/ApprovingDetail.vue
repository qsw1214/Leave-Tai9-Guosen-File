<template>
  <section
    v-loading.fullscreen.lock="loading"
    class="page page--approving-fixed__assets">

    <m-breadcrumb :items="breadcrumb" />

    <entry-form :data="detail" />

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

    <EntryApprovedDialog
      ref="dialog"
      :data="detail" />
  </section>
</template>

<script>
  import mixins from '~employee/mixins'
  import ApprovalSteps from '@/components/ApprovalSteps'
  import EntryForm from '../common/EntryForm'
  import ApprovalButton from '../common/ApprovalButton'
  import EntryApprovedDialog from '../common/EntryApprovedDialog'
  import RSApprovingForm from './approving/RSApprovingForm'
  import HGApprovingForm from './approving/HGApprovingForm'
  import ITApprovingForm from './approving/ITApprovingForm'
  import XZApprovingForm from './approving/XZApprovingForm'
  import RS2ApprovingForm from './approving/RS2ApprovingForm'
  import RS3ApprovingForm from './approving/RS3ApprovingForm'
  import PXApprovingForm from './approving/PXApprovingForm'

  export default {
    name: 'ToEntryApprovingDetail',

    components: {
      ApprovalSteps,
      ApprovalButton,
      EntryForm,
      EntryApprovedDialog,
      RSApprovingForm,
      HGApprovingForm,
      ITApprovingForm,
      XZApprovingForm,
      RS2ApprovingForm,
      RS3ApprovingForm,
      PXApprovingForm,
    },

    mixins: [
      mixins.approving,
      mixins.flow,
      mixins.routerHook,
      mixins.formType.entryApproving,
    ],

    data() {
      const endContractsDate = (rule, value, callback) => {
        const startDate = this.form.approval_user_contracts_begin_date
        if (startDate && value) {
          const end = new Date(value).getTime()
          const start = new Date(startDate).getTime()

          if (end <= start) {
            callback(new Error('合同终止日期不能早于起始日期'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }

      const regularDate = (rule, value, callback) => {
        const startDate = this.form.approval_user_contracts_probation_begin_date
        if (startDate && value) {
          const end = new Date(value).getTime()
          const start = new Date(startDate).getTime()

          if (end <= start) {
            callback(new Error('拟转正日期不能早于试用开始日期'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }

      const regularDate2 = (rule, value, callback) => {
        const startDate = this.form.approval_user_contracts_probation_end_date
        if (startDate && value) {
          const end = new Date(value).getTime()
          const start = new Date(startDate).getTime()

          if (end <= start) {
            callback(new Error('拟转正日期不能早于试用期结束日期'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }


      const probationEndDate = (rule, value, callback) => {
        const startDate = this.form.approval_user_contracts_probation_begin_date
        if (startDate && value) {
          const end = new Date(value).getTime()
          const start = new Date(startDate).getTime()

          if (end <= start) {
            callback(new Error('试用结束日期不能早于试用开始日期'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }

      const probationEndDate2 = (rule, value, callback) => {
        const endDate = this.form.approval_user_contracts_plan_regular_date
        if (endDate && value) {
          const start = new Date(value).getTime()
          const end = new Date(endDate).getTime()

          if (end <= start) {
            callback(new Error('试用结束日期不能晚于拟转正日期'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }

      return {
        rules: {
          approval_aids: [
            { required: true, message: '请上传附件', trigger: 'blur' },
          ],
          approval_subject: [
            { required: true, message: '请填写审批意见', trigger: 'blur' },
          ],
          approval_emp_code: [
            { required: true, message: '请填写员工ID', trigger: 'blur' },
          ],
          approval_apply_id: [
            { required: true, message: '请填写账号', trigger: 'blur' },
          ],
          approval_apply_url: [
            { required: true, message: '请填写申请链接', trigger: 'blur' },
          ],
          approval_is_send_key: [
            { required: true, message: '请选择是否已经发放密钥', trigger: 'blur' },
          ],
          approval_is_hand_print: [
            { required: true, message: '请选择是否录入指/掌纹', trigger: 'blur' },
          ],
          approval_user_file_code: [
            { required: true, message: '请填写档案编号', trigger: 'blur' },
          ],
          approval_xingzheng_json: [
            { required: true, message: '请填写为新员工准备入职所需材料。', trigger: 'blur' },
          ],
          approval_hegui_chat_log: [
            { required: true, message: '请填写面谈记录', trigger: 'blur' },
          ],
          approval_user_contracts_num: [
            { required: true, message: '请填写合同序号', trigger: 'blur' },
          ],
          approval_user_contracts_end_date: [
            { required: true, message: '请填写合同终止日期', trigger: 'blur' },
            { validator: endContractsDate, trigger: 'blur' },
          ],
          approval_user_contracts_term_type: [
            { required: true, message: '请填写合同期限类型', trigger: 'blur' },
          ],
          approval_user_contracts_sign_date: [
            { required: true, message: '请填写签订日期', trigger: 'blur' },
          ],
          approval_user_contracts_begin_date: [
            { required: true, message: '请填写合同起始日期', trigger: 'blur' },
          ],
          approval_user_contracts_subject_unit: [
            { required: true, message: '请选择合同主体单位', trigger: 'blur' },
          ],
          approval_user_contracts_probation_term: [
            { required: true, message: '请填写试用期限', trigger: 'blur' },
          ],
          approval_user_contracts_employment_form: [
            { required: true, message: '请选择用工形式', trigger: 'blur' },
          ],
          approval_user_contracts_plan_regular_date: [
            { required: true, message: '请选择拟转正日期', trigger: 'blur' },
            { validator: regularDate, trigger: 'blur' },
            { validator: regularDate2, trigger: 'blur' },
          ],
          approval_user_contracts_finance_attribute: [
            { required: true, message: '请选择财务属性', trigger: 'blur' },
          ],
          approval_user_contracts_probation_end_date: [
            { required: true, message: '请填写试用结束日期', trigger: 'blur' },
            { validator: probationEndDate, trigger: 'blur' },
            { validator: probationEndDate2, trigger: 'blur' },
          ],
          approval_user_contracts_probation_begin_date: [
            { required: true, message: '请填写试用开始日期', trigger: 'blur' },
          ],
        },
        form: {
          // 附件id，多个以,隔开
          approval_aids: '',
          // 审批意见
          approval_subject: '',
          // 员工ID
          approval_emp_code: '',
          // 账号
          approval_apply_id: '',
          // 审批表单类型
          approval_form_type: '',
          // 申请链接
          approval_apply_url: '',
          // 是否已发放密钥，1-是、0-否
          approval_is_send_key: '',
          // 是否录入指/掌纹，1-是、0-否
          approval_is_hand_print: '',
          // 档案编号
          approval_user_file_code: '',
          // 行政岗json
          approval_xingzheng_json: '',
          // 面谈详情
          approval_hegui_chat_log: '',
          // 合同序号
          approval_user_contracts_num: '',
          // 合同终止日期
          approval_user_contracts_end_date: '',
          // 合同期限类型
          approval_user_contracts_term_type: '',
          // 签订日期
          approval_user_contracts_sign_date: '',
          // 合同起始日期
          approval_user_contracts_begin_date: '',
          // 合同主体单位
          approval_user_contracts_subject_unit: '',
          // 试用期限
          approval_user_contracts_probation_term: '6个月',
          // 用工形式，1-正式、2-派遣、4-外包、8-返聘
          approval_user_contracts_employment_form: '1',
          // 拟转正日期
          approval_user_contracts_plan_regular_date: '',
          // 财务属性
          approval_user_contracts_finance_attribute: '',
          // 试用结束日期
          approval_user_contracts_probation_end_date: '',
          // 试用开始日期
          approval_user_contracts_probation_begin_date: '',
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
        if (this.detail.rsrzgl_name) {
          applierName = this.detail.rsrzgl_name
        }

        return [
          { name: '员工服务' },
          { name: '入职管理', to: '/entry/application' },
          { name: '待我审批', to: '/entry/approving' },
          { name: applierName },
        ]
      },
    },

    watch: {
      /* eslint func-names:0 */
      'form.approval_user_contracts_probation_begin_date': function (val) {
        const time = this.next6Month(val)
        this.form.approval_user_contracts_plan_regular_date = time.justSixMonth
        this.form.approval_user_contracts_probation_end_date = time.reduceSixMonth
      },

      /* eslint func-names:0 */
      'form.approval_user_contracts_begin_date': function () {
        this.form.approval_user_contracts_end_date = ''
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

      next6Month(dateStr) {
        const date = new Date(dateStr)
        const month = date.getMonth()
        date.setMonth(month + 6)
        const justSixMonth = this.$utils.tools.formatDate(date.getTime())
        date.setDate(date.getDate() - 1)
        const reduceSixMonth = this.$utils.tools.formatDate(date.getTime())

        return {
          justSixMonth,
          reduceSixMonth,
        }
      },
    },
  }
</script>
