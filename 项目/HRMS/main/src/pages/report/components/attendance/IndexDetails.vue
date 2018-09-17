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
          <el-col :span="12">
            <el-form-item
              prop="start"
              label="开始日期">
              <el-date-picker
                type="date"
                value-format="yyyy-MM-dd"
                placeholder=""
                v-model="formData.start"
                :picker-options="pickerOptions" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              prop="end"
              label="结束日期">
              <el-date-picker
                type="date"
                value-format="yyyy-MM-dd"
                placeholder=""
                v-model="formData.end"
                :picker-options="pickerOptions"
                @change="changeEnd" />
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
        remote="/common/get-org-level-by-auth"
        init-change
        :width="260"
        :organization.sync="orgId"
        :valid-date="today"
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
            label="打卡日期"
            align="center"
            width="150"
            class-name="autotest-date"
            prop="date" />

          <el-table-column
            label="上班时间"
            align="center"
            width="150"
            class-name="autotest-on_time"
            prop="on_time" />

          <el-table-column
            label="考勤状态"
            align="center"
            width="150"
            class-name="autotest-on_status_name"
            prop="on_status_name" />


          <el-table-column
            label="下班时间"
            align="center"
            width="120"
            class-name="autotest-off_time"
            prop="off_time" />

          <el-table-column
            label="考勤状态"
            align="center"
            width="120"
            class-name="autotest-off_status_name"
            prop="off_status_name" />

          <el-table-column
            label="打卡方式"
            align="center"
            width="120"
            class-name="autotest-sign_type_name"
            prop="sign_type_name" />

          <el-table-column
            label="打卡地点"
            align="center"
            width="120"
            class-name="autotest-sign_area_name"
            prop="sign_area_name" />

          <el-table-column
            label="是否存在修正"
            align="center"
            width="120"
            class-name="autotest-is_fixed_name"
            prop="is_fixed_name" />

          <el-table-column
            label="修正人"
            align="center"
            width="120"
            class-name="autotest-fixed_name"
            prop="fixed_name" />
        </el-table>
      </template>
    </m-table>
  </div>
</template>

<script>
  /**
  * @description  考勤管理 - 考勤明细表
  * @router /attendance/details
  */
  import mixin from '~report/mixins'

  export default {
    mixins: [mixin.attendance],
    data() {
      const validStart = (rule, value, callback) => {
        if (value && this.formData.end) {
          const start = new Date(value)
          const end = new Date(this.formData.end)
          if (start > end) {
            callback('开始日期不能大于结束日期')
          } else if (start.getMonth() !== end.getMonth()) {
            callback('开始和结束日期需同月份，不可跨月查询')
          }
        }
        callback()
      }
      const today = this.$utils.tools.formatDate(new Date(), 'YYYY-MM-DD')
      return {
        formData: {
          start: today,
          end: today,
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
            return time > new Date()
          },
        },
        requestParams: {},
        exportType: 'export_detail',
      }
    },
    methods: {
      fetch() {
        if (this.loading) return
        this.loading = true
        const submitParams = {
          start_date: this.formData.start,
          end_date: this.formData.end,
          org_id: this.orgId,
          keywords: this.keywordValues,
          per_page: this.pageSize,
          page: this.pageIndex,
        }
        this.requestParams = Object.assign({}, submitParams)
        this.$axios({
          url: this.$api.report.attendance.listDetails,
          method: 'post',
          data: submitParams,
        })
          .then((data) => {
            this.loading = false
            this.total = data.data.count
            this.data = data.data.list
          }).catch(() => {})
      },
      changeEnd() {
        this.$refs.form.validateField('start')
      },
      organizationsReady(options) {
        this.orgId = options[0].id
        this.fetch()
      },
    },
  }
</script>
