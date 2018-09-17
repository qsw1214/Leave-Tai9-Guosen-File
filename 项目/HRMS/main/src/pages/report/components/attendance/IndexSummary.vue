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
        <el-row>
          <el-col>
            <el-form-item label="汇总方式">
              <el-radio
                label="1"
                v-model="formData.type">按员工汇总</el-radio>
              <el-radio
                label="2"
                v-model="formData.type">按部门汇总</el-radio>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item
              prop="start"
              label="开始月份">
              <el-date-picker
                type="month"
                value-format="yyyy-MM"
                placeholder=""
                v-model="formData.start"
                :picker-options="pickerOptions"
                :editable="false" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              prop="end"
              label="结束月份">
              <el-date-picker
                type="month"
                value-format="yyyy-MM"
                placeholder=""
                v-model="formData.end"
                :picker-options="pickerOptions"
                :editable="false" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <div class="btn-con" />
            <el-button
              type="primary"
              @click="validForm">查询</el-button>
            <el-button @click="expxortExcel">导出</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="table-condtion block-margin-bottom">
      <m-cascader
        class="org-select"
        clearable
        init-change
        :width="260"
        :remote="orgUrl"
        :organization.sync="orgId"
        :valid-date="today"
        @fetchCompleted="organizationsReady"
        @selectCompleted="changeDep" />

      <el-input
        class="search"
        placeholder="输入员工姓名或员工ID进行搜索"
        v-if="formData.type === '1'"
        v-model="keyword"
        @keyup.enter.native="search">
        <el-button
          icon="el-icon-search"
          slot="append"
          @click="search" />
      </el-input>
    </div>

    <!-- 按部门列表 -->
    <m-table
      v-loading="loading"
      is-full-table
      v-if="requestParams.type === '2'"
      :data="data"
      :total="data.length"
      :remote="false"
      :current-page="pageIndex"
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
            label="组织名称"
            align="center"
            width="150"
            class-name="autotest-org_name"
            prop="org_name" />

          <el-table-column
            label="组织编码"
            align="center"
            width="120"
            class-name="autotest-org_code"
            prop="org_code" />

          <el-table-column
            label="组织层级"
            align="center"
            width="120"
            class-name="autotest-org_level_name"
            prop="org_level_name" />

          <el-table-column
            label="组织属性"
            align="center"
            width="120"
            class-name="autotest-org_flag_name"
            prop="org_flag_name" />

          <el-table-column
            label="迟到次数"
            align="center"
            width="150"
            class-name="autotest-later_cnt"
            prop="later_cnt">
            <template slot-scope="scope">
              {{ scope.row.later_cnt }}次
            </template>
          </el-table-column>

          <el-table-column
            label="超时迟到次数"
            align="center"
            width="150"
            class-name="autotest-over_later_cnt"
            prop="over_later_cnt">
            <template slot-scope="scope">
              {{ scope.row.over_later_cnt }}次
            </template>
          </el-table-column>

          <el-table-column
            label="早退次数"
            align="center"
            width="150"
            class-name="autotest-early_cnt"
            prop="early_cnt">
            <template slot-scope="scope">
              {{ scope.row.early_cnt }}次
            </template>
          </el-table-column>

          <el-table-column
            label="超时早退次数"
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
            label="因公外出"
            align="center"
            width="120"
            class-name="autotest-business_out"
            prop="business_out" >
            <template slot-scope="scope">
              {{ scope.row.business_out }}天
            </template>
          </el-table-column>

          <el-table-column
            label="未打卡申诉"
            align="center"
            width="120"
            class-name="autotest-not_sign"
            prop="not_sign">
            <template slot-scope="scope">
              {{ scope.row.not_sign }}次
            </template>
          </el-table-column>

          <el-table-column
            label="忘记打卡"
            align="center"
            width="120"
            class-name="autotest-not_sign_forget"
            prop="not_sign_forget">
            <template slot-scope="scope">
              {{ scope.row.not_sign_forget }}次
            </template>
          </el-table-column>

          <el-table-column
            label="因指纹模糊未打卡"
            align="center"
            width="140"
            class-name="autotest-not_sign_finger"
            prop="not_sign_finger">
            <template slot-scope="scope">
              {{ scope.row.not_sign_finger }}次
            </template>
          </el-table-column>

          <el-table-column
            label="事假天数"
            align="center"
            width="80"
            class-name="autotest-leave_days"
            prop="leave_days">
            <template slot-scope="scope">
              {{ scope.row.leave_days }}天
            </template>
          </el-table-column>

          <el-table-column
            label="年假天数"
            align="center"
            width="80"
            class-name="autotest-annual_leave_days"
            prop="annual_leave_days">
            <template slot-scope="scope">
              {{ scope.row.annual_leave_days }}天
            </template>
          </el-table-column>

          <el-table-column
            label="病假天数"
            align="center"
            width="80"
            class-name="autotest-sick_leave_days"
            prop="sick_leave_days">
            <template slot-scope="scope">
              {{ scope.row.sick_leave_days }}天
            </template>
          </el-table-column>

          <el-table-column
            label="陪产假天数"
            align="center"
            width="100"
            class-name="autotest-paternity_leave_days"
            prop="paternity_leave_days">
            <template slot-scope="scope">
              {{ scope.row.paternity_leave_days }}天
            </template>
          </el-table-column>

          <el-table-column
            label="产假天数"
            align="center"
            width="80"
            class-name="autotest-maternity_leave_days"
            prop="maternity_leave_days">
            <template slot-scope="scope">
              {{ scope.row.maternity_leave_days }}天
            </template>
          </el-table-column>

          <el-table-column
            label="流产假天数"
            align="center"
            width="100"
            class-name="autotest-abortion_leave_days"
            prop="abortion_leave_days">
            <template slot-scope="scope">
              {{ scope.row.abortion_leave_days }}天
            </template>
          </el-table-column>

          <el-table-column
            label="产检假天数"
            align="center"
            width="100"
            class-name="autotest-prenatal_leave_days"
            prop="prenatal_leave_days">
            <template slot-scope="scope">
              {{ scope.row.prenatal_leave_days }}天
            </template>
          </el-table-column>

          <el-table-column
            label="婚假天数"
            align="center"
            width="80"
            class-name="autotest-marriage_leave_days"
            prop="marriage_leave_days" >
            <template slot-scope="scope">
              {{ scope.row.marriage_leave_days }}天
            </template>
          </el-table-column>

          <el-table-column
            label="丧假天数"
            align="center"
            width="80"
            class-name="autotest-funeral_leave_days"
            prop="funeral_leave_days">
            <template slot-scope="scope">
              {{ scope.row.funeral_leave_days }}天
            </template>
          </el-table-column>

          <el-table-column
            label="出差天数"
            align="center"
            width="80"
            class-name="autotest-travel_days"
            prop="travel_days">
            <template slot-scope="scope">
              {{ scope.row.travel_days }}天
            </template>
          </el-table-column>

        </el-table>
      </template>
    </m-table>

    <!-- 按员工列表 -->
    <m-table
      v-loading="loading"
      is-full-table
      v-if="requestParams.type === '1'"
      :data="data"
      :total="data.length"
      :remote="false"
      :current-page="pageIndex"
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
            label="姓名"
            align="center"
            class-name="autotest-name"
            width="120"
            prop="name" />

          <el-table-column
            label="员工ID"
            align="center"
            class-name="autotest-emp_code"
            width="120"
            prop="emp_code" />

          <el-table-column
            label="所属组织"
            align="center"
            width="120"
            class-name="autotest-org_name"
            prop="org_name" />

          <el-table-column
            label="职位名称"
            align="center"
            width="150"
            class-name="autotest-job_name"
            prop="job_name" />

          <el-table-column
            label="迟到次数"
            align="center"
            width="150"
            class-name="autotest-later_cnt"
            prop="later_cnt">
            <template slot-scope="scope">
              {{ scope.row.later_cnt }}次
            </template>
          </el-table-column>

          <el-table-column
            label="超时迟到次数"
            align="center"
            width="150"
            class-name="autotest-over_later_cnt"
            prop="over_later_cnt">
            <template slot-scope="scope">
              {{ scope.row.over_later_cnt }}次
            </template>
          </el-table-column>

          <el-table-column
            label="早退次数"
            align="center"
            width="150"
            class-name="autotest-early_cnt"
            prop="early_cnt">
            <template slot-scope="scope">
              {{ scope.row.early_cnt }}次
            </template>
          </el-table-column>

          <el-table-column
            label="超时早退次数"
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
            label="因公外出"
            align="center"
            width="120"
            class-name="autotest-business_out"
            prop="business_out" >
            <template slot-scope="scope">
              {{ scope.row.business_out }}天
            </template>
          </el-table-column>

          <el-table-column
            label="未打卡申诉"
            align="center"
            width="120"
            class-name="autotest-not_sign"
            prop="not_sign">
            <template slot-scope="scope">
              {{ scope.row.not_sign }}次
            </template>
          </el-table-column>

          <el-table-column
            label="忘记打卡"
            align="center"
            width="120"
            class-name="autotest-not_sign_forget"
            prop="not_sign_forget">
            <template slot-scope="scope">
              {{ scope.row.not_sign_forget }}次
            </template>
          </el-table-column>

          <el-table-column
            label="因指纹模糊未打卡"
            align="center"
            width="140"
            class-name="autotest-not_sign_finger"
            prop="not_sign_finger">
            <template slot-scope="scope">
              {{ scope.row.not_sign_finger }}次
            </template>
          </el-table-column>

          <el-table-column
            label="事假天数"
            align="center"
            width="80"
            class-name="autotest-leave_days"
            prop="leave_days">
            <template slot-scope="scope">
              {{ scope.row.leave_days }}天
            </template>
          </el-table-column>

          <el-table-column
            label="年假天数"
            align="center"
            width="80"
            class-name="autotest-annual_leave_days"
            prop="annual_leave_days">
            <template slot-scope="scope">
              {{ scope.row.annual_leave_days }}天
            </template>
          </el-table-column>

          <el-table-column
            label="病假天数"
            align="center"
            width="80"
            class-name="autotest-sick_leave_days"
            prop="sick_leave_days">
            <template slot-scope="scope">
              {{ scope.row.sick_leave_days }}天
            </template>
          </el-table-column>

          <el-table-column
            label="陪产假天数"
            align="center"
            width="100"
            class-name="autotest-paternity_leave_days"
            prop="paternity_leave_days">
            <template slot-scope="scope">
              {{ scope.row.paternity_leave_days }}天
            </template>
          </el-table-column>

          <el-table-column
            label="产假天数"
            align="center"
            width="80"
            class-name="autotest-maternity_leave_days"
            prop="maternity_leave_days">
            <template slot-scope="scope">
              {{ scope.row.maternity_leave_days }}天
            </template>
          </el-table-column>

          <el-table-column
            label="流产假天数"
            align="center"
            width="100"
            class-name="autotest-abortion_leave_days"
            prop="abortion_leave_days">
            <template slot-scope="scope">
              {{ scope.row.abortion_leave_days }}天
            </template>
          </el-table-column>

          <el-table-column
            label="产检假天数"
            align="center"
            width="100"
            class-name="autotest-prenatal_leave_days"
            prop="prenatal_leave_days">
            <template slot-scope="scope">
              {{ scope.row.prenatal_leave_days }}天
            </template>
          </el-table-column>

          <el-table-column
            label="婚假天数"
            align="center"
            width="80"
            class-name="autotest-marriage_leave_days"
            prop="marriage_leave_days" >
            <template slot-scope="scope">
              {{ scope.row.marriage_leave_days }}天
            </template>
          </el-table-column>

          <el-table-column
            label="丧假天数"
            align="center"
            width="80"
            class-name="autotest-funeral_leave_days"
            prop="funeral_leave_days">
            <template slot-scope="scope">
              {{ scope.row.funeral_leave_days }}天
            </template>
          </el-table-column>

          <el-table-column
            label="出差天数"
            align="center"
            width="80"
            class-name="autotest-travel_days"
            prop="travel_days">
            <template slot-scope="scope">
              {{ scope.row.travel_days }}天
            </template>
          </el-table-column>

        </el-table>
      </template>
    </m-table>
  </div>
