<template>
  <div class="page-books-list--all">
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
            label="操作"
            class-name="autotest-options"
            align="center"
            fixed="right"
            prop="operate"
            column-key="operate"
            width="75">
            <template slot-scope="scope">
              <el-button
                type="text"
                :disabled="scope.row.count <= 0"
                @click="clickBorrow(scope.row)">借阅</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </m-table>

    <el-dialog
      title="图书借阅"
      custom-class="dialog-borrow"
      :visible.sync="dialogVisible">
      <div v-loading="isSubmit">
        <el-form
          label-width="115px"
          class="form-create"
          ref="form"
          :model="formData"
          :rules="formRules">
          <el-form-item label="借阅人">
            {{ userInfo.name }} {{ userInfo.emp_code }}
          </el-form-item>
          <el-form-item label="图书名称">
            {{ bookInfo.name }}
          </el-form-item>
          <el-form-item
            label="借阅日期"
            prop="borrowing_date">
            <el-date-picker
              value-format="yyyy-MM-dd"
              :picker-options="datepickerOptions"
              v-model="formData.borrowing_date"
              @change="changeBorrowDate" />
          </el-form-item>
          <el-form-item
            label="预计归还日期"
            prop="return_date">
            <el-date-picker
              value-format="yyyy-MM-dd"
              :picker-options="datepickerOptions"
              v-model="formData.return_date" />
          </el-form-item>
          <el-form-item label="借阅状态">
            未归还
          </el-form-item>
          <el-form-item>
            <div class="dialog-borrow__btn">
              <el-button
                type="primary"
                @click="submitBorrow">提交</el-button>
              <el-button
                type="info"
                @click="cancalBorrow">取消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
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
  * @description 图书列表页面 - 图书清单
  * @router /books/list/all
  */
  import mixin from '~oa/mixins'

  export default {
    mixins: [mixin.books],
    data() {
      const compareDate = (rule, value, callback) => {
        if (this.formData.borrowing_date && value) {
          const data1 = Number(this.formData.borrowing_date.replace(/-/g, ''))
          const data2 = Number(value.replace(/-/g, ''))
          if (data2 < data1) {
            callback(new Error('不能小于借阅日期'))
          }
        }
        callback()
      }
      const today = this.$utils.tools.formatDate(new Date())
      return {
        userInfo: {},
        bookInfo: {},
        dialogVisible: false,
        formData: {
          book_code: '',
          book_id: '',
          borrowing_date: today,
          return_date: '',
        },
        isSubmit: false,
        formRules: {
          borrowing_date: [{
            required: true,
            trgger: 'blur',
            message: '请选择借阅日期',
          }],
          return_date: [
            {
              required: true,
              trgger: 'blur',
              message: '请选择预计归还日期',
            },
            {
              validator: compareDate,
              trigger: 'blur',
            },
          ],
        },
        datepickerOptions: {
          disabledDate(time) {
            return time.getTime() < (Date.now() - 8.64e7)
          },
        },
      }
    },
    created() {
      this.fetch()
      const userInfo = sessionStorage.getItem('USER_INFO')
      if (userInfo) {
        this.userInfo = JSON.parse(userInfo)
      }
    },
    methods: {
      fetch() {
        if (this.loading) return false
        this.loading = true
        return this.$axios({
          url: this.$api.oa.books.listAll,
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
      submitBorrow() {
        if (this.isSubmit) return
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.isSubmit = true
            const submitData = {
              book_code: this.bookInfo.code,
              book_id: this.bookInfo.id,
              borrowing_date: this.formData.borrowing_date,
              return_date: this.formData.return_date,
            }
            this.$axios({
              method: 'post',
              url: this.$api.oa.books.borrow,
              data: submitData,
            })
              .then((data) => {
                this.isSubmit = false
                if (data.code === 0) {
                  this.dialogVisible = false
                  this.$message({
                    message: '借阅成功，请及时联系图书管理员取书',
                    type: 'success',
                  })
                  this.fetch()
                }
              }).catch(() => {
                this.isSubmit = false
              })
          }
        })
      },
      changeBorrowDate() {
        if (this.formData.return_date) {
          this.$refs.form.validateField('return_date')
        }
      },
      clickBorrow(row) {
        this.bookInfo = row
        this.dialogVisible = true
      },
      cancalBorrow() {
        this.$refs.form.resetFields()
        this.dialogVisible = false
      },
    },
  }
</script>

<style lang="scss" type="text/scss">
.page-books-list--all {
  .dialog-borrow {
    min-width: 550px !important;
    width: 550px !important;

    &__btn {
      white-space: nowrap;
      padding-top: 8px;
      margin-bottom: -2px;
    }

    .el-form {
      margin-left: 40px;
      padding-top: 10px;
    }

    .el-form-item__content {
      width: 253px;
    }

    .el-input {
      width: 100%;
    }
  }
}
</style>

