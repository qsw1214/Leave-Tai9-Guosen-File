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
      <el-button
        v-permission="1020001"
        icon="el-icon-upload2"
        @click.native="handleOption('exportZip')">职位说明书导出
      </el-button>

      <el-input
        class="search"
        placeholder="输入职位编码或名称进行查询"
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
          :data="props.data"
          :max-height="props.maxHeight"
          @row-dblclick="handleRowClick"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            align="center"
            class-name="checkbox autotest-checkbox"
            width="75" />

          <el-table-column
            prop="code"
            class-name="autotest-code"
            label="职位编码"
            align="center"
            min-width="120" />

          <el-table-column
            prop="name"
            class-name="autotest-name"
            label="职位名称"
            align="center"
            min-width="120" />

          <el-table-column
            prop="level"
            label="职等"
            class-name="autotest-level"
            align="center"
            min-width="120" />

          <el-table-column
            prop="pname"
            class-name="autotest-pname"
            label="上级职位"
            align="center"
            min-width="120" />

          <el-table-column
            prop="duty_name"
            label="职务"
            class-name="autotest-duty"
            align="center"
            min-width="120" />

          <el-table-column
            prop="duty_type_name"
            class-name="autotest-dutyTypeName"
            align="center"
            label="职务类别" />

          <el-table-column
            prop="duty_type_level_name"
            align="center"
            class-name="autotest-dutyTypeLevelName"
            label="职级" />

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

    <m-import
      :upload-excel-url="uploadExcelUrl"
      :template-download-url="templateDownloadUrl"
      :show-import.sync="showImport"
      @completed="handleCompleted"
      @completedPart="handleCompleted" />
  </div>
</template>

<script>
  export default {
    name: 'PositionList',
    data() {
      const templateDownloadUrl = this.$api.position.positionImportTemplate
      const uploadExcelUrl = this.$api.position.positionUploadExcelUrl
      const { page, size, keyword } = this.$route.query

      return {
        breadcrumb: [
          { name: '职位管理' },
          { name: '职位维护' },
        ],
        test: 'PositionList',
        // 是否loading
        loading: true,
        // 静默loading
        silent: false,
        // 搜索关键字
        keyword: keyword || '',
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
        this.$axios.post(this.$api.position.positionList)
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
            const str = keywordArr.join('|')
            const regStr = this.$utils.tools.convertRegStr(str)
            const reg = new RegExp(regStr)
            this.totalList.forEach((item) => {
              const searchStr = `${item.code} ${item.name}`
              if (reg.test(searchStr)) {
                filterData.push(item)
              }
            })
          } else {
            // 精准搜索
            this.totalList.forEach((item) => {
              if (keywordArr.includes(item.code) || keywordArr.includes(item.name)) {
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
        const getIds = () => {
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
          return ids
        }
        switch (option) {
        case 'add':
          this.$router.push({
            path: '/position/details',
          })
          break
        case 'edit':
          this.dispatchIds()
          this.$router.push({
            name: 'PositionDetails',
            params: {
              id: row.id,
            },
            query: {
              edit: true,
            },
          })
          break
        case 'import':
          this.showImport = true
          break
        case 'export': {
          const ids = getIds()
          this.handleExport(ids)
          break
        }
        case 'exportZip': {
          const ids = getIds()
          this.handleExport(ids, true)
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
            }).catch((e) => {
              console.dir(e)
            })
          } else {
            this.$message.error('请勾选需要删除的职位')
          }
          break
        }
        default:
        }
      },
      // 导出
      handleExport(ids, isZip) {
        if (this.operating) return
        this.operating = true
        this.$axios
          .post(this.$api.position.positionOption, {
            ids: ids.join(','),
            type: isZip ? 'export_zip' : 'export',
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
          .post(this.$api.position.positionOption, {
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
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      // 双击行
      handleRowClick(row) {
        this.$router.push({
          name: 'PositionDetails',
          params: {
            id: row.id,
          },
        })
        this.dispatchIds()
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
    },
  }
</script>
