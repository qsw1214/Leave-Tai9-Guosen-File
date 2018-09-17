<template>
  <div class="page-books-list--share">

    <!-- 操作 -->
    <div class="block-margin-bottom">
      <el-button
        v-permission="1070004"
        type="primary"
        icon="el-icon-plus"
        @click="clickCreate">新建
      </el-button>

      <el-button
        v-permission="1070004"
        icon="el-icon-download"
        @click="clickImport">导入
      </el-button>

      <el-button
        v-permission="1070004"
        icon="el-icon-upload2"
        @click="clickExport">导出
      </el-button>

      <el-button
        v-permission="1070004"
        icon="el-icon-delete"
        @click="clickDelete">删除
      </el-button>

      <el-input
        class="search"
        placeholder="输入图书名称或状态进行搜索"
        v-model="keyword"
        @keyup.enter.native="search">
        <el-button
          icon="el-icon-search"
          slot="append"
          @click="search" />
      </el-input>
    </div>

    <!-- 主要列表 -->
    <m-table
      v-loading="loading"
      is-full-table
      :data="data"
      :total="total"
      :current-page="pageIndex"
      @size-change="changePageSize"
      @current-change="changePageIndex">
      <template slot-scope="props">
        <el-table
          border
          stripe
          :max-height="props.maxHeight - 20"
          :data="props.data"
          @selection-change="selectionChange"
          @row-dblclick="toDetails">
          <el-table-column
            type="selection"
            column-key="select"
            align="center"
            class-name="checkbox autotest-checkbox"
            width="75" />

          <el-table-column
            label="图书编码"
            align="center"
            class-name="autotest-code"
            width="120"
            prop="code" />
          <el-table-column
            label="图书名称"
            align="center"
            class-name="autotest-name"
            min-width="120"
            prop="name" />

          <el-table-column
            label="图书简介"
            align="center"
            width="120"
            prop="name">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="showBorrowIntroduction(scope.row)">
                查看详情
              </el-button>
            </template>
          </el-table-column>

          <el-table-column
            label="推荐指数"
            align="center"
            width="150"
            class-name="autotest-recommendation_index"
            prop="recommendation_index" >
            <template slot-scope="scope">
              <el-rate
                disabled
                text-color="#ff9900"
                v-model="scope.row.recommendation_index" />
            </template>
          </el-table-column>

          <el-table-column
            label="总体库存"
            align="center"
            class-name="autotest-total"
            width="120"
            prop="total" />

          <el-table-column
            label="可借数量"
            align="center"
            class-name="autotest-count"
            width="120"
            prop="count" />

          <el-table-column
            label="图书状态"
            align="center"
            class-name="autotest-status_name"
            width="120"
            prop="status_name" />

          <el-table-column
            label="借阅信息"
            align="center"
            width="450"
            class-name="autotest-status_name"
            prop="status_name">
            <template slot-scope="scope">
              {{ getShowBorrowInfo(scope.row.body) }}
              <span
                class="el-icon-zoom-in"
                v-if="scope.row.body && scope.row.body.length > 1"
                @click="showBorrowList(scope.row.body)" />
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            fixed="right"
            width="75">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="toEdit(scope.row)">
                <i class="el-icon-edit" />
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </m-table>

    <!-- 上传弹层 -->
    <m-import
      :upload-excel-url="uploadUrl"
      :template-download-url="templateDownloadUrl"
      :show-import.sync="dialogImportVisible"
      @completed="uploadCompleted"
      @completedPart="uploadCompletedPart" />

    <!-- 借阅信息列表 -->
    <el-dialog
      title="借阅信息"
      :visible.sync="dialogBorrowVisible">

      <div class="block-margin-bottom">
        <el-input
          class="search"
          placeholder="输入借阅人或员工ID进行搜索"
          v-model="borrowKeyword"
          @keyup.enter.native="searchBorrow">
          <el-button
            icon="el-icon-search"
            slot="append"
            @click="searchBorrow" />
        </el-input>
      </div>

      <m-table
        :remote="false"
        :data="showBorrowListData"
        :total="showBorrowListData.length"
        :current-page="borrowPageIndex"
        @current-change="changeBorrowPageIndex">
        <template slot-scope="props">
          <el-table
            border
            stripe
            :data="props.data">
            <el-table-column
              label="借阅人"
              align="center"
              class-name="autotest-name"
              prop="name" />
            <el-table-column
              label="员工ID"
              align="center"
              class-name="autotest-emp_code"
              prop="emp_code" />
            <el-table-column
              label="借阅日期"
              align="center"
              class-name="autotest-borrowing_date"
              prop="borrowing_date" />
            <el-table-column
              label="预计归还日期"
              align="center"
              class-name="autotest-return_date"
              prop="return_date" />
            <el-table-column
              label="借阅状态"
              align="center"
              class-name="autotest-status_name"
              prop="status_name" />
            <el-table-column
              label="实际归还日期"
              align="center"
              class-name="autotest-actual_return_date"
              prop="actual_return_date" />
          </el-table>
        </template>
      </m-table>
    </el-dialog>

    <!-- 书籍简介 -->
    <el-dialog
      title="图书简介"
      width="400px"
      custom-class="dialog-borrow-desc"
      :visible.sync="dialogIntroductionVisible">
      {{ bookIntroduction }}
    </el-dialog>
  </div>
