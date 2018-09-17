<template>
  <div class="page-books-list--borrow">

    <!-- 操作 -->
    <div class="block-margin-bottom">
      <el-input
        class="search"
        placeholder="输入图书编码或名称进行搜索"
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
          :data="props.data">
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
            width="120"
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
            label="归属部门"
            align="center"
            width="150"
            class-name="autotest-org_name"
            prop="org_name" />

          <el-table-column
            label="借阅联系人"
            align="center"
            width="150"
            class-name="autotest-user_name"
            prop="user_name" />

          <el-table-column
            label="联系方式"
            align="center"
            width="150"
            class-name="autotest-mobile"
            prop="mobile" />


          <el-table-column
            label="借阅日期"
            align="center"
            width="120"
            class-name="autotest-borrowing_date"
            prop="borrowing_date" />

          <el-table-column
            label="预计归还日期"
            align="center"
            width="120"
            class-name="autotest-return_date"
            prop="return_date" />

          <el-table-column
            label="借阅状态"
            align="center"
            width="120"
            class-name="autotest-status_name"
            prop="status_name" />

          <el-table-column
            label="实际归还日期"
            align="center"
            width="120"
            class-name="autotest-actual_return_date"
            prop="actual_return_date" />
        </el-table>
      </template>
    </m-table>

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
  * @description 图书列表页面 - 我借阅的
  * @router /books/list/borrow
  */
  import mixin from '~oa/mixins'

  export default {
    mixins: [mixin.books],
    data() {
      return {
      }
    },
    created() {
      this.fetch()
    },
    methods: {
      fetch() {
        if (this.loading) return false
        this.loading = true
        return this.$axios({
          url: this.$api.oa.books.listBorrow,
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
            this.total = data.data.count
          }).catch(() => {
            this.loading = false
          })
      },
    },
  }
</script>