</template>

<script>
  /**
  * @description  考勤管理 - 考勤汇总表
  * @router /attendance/summary
  */
  import mixin from '~report/mixins'

  export default {
    mixins: [mixin.attendance],
    data() {
      const month = new Date()
      month.setDate(0)
      const monthStr = this.$utils.tools.formatDate(month, 'YYYY-MM')
      const validStart = (rule, value, callback) => {
        if (value && this.formData.end) {
          const start = new Date(`${value}-01`)
          const end = new Date(`${this.formData.end}-01`)
          if (start > end) {
            callback('开始月份不能大于结束月份')
          }
        }
        callback()
      }
      return {
        formData: {
          start: monthStr,
          end: monthStr,
          type: '1',
        },
        formRules: {
          start: [
            {
              required: true,
              message: '请选择开始日期',
              trigger: 'blur',
            },
            {
              validator: validStart,
              trigger: 'blur',
            },
          ],
          end: [{
            required: true,
            message: '请选择结束日期',
            trigger: 'blur',
          }],
        },
        pickerOptions: {
          disabledDate(time) {
            const m = new Date()
            m.setDate(0)
            return time.getTime() > m
          },
        },
        requestParams: {
          type: '1',
        },
        exportType: 'export_collect',
      }
    },
    methods: {
      fetch() {
        if (this.loading) return
        this.loading = true
        if (this.formData.type === '2') {
          this.keyword = ''
          this.keywordValues = ''
        }
        const submitParams = {
          start_month: this.formData.start.replace(/-/g, ''),
          end_month: this.formData.end.replace(/-/g, ''),
          org_id: this.orgId,
          type: this.formData.type,
          keywords: this.keywordValues,
        }
        this.$axios({
          url: this.$api.report.attendance.listSummary,
          method: 'post',
          data: submitParams,
        })
          .then((data) => {
            this.requestParams = Object.assign({}, submitParams)
            this.loading = false
            this.data = data.data.list
          }).catch(() => {
            this.loading = false
          })
      },

      changePageIndex(value) {
        this.pageIndex = value
      },

      organizationsReady(options) {
        this.orgId = options[0].id
        this.fetch()
      },
    },
  }
</script>
