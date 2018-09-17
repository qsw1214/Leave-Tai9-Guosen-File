<template>
  <div class="page">

    <m-breadcrumb :items="breadcrumb" />
    <tabs :tabs="tabs" />

    <div class="tabs-panel">
      <div class="block-margin-bottom">
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
        :loading="loading"
        :total="pagination.total"
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
              label="所属部门" />

            <el-table-column
              prop="job_name"
              class-name="autotest-job_name"
              align="center"
              label="职位" />

            <el-table-column
              prop="mobile"
              class-name="autotest-mobile"
              align="center"
              label="手机号码" />

            <el-table-column
              prop="rszzgl_date"
              class-name="autotest-rszzgl_date"
              align="center"
              width="110"
              label="拟转正日期" />

            <el-table-column
              width="75"
              class-name="autotest-actions"
              align="center"
              fixed="right"
              label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="goApproving(scope.row)">审批</el-button>
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
    name: 'EmployeeBecomeRegularApproving',
    components: { Tabs },
    mixins: [mixins.routerQuery, mixins.tabs.becomeRegular],

    data() {
      return {
        breadcrumb: [
          { name: '员工管理' },
          { name: '转正管理' },
        ],
        loading: false,
        list: [],
      }
    },

    created() {
      this.fetch()
    },

    methods: {
      fetch() {
        this.loading = true
        const url = this.$api.employee.flow.approvingList
        const { currentPage, pageSize } = this.pagination

        this.$axios.get(url, {
          params: {
            code: 200017,
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

      goApproving({ id }) {
        this.$router.push(`approving/200017/${id}`)
      },
    },
  }
</script>

<style lang="scss">
  @import '../../assets/scss/tabs-panel.scss';
</style>
