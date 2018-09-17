<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="page">

    <m-breadcrumb :items="breadcrumb" />
    <user :data="info.applier_user_info" />
    <static-form :data="detail" />
    <transferir :data="info.flow_form_data.rslzgl_transfer" />

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

        <!-- 部总审批 -->
        <template v-if="formType === '200015001'">
          <m-section-row>
            <el-form-item
              prop="approval_is_all_transfer"
              label="交接事项是否完整">
              <el-select
                autotest="approval_is_all_transfer"
                placeholder="请选择"
                v-model="approvalResult.approval_is_all_transfer">
                <el-option
                  value="1"
                  label="是" />
                <el-option
                  value="0"
                  label="否" />
              </el-select>
            </el-form-item>

            <el-form-item
              prop="approval_last_date"
              label="确认最后工作日期">
              <el-date-picker
                autotest="approval_last_date"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                v-model="approvalResult.approval_last_date" />
            </el-form-item>
          </m-section-row>

          <el-form-item
            label="离职面谈"
            prop="approval_chat_log">
            <el-input
              autotest="approval_chat_log"
              type="textarea"
              :rows="3"
              v-model="approvalResult.approval_chat_log" />
          </el-form-item>
        </template>
        <!-- 部总审批 end -->

        <!-- 运营经理 -->
        <template v-if="formType === '200015002'">
          <m-section-row>
            <m-section-cell title="流程说明">
              1. 请核查员工工作交接情况，并为员工提起《客户关系划拨申请》；<br>
              2. 确认待离职员工名下客户调佣申请已办结，如未办结，务必添加并列明在下表中；<br>
              3. 督促员工退出相关工作微信群。
            </m-section-cell>
          </m-section-row>

          <m-section-row class="toggle-handover">
            <el-button
              type="text"
              icon="el-icon-plus"
              @click="toggleHandover(false)">添加交接事项</el-button>
          </m-section-row>

          <el-form
            class="m-section--form handover-form"
            label-width="140px"
            v-if="showHandover"
            ref="handover"
            :model="handover"
            :rules="handoverRules">

            <m-section-row>
              <el-form-item
                label="拟离职交接人"
                prop="transfer_user_id">
                <m-employee-select
                  init-change
                  cached
                  :employees.sync="handover.transfer_user_id"
                  :width="260"
                  @change="changeHandover" />
              </el-form-item>

              <el-form-item
                label="拟工作交接事项"
                prop="transfer_matters">
                <el-input
                  v-model="handover.transfer_matters"
                  :maxlength="50" />
              </el-form-item>
            </m-section-row>
            <m-section-row>
              <el-form-item label="">
                <el-button
                  type="primary"
                  @click="addHandover">确定</el-button>
                <el-button
                  type="info"
                  @click="toggleHandover(false)">取消</el-button>
              </el-form-item>
            </m-section-row>
          </el-form>

          <m-section-row
            class="table-200015002"
            v-if="json[200015002]">
            <el-table
              border
              ref="checkList200015002"
              :data="json[200015002]">
              <el-table-column
                width="80"
                type="index"
                align="center"
                label="序号" />
              <el-table-column
                class-name="autotest-transfer_user_name"
                prop="transfer_user_name"
                align="center"
                width="140"
                label="拟离职交接人" />
              <el-table-column
                class-name="autotest-transfer_matters"
                prop="transfer_matters"
                label="拟交接工作事项" />

              <el-table-column
                prop="status"
                class-name="autotest-checkbox"
                align="center"
                width="160"
                label="是否已完成工作交接">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.status" />
                </template>
              </el-table-column>

              <el-table-column
                align="center"
                width="120"
                label="操作">
                <template
                  v-if="scope.row.editable"
                  slot-scope="scope">
                  <el-button
                    type="text"
                    @click="edit200015002(scope.row, scope.$index)">编辑</el-button>
                  <el-button
                    type="text"
                    class="color-error"
                    @click="delete200015002(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <p
              class="el-form-item__error"
              v-show="is200015002Validate">有未完成工作交接，不能继续下一步</p>
          </m-section-row>
        </template>
        <!-- 运营经理 end -->

        <m-section-row v-if="formType === '200015018'">
          <el-form-item
            prop="approval_quit_status"
            label="离职状态确认">
            <el-select
              autotest="approval_quit_status"
              placeholder="请选择"
              v-model="approvalResult.approval_quit_status">
              <el-option
                value="1"
                label="放弃离职" />
              <el-option
                value="2"
                label="已离职" />
            </el-select>
          </el-form-item>
        </m-section-row>

        <el-form-item
          label-width="0px"
          v-if="json[formType] && formType !== '200015002'">
          <check-list
            ref="checkList"
            :list="json[formType]" />
        </el-form-item>

        <el-form-item
          label="审批意见"
          prop="approval_subject">
          <el-input
            autotest="approval_subject"
            style="width: 100%;"
            v-model="approvalResult.approval_subject" />
        </el-form-item>

      </el-form>
    </m-section>

    <div class="page--approving-actions">
      <el-button
        type="primary"
        :loading="button.agree"
        @click="beforeApproval({ step: '2' })">同意</el-button>

      <el-button
        type="info"
        :loading="button.reject"
        @click="beforeApproval({ step: '4' })">退回</el-button>

      <el-button
        type="info"
        @click="cancel">取消</el-button>
    </div>

    <el-dialog
      title="审批记录详情"
      top="5vh"
      :visible.sync="showApprovalLogNodes">
      <log-nodes
        :nodes="approvalLogNodes" />
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
  import Transferir from './common/Transferir'
  import jsondata from './json'

  export default {
    name: 'EmployeeLeaveApprovingDetail',
    components: { User, ApprovalSteps, CheckList, LogNodes, StaticForm, Transferir },
    mixins: [mixins.flow, mixins.approving],

    data() {
      const valid = {}
      valid.approval_is_all_transfer = (rule, value, callback) => {
        if (rule.required && value === '0') return callback(new Error('交接事项不完整不能继续下一项'))
        return callback()
      }

      return {
        breadcrumb: [
          { name: '员工管理' },
          { name: '离职管理', to: '/leave/approving' },
          { name: '待我审批', to: '/leave/approving' },
        ],

        approvalResult: {
          approval_subject: '',
          approval_is_all_transfer: '',
          approval_last_date: '',
          approval_chat_log: '',
          approval_quit_status: '',
          approval_transfer_json: '',
          approval_yunxingfuwubu_json: '',
          approval_xingzhengzhuguan_json: '',
          approval_renshigang_json: '',
          approval_caiwubu_json: '',
          approval_caifuyewuguanlibu_json: '',
          approval_heguijingli_json: '',
          approval_heguifengkongzhuguan_json: '',
          approval_xingzhengzongjian_json: '',
          approval_touziyanjiubu_json: '',
          approval_itjishubu_json: '',
          approval_hesuangang_json: '',
          approval_yunweigang_json: '',
          approval_renshigang_confirm_json: '',
          approval_20430_json: '',
        },

        rules: {
          approval_subject: [
            { required: true, trigger: 'blur', message: '请填写审批意见' },
          ],
          approval_is_all_transfer: [
            { required: true, trigger: 'blur', message: '请选择交接事项是否完整' },
            { validator: valid.approval_is_all_transfer, trigger: ['blur', 'change'], required: false },
          ],
          approval_last_date: [
            { required: true, trigger: 'blur', message: '请确认最后工作日期' },
          ],
          approval_chat_log: [
            { required: false, trigger: 'blur', message: '请填写离职面谈' },
          ],
          approval_quit_status: [
            { required: true, trigger: 'blur', message: '请选择离职状态' },
          ],
        },

        handover: {
          transfer_matters: '',
          transfer_user_id: '',
          transfer_user_name: '',
        },

        handoverRules: {
          transfer_user_id: [
            { required: true, trigger: 'blur', message: '请选择拟离职交接人' },
          ],
          transfer_matters: [
            { required: true, trigger: 'blur', message: '请填写拟工作交接事项' },
          ],
        },

        showHandover: false,

        json: {
          200015002: null,
          ...jsondata.data,
        },
        jsonMap: jsondata.map,

        // 是否打开审批记录详情 dialog
        showApprovalLogNodes: false,
        approvalLogNodes: [],
        is200015002Validate: false,
        step: '',
      }
    },

    computed: {
      formType() {
        return this.logs.approval_form_type
      },

      detail() {
        const {
          apply_date,
          code,
          status_name,
          flow_form_data,
        } = this.info

        return {
          apply_date,
          code,
          status_name,
          ...flow_form_data,
        }
      },
    },

    methods: {
      fetch() {
        this
          .getInfo()
          .then(() => {
            this.getLogs().then(({ data }) => {
              const formdata = this.info.flow_form_data

              // 200015001 节点需要带入“最后工作日”
              if (data.approval_form_type === '200015001') {
                this.approvalResult.approval_last_date = formdata.rslzgl_work_end_date
              }

              const config = formdata.rslzgl_transfer
              config.map((item) => {
                item.status = false
                item.editable = false
                return item
              })
              this.json[200015002] = JSON.parse(JSON.stringify(config))
            })
          })
      },

      beforeApproval({ step }) {
        if (step === '2') {
          this.rules.approval_chat_log[0].required = true
          this.rules.approval_is_all_transfer[1].required = true
        } else {
          this.rules.approval_chat_log[0].required = false
          this.rules.approval_is_all_transfer[1].required = false
        }

        setTimeout(() => {
          this.approval({ step, debug: false })
        }, 0)
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

      validator(success, { step }) {
        if (step === '4') {
          this.$refs.form
            .validateField('approval_subject', (error) => {
              if (!error) success()
            })

          return false
        }

        return this.$refs.form.validate((valid) => {
          if (valid) {
            let flag = true
            const $checkList = this.$refs.checkList
            const $checkList200015002 = this.$refs.checkList200015002

            if ($checkList200015002) flag = this.valid200015002()
            else if ($checkList) flag = $checkList.validate()

            if (flag) success()
          }
        })
      },

      paramsHandler({ step }) {
        const { approvalResult, id, formType, json, jsonMap } = this

        if (json[formType]) {
          approvalResult[`approval_${jsonMap[formType]}_json`] = JSON.stringify(json[formType])
        }

        return {
          id,
          step,
          approval_form_data: JSON.stringify(Object.assign(approvalResult, {
            approval_form_type: formType,
          })),
        }
      },

      valid200015002() {
        let flag = true
        this.json[200015002].some((it) => {
          if (!it.status) {
            flag = false
            return true
          }
          return false
        })

        this.is200015002Validate = !flag
        return flag
      },

      edit200015002(data, index) {
        this.toggleHandover(JSON.parse(JSON.stringify({ ...data, index })))
      },

      delete200015002(index) {
        this.json[200015002].splice(index, 1)
      },

      toggleHandover(handover) {
        this.showHandover = !this.showHandover
        this.handover = handover || {
          transfer_matters: '',
          transfer_user_id: '',
          transfer_user_name: '',
        }
      },

      changeHandover(employee) {
        if (employee.length) this.handover.transfer_user_name = employee[0].name
      },

      addHandover() {
        this.$refs.handover
          .validate()
          .then(() => {
            const { handover } = this
            const {
              transfer_matters,
              transfer_user_name,
              transfer_user_id,
              status,
              remark,
              editable,
            } = handover

            if (!handover.editable) {
              // 添加状态
              this.json[200015002].push(Object.assign(
                {},
                handover,
                { remark: '', status: 0, editable: true }
              ))
            } else {
              // 编辑状态
              this.$set(this.json[200015002], handover.index, JSON.parse(JSON.stringify({
                transfer_matters,
                transfer_user_name,
                transfer_user_id,
                status,
                remark,
                editable,
              })))
            }

            this.toggleHandover()
          })
      },
    },
  }
</script>

<style lang="scss">
  .table-200015002 {
    margin-left: 36px;

    .el-table {
      width: calc(50% + 392px);
    }
  }

  .toggle-handover {
    margin-left: 32px;
  }

  .handover-form {
    border: 1px solid #e5e5e5;
    width: calc(50% + 372px);
    margin-left: 36px;
  }

  .el-dialog {
    .approval-check-list {
      margin-left: 0;
      width: 100%;
    }
  }
</style>
