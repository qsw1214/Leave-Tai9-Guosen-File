<template>
  <el-dialog
    custom-class="tags--dialog"
    size="tiny"
    :title="title"
    :visible.sync="dialogVisible"
    :before-close="handleClose">

    <div class="block-margin-bottom">
      <el-input
        class="search"
        :placeholder="placeholder"
        v-model="keyword"
        @keyup.enter.native="handleFilter">
        <el-button
          icon="el-icon-search"
          slot="append"
          @click="handleFilter" />
      </el-input>
    </div>
    <m-table
      class="role-list-table"
      is-pagination
      :data="gridData"
      :total="pagination.total"
      :page-size="pagination.pageSize"
      :current-page="pagination.currentPage"
      :is-update-router="false"
      @current-change="changeCurrentPage"
      @size-change="changeSize">
      <template slot-scope="props">
        <el-table
          border
          stripe
          max-height="400"
          row-key="id"
          :data="props.data">
          <el-table-column
            align="center"
            v-for="(column, index) in tableColumn"
            :key="column"
            :property="column"
            :label="tableHead[index]" />
        </el-table>
      </template>
    </m-table>
  </el-dialog>
</template>

<script>
  export default {
    name: 'TagsDialog',
    props: {
      tags: {
        type: Array,
        required: true,
        default: () => ([]),
      },
      showTagsDialog: {
        type: Boolean,
        required: true,
        default: false,
      },
      title: {
        type: String,
        default: '',
      },
      tableHead: {
        type: Array,
        required: true,
        default: () => (['代码', '名称']),
      },
      tableColumn: {
        type: Array,
        default: () => (['code', 'name']),
      },
      placeholder: {
        type: String,
        default: '输入关键字进行查询',
      },
    },
    data() {
      return {
        pagination: {
          pageSize: 20,
          currentPage: 1,
          total: 0,
        },
        gridData: [],
        keyword: '',
        dialogVisible: false,
      }
    },
    watch: {
      showTagsDialog(val) {
        if (val) {
          this.init()
          this.getCurrentShowTags()
          this.dialogVisible = true
        } else {
          this.dialogVisible = false
        }
      },
    },
    methods: {
      init() {
        this.pagination.pageSize = 20
        this.pagination.currentPage = 1
        this.pagination.total = 0
        this.keyword = ''
      },
      changeSize(size) {
        this.pagination.pageSize = size
        this.pagination.currentPage = 1
        this.getCurrentShowTags()
      },
      changeCurrentPage(page) {
        this.pagination.currentPage = page
        this.getCurrentShowTags()
      },
      getCurrentShowTags() {
        const offset = Number(this.pagination.pageSize)
        const page = Number(this.pagination.currentPage)
        const begin = (page - 1) * offset
        const end = page * offset
        const filterList = this.getDataByFilters()
        this.pagination.total = filterList.length
        this.gridData = filterList.slice(begin, end)
      },
      getDataByFilters() {
        const keywordArr = this.$utils.tools.splitKeyword(this.keyword)
        const filterData = []
        const len = keywordArr.length
        if (len === 0) return this.tags
        if (len > 1) {
          // 精准搜索
          this.tags.forEach((item) => {
            this.tableColumn.some((key) => {
              if (keywordArr.includes(item[key])) {
                filterData.push(item)
                return true
              }
              return false
            })
          })
        } else {
          // 模糊匹配
          const str = keywordArr.join('|')
          const regStr = this.$utils.tools.convertRegStr(str)
          const reg = new RegExp(regStr)
          this.tags.forEach((item) => {
            let searchStr = ''
            this.tableColumn.forEach((key, keyIndex) => {
              searchStr += `${item[key]}`
              if (keyIndex < this.tableColumn.length - 1) searchStr += ' '
            })
            if (reg.test(searchStr)) {
              filterData.push(item)
            }
          })
        }
        return filterData
      },
      handleClose() {
        this.$emit('close')
      },
      handleFilter() {
        this.pagination.currentPage = 1
        this.getCurrentShowTags()
      },
    },
  }
</script>
