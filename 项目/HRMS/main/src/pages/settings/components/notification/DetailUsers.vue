<template>
  <m-section-row class="table">
    <div class="block-margin-bottom">
      <!-- <el-col :span="12">
        <m-cascader
          placeholder="请选择组织机构"
          :width="260"
          :inputOptions="tree.data"
          :organization.sync="users.organization"
          @selectCompleted="fetchUsers" />
      </el-col> -->

      <el-input
        class="search"
        placeholder="输入员工ID或姓名进行查询"
        v-model="keyword"
        @keyup.enter.native="search">
        <el-button
          icon="el-icon-search"
          slot="append"
          @click="search" />
      </el-input>
    </div>

    <m-table
      is-full-table
      :total="list.length"
      :current-page="pagination.currentPage"
      :page-size="pagination.pageSize"
      :remote="false"
      :data="list"
      @current-change="pageChange"
      @size-change="sizeChange">

      <template slot-scope="props">
        <el-table
          border
          ref="table"
          :max-height="props.maxHeight - 20"
          :data="props.data">

          <el-table-column
            prop="name"
            class-name="autotest-name"
            align="center"
            label="姓名" />

          <el-table-column
            prop="emp_code"
            class-name="autotest-emp_code"
            align="center"
            label="员工ID" />

          <el-table-column
            prop="org_name"
            class-name="autotest-job"
            align="center"
            label="所属组织" />

          <el-table-column
            prop="job_name"
            class-name="autotest-job"
            align="center"
            label="职位名称" />

        </el-table>
      </template>
    </m-table>
  </m-section-row>
</template>

<script>
  export default {
    name: 'NotificationUsers',

    props: {
      users: {
        type: Array,
        required: true,
      },
    },

    data() {
      return {
        pagination: {
          currentPage: 1,
          pageSize: 20,
          total: 0,
        },

        keyword: '',
        list: this.users,
      }
    },

    methods: {
      pageChange(page) {
        this.pagination.currentPage = page
      },

      sizeChange(size) {
        Object.assign(this.pagination, {
          currentPage: 1,
          pageSize: size,
        })
      },

      search() {
        this.pagination.currentPage = 1
        this.list = this.$utils.tools.arraySearch(this.users, ['name', 'emp_code'], this.keyword)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .table {
    margin-right: 15px;
  }
</style>

