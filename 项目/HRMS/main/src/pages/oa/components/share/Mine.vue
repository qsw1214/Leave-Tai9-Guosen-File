<template>
  <section class="page page--mine">
    <m-breadcrumb :items="breadcrumb" />

    <tabs active-name="mine">
      <div slot="mine">
        <div class="block-margin-bottom">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click.native="$router.push('/share/mine/edit')">新建
          </el-button>
          <el-button
            icon="el-icon-delete"
            :loading="deleted"
            @click.native="doDel">删除
          </el-button>

          <el-input
            placeholder="请输入资料标题和年份进行搜索"
            class="search"
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
              @row-dblclick="doubleClickRow"
              @selection-change="doSelection">
              <el-table-column
                type="selection"
                width="50" />

              <el-table-column
                prop="title"
                width="150"
                align="center"
                label="资料标题" />

              <el-table-column
                prop="introduction"
                align="center"
                width="150"
                label="资料简介" />

              <el-table-column
                prop="type"
                width="120"
                align="center"
                label="资料类型" />

              <el-table-column
                prop="year"
                width="120"
                align="center"
                label="资料年份" />

              <el-table-column
                align="left"
                width="300"
                label="可查阅部门">
                <template slot-scope="scope">
                  <m-tag-multiple
                    class="roleTag"
                    v-if="scope.row.org_list.length > 0"
                    :key="scope.row.id"
                    :data="scope.row.org_list"
                    @more="showDepartmentTags" />
                </template>
              </el-table-column>

              <el-table-column
                align="left"
                width="390"
                label="可查阅用户">
                <template slot-scope="scope">
                  <m-tag-multiple
                    class="authUser"
                    v-if="scope.row.user_list.length > 0"
                    :key="scope.row.id"
                    :attrs="['name', {
                      key: 'emp_code',
                      all: true,
                      render: (item, attr) => { return `(${item[attr.key]})` }
                    }]"
                    :data="scope.row.user_list"
                    @more="showUserTags" />
                </template>
              </el-table-column>

              <el-table-column
                prop="update_time"
                align="center"
                width="160"
                label="最新更新时间" />

              <el-table-column
                width="75"
                align="center"
                fixed="right"
                label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    icon="el-icon-edit"
                    @click="doEdit(scope.row)" />
                </template>
              </el-table-column>
            </el-table>
          </template>
        </m-table>
      </div>
    </tabs>

    <!--组织-->
    <m-tags-dialog
      title="可查阅部门"
      :tags="tempOrgsData"
      :table-head="tableHead"
      :show-tags-dialog="showOrgsDialog"
      @close="closeTagsDialog" />

    <!--用户-->
    <m-tags-dialog
      title="可查阅用户"
      :tags="tempUserData"
      :table-head="tableUserHead"
      :table-column="tableColumn"
      :show-tags-dialog="showUserDialog"
      @close="closeTagsDialog" />

  </section>
</template>

<script>
  import mixin from '~oa/mixins'
  import Tabs from './Tabs'

  export default {
    name: 'Mine',

    components: { Tabs },

    mixins: [mixin.routerQuery],

    data() {
      return {
        breadcrumb: [
          { name: '企业OA' },
          { name: '知识仓库' },
        ],
        list: [],
        pagination: {
          total: 0,
        },
        loading: true,
        deleted: false,
        selections: [],
        showOrgsDialog: false,
        showUserDialog: false,
        tempOrgsData: [],
        tempUserData: [],
        tableHead: ['部门编码', '部门名称'],
        tableUserHead: ['员工ID', '员工姓名', '所在部门', '职位名称'],
        tableColumn: ['emp_code', 'name', 'org_name', 'job_name'],
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
          .get(this.$api.oa.mine.list, {
            params: {
              per_page: pageSize,
              page: currentPage,
              keywords: this.keyword,
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

      doDel() {
        const ids = this.selections.map(item => item.id).join(',')
        if (ids.length === 0) {
          this.$message.error('请先勾选需要删除的资料！')
          return
        }

        this.deleted = true
        const message = '确认删除选中数据?'
        this
          .$confirm(message, '提示', {
            type: 'warning',
          })
          .then(() => {
            this.$axios
              .post(this.$api.oa.mine.delete, { ids })
              .then(() => {
                this.$message({
                  showClose: false,
                  message: '删除成功！',
                  type: 'success',
                })
                this.fetch()
              })
              .catch(() => {})
              .then(() => {
                this.deleted = false
              })
          })
          .catch(() => {
            this.deleted = false
          })
      },

      doEdit(rows) {
        const { id } = rows
        this.$router.push({
          path: '/share/mine/edit',
          query: { id },
        })
      },

      doSelection(rows) {
        this.selections = rows
      },

      pageChange(page) {
        this.pagination.currentPage = page
        this.fetch()
      },

      sizeChange(size) {
        Object.assign(this.pagination, { pageSize: size, currentPage: 1 })
        this.fetch()
      },

      doubleClickRow(row) {
        this.dispatchIds()
        this.$router.push({
          name: 'shareMineDetails',
          params: {
            id: row.id,
          },
        })
      },

      dispatchIds() {
        const ids = this.list.map(item => item.id)
        this.$store.dispatch('saveMineIds', { ids })
      },

      showDepartmentTags(tags) {
        this.showOrgsDialog = true
        this.tempOrgsData = [...tags]
      },

      showUserTags(tags) {
        this.showUserDialog = true
        this.tempUserData = tags
      },

      closeTagsDialog() {
        this.showOrgsDialog = false
        this.showUserDialog = false
        this.tempUserData = []
        this.tempOrgsData = []
      },
    },
  }
</script>
