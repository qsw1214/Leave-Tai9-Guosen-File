<template>
  <div class="">
    <div class="form-condtion">
      <div class="desc">
        说明：输入查询条件，点击查询按钮，点击导出按钮
      </div>
      <el-form
        label-position="left"
        label-width="80px"
        ref="form"
        :model="formData"
        :rules="formRules">
        <el-form-item label="查询月份">
          <el-date-picker
            value-format="yyyy-MM"
            type="month"
            v-model="formData.month"
            :picker-options="pickerOptions" />
        </el-form-item>
        <el-button
          type="primary"
          @click="validForm">查询</el-button>
        <el-button @click="expxortExcel">导出</el-button>
      </el-form>
    </div>
    <div class="table-condtion block-margin-bottom">
      <m-cascader
        class="org-select"
        clearable
        init-change
        :width="260"
        :organization.sync="orgId"
        :valid-date="today"
        :remote="orgUrl"
        @fetchCompleted="organizationsReady"
        @selectCompleted="changeDep" />

      <el-input
        class="search"
        placeholder="输入员工姓名或员工ID进行搜索"
        v-model="keyword"
        @keyup.enter.native="search">
        <el-button
          icon="el-icon-search"
          slot="append"
          @click="search" />
      </el-input>
    </div>

    <!-- 主要列表 -->
    <m-table
      v-loading="loading"
      is-full-table
      :data="data"
      :total="total"
      :current-page="pageIndex"
      @size-change="changePageSize"
      @current-change="changePageIndex">
      <template slot-scope="props">
        <el-table
          border
          stripe
          :max-height="props.maxHeight - 20"
          :data="props.data"
          @selection-change="selectionChange">
          <el-table-column
            type="selection"
            column-key="select"
            align="center"
            class-name="checkbox autotest-checkbox"
            width="75" />
          <el-table-column
            label="证件号码"
            align="center"
            class-name="autotest-credential_num"
            width="180"
            prop="credential_num" />

          <el-table-column
            label="薪资类别"
            align="center"
            class-name="autotest-salary_type_name"
            width="120"
            prop="salary_type_name" />

          <el-table-column
            label="序号"
            align="center"
            width="120"
            prop="name">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>

          <el-table-column
            label="员工ID"
            align="center"
            width="150"
            class-name="autotest-emp_code"
            prop="emp_code" />

          <el-table-column
            label="经纪号"
            align="center"
            width="150"
            class-name="autotest-broker_code"
            prop="broker_code" />

          <el-table-column
            label="姓名"
            align="center"
            width="150"
            class-name="autotest-name"
            prop="name" />

          <el-table-column
            label="财务属性"
            align="center"
            width="150"
            class-name="autotest-finance_attribute"
            prop="finance_attribute" />


          <el-table-column
            label="部门"
            align="center"
            width="120"
            class-name="autotest-org_name"
            prop="org_name" />

          <el-table-column
            label="职位"
            align="center"
            width="120"
            class-name="autotest-job_name"
            prop="job_name" />

          <el-table-column
            label="级别"
            align="center"
            width="120"
            class-name="autotest-level"
            prop="level" />

          <el-table-column
            label="属性"
            align="center"
            width="120"
            class-name="autotest-team_attribute_name"
            prop="team_attribute_name" />

          <el-table-column
            label="职能"
            align="center"
            width="120"
            class-name="autotest-function_name"
            prop="function_name" />

          <el-table-column
            label="团队名称"
            align="center"
            width="120"
            class-name="autotest-team_name"
            prop="team_name" />

          <el-table-column
            label="团队长经纪号"
            align="center"
            width="120"
            class-name="autotest-team_leader_broker_code"
            prop="team_leader_broker_code" />

          <el-table-column
            label="团队长姓名"
            align="center"
            width="120"
            class-name="autotest-team_leader_name"
            prop="team_leader_name" />

          <el-table-column
            label="入职时间"
            align="center"
            width="120"
            class-name="autotest-join_date"
            prop="join_date" />

          <el-table-column
            label="转正时间"
            align="center"
            width="120"
            class-name="autotest-correction_date"
            prop="correction_date" />

          <el-table-column
            label="转岗时间"
            align="center"
            width="120"
            class-name="autotest-move_date"
            prop="move_date" />

          <el-table-column
            label="离职时间"
            align="center"
            width="120"
            class-name="autotest-leave_date"
            prop="leave_date" />

          <el-table-column
            label="参加工作时间"
            align="center"
            width="120"
            class-name="autotest-begin_work_date"
            prop="begin_work_date" />

          <el-table-column
            label="出勤天数"
            align="center"
            width="120"
            class-name="autotest-on_duty_days"
            prop="on_duty_days">
            <template slot-scope="scope">
              {{ scope.row.on_duty_days }}天
            </template>
          </el-table-column>

          <el-table-column
            label="基本考勤分"
            align="center"
            width="120"
            class-name="autotest-base_kq_score"
            prop="base_kq_score">
            <template slot-scope="scope">
              {{ scope.row.base_kq_score }}分
            </template>
          </el-table-column>

          <el-table-column
            label="绩效考勤分"
            align="center"
            width="120"
            class-name="autotest-performance_kq_score"
            prop="performance_kq_score">
            <template slot-scope="scope">
              {{ scope.row.performance_kq_score }}分
            </template>
          </el-table-column>

          <el-table-column
            label="迟到次数"
            align="center"
            width="120"
            class-name="autotest-later_cnt"
            prop="later_cnt">
            <template slot-scope="scope">
              {{ scope.row.later_cnt }}次
            </template>
          </el-table-column>

          <el-table-column
            label="早退次数"
            align="center"
            width="120"
            class-name="autotest-early_cnt"
            prop="early_cnt">
            <template slot-scope="scope">
              {{ scope.row.early_cnt }}次
            </template>
          </el-table-column>

          <el-table-column
            label="超时迟到"
            align="center"
            width="120"
            class-name="autotest-over_later_cnt"
            prop="over_later_cnt">
            <template slot-scope="scope">
              {{ scope.row.over_later_cnt }}次
            </template>
          </el-table-column>

          <el-table-column
            label="超时早退"
            align="center"
            width="120"
            class-name="autotest-over_early_cnt"
            prop="over_early_cnt">
            <template slot-scope="scope">
              {{ scope.row.over_early_cnt }}次
            </template>
          </el-table-column>

          <el-table-column
            label="旷工天数"
            align="center"
            width="120"
            class-name="autotest-off_work_days"
            prop="off_work_days">
            <template slot-scope="scope">
              {{ scope.row.off_work_days }}天
            </template>
          </el-table-column>

          <el-table-column
            label="事假天数"
            align="center"
            width="120"
            class-name="autotest-leave_days"
            prop="leave_days">
            <template slot-scope="scope">
              {{ scope.row.leave_days }}天
            </template>
          </el-table-column>

          <el-table-column
            label="病假天数"
            align="center"
            width="120"
            class-name="autotest-sick_leave_days"
            prop="sick_leave_days">
            <template slot-scope="scope">
              {{ scope.row.sick_leave_days }}天
            </template>
          </el-table-column>

          <el-table-column
            label="产假天数"
            align="center"
            width="120"
            class-name="autotest-maternity_leave_days"
            prop="maternity_leave_days">
            <template slot-scope="scope">
              {{ scope.row.maternity_leave_days }}天
            </template>
          </el-table-column>

          <el-table-column
            label="婚假天数"
            align="center"
            width="120"
            class-name="autotest-marriage_leave_days"
            prop="marriage_leave_days" >
            <template slot-scope="scope">
              {{ scope.row.marriage_leave_days }}天
            </template>
          </el-table-column>

          <el-table-column
            label="年假天数"
            align="center"
            width="120"
            class-name="autotest-annual_leave_days"
            prop="annual_leave_days">
            <template slot-scope="scope">
              {{ scope.row.annual_leave_days }}天
            </template>
          </el-table-column>

          <el-table-column
            label="丧假天数"
            align="center"
            width="120"
            class-name="autotest-funeral_leave_days"
            prop="funeral_leave_days">
            <template slot-scope="scope">
              {{ scope.row.funeral_leave_days }}天
            </template>
          </el-table-column>

          <el-table-column
            label="陪产假天数"
            align="center"
            width="120"
            class-name="autotest-paternity_leave_days"
            prop="paternity_leave_days">
            <template slot-scope="scope">
              {{ scope.row.paternity_leave_days }}天
            </template>
          </el-table-column>

          <el-table-column
            label="考勤按次扣款"
            align="center"
            width="120"
            class-name="autotest-kq_kk_by_cnt"
            prop="kq_kk_by_cnt" />

          <el-table-column
            label="考勤申诉退款"
            align="center"
            width="120"
            class-name="autotest-kq_sstk"
            prop="kq_sstk" />

          <el-table-column
            label="备注"
            align="center"
            width="120"
            class-name="autotest-remark"
            prop="remark" />

          <el-table-column
            label="是否有过渡期"
            align="center"
            width="120"
            class-name="autotest-is_interim_name"
            prop="is_interim_name" />

          <el-table-column
            label="客户经理基本定级备注"
            align="center"
            width="180"
            class-name="autotest-cm_base_remark"
            prop="cm_base_remark" />

          <el-table-column
            label="员工编码"
            align="center"
            width="120"
            class-name="autotest-yonyou_code"
            prop="yonyou_code" />

          <el-table-column
            label="底薪"
            align="center"
            width="120"
            class-name="autotest-base_salary"
            prop="base_salary" />

          <el-table-column
            label="绩效标准"
            align="center"
            width="120"
            class-name="autotest-performance_standard"
            prop="performance_standard" />

          <el-table-column
            label="业务方向"
            align="center"
            width="120"
            class-name="autotest-business_direction_name"
            prop="business_direction_name" />

          <el-table-column
            label="社保 - 养老个人部分"
            align="center"
            width="160"
            class-name="autotest-sb_yanglao_person"
            prop="sb_yanglao_person" />

          <el-table-column
            label="社保 - 医疗个人部分"
            align="center"
            width="160"
            class-name="autotest-sb_yiliao_person"
            prop="sb_yiliao_person" />

          <el-table-column
            label="社保 - 失业个人部分"
            align="center"
            width="160"
            class-name="autotest-sb_shiye_person"
            prop="sb_shiye_person" />

          <el-table-column
            label="大额医疗 - 个人部分（北京购买社保人员）"
            align="center"
            width="300"
            class-name="autotest-deyl_person"
            prop="deyl_person" />

          <el-table-column
            label="住房公积金缴交金额"
            align="center"
            width="160"
            class-name="autotest-zfgjj"
            prop="zfgjj" />

          <el-table-column
            label="工行账号"
            align="center"
            width="150"
            class-name="autotest-gh_bank_num"
            prop="gh_bank_num" />

          <el-table-column
            label="建行账号"
            align="center"
            width="150"
            class-name="autotest-jh_bank_num"
            prop="jh_bank_num" />

        </el-table>
      </template>
    </m-table>
  </div>
