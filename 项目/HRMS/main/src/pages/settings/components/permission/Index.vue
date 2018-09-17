<template>
  <section class="page permission-index">

    <m-breadcrumb :items="breadcrumb" />

    <!--操作行-->
    <div class="block-margin-bottom">
      <m-cascader
        placeholder="请选择组织机构"
        v-if="orgLevels.length"
        ref="cascader"
        :organization.sync="organization"
        :input-options="orgLevels"
        :width="240"
        @selectCompleted="selectCompleted" />

      <el-button
        icon="el-icon-download"
        @click.native="importHandler">导入
      </el-button>

      <el-button
        icon="el-icon-upload2"
        @click.native="exportHandler">导出
      </el-button>

      <el-checkbox
        v-model="radio">显示锁定用户</el-checkbox>

      <el-input
        class="search"
        placeholder="输入员工姓名或员工ID进行查询"
        v-model="keyword"
        @keyup.enter.native="handleFilter">
        <el-button
          icon="el-icon-search"
          slot="append"
          @click="handleFilter" />
      </el-input>
    </div>

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
          @cell-click="setTitle"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            align="center"
            class-name="checkbox autotest-checkbox"
            width="75" />

          <el-table-column
            prop="name"
            class-name="autotest-name"
            label="姓名"
            align="center"
            min-width="120" />

          <el-table-column
            prop="emp_code"
            class-name="autotest-empCode"
            label="员工ID"
            align="center"
            min-width="120" />

          <el-table-column
            prop="org_name"
            class-name="autotest-orgName"
            label="所属组织"
            align="center"
            min-width="120" />

          <el-table-column
            prop="job_name"
            class-name="autotest-jobName"
            label="职位名称"
            align="center"
            min-width="120" />

          <el-table-column
            prop="is_lock"
            class-name="autotest-isLock"
            label="用户状态"
            align="center"
            min-width="120" />

          <el-table-column
            label="已分配角色"
            class-name="tag role autotest-role"
            align="left"
            width="300">
            <template slot-scope="scope">
              <m-tag-multiple
                class="roleTag"
                v-if="scope.row.role_list.length > 0"
                :key="scope.row.id"
                :data="scope.row.role_list"
                @more="showMoreTags" />
            </template>
          </el-table-column>

          <el-table-column
            label="组织范围权限"
            class-name="tag autotest-tag"
            align="left"
            width="300">
            <template slot-scope="scope">
              <m-tag-multiple
                class="orgTag"
                v-if="scope.row.org_list.length > 0"
                :key="scope.row.id"
                :data="scope.row.org_list"
                @more="showMoreTags" />
            </template>
          </el-table-column>

          <el-table-column
            width="75"
            fixed="right"
            class-name="autotest-options"
            align="center"
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

    <!--Dialog-->
    <m-import
      :upload-excel-url="uploadExcelUrl"
      :template-download-url="templateDownloadUrl"
      :show-import.sync="showImport"
      @completed="importCompleted"
      @completedPart="importCompleted" />

    <!--浮层-->
    <m-tags-dialog
      :tags="tempTags"
      :title="title"
      :table-head="tableHead"
      :show-tags-dialog="showTagsDialog"
      @close="closeTagsDialog" />
  </section>
</template>

