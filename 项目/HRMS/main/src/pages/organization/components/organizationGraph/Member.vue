<template>
  <div
    class="member">
    <div>
      <div class="panel--title">
        <div class="option block-margin-bottom">
          <el-input
            class="search"
            placeholder="输入员工ID、姓名查询"
            style="width: 240px;"
            v-model="keyword"
            @keyup.enter.native="handleFilter">
            <el-button
              icon="el-icon-search"
              slot="append"
              @click="handleFilter" />
          </el-input>
        </div>
      </div>
      <div class="panel--body">
        <m-table
          is-pagination
          :data="memberList"
          :total="pagination.total"
          :page-sizes="pagination.pageSizes"
          :loading="loadingMember"
          :is-update-router="false"
          @current-change="changePage"
          @size-change="changeSize">
          <template slot-scope="props">
            <el-table
              max-height="400"
              border
              :data="props.data">
              <el-table-column
                label="员工ID"
                prop="emp_code"
                align="center"
                min-width="120" />
              <el-table-column
                label="姓名"
                prop="name"
                align="center"
                min-width="120" />
              <el-table-column
                label="职位"
                prop="job_name"
                align="center"
                min-width="120" />
              <el-table-column
                label="入职时间"
                prop="enter_date"
                align="center"
                min-width="120" />
              <el-table-column
                label="手机号码"
                prop="mobile"
                align="center"
                min-width="120" />
              <el-table-column
                label="员工短号"
                prop="mobile_short"
                align="center"
                min-width="120" />
              <el-table-column
                align="center"
                label="员工状态">
                <template slot-scope="scope">
                  {{ scope.row.status | status }}
                </template>
              </el-table-column>
            </el-table>
          </template>
        </m-table>
      </div>
    </div>
  </div>
</template>

<script>
  /**
   * A Member component for organization.
   * Created on 2017/8/28
   * @module components/organization/member
   * @param {Array} memberList - Required, 组织成员
   * @param {String} keyword - Required, 关键词
   * @author Yangleilei
   */

  export default {
    name: 'Member',
    filters: {
      status(val) {
        return { 1: '未转正', 4: '转正', 8: '待离职', 16: '已离职' }[val]
      },
    },
    props: {
      organizationId: {
        type: String || Number,
        default: '',
      },
    },
    data() {
      return {
        keyword: '',
        memberList: [],
        loadingMember: false,
        pagination: {
          pageSize: 20,
          pageSizes: [20, 50, 100],
          currentPage: 1,
          total: 0,
        },
      }
    },
    watch: {
      organizationId() {
        this.keyword = ''
        this.pagination.currentPage = 1
        this.getMembers()
      },
    },
    created() {
      this.getMembers()
    },
    methods: {
      // 获取人员列表
      getMembers() {
        this.loadingMember = true
        this.$axios.post(this.$api.common.employee, {
          org_id: this.organizationId,
          per_page: this.pagination.pageSize,
          page: this.pagination.currentPage,
          keywords: this.$utils.tools.splitKeyword(this.keyword).join(','),
        })
          .then((res) => {
            const { list, count } = res.data
            this.memberList = list
            this.pagination.total = count
            this.loadingMember = false
          })
          .catch((error) => {
            this.loadingMember = false
            console.dir(error)
          })
      },
      // 过滤操作
      handleFilter() {
        this.pagination.currentPage = 1
        this.$nextTick(() => {
          this.getMembers()
        })
      },
      // 更改当前页
      changePage(page) {
        this.pagination.currentPage = page
        this.getMembers()
      },
      // 更改当前页码大小
      changeSize(size) {
        this.pagination.pageSize = size
        this.pagination.currentPage = 1
        this.getMembers()
      },
    },
  }
</script>
