<template>
  <div class="page page--approving-noEntry">

    <m-breadcrumb :items="breadcrumb" />

    <Tabs :tabs="tabs" />

    <div class="tabs-panel">
      <div class="block-margin-bottom">
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
            :data="list">
            <el-table-column
              prop="flow_code"
              align="center"
              label="流程编码" />

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
              label="拟入职部门" />

            <el-table-column
              prop="rsdrzgl_job_name"
              align="center"
              label="拟任职职位" />

            <el-table-column
              prop="rsdrzgl_nrz_date"
              align="center"
              label="拟入职日期" />

            <el-table-column
              prop="apply_time"
              align="center"
              label="申请日期" />

            <el-table-column
              width="75"
              align="center"
              fixed="right"
              label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="goApproved(scope.row)">审批</el-button>
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

    name: 'ToEntryApplication',

    components: { Tabs },
    mixins: [
      mixins.routerQuery,
      mixins.tabs.toEntry,
    ],

    data() {
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
        code: 200013,
      }
    },

    created() {
      this.fetch()
    },

    methods: {
      fetch() {
        const { pageSize, currentPage } = this.pagination

        this.loading = true
        this.$axios
          .get(this.$api.employee.flow.approvingList, {
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

      goApproved(row) {
        const { id } = row
        this.$router.push({ path: `/to-entry/approving/${this.code}/${id}` })
      },
    },
  }
</script>

<style lang="scss">
  @import '../../assets/scss/tabs-panel.scss';
</style>
