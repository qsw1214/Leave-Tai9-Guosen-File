<template>
  <div class="page">

    <m-breadcrumb :items="breadcrumb" />
    <tabs :tabs="tabs" />

    <div class="tabs-panel">
      <div class="block-margin-bottom">
        <el-button
          icon="el-icon-upload2"
          :loading="exporting"
          @click="doExport">导出</el-button>

        <el-input
          class="search"
          placeholder="输入姓名或员工ID进行搜索"
          v-model="keyword"
          @keyup.enter.native="doSearch">
          <el-button
            icon="el-icon-search"
            slot="append"
            @click="doSearch" />
        </el-input>
      </div>

      <m-table
        is-full-table
        :total="pagination.total"
        :loading="loading"
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        :data="list"
        @current-change="pageChange"
        @size-change="sizeChange">

        <template slot-scope="props">
          <el-table
            border
            :max-height="props.maxHeight - 20"
            :data="list"
            @selection-change="selectionChange">

            <el-table-column
              type="selection"
              align="center"
              class-name="checkbox autotest-checkbox"
              width="75" />

            <el-table-column
              prop="flow_code"
              class-name="autotest-flow_code"
              align="center"
              width="120"
              label="流程编码" />

            <el-table-column
              prop="emp_code"
              class-name="autotest-emp_code"
              align="center"
              label="员工 ID" />

            <el-table-column
              prop="name"
              class-name="autotest-name"
              align="center"
              label="姓名" />

            <el-table-column
              prop="org_name"
              class-name="autotest-org_name"
              align="center"
              width="160"
              label="所属部门" />

            <el-table-column
              prop="job_name"
              class-name="autotest-job_name"
              align="center"
              width="100"
              label="职位" />

            <el-table-column
              prop="mobile"
              class-name="autotest-mobile"
              align="center"
              width="110"
              label="手机号码" />

            <el-table-column
              prop="apply_time"
              class-name="autotest-apply_time"
              align="center"
              width="110"
              label="申请日期" />

            <el-table-column
              prop="rslzgl_work_end_date"
              class-name="autotest-rslzgl_work_end_date"
              align="center"
              width="140"
              label="计划最后工作日" />

            <el-table-column
              prop="status_name"
              class-name="autotest-status_name"
              align="center"
              label="流程状态" />

            <el-table-column
              prop="approvaler_names"
              class-name="autotest-approvaler_names"
              align="center"
              label="审批节点" />

            <el-table-column
              prop="approval_quit_status_name"
              class-name="autotest-approval_quit_status_name"
              align="center"
              label="离职状态" />

            <el-table-column
              prop="approval_last_date"
              class-name="autotest-approval_last_date"
              align="center"
              width="110"
              label="离职日期" />

            <el-table-column
              width="75"
              class-name="autotest-actions"
              align="center"
              fixed="right"
              label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="goApplication(scope.row)">查看</el-button>
              </template>
            </el-table-column>

          </el-table>
        </template>
      </m-table>
    </div>

  </div>
</template>

<script>
  import mixins from '~employee/mixins'
  import Tabs from '../common/Tabs'

  export default {
    name: 'EmployeeLeaveApplication',
    components: { Tabs },
    mixins: [mixins.routerQuery, mixins.tabs.leave],

    data() {
      return {
        breadcrumb: [
          { name: '员工管理' },
          { name: '离职管理' },
        ],
        loading: false,
        list: [],
        selection: [],
        exporting: false,
      }
    },

    created() {
      this.fetch()
    },

    methods: {
      fetch() {
        this.loading = true
        const url = this.$api.employee.flow.list
        const { currentPage, pageSize } = this.pagination

        this.$axios.get(url, {
          params: {
            code: 200015,
            per_page: pageSize,
            page: currentPage,
            keywords: this.keywords,
          },
        }).then((res) => {
          this.loading = false
          const { list, count } = res.data
          this.list = list
          this.pagination.total = Number(count)
        })
      },

      pageChange(page) {
        this.pagination.currentPage = page
        this.fetch()
      },

      sizeChange(size) {
        Object.assign(this.pagination, {
          currentPage: 1,
          pageSize: size,
        })
        this.fetch()
      },

      selectionChange(selection) {
        this.selection = selection
      },

      goApplication({ id }) {
        this.$router.push(`application/200015/${id}`)
      },

      doExport() {
        const { keywords, selection } = this
        if (this.exporting) return false
        this.exporting = true
        return this.$axios
          .post(this.$api.employee.flow.multi, {
            ids: selection.map(it => it.id).join(','),
            type: 'export_rldz_by_pro',
            keywords,
            code: '200015',
          })
          .then(({ data }) => {
            this.$utils.tools.windowOpen(data.url)
          })
          .catch(() => {})
          .then(() => {
            this.exporting = false
          })
      },
    },
  }
</script>

<style lang="scss">
  @import '../../assets/scss/tabs-panel.scss';
</style>
