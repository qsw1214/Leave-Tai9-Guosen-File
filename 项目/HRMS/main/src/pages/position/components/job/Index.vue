<template>
  <div
    class="page">

    <m-breadcrumb :items="breadcrumb" />

    <div class="block-margin-bottom">
      <el-button
        v-permission="1020001"
        type="primary"
        icon="el-icon-plus"
        @click.native="handleOption('add')">新建
      </el-button>
      <el-button
        v-permission="1020001"
        icon="el-icon-download"
        @click.native="handleOption('import')">导入
      </el-button>
      <el-button
        v-permission="1020001"
        icon="el-icon-upload2"
        @click.native="handleOption('export')">导出
      </el-button>
      <el-button
        v-permission="1020001"
        icon="el-icon-delete"
        @click.native="handleOption('del')">删除
      </el-button>

      <el-input
        class="search"
        placeholder="输入职务名称或类别进行查询"
        v-model="keyword"
        @keyup.enter.native= "handleFilter">
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
      :total="pagination.total"
      :page-sizes="pagination.pageSizes"
      :page-size="pagination.pageSize"
      :current-page="pagination.currentPage"
      @current-change="changePage"
      @size-change="changeSize">
      <template slot-scope="props">
        <el-table
          stripe
          border
          ref="multipleTable"
          :data="props.data"
          :max-height="props.maxHeight"
          @selection-change="handleSelectionChange">

          <el-table-column
            type="selection"
            align="center"
            class-name="checkbox autotest-checkbox"
            width="75" />

          <el-table-column
            prop="code"
            label="职务编码"
            align="center"
            class-name="autotest-code"
            min-width="120" />

          <el-table-column
            prop="name"
            class-name="autotest-name"
            label="职务名称"
            align="center"
            min-width="120" />

          <el-table-column
            prop="type"
            class-name="autotest-type"
            label="职务类别"
            align="center"
            min-width="120" />

          <el-table-column
            prop="level"
            class-name="autotest-level"
            label="职级"
            align="center"
            min-width="120" />

          <el-table-column
            width="75"
            class-name="autotest-options"
            fixed="right"
            align="center"
            label="操作"
            v-if="$permission.valid(1020001)">
            <template slot-scope="scope">
              <el-button
                type="text"
                icon="el-icon-edit"
                @click="handleOption('edit', scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      </template>
    </m-table>

    <edit
      ref="edit"
      @end="editEnd" />

    <m-import
      :upload-excel-url="uploadExcelUrl"
      :template-download-url="templateDownloadUrl"
      :show-import.sync="showImport"
      @completed="handleCompleted"
      @completedPart="handleCompleted" />
  </div>
</template>

