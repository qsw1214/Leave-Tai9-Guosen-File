<template>
  <div class="page page--application-entry">
    <m-breadcrumb :items="breadcrumb" />

    <Tabs :tabs="tabs" />

    <div class="panel">
      <div class="block-margin-bottom">
        <el-button
          icon="el-icon-upload2"
          :loading="exporting"
          @click.native="doExport">导出
        </el-button>

        <el-input
          class="search"
          placeholder="请输入姓名或证件号码进行搜索"
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
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        :loading="loading"
        :data="list"
        @current-change="pageChange"
        @size-change="sizeChange">

        <template slot-scope="props">
          <el-table
            border
            :max-height="props.maxHeight - 20"
            :data="list"
            @selection-change="handleSelectionChange">

            <el-table-column
              type="selection"
              align="center"
              class-name="checkbox autotest-checkbox"
              width="75" />

            <el-table-column
              prop="flow_code"
              align="center"
              width="120"
              label="流程编码" />

            <el-table-column
              prop="code"
              align="center"
              label="系统编码" />

            <el-table-column
              prop="name"
              align="center"
              label="姓名" />

            <el-table-column
              prop="credential_type_name"
              align="center"
              label="证照类型" />

            <el-table-column
              prop="credential_num"
              align="center"
              label="证件号码" />

            <el-table-column
              prop="rsrzgl_org_name"
              align="center"
              label="入职部门" />

            <el-table-column
              prop="rsrzgl_job_name"
              align="center"
              label="任职职位" />

            <el-table-column
              prop="rsrzgl_rz_date"
              align="center"
              label="入职日期" />

            <el-table-column
              prop="status_name"
              align="center"
              label="流程状态" />

            <el-table-column
              prop="approvaler_names"
              align="center"
              label="审批节点" />

            <el-table-column
              width="120"
              align="center"
              fixed="right"
              label="操作">
              <template slot-scope="scope">
                <!--0-未提交、30-审批中、90-审批通过、91-待确认、92-提交失败、93-作废、94-已退回、99-已完成-->
                <div class="options">
                  <el-button
                    type="text"
                    v-if="scope.row.status == 30 || scope.row.status == 90"
                    @click="linkTo(scope.row)">查看</el-button>
                  <el-button
                    type="text"
                    v-else-if="(scope.row.status == 92 || scope.row.status == 94)"
                    @click="linkTo(scope.row, true)">重新提交</el-button>
                  <el-button
                    type="text"
                    v-else-if="scope.row.status == 0"
                    @click="linkTo(scope.row, true)">提交</el-button>
                  <el-button
                    type="text"
                    v-else-if="scope.row.status == 91"
                    @click="linkTo(scope.row)">确认</el-button>
                  <el-button
                    type="text"
                    v-else-if="scope.row.status == 93"
                    @click="linkTo(scope.row)">详情</el-button>
                </div>
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
  import Tabs from '~employee/components/common/Tabs'

  export default {

    name: 'ApprovedIndex',

    components: { Tabs },
    mixins: [
      mixins.routerQuery,
      mixins.tabs.entry,
    ],

    data() {
      return {
        breadcrumb: [
          { name: '员工管理' },
          { name: '入职管理' },
        ],
        list: [],
        selections: [],
        pagination: {
          total: 0,
        },
        loading: true,
        code: 200014,
        exporting: false,
      }
    },

    created() {
      this.fetch()
    },

    methods: {
      fetch() {
        const { pageSize, currentPage } = this.pagination
        this.loading = true
        const url = this.$api.employee.flow.list
        this.$axios
          .get(url, {
            params: {
              code: this.code,
              per_page: pageSize,
              page: currentPage,
              keywords: this.keywords,
            },
          })
          .then((res) => {
            const { list, count } = res.data

            this.pagination.total = count
            this.list = list
          })
          .catch(() => {})
          .then(() => {
            this.loading = false
          })
      },

      pageChange(page) {
        this.pagination.currentPage = page
        this.fetch()
      },

      sizeChange(size) {
        Object.assign(this.pagination, { pageSize: size, currentPage: 1 })
        this.fetch()
      },

      handleSelectionChange(rows) {
        this.selections = rows
      },

      doExport() {
        const { keywords, code } = this
        if (this.exporting) return false
        this.exporting = true

        return this.$axios
          .post(this.$api.employee.flow.multi, {
            ids: this.getIds(),
            type: 'export_rldz_by_pro',
            keywords,
            code,
          })
          .then(({ data }) => {
            this.$utils.tools.windowOpen(data.url)
          })
          .catch(() => {})
          .then(() => {
            this.exporting = false
          })
      },

      getIds() {
        return this.selections.map(item => item.id)
      },

      linkTo(row) {
        const { id, status } = row
        const { code } = this
        const path = `/entry/application/${code}/${id}?status=${status}`
        this.$router.push(path)
      },
    },
  }
</script>

<style scoped>
  .panel {
    background: #fff;
    padding: 15px;
    border: 1px solid #e9e9e9;
    border-top: none;
  }
</style>
