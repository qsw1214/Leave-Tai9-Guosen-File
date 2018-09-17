<template>
  <div class="page page-initiated-transfer">
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
        <m-section-cell
          title="操作类型"
          content="异动" />
      </m-section-row>
      <el-form
        class="m-section--form"
        label-width="140px"
        ref="form"
        :model="info.flow_form_data"
        :rules="formRules">
        <m-section-row>
          <el-form-item
            label="异动类型"
            prop="rsddgl_job_reason">
            <el-select v-model="info.flow_form_data.rsddgl_job_reason">
              <el-option
                v-for="(item, index) in typeOptions"
                :label="item.label"
                :value="item.value"
                :key="'typeOption_' + index" />
            </el-select>
          </el-form-item>
          <el-form-item
            label="计划调动日期"
            prop="rsddgl_date">
            <el-date-picker
              value-format="yyyy-MM-dd"
              v-model="info.flow_form_data.rsddgl_date"
              @change="changeDate" />
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="拟调入部门"
            prop="rsddgl_org">
            <m-cascader
              class="org-select"
              glass
              clearable
              init-change
              :width="260"
              :organization.sync="info.flow_form_data.rsddgl_org"
              :valid-date="info.flow_form_data.rsddgl_date || today"
              @change="changeDep" />
          </el-form-item>
          <el-form-item
            label="调入部门所属条线">
            {{ selectDep.line_name }}
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="拟任职职位"
            prop="rsddgl_job">
            <m-position-select
              class="job-select"
              title="请选择职位"
              init-change
              :width="260"
              :positions.sync="info.flow_form_data.rsddgl_job"
              :input-options="jobOptions"
              @change="changeJob"
              @fetchCompleted="jobOptionsInit" />
          </el-form-item>

          <el-form-item
            label="是否跨业务线"
            prop="rsddgl_is_cross_service">
            <el-select v-model="info.flow_form_data.rsddgl_is_cross_service">
              <el-option
                label="是"
                value="1" />
              <el-option
                label="否"
                value="2" />
            </el-select>
          </el-form-item>
        </m-section-row>

        <el-form-item
          label="申请原因"
          prop="rsddgl_reason">
          <el-input
            type="textarea"
            :rows="3"
            v-model="info.flow_form_data.rsddgl_reason" />
        </el-form-item>
      </el-form>
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
   * @description 发起调动申请流程
   * @router /op/initiated/transfer
   */

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
      const today = this.$utils.tools.formatDate(new Date(), 'YYYY-MM-DD')
      return {
        today,
        code: '200016',
        breadcrumb: [
          { name: '员工自助' },
          { name: '组织人事', to: '/op/transfer' },
          { name: '调动申请' },
        ],
        // 异动类型
        typeOptions: [
          { value: '128', label: '同部门调动' },
          { value: '64', label: '跨部门调动' },
          { value: '256', label: '竞聘调动' },
        ],
        // 职位列表
        jobOptions: [],
        // 选择部门
        selectDep: {},
        // 表单数据
        info: {
          flow_form_data: {
            rsddgl_job_reason: '',
            rsddgl_date: '',
            rsddgl_org: '',
            rsddgl_org_name: '',
            rsddgl_job: '',
            rsddgl_job_name: '',
            rsddgl_is_cross_service: '',
            rsddgl_reason: '',
          },
        },
        // 表单验证规则
        formRules: {
          rsddgl_job_reason: [{
            required: true,
            message: '请选择异动类型',
            trigger: 'change',
          }],
          rsddgl_date: [{
            required: true,
            message: '请选择计划调动日期',
            trigger: 'blur',
          }],
          rsddgl_org: [{
            required: true,
            message: '请选择拟调入部门',
            trigger: 'blur',
          }],
          rsddgl_job: [{
            required: true,
            message: '请选择拟任职职位',
          }],
          rsddgl_is_cross_service: [{
            required: true,
            message: '请选择是否跨业务线',
          }],
          rsddgl_reason: [{
            required: true,
            message: '请输入申请原因',
            trigger: 'blur',
          }],
        },
        submitRedirectPath: '/op/transfer',
      }
    },
    created() {
      if (this.id) {
        this.getInfo()
          .then(() => {
            if (this.info.status === 94) this.getLogsAndPath()
          })
      }
    },
    methods: {
      changeDate(value) {
        if (value && this.info.flow_form_data.rsddgl_org && this.selectDep) {
          const selectedDate = new Date(value)
          const depDate = new Date(this.selectDep.valid_date)
          if (depDate > selectedDate) {
            this.info.flow_form_data.rsddgl_org = ''
          }
        }
      },
      // 选择部门回调
      changeDep(deps) {
        if (deps.length > 0) {
          this.selectDep = deps[deps.length - 1]
          this.info.flow_form_data.rsddgl_org_name = this.selectDep.name
        }
      },
      changeJob(jobs) {
        if (jobs.length > 0) {
          this.info.flow_form_data.rsddgl_job_name = jobs[0].name
        } else {
          this.info.flow_form_data.rsddgl_job_name = ''
        }
      },
      // 职位组件初始化回调
      jobOptionsInit(options) {
        this.jobOptions = options
      },
    },
  }
</script>