</template>

<script>
  /**
  * @description  考勤管理 - 算薪表
  * @router /attendance/summary
  */
  import mixin from '~report/mixins'

  export default {
    mixins: [mixin.attendance],
    data() {
      const month = new Date()
      month.setDate(0)
      const monthStr = this.$utils.tools.formatDate(month, 'YYYY-MM')
      return {
        formData: {
          month: monthStr,
        },
        formRules: {
          month: [],
        },
        pickerOptions: {
          disabledDate(time) {
            const m = new Date()
            m.setDate(0)
            return time.getTime() > m
          },
        },
        requestParams: {},
        exportType: 'export_salary_month',
      }
    },
    methods: {
      fetch() {
        if (this.loading) return
        this.loading = true
        const submitParams = {
          month: this.formData.month.replace(/-/g, ''),
          keywords: this.keywordValues,
          org_id: this.orgId,
          per_page: this.pageSize,
          page: this.pageIndex,
        }
        this.$axios({
          url: this.$api.report.attendance.listSalary,
          method: 'post',
          data: submitParams,
        })
          .then((data) => {
            this.requestParams = Object.assign({}, submitParams)
            this.loading = false
            this.data = data.data.list
            this.total = data.data.count
          }).catch(() => {
            this.loading = false
          })
      },

      organizationsReady(options) {
        this.orgId = options[0].id
        this.fetch()
      },
    },
  }
</script>