<script>
  export default {
    name: 'PermissionList',
    data() {
      const uploadExcelUrl = this.$api.settings.permissionUploadExcelUrl
      const templateDownloadUrl = this.$api.settings.permissionDownloadExcelUrl
      const { page, size, keyword, organization } = this.$route.query

      return {
        test: 'permissionList',
        breadcrumb: [
          { name: '基础配置' },
          { name: '权限管理', to: '/permission' },
        ],
        radio: false,
        uploadExcelUrl,
        templateDownloadUrl,
        keyword: keyword || '',
        cachedKeyword: keyword || '',
        orgLevels: [],
        organization: organization || '',
        staticOrganization: '',
        showImport: false,
        pagination: {
          pageSize: parseInt((size || 20), 10),
          currentPage: parseInt((page || 1), 10),
          total: 0,
        },
        tableHeight: 600,
        loading: false,
        currentList: [],
        tempTags: [],
        showTagsDialog: false,
        title: '',
        tableHead: [],
        multipleSelection: [],
        operating: false,
      }
    },
    watch: {
      radio() {
        this.fetchData()
      },
    },
    created() {
      this.getOrgLevels().then(() => {
        this.fetchData()
      })
    },
    methods: {
      // 获取组织架构
      // 此处没有采取组件内获取数据，外部获取数据填充
      getOrgLevels() {
        this.loading = true
        const url = this.$api.common.organizationLevel
        return this.$axios
          .post(url)
          .then((res) => {
            const { data } = res
            this.orgLevels = [data]
            this.organization = this.organization || data.id
            this.staticOrganization = data.id
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
      },
      // 接入数据
      fetchData(silent) {
        if (!silent) this.loading = true
        const url = this.$api.settings.permissionList

        this.$axios
          .post(url, {
            org_id: this.organization,
            is_lock: this.radio ? '1' : '0',
            keywords: this.$utils.tools.splitKeyword(this.keyword).join(','),
            per_page: this.pagination.pageSize,
            page: this.pagination.currentPage,
          })
          .then((res) => {
            const { list, page, count } = res.data
            this.loading = false
            this.currentList = list
            this.pagination.total = Number(count)
            this.pagination.currentPage = Number(page)
          })
          .catch(() => {
            this.loading = false
          })
      },
      showCurrentList() {
        this.currentList = this.totalList
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
      selectCompleted() {
        const { query } = this.$route

        this.$router.replace({
          query: Object.assign({}, query, { organization: this.organization, page: 1 }),
        })

        this.pagination.currentPage = 1
        this.fetchData()
      },
      importHandler() {
        this.showImport = true
      },
      exportHandler() {
        if (this.operating) return
        const ids = this.getIds()
        this.operating = true
        this.$axios
          .post(this.$api.settings.permissionExport, {
            ids: ids.join(','),
            org_id: this.organization,
            is_lock: this.radio ? '1' : '0',
            keywords: this.$utils.tools.splitKeyword(this.cachedKeyword).join(','),
            type: 'export',
          })
          .then((res) => {
            const { url } = res.data
            this.$utils.tools.windowOpen(url)
          })
          .catch(() => {})
          .then(() => {
            this.operating = false
          })
      },
      getIds() {
        return this.multipleSelection.map(item => item.id)
      },
      editHanlder(row) {
        this.dispatchIds()
        this.$router.push({
          name: 'PermissionEdit',
          params: {
            id: row.id,
          },
          query: {
            edit: true,
          },
        })
      },
      importCompleted() {
        this.keyword = ''
        this.organization = this.staticOrganization
        this.pagination.currentPage = 1
        this.fetchData(true)
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      changeCurrentPage(page) {
        this.pagination.currentPage = Number(page)
        this.fetchData()
      },
      changeSize(size) {
        this.pagination.pageSize = Number(size)
        this.pagination.currentPage = 1
        this.fetchData()
      },
      dbClickRow(row) {
        this.dispatchIds()
        this.$router.push({
          name: 'PermissionEdit',
          params: {
            id: row.id,
          },
        })
      },
      showMoreTags(tags) {
        this.showTagsDialog = true
        this.tempTags = [...tags]
      },
      closeTagsDialog() {
        this.showTagsDialog = false
      },
      setTitle(row, column) {
        const { label, className } = column
        this.title = label
        if (!className) return
        if (className.includes('role')) {
          this.tableHead = ['角色编码', '角色名称']
        } else {
          this.tableHead = ['组织编码', '组织名称']
        }
      },
      dispatchIds() {
        const ids = this.currentList.map(item => item.id)
        this.$store.dispatch('updatePermissionIds', { ids })
      },
    },
  }
</script>

<style lang="scss">
.permission-index {
  .block-margin-bottom {
    .el-button {
      vertical-align: top;
    }

    .m-org-select {
      margin-right: 10px;
    }

    .el-checkbox {
      margin-left: 10px;
    }
  }
}
</style>