</template>

<script>
  /**
  * @description 图书列表页面 - 我的分享
  * @router /books/list/share
  */

  import mixin from '~oa/mixins'

  export default {
    mixins: [mixin.books],
    data() {
      const templateDownloadUrl = this.$api.oa.books.importDownloadTemplate
      const uploadUrl = this.$api.oa.books.shareImport
      return {
        borrowPageIndex: 1,
        selectedItems: [],
        dialogImportVisible: false,
        dialogBorrowVisible: false,
        borrowKeyword: '',
        listBorrowData: [],
        showBorrowListData: [],
        dialogDescValue: '',
        templateDownloadUrl,
        uploadUrl,
      }
    },
    created() {
      this.fetch()
    },
    methods: {
      // 拉取数据
      fetch() {
        if (this.loading) return false
        this.loading = true
        return this.$axios({
          url: this.$api.oa.books.listShare,
          method: 'post',
          data: {
            keywords: this.keywordValues,
            per_page: this.pageSize,
            page: this.pageIndex,
          },
        })
          .then((data) => {
            this.loading = false
            this.data = data.data.list
            this.$store.dispatch('updateBooksShareList', data.data.list)
            this.total = data.data.count
          }).catch(() => {
            this.loading = false
          })
      },
      // 列表勾选回调
      selectionChange(items) {
        this.selectedItems = items
      },
      // 发送勾选操作请求
      handleSelected(type, callback) {
        let ids = ''
        if (this.selectedItems.length > 0) {
          const idArr = this.selectedItems.map(item => item.id)
          ids = idArr.join(',')
        }
        this.$axios({
          url: this.$api.oa.books.listShareSelected,
          method: 'post',
          data: {
            ids,
            type,
            keywords: this.keywordValues,
          },
        })
          .then((data) => {
            console.log(data)
            if (callback) {
              callback(data)
            }
          }).catch(() => {
            callback(false)
          })
      },
      // 列表获取借阅信息显示文
      getShowBorrowInfo(borrowList) {
        if (!borrowList || borrowList.length === 0) return '暂无'
        const bInfo = borrowList[0]
        let endDate = bInfo.return_date
        if (bInfo.status.toString() === '1') {
          endDate = bInfo.actual_return_date
        }
        return `${bInfo.name} ${bInfo.emp_code}
          （${bInfo.borrowing_date} - ${endDate}）
          - ${bInfo.status_name}`
      },
      // 显示借阅信息弹层
      showBorrowList(borrowList) {
        this.borrowPageIndex = 1
        this.dialogBorrowVisible = true
        this.listBorrowData = borrowList
        this.showBorrowListData = borrowList
      },
      // 新建
      clickCreate() {
        this.$router.push({
          path: '/books/create',
        })
      },
      // 导出
      clickExport() {
        this.handleSelected('export', (data) => {
          this.$utils.tools.windowOpen(data.data.url)
        })
      },
      // 删除
      clickDelete() {
        if (this.selectedItems.length === 0) {
          this.$message({
            type: 'error',
            message: '请勾选需要删除的图书',
          })
          return false
        }

        const borrowLength = this.selectedItems.filter(i => i.body && i.body.length > 0)
        if (borrowLength.length) {
          this.$message({
            type: 'error',
            message: '勾选图书存在借阅记录，无法删除',
          })
          return false
        }

        this.$confirm('确认删除勾选图书吗？', '提示', {
          type: 'warning',
        })
          .then(() => {
            this.loading = true
            this.handleSelected('delete', (data) => {
              this.loading = false
              if (data) {
                this.pageIndex = 1
                this.fetch()
              }
            })
          })

        return true
      },
      // 点击导入
      clickImport() {
        this.dialogImportVisible = true
      },
      // 上传成功
      uploadCompleted() {
        this.$message({
          type: 'success',
          message: '文件数据已导入',
        })
        this.pageIndex = 1
        this.fetch()
      },
      // 导入部分数据
      uploadCompletedPart() {
        this.pageIndex = 1
        this.fetch()
      },
      // 借阅信息查找
      searchBorrow() {
        const keyword = this.borrowKeyword.trim()
        if (keyword) {
          this.showBorrowListData =
            this.$utils.tools.arraySearch(this.listBorrowData, ['name', 'emp_code'], keyword)
        } else {
          this.showBorrowListData = this.listBorrowData
        }
      },
      changeBorrowPageIndex() {
        this.borrowPageIndex = 1
      },
      // 跳转至编辑
      toEdit(row) {
        this.$router.push({
          path: `/books/create/${row.id}`,
        })
      },
      // 要转至详情
      toDetails(row) {
        this.$router.push({
          path: `/books/details/${row.id}`,
          query: {
            isEdit: '1',
          },
        })
      },
    },
  }
</script>

<style lang="scss" type="text/scss">
.page-books-list--share {
  .el-icon-zoom-in {
    cursor: pointer;
    vertical-align: middle;
    height: 24px;
    line-height: 24px;
    margin-bottom: 4px;
  }
}
</style>
