<template>
  <div class="page page-initiated-leave">
    <m-breadcrumb :items="breadcrumb" />
    <userinfo/>
    <m-section
      title="申请表单"
      is-form>
      <m-section-row>
        <m-section-cell
          title="流程编码"
          :content="info.code || '由系统自动生成'" />
        <m-section-cell
          title="申请日期"
          :content="info.apply_date || '由系统自动生成'" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="流程状态"
          :content="info.status_name || '草稿'" />
      </m-section-row>

      <el-form
        class="m-section--form"
        label-width="140px"
        ref="form"
        :model="info.flow_form_data"
        :rules="formRules">
        <m-section-row>
          <el-form-item
            label="操作类型">
            离职
          </el-form-item>

          <el-form-item
            label="操作原因"
            prop="rslzgl_type">
            <el-select v-model="info.flow_form_data.rslzgl_type">
              <el-option
                v-for="(item, index) in typeOptions1"
                :label="item.label"
                :value="item.value"
                :key="'typeOption_' + index" />
            </el-select>
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="离职原因"
            prop="rslzgl_reason">
            <el-select v-model="info.flow_form_data.rslzgl_reason">
              <el-option
                v-for="(item, index) in typeOptions2"
                :label="item.label"
                :value="item.value"
                :key="'typeOption_' + index" />
            </el-select>
          </el-form-item>

          <el-form-item
            label="离职去向"
            prop="rslzgl_goto">
            <el-select v-model="info.flow_form_data.rslzgl_goto">
              <el-option
                v-for="(item, index) in typeOptions3"
                :label="item.label"
                :value="item.value"
                :key="'typeOption_' + index" />
            </el-select>
          </el-form-item>
        </m-section-row>

        <el-form-item
          label="去向具体说明"
          prop="rslzgl_goto_explain">
          <el-input
            type="textarea"
            :rows="3"
            v-model="info.flow_form_data.rslzgl_goto_explain" />
        </el-form-item>

        <m-section-row>
          <el-form-item
            label="计划最后工作日"
            prop="rslzgl_work_end_date">
            <el-date-picker
              value-format="yyyy-MM-dd"
              :picker-options="datepickerOptions"
              v-model="info.flow_form_data.rslzgl_work_end_date" />
          </el-form-item>

          <el-form-item
            label="对公司意见"
            prop="rslzgl_opinion">
            <el-input v-model="info.flow_form_data.rslzgl_opinion" />
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="离职后手机号码"
            prop="rslzgl_quit_mobile">
            <el-input v-model="info.flow_form_data.rslzgl_quit_mobile" />
          </el-form-item>

          <el-form-item
            label="离职后邮箱"
            prop="rslzgl_quit_mail">
            <el-input v-model="info.flow_form_data.rslzgl_quit_mail" />
          </el-form-item>
        </m-section-row>

        <el-form-item
          label="离职后通讯地址"
          prop="rsddgl_reason">
          <el-input
            type="textarea"
            :rows="3"
            :maxlength="100"
            v-model="info.flow_form_data.rslzgl_quit_address" />
        </el-form-item>
      </el-form>
    </m-section>

    <m-section
      title="交接事项"
      is-form>
      <m-section-row>
        <el-button
          type="text"
          icon="el-icon-plus"
          @click="showHandover(true)">添加交接事项</el-button>
      </m-section-row>
      <el-form
        class="m-section--form form-handover"
        label-width="140px"
        v-show="handover.showForm"
        ref="formHandover"
        :model="handover.formData"
        :rules="handover.formRules">

        <m-section-row>
          <el-form-item
            label="拟离职交接人"
            prop="transfer_user_id">
            <m-employee-select
              class="employee-select"
              store-name="proEmployeeSelect"
              init-change
              cached
              :employees.sync="handover.formData.transfer_user_id"
              :width="260"
              @change="changeEmployee" />
          </el-form-item>

          <el-form-item
            label="拟工作交接事项"
            prop="transfer_matters">
            <el-input
              :maxlength="50"
              v-model="handover.formData.transfer_matters" />
          </el-form-item>
        </m-section-row>
        <m-section-row>
          <el-form-item label="">
            <el-button
              type="primary"
              @click="addHandover">确定</el-button>

            <el-button
              type="info"
              v-if="info.flow_form_data.rslzgl_transfer.length > 0"
              @click="showHandover(false)">取消</el-button>
          </el-form-item>
        </m-section-row>
      </el-form>

      <m-section-row v-show="info.flow_form_data.rslzgl_transfer.length > 0 || id">
        <m-section-cell title="">
          <el-table
            border
            stripe
            :data="info.flow_form_data.rslzgl_transfer">
            <el-table-column
              label="序号"
              align="center"
              width="180"
              prop="number">
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>

            <el-table-column
              label="拟离职交接人"
              align="center"
              prop="number">
              <template slot-scope="scope">
                {{ scope.row.transfer_user_name }} {{ scope.row.transfer_user_empcode }}
              </template>
            </el-table-column>

            <el-table-column
              label="拟交接工作事项"
              align="center"
              prop="transfer_matters" />

            <el-table-column
              label="操作"
              align="center"
              width="120"
              prop="number">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="handoverHandler('edit', scope.$index)">编辑</el-button>
                <el-button
                  type="text"
                  class="error"
                  @click="handoverHandler('delete', scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </m-section-cell>
      </m-section-row>
    </m-section>

    <logs-and-path
      v-if="info.status === 94"
      :data="logsAndPath" />
    <div>
      <el-button
        type="primary"
        :loading="button.submit"
        @click="submit('submit')">提交</el-button>

      <el-button
        type="info"
        :loading="button.stash"
        @click="submit('stash')">暂存</el-button>

      <el-button
        type="info"
        @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
  /**
   * @description 发起离职申请流程
   * @router /op/initiated/leave
   */

  import { mapState } from 'vuex'
  import LogsAndPath from '@/components/logsAndPath'
  import mixin from '~services/mixin'
  import Userinfo from '../common/Userinfo'

  export default {
    components: {
      Userinfo,
      LogsAndPath,
    },
    mixins: [mixin.pa, mixin.flow, mixin.router],
    data() {
      return {
        code: '200015',
        breadcrumb: [
          { name: '员工自助' },
          { name: '组织人事', to: '/op/leave' },
          { name: '离职申请' },
        ],
        // 操作原因
        typeOptions1: [
          { value: '8', label: '主动离职' },
          { value: '16', label: '被动离职' },
          { value: '32', label: '退休' },
        ],
        // 离职原因
        typeOptions2: [
          { value: '1', label: '不适应公司文化' },
          { value: '2', label: '公司架构调整/管理变化' },
          { value: '4', label: '对工作环境/模式不满意' },
          { value: '8', label: '对管理层不满意' },
          { value: '16', label: '对直接管理人员不满意' },
          { value: '32', label: '对团队氛围不满意/与同事的相处不融洽' },
          { value: '64', label: '目前工作和个人发展规划不符' },
          { value: '128', label: '对收入报酬/职级不满意' },
          { value: '256', label: '家庭原因' },
          { value: '512', label: '找到更好的工作' },
          { value: '1024', label: '自己做生意' },
          { value: '2048', label: '不胜任岗位工作，工作压力大' },
          { value: '4096', label: '转换行业' },
          { value: '8192', label: '个人健康原因' },
          { value: '16384', label: '回校继续深造' },
        ],
        // 离职去向
        typeOptions3: [
          { value: '1', label: '银行' },
          { value: '2', label: '保险' },
          { value: '4', label: '互联网金融' },
          { value: '8', label: '证券' },
          { value: '16', label: '三方理财' },
          { value: '32', label: '公募基金' },
          { value: '64', label: '私募基金' },
          { value: '128', label: '期货' },
          { value: '256', label: '其他金融' },
          { value: '512', label: '互联网' },
          { value: '1024', label: '高科技' },
          { value: '2048', label: '咨询' },
          { value: '4096', label: '服务业' },
          { value: '8192', label: '房地产' },
          { value: '16384', label: '教育/培训' },
          { value: '32768', label: '消费品' },
          { value: '65536', label: '零售' },
          { value: '131072', label: '制造' },
          { value: '262144', label: '能源' },
          { value: '524288', label: '政府部门/事业单位' },
          { value: '1048576', label: '其他非金融' },
        ],
        // 职位列表
        jobOptions: [],
        // 选择部门
        selectDep: {},
        // 表单数据
        info: {
          flow_form_data: {
            rslzgl_type: '8',
            rslzgl_reason: '',
            rslzgl_goto: '',
            rslzgl_goto_explain: '',
            rslzgl_work_end_date: '',
            rslzgl_opinion: '',
            rslzgl_quit_mobile: '',
            rslzgl_quit_mail: '',
            rslzgl_quit_address: '',
            rslzgl_transfer: [],
          },
        },
        // 表单验证规则
        formRules: {
          rslzgl_type: [{
            required: true,
            message: '请选择操作原因',
            trigger: 'change',
          }],
          rslzgl_reason: [{
            required: true,
            message: '请选择离职原因',
            trigger: 'change',
          }],
          rslzgl_goto: [{
            required: true,
            message: '请选择离职去向',
            trigger: 'change',
          }],
          rslzgl_goto_explain: [{
            required: true,
            message: '请输入去向具体说明',
            trigger: 'blur',
          }],
          rslzgl_work_end_date: [{
            required: true,
            message: '请选择计划最后工作日',
            trigger: 'blur',
          }],
          rslzgl_opinion: [{
            required: true,
            message: '请输入公司意见',
            trigger: 'blur',
          }],
          rslzgl_quit_mail: [{
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: 'blur',
          }],
          rslzgl_quit_mobile: [{
            message: '请输入正确的手机号码',
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value.trim()) {
                const regx = new RegExp(/1[3|4|5|7|8]\d{9}/)
                if (!regx.test(value)) {
                  callback(new Error('请输入正确的手机号码'))
                }
              }
              callback()
            },
          }],
        },
        // 交接事项
        handover: {
          // 是否显示表单
          showForm: false,
          // 列表编辑索引
          editIndex: -1,
          // 表单数据
          formData: {
            transfer_user_id: '',
            transfer_user_empcode: '',
            transfer_matters: '',
            transfer_user_name: '',
          },
          formRules: {
            transfer_user_id: [{
              required: true,
              message: '请选择离职交接人',
            }],
            transfer_matters: [{
              required: true,
              message: '请输入交接工作事项',
              trigger: 'blur',
            }],
          },
        },
        submitRedirectPath: '/op/leave',
        datepickerOptions: {
          disabledDate(time) {
            return time.getTime() < (Date.now() - 8.64e7)
          },
        },
      }
    },
    computed: {
      ...mapState({
        initData: state => state.services.initData,
      }),
    },
    watch: {
      initData: {
        handler(newValue) {
          if (newValue.id) {
            this.getUserJob()
          }
        },
        deep: true,
      },
    },
    created() {
      if (this.id) {
        this.getInfo()
          .then(() => {
            if (this.info.flow_form_data.rslzgl_transfer.length > 0) {
              this.handover.showForm = false
            }
            if (this.info.status === 94) this.getLogsAndPath()
          })
      }
    },
    methods: {
      getUserJob() {
        this.$axios({
          url: this.$api.services.op.userJob,
          params: {
            uid: this.initData.id,
          },
        })
          .then((data) => {
            if (data.code === 0 && data.data.info.valid_date) {
              const dataStr = data.data.info.valid_date
              this.datepickerOptions = {
                disabledDate(time) {
                  const date = new Date(dataStr)
                  return time.getTime() < date
                },
              }
            }
          }).catch(() => {})
      },
      // 选择部门回调
      changeDep(deps) {
        if (deps.length > 0) {
          this.selectDep = deps[deps.length - 1]
        }
      },
      // 职位组件初始化回调
      jobOptionsInit(options) {
        this.jobOptions = options
      },
      // 选择工作交接人回调
      changeEmployee(list) {
        if (list.length > 0) {
          this.handover.formData.transfer_user_name = list[0].name
          this.handover.formData.transfer_user_empcode = list[0].emp_code
        } else {
          this.handover.formData.transfer_user_name = null
        }
      },
      // 添加交接事项
      addHandover() {
        this.$refs.formHandover.validate((valid) => {
          if (valid) {
            const { editIndex } = this.handover
            const newData = Object.assign({}, this.handover.formData)
            newData.transfer_matters = newData.transfer_matters.trim()
            if (editIndex > -1) {
              this.info.flow_form_data.rslzgl_transfer.splice(
                editIndex,
                1,
                newData
              )
              this.handover.editIndex = -1
            } else {
              this.info.flow_form_data.rslzgl_transfer.push(newData)
            }
            this.$refs.formHandover.resetFields()
          }
        })
      },
      // 交接事项列表操作
      handoverHandler(type, index) {
        switch (type) {
        case 'delete':
          this.info.flow_form_data.rslzgl_transfer.splice(index, 1)
          break
        case 'edit':
          this.handover.editIndex = index
          this.handover.showForm = true
          this.handover.formData =
            Object.assign({}, this.info.flow_form_data.rslzgl_transfer[index])
          break
        default:
          break
        }
      },
      // 显示交接事项表单
      showHandover(value) {
        this.handover.showForm = value
      },
    },
  }
</script>