<script>
  import Edit from './Edit'

  export default {
    name: 'PositionList',
    components: { Edit },
    data() {
      const templateDownloadUrl = this.$api.position.jobImportTemplate
      const uploadExcelUrl = this.$api.position.jobUploadExcelUrl
      const { page, size, keyword } = this.$route.query

      return {
        breadcrumb: [
          { name: '职位管理' },
          { name: '职务维护' },
        ],
        test: 'PositionList',
        // 是否loading
        loading: true,
        // 静默loading
        silent: false,
        // 搜索关键字
        keyword: keyword || '',
        // 缓存搜索后 keyword，供导出使用
        cachedKeyword: keyword || '',
        // 分页信息
        pagination: {
          pageSize: parseInt((size || 20), 10),
          currentPage: parseInt((page || 1), 10),
          total: 0,
        },
        totalList: [],
        currentList: [],
        multipleSelection: [],
        showImport: false,
        uploadExcelUrl,
        templateDownloadUrl,
        operating: false,
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      // 拉取列表数据
      fetchData() {
        if (!this.silent) this.loading = true
        this.$axios
          .post(this.$api.position.jobList)
          .then((res) => {
            this.silent = false
            this.loading = false
            const { list } = res.data
            this.totalList = list
            this.pagination.total = list.length
            this.showCurrentList()
          }).catch((error) => {
            this.silent = false
            this.loading = false
            console.dir(error)
          })
      },
      // 前端
      // 此页面前端分页
      showCurrentList() {
        const offset = Number(this.pagination.pageSize)
        const page = Number(this.pagination.currentPage)
        const begin = (page - 1) * offset
        const end = page * offset
        const filterList = this.getDataByFilters()
        this.pagination.total = filterList.length
        this.currentList = filterList.slice(begin, end)
      },
      // 过滤数据
      getDataByFilters() {
        const keywordArr = this.$utils.tools.splitKeyword(this.cachedKeyword)
        let filterData = []
        const { length } = keywordArr
        if (length !== 0) {
          if (length === 1) {
            // 模糊匹配
            const str = keywordArr.join('|')
            const regStr = this.$utils.tools.convertRegStr(str)
            const reg = new RegExp(regStr)
            this.totalList.forEach((item) => {
              const searchStr = `${item.name} ${item.type}`
              if (reg.test(searchStr)) {
                filterData.push(item)
              }
            })
          } else {
            // 精准搜索
            this.totalList.forEach((item) => {
              if (keywordArr.includes(item.name) || keywordArr.includes(item.type)) {
                filterData.push(item)
              }
            })
          }
        } else {
          filterData = this.totalList
        }
        return filterData
      },
      // 操作
      handleOption(option, row) {
        switch (option) {
        case 'add':
          this.$refs.edit.open()
          break
        case 'edit':
          this.$refs.edit.open(row)
          break
        case 'import':
          this.showImport = true
          break
        case 'export': {
          let ids = []
          // 未选择导出所有
          if (this.multipleSelection.length === 0) {
            const filterList = this.getDataByFilters()
            ids = filterList.map(item => item.id)
          } else {
            this.multipleSelection
              .sort((a, b) => (parseInt(a.code, 10) - parseInt(b.code, 10)))
            ids = this.multipleSelection.map(item => item.id)
          }
          this.handleExport(ids)
          break
        }
        case 'del': {
          const { length } = this.multipleSelection
          if (length !== 0) {
            const message = '确认删除选中数据?'
            this.$confirm(message, '提示', {
              type: 'warning',
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              showCancelButton: true,
            }).then(() => {
              this.handleDelete()
            }).catch(() => {})
          } else {
            this.$message.error('请勾选需要删除的职务')
          }
          break
        }
        default:
        }
      },
      // 导出
      handleExport(ids) {
        if (this.operating) return
        this.operating = true
        this.$axios
          .post(this.$api.position.jobOption, {
            ids: ids.join(','),
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
      // 删除操作
      handleDelete() {
        const ids = this.multipleSelection.map(item => item.id)
        this.loading = true
        return this.$axios
          .post(this.$api.position.jobOption, {
            ids: ids.join(','),
            type: 'delete',
          })
          .then(() => {
            this.$message({
              showClose: false,
              message: '删除成功！',
              type: 'success',
            })
            this.multipleSelection.forEach((item) => {
              const pos = this.totalList.indexOf(item)
              this.totalList.splice(pos, 1)
            })
            this.loading = false
            this.showCurrentList()
          })
          .catch(() => {
            this.loading = false
          })
      },
      // 过滤操作
      handleFilter() {
        const { query } = this.$route
        this.$router.replace({
          query: Object.assign({}, query, { page: 1, keyword: this.keyword.trim() }),
        })
        this.pagination.currentPage = 1
        this.cachedKeyword = this.keyword.trim()
        this.showCurrentList()
      },
      // 改变页码
      changePage(page) {
        this.pagination.currentPage = page
        this.showCurrentList()
      },
      // 改变size
      changeSize(number) {
        this.pagination.pageSize = number
        this.pagination.currentPage = 1
        this.showCurrentList()
      },
      // 多选操作
      handleSelectionChange(selection) {
        this.multipleSelection = selection
      },
      // 分发id
      dispatchIds() {
        const filterList = this.getDataByFilters()
        const ids = filterList.map(item => item.id)
        this.$store.dispatch('updateIds', { ids })
      },
      // 导入完成(部分)
      handleCompleted() {
        this.keyword = ''
        this.pagination.pageSize = 20
        this.pagination.currentPage = 1
        this.silent = true
        this.fetchData()
      },
      // 编辑完成
      editEnd(bool) {
        if (bool) this.fetchData()
      },
    },
  }
</script>
