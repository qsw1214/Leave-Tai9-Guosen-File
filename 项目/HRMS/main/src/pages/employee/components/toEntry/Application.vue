<template>
  <div class="page page--application-noEntry">
    <m-breadcrumb :items="breadcrumb" />

    <Tabs :tabs="tabs" />

    <div class="tabs-panel">
      <div class="block-margin-bottom">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click.native="$router.push('/to-entry/pa/200013')">流程发起
        </el-button>
        <el-button
          icon="el-icon-upload2"
          :loading="exporting"
          @click.native="doExport">导出
        </el-button>
        <el-button
          icon="el-icon-delete"
          :loading="deleted"
          @click.native="doDel">删除
        </el-button>

        <el-input
          class="search"
          placeholder="输入姓名或证件号码进行搜索"
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
            @selection-change="handleSelectionChange">

            <el-table-column
              type="selection"
              align="center"
              class-name="checkbox"
              width="75"
              :selectable="isSelected" />

            <el-table-column
              prop="flow_code"
              align="center"
              label="流程编码"
              width="120" />

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
              prop="rsdrzgl_org_name"
              align="center"
              label="拟入职部门"
              width="160" />

            <el-table-column
              prop="rsdrzgl_job_name"
              align="center"
              label="拟任职职位"
              width="100" />

            <el-table-column
              prop="rsdrzgl_nrz_date"
              align="center"
              label="拟入职日期"
              width="110" />

            <el-table-column
              prop="apply_time"
              align="center"
              label="申请日期"
              width="110" />

            <el-table-column
              prop="status_name"
              align="center"
              label="流程状态" />

            <el-table-column
              prop="approvaler_names"
              align="center"
              label="审批节点" />

            <el-table-column
              prop="approval_rz_status"
              align="center"
              label="入职状态" />

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
                    v-else-if="
                      (scope.row.status == 92 || scope.row.status == 94)
                        && (scope.row.applier_uid !== userId)
                    "
                    @click="linkTo(scope.row, false)">查看</el-button>
                  <el-button
                    type="text"
                    v-else-if="
                      (scope.row.status == 92 || scope.row.status == 94)
                        && (scope.row.applier_uid === userId)
                    "
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

    name: 'ToEntryApplicationList',

    components: { Tabs },
    mixins: [
      mixins.routerQuery,
      mixins.tabs.toEntry,
    ],

    data() {
      const user = JSON.parse(sessionStorage.getItem('USER_INFO'))

      return {
        breadcrumb: [
          { name: '员工管理' },
          { name: '待入职管理' },
        ],
        list: [],
        pagination: {
          total: 0,
        },
        loading: true,
        selections: [],
        code: 200013,
        exporting: false,
        deleted: false,
        userId: user.id,
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

      doDel() {
        const ids = this.getIds()
        if (ids.length === 0) {
          this.$message.error('请勾选需要删除的数据')
          return
        }
        this.$confirm('确认删除选中数据？', '提示', {
          type: 'warning',
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          showCancelButton: true,
        }).then(() => {
          const { keywords, code } = this
          if (this.deleted) return false
          this.deleted = true

          return this.$axios
            .post(this.$api.employee.flow.multi, {
              ids,
              type: 'delete',
              keywords,
              code,
            })
            .then(() => {
              this.fetch()
            })
            .catch(() => {})
            .then(() => {
              this.deleted = false
            })
        }).catch(() => {})
      },

      handleSelectionChange(rows) {
        this.selections = rows
      },

      getIds() {
        return this.selections.map(item => item.id)
      },

      linkTo(row, submit) {
        const { id, status } = row
        const { code } = this
        let path

        if (submit) {
          path = `/to-entry/pa/${code}/${id}`
        } else if (status === 91 || status === 93) {
          path = `/to-entry/application/${code}/${id}?status=${status}`
        } else {
          path = `/to-entry/application/${code}/${id}`
        }
        this.$router.push(path)
      },

      isSelected(data) {
        const status = Number(data.status)
        if (status === 0 || status === 92) {
          return true
        }
        return false
      },
    },
  }
</script>

<style lang="scss">
  @import '../../assets/scss/tabs-panel.scss';
</style>
