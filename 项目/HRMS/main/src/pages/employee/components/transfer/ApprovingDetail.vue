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

        <!-- 调入部总、运营经理 -->
        <el-form-item
          prop="approval_move_date"
          label="调动日期确认"
          v-if="formType === '200016004' || formType === '200016005'"
          :rules="rules.approval_move_date">
          <el-date-picker
            autotest="approval_move_date"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            v-model="approvalResult.approval_move_date"
            :picker-options="datepickerOptions" />
        </el-form-item>

        <!-- 人事岗 财务属性、客户划转判断 -->
        <el-form-item
          prop="approval_is_need_move_customers"
          label="是否需要划转客户"
          v-if="formType === '200016010'"
          :rules="rules.approval_is_need_move_customers">
          <el-select
            autotest="approval_is_need_move_customers"
            placeholder="请选择"
            v-model="approvalResult.approval_is_need_move_customers">
            <el-option
              value="1"
              label="是" />
            <el-option
              value="2"
              label="否" />
          </el-select>
        </el-form-item>

        <!-- 业务管理岗 -->
        <el-form-item
          prop="approval_is_move_customers"
          label="客户是否完成划转"
          v-if="formType === '200016011'"
          :rules="rules.approval_is_move_customers">
          <el-select
            autotest="approval_is_move_customers"
            placeholder="请选择"
            v-model="approvalResult.approval_is_move_customers">
            <el-option
              value="1"
              label="是" />
            <el-option
              value="0"
              label="否" />
          </el-select>
        </el-form-item>

        <!-- 调出运营经理 清点会费 -->
        <m-section-row
          v-if="formType === '200016012'">
          <m-section-cell
            content="请及时清点工会费用，并将结果列示在审批意见中，以便财务部划转。"
            title="流程说明" />
        </m-section-row>

        <!-- 财务岗 -->
        <el-form-item
          prop="approval_is_move_fee"
          label="费用是否清算划转"
          v-if="formType === '200016013'"
          :rules="rules.approval_is_move_fee">
          <el-select
            autotest="approval_is_move_fee"
            placeholder="请选择"
            v-model="approvalResult.approval_is_move_fee">
            <el-option
              value="1"
              label="是" />
            <el-option
              value="0"
              label="否" />
          </el-select>
        </el-form-item>

        <!-- 行政主管 -->
        <el-form-item
          prop="approval_is_move_fee_recheck"
          label="资产是否完成复核"
          v-if="formType === '200016014'"
          :rules="rules.approval_is_move_fee_recheck">
          <el-select
            autotest="approval_is_move_fee_recheck"
            placeholder="请选择"
            v-model="approvalResult.approval_is_move_fee_recheck">
            <el-option
              value="1"
              label="是" />
            <el-option
              value="0"
              label="否" />
          </el-select>
        </el-form-item>

        <!-- 绩效岗 -->
        <el-form-item
          prop="approval_is_confirm_salary_level"
          label="是否完成定薪定级"
          v-if="formType === '200016015'"
          :rules="rules.approval_is_confirm_salary_level">
          <el-select
            autotest="approval_is_confirm_salary_level"
            placeholder="请选择"
            v-model="approvalResult.approval_is_confirm_salary_level">
            <el-option
              value="1"
              label="是" />
            <el-option
              value="0"
              label="否" />
          </el-select>
        </el-form-item>

        <!-- 人事岗 最终确认 -->
        <el-form-item
          prop="approval_move_status"
          label="调动状态确认"
          v-if="formType === '200016016'"
          :rules="rules.approval_move_status">
          <el-select
            autotest="approval_move_status"
            placeholder="请选择"
            v-model="approvalResult.approval_move_status">
            <el-option
              value="1"
              label="放弃调动" />
            <el-option
              value="2"
              label="已调动" />
          </el-select>
        </el-form-item>

        <el-form-item
          prop="approval_subject"
          label="审批意见">
          <el-input
            autotest="approval_subject"
            style="width: 100%;"
            v-model="approvalResult.approval_subject" />
        </el-form-item>

        <!-- 同部门、跨部门：调入部门运营经理 -->
        <m-section-row
          v-if="formType === '200016004'">
          <el-form-item
            required
            label="面试评估表上传"
            :error="rules.upload">
            <m-upload
              class="autotest-upload"
              ref="upload"
              :on-remove="uploadEvent"
              :on-change="uploadEvent"
              :accept="upload.accept"
              :file-list="upload.files"
              :action="upload.action" />
          </el-form-item>
        </m-section-row>

        <el-form-item
          label-width="0px"
          v-if="formType === '200016016'">
          <check-list
            ref="checkList"
            :list="config[formType]" />
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
  import CheckList from '../common/ApprovalCheckList'
  import LogNodes from './common/LogNodes'
  import StaticForm from './common/Form'

  export default {
    name: 'EmployeeTransferApprovingDetail',
    components: { User, ApprovalSteps, CheckList, LogNodes, StaticForm },
    mixins: [mixins.flow, mixins.approving],

    data() {
      return {
        breadcrumb: [
          { name: '员工管理' },
          { name: '调动管理', to: '/transfer/approving' },
          { name: '待我审批', to: '/transfer/approving' },
        ],

        approvalResult: {
          approval_subject: '',
          approval_aids: '',
          approval_move_date: '',
          approval_is_need_move_customers: '',
          approval_is_move_customers: '',
          approval_is_move_fee: '',
          approval_is_move_fee_recheck: '',
          approval_is_confirm_salary_level: '',
          approval_move_status: '',
          approval_hr_json: '',
        },

        rules: {
          approval_subject: [
            { required: true, trigger: 'blur', message: '请填写审批意见' },
          ],
          approval_move_date: [
            { required: true, trigger: 'blur', message: '请选择调动日期' },
          ],
          approval_is_need_move_customers: [
            { required: true, trigger: ['blur', 'change'], message: '请选择是否需要划转客户' },
          ],
          approval_is_move_customers: [
            { required: true, trigger: ['blur', 'change'], message: '请选择客户是否完成划转' },
            { type: 'enum', enum: ['1'], message: '客户未完成划转不能继续下一步流程' },
          ],
          approval_is_move_fee: [
            { required: true, trigger: ['blur', 'change'], message: '请选择费用是否清算划转' },
            { type: 'enum', enum: ['1'], message: '费用未完成清算划拨不能继续下一步流程' },
          ],
          approval_is_move_fee_recheck: [
            { required: true, trigger: ['blur', 'change'], message: '请选择资产是否完成复核' },
            { type: 'enum', enum: ['1'], message: '资产未完成复核不能继续下一步流程' },
          ],
          approval_is_confirm_salary_level: [
            { required: true, trigger: ['blur', 'change'], message: '请选择是否完成定薪定级' },
            { type: 'enum', enum: ['1'], message: '定薪定级未完成不能继续下一步流程' },
          ],
          approval_move_status: [
            { required: true, trigger: ['blur', 'change'], message: '请选择调动状态' },
          ],
          upload: '',
        },

        datepickerOptions: {
          disabledDate(time) {
            return time.getTime() < (Date.now() - 8.64e7)
          },
        },

        config: {
          200016016: [
            { name: '调整组织架构', status: 0, remark: '' },
            { name: '系统设置（含运筹/用友/企微/短信/彩铃）', status: 0, remark: '' },
            { name: '调动打卡地点', status: 0, remark: '' },
            { name: '换签劳动合同', status: 0, remark: '' },
            { name: '更改财务属性归属地', status: 0, remark: '' },
            { name: '更改社保公积金缴纳信息', status: 0, remark: '' },
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
      fetch() {
        this
          .getInfo()
          .then(() => {
            this.getLogs().then(({ data }) => {
              const formType = data.approval_form_type
              const lastForm = data.last_approval_form_data
              const { info } = this

              this.approvalResult.approval_move_date =
                lastForm.approval_move_date || info.flow_form_data.rsddgl_date || ''
              this.approvalResult.approval_is_need_move_customers =
                lastForm.approval_is_need_move_customers || info.approval_is_need_move_customers || ''

              if (formType === '200016004' || formType === '200016005') {
                this.setValidDate({
                  uid: info.applier_user_info.id,
                  org_id: info.flow_form_data.rsddgl_org,
                })
              }
            })
          })
      },

      /**
       * formType 为 200016004 || 200016005 时，设置“调动日期确认”选择范围
       */
      setValidDate(params) {
        this.$axios
          .get(this.$api.employee.transfer.validDate, { params })
          .then(({ data }) => {
            const { org_valid_date, user_job_valid_date } = data.info
            this.datepickerOptions.disabledDate = (time) => {
              const org = new Date(org_valid_date).getTime()
              const user = new Date(user_job_valid_date).getTime()
              const current = time.getTime()

              if (user >= org) return current < user
              return current < (org - 8.64e7)
            }
          })
      },

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

      uploadEvent(file, fileList) {
        if (!fileList.length) this.rules.upload = '请上传面试评估表'
        else this.rules.upload = ''
      },

      validator(success, { step }) {
        const { formType } = this

        if (step === '4') {
          this.$refs.form
            .validateField('approval_subject', (error) => {
              if (!error) success()
            })

          return false
        }

        return this.$refs.form.validate((valid) => {
          let flag = true

          if (this.formType === '200016004') {
            flag = !!this.$refs.upload.uploadFiles.length
            if (flag) {
              this.rules.upload = ''
            } else {
              this.rules.upload = '请上传面试评估表'
            }
          }

          if (formType === '200016016') {
            const $checkList = this.$refs.checkList
            flag = $checkList.validate()
          }

          if (valid && flag) success()
        })
      },

      paramsHandler({ step }) {
        const { approvalResult, id, formType } = this
        const $upload = this.$refs.upload
        let approval_aids = ''
        let approval_hr_json = ''

        if ($upload && $upload.uploadFiles.length) {
          approval_aids = $upload.getFiles()
          approval_aids = approval_aids.map(file => file.id).join(',')
        }

        if (formType === '200016016') {
          approval_hr_json = JSON.stringify(this.config[200016016])
        }

        return {
          id,
          step,
          approval_form_data: JSON.stringify(Object.assign(approvalResult, {
            approval_form_type: formType,
            approval_aids,
            approval_hr_json,
          })),
        }
      },
    },
  }
</script>
