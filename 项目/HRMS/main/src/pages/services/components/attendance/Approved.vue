<template>
  <div class="page page--attendance__approved">

    <m-breadcrumb :items="breadcrumb" />

    <Tabs :tabs="tabs" />

    <div class="tabs-panel">
      <div class="block-margin-bottom">
        <el-input
          class="search"
          placeholder="输入流程名称或申请人姓名、员工ID搜索"
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
              prop="flow_config_type_name"
              align="center"
              label="流程类型" />

            <el-table-column
              prop="name"
              align="center"
              label="流程名称" />

            <el-table-column
              prop="applier_name"
              align="center"
              label="申请人" />

            <el-table-column
              prop="applier_emp_code"
              align="center"
              label="员工 ID" />

            <el-table-column
              prop="applier_org_name"
              align="center"
              label="部门" />

            <el-table-column
              prop="applier_job_name"
              align="center"
              label="职位" />

            <el-table-column
              prop="apply_date"
              align="center"
              label="申请日期" />

            <el-table-column
              prop="approval_date"
              align="center"
              label="审批日期" />

            <el-table-column
              prop="approval_subject"
              align="center"
              label="审批意见" />

            <el-table-column
              prop="code"
              align="center"
              label="流程编码" />

            <el-table-column
              width="75"
              align="center"
              fixed="right"
              label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="goApproved(scope.row)">查看</el-button>
              </template>
            </el-table-column>

          </el-table>
        </template>
      </m-table>
    </div>
  </div>
</template>

<script>
  import mixin from '~services/mixin'
  import Tabs from '@/components/tabs'
  import flowMap from '@/components/flowMap'

  export default {
    name: 'AttendanceApprovedList',

    components: {
      Tabs,
    },

    mixins: [mixin.tabs.attendance, mixin.routerQuery],

    data() {
      return {
        breadcrumb: this.$breadcrumb(null, 'attendance'),
        list: [],
        pagination: {
          total: 0,
        },
        loading: false,
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
          .get(this.$api.services.approved.list, {
            params: {
              type: 4,
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

      goApproved(data) {
        const { id, flow_config_code, approval_id } = data
        let path = `/attendance/approved/${flowMap[flow_config_code]}/${flow_config_code}/${id}`
        path += `?approval_id=${approval_id}`

        this.$router.push({ path })
      },
    },
  }
</script>

<style lang="scss">
  @import '../../assets/scss/tabs-panel.scss';
</style>
