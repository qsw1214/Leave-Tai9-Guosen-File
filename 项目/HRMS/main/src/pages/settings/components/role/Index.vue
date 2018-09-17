<template>
  <section class="page">

    <m-breadcrumb :items="breadcrumb" />

    <!--操作行-->
    <div class="nav block-margin-bottom">
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click.native="addHandler">新建
      </el-button>
      <el-button
        icon="el-icon-upload2"
        @click.native="exportHandler">导出
      </el-button>
      <el-button
        icon="el-icon-delete"
        @click.native="delHandler">删除
      </el-button>

      <el-input
        class="search"
        placeholder="输入角色名称进行查询"
        v-model="keyword"
        @keyup.enter.native="handleFilter">
        <el-button
          icon="el-icon-search"
          slot="append"
          @click="handleFilter" />
      </el-input>
    </div>

    <!--表格-->
    <m-table
      is-pagination
      is-full-table
      :loading="loading"
      :data="currentList"
      v-bind="pagination"
      @current-change="changeCurrentPage"
      @size-change="changeSize">
      <template slot-scope="props">
        <el-table
          border
          stripe
          :data="currentList"
          :max-height="props.maxHeight"
          @row-dblclick="dbClickRow"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            align="center"
            class-name="checkbox autotest-checkbox"
            width="75" />

          <el-table-column
            prop="code"
            label="角色编码"
            class-name="autotest-code"
            align="center"
            min-width="120" />

          <el-table-column
            prop="name"
            class-name="autotest-name"
            label="角色名称"
            align="center"
            min-width="120" />

          <el-table-column
            prop="remark"
            class-name="autotest-remark"
            label="备注"
            align="center"
            min-width="120" />

          <el-table-column
            label="已授权用户"
            align="left"
            class-name="tag autotest-tag"
            width="390">
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
                @more="showMoreTags" />
            </template>
          </el-table-column>

          <el-table-column
            width="75"
            fixed="right"
            align="center"
            class-name="autotest-options"
            label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                icon="el-icon-edit"
                @click="editHanlder(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      </template>
    </m-table>

    <!--浮层-->
    <m-tags-dialog
      title="已授权用户"
      :tags="tempTags"
      :table-head="['员工ID', '员工姓名']"
      :show-tags-dialog="showTagsDialog"
      @close="closeTagsDialog" />
  </section>
</template>

<script>
  export default {
    name: 'RoleList',
    data() {
      const { page, size, keyword } = this.$route.query

      return {
        showImport: false,
        breadcrumb: [
          { name: '基础配置' },
          { name: '角色管理', to: '/role' },
        ],
        currentList: [],
        keyword: keyword || '',
        cachedKeyword: keyword || '',
        pagination: {
          pageSize: parseInt((size || 20), 10),
          currentPage: parseInt((page || 1), 10),
          total: 0,
        },
        showTagsDialog: false,
        tempTags: [],
        multipleSelection: [],
        loading: false,
        operating: false,
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData(silent) {
        if (!silent) this.loading = true
        const url = this.$api.settings.roleList
        this.$axios.post(url, {
          keywords: this.$utils.tools
            .splitKeyword(this.keyword).join(','),
          per_page: this.pagination.pageSize,
          page: this.pagination.currentPage,
        })
          .then((res) => {
            const { list, count, page } = res.data
            this.loading = false
            this.currentList = list
            this.pagination.total = Number(count)
            this.pagination.currentPage = Number(page)
          })
          .catch(() => {
            this.loading = false
          })
      },
      addHandler() {
        this.$router.push({
          name: 'RoleCreate',
        })
      },
      delHandler() {
        const ids = this.getChooseIds()
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
          this.multiOptions('delete', ids)
        }).catch((e) => {
          console.dir(e)
        })
      },
      exportHandler() {
        const ids = this.getChooseIds()
        this.multiOptions('export', ids)
      },
      multiOptions(type, ids) {
        if (this.operating) return
        if (type === 'export') this.operating = true
        const url = '/role/multi'
        this.$axios
          .post(url, {
            keywords: this.$utils.tools
              .splitKeyword(this.cachedKeyword).join(','),
            ids: ids.join(','),
            type,
          })
          .then((res) => {
            if (type === 'delete') {
              this.$message({
                showClose: false,
                message: '删除成功！',
                type: 'success',
              })
              this.fetchData(true)
            } else {
              const { url: downloadUrl } = res.data
              this.$utils.tools.windowOpen(downloadUrl)
            }
          })
          .catch(() => {})
          .then(() => {
            if (type === 'export') this.operating = false
          })
      },
      getChooseIds() {
        return this.multipleSelection.map(item => item.id)
      },
      handleFilter() {
        const { query } = this.$route

        this.$router.replace({
          query: Object.assign({}, query, { page: 1, keyword: this.keyword.trim() }),
        })
        this.cachedKeyword = this.keyword.trim()
        this.pagination.currentPage = 1
        this.fetchData()
      },
      dbClickRow(row) {
        this.dispatchIds()
        this.$router.push({
          name: 'RoleEdit',
          params: {
            id: row.id,
          },
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      changeSize(size) {
        this.pagination.pageSize = size
        this.pagination.currentPage = 1
        this.fetchData()
      },
      changeCurrentPage(page) {
        this.pagination.currentPage = page
        this.fetchData()
      },
      showMoreTags(tags) {
        this.showTagsDialog = true
        this.tempTags = tags
          .map(item => ({ name: item.name, code: item.emp_code }))
      },
      closeTagsDialog() {
        this.showTagsDialog = false
      },
      dispatchIds() {
        const ids = this.currentList.map(item => item.id)
        this.$store.dispatch('updateRoleIds', { ids })
      },
      editHanlder(row) {
        this.dispatchIds()
        this.$router.push({
          name: 'RoleEdit',
          params: {
            id: row.id,
          },
          query: {
            edit: true,
          },
        })
      },
    },
  }
</script>
