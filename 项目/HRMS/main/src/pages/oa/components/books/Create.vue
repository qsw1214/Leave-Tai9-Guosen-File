<template>
  <div
    v-loading="preloading"
    class="page page-book-create">
    <m-breadcrumb :items="breadcrumb" />
    <m-section
      title="图书信息"
      is-form>
      <m-section-row>
        <m-section-cell
          title="图书编码"
          :content="infoData.code || '由系统自动生成'" />
      </m-section-row>

      <el-form
        class="m-section--form"
        label-width="140px"
        ref="form"
        :model="formData"
        :rules="formRules">
        <m-section-row>
          <el-form-item
            label="图书名称"
            prop="name">
            <el-input v-model="formData.name" />
          </el-form-item>
          <el-form-item
            label="图书状态"
            prop="status">
            <el-select v-model="formData.status">
              <el-option
                value="1"
                label="上架" />
              <el-option
                value="2"
                label="下架" />
            </el-select>
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="总体库存"
            prop="total">
            <el-input v-model="formData.total" />
          </el-form-item>
          <el-form-item
            label="计量单位"
            prop="unit">
            <el-select v-model="formData.unit">
              <el-option
                value="1"
                label="本" />
              <el-option
                value="2"
                label="册" />
              <el-option
                value="4"
                label="卷" />
              <el-option
                value="8"
                label="套" />
            </el-select>
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item label="可借数量">
            {{ infoData.count || '由系统自动带出' }}
          </el-form-item>
          <el-form-item
            label="推荐指数"
            prop="recommendation_index">
            <el-rate v-model="formData.recommendation_index" />
          </el-form-item>
        </m-section-row>

        <el-form-item
          label="图书简介"
          prop="introduction">
          <el-input
            type="textarea"
            :rows="3"
            v-model="formData.introduction" />
        </el-form-item>
      </el-form>
    </m-section>

    <m-section
      title="借阅信息"
      is-form>
      <m-section-row>
        <m-section-cell>
          <m-table
            :data="infoData.body"
            :total="infoData.body.length"
            :remote="false"
            :current-page="pageIndex"
            @current-change="changePageIndex">
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
                <el-table-column
                  label="操作"
                  align="center"
                  class-name="autotest-code"
                  width="75"
                  prop="code">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      :disabled="scope.row.status == 1"
                      @click="editBorrow(scope.row, scope.$index)">编辑</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </m-table>
        </m-section-cell>
      </m-section-row>
    </m-section>

    <el-dialog
      title="修改"
      custom-class="dialog-borrow"
      :visible.sync="dialogVisible">
      <div>
        <el-form
          label-width="115px"
          class="form-create"
          ref="formBorrow"
          :model="formBorrowData"
          :rules="formBorrowRules">
          <el-form-item label="借阅人">
            {{ borrowInfo.name }} {{ borrowInfo.emp_code }}
          </el-form-item>

          <el-form-item label="借阅日期">
            {{ borrowInfo.borrowing_date }}
          </el-form-item>

          <el-form-item label="预计归还日期">
            {{ borrowInfo.return_date }}
          </el-form-item>

          <el-form-item
            label="借阅状态"
            prop="status">
            <el-select
              ref="borrowStatus"
              v-model="formBorrowData.status"
              @change="changeBorrowStatus">
              <el-option
                value="2"
                label="未归还" />
              <el-option
                value="1"
                label="已归还" />
            </el-select>
          </el-form-item>

          <el-form-item
            label="实际归还日期"
            prop="actual_return_date"
            v-if="formBorrowData.status === '1'">
            <el-date-picker
              value-format="yyyy-MM-dd"
              :picker-options="datepickerOptions"
              v-model="formBorrowData.actual_return_date" />
          </el-form-item>

          <el-form-item>
            <div class="dialog-borrow__btn">
              <el-button
                type="primary"
                @click="confirmBorrow">确定</el-button>
              <el-button
                type="info"
                @click="cancelBorrow">取消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <div class="btn-handlers">
      <el-button
        type="primary"
        @loading="loading"
        @click="submit">保存</el-button>
      <el-button
        type="info"
        @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      const { id } = this.$route.params
      const breadcrumb = [
        { name: '企业OA' },
        { name: '图书借阅', to: '/books/list/share' },
      ]
      if (!id) {
        breadcrumb.push({ name: '我要分享', to: '/books/list/share' })
        breadcrumb.push({ name: '新建' })
      }
      const recommendationValid = (rule, value, callback) => {
        if (value <= 0) {
          callback(new Error('请选择推荐指数'))
        }
        callback()
      }
      const countValid = ((rule, value, callback) => {
        const newValue = value.toString().trim()
        const regx = /^[0-9]+$/
        if (newValue && (!regx.test(newValue) || newValue <= 0)) {
          callback(new Error('请输入有效的数字值'))
        }
        callback()
      })
      return {
        id,
        breadcrumb,
        preloading: false,
        loading: false,
        isEdit: false,
        dialogVisible: false,
        isSubmitSuccess: false,
        pageIndex: 1,
        infoData: {
          body: [],
        },
        formData: {
          name: '',
          status: '',
          unit: '',
          recommendation_index: 0,
          total: '',
          introduction: '',
        },
        borrowIndex: -1,
        borrowInfo: {
        },
        formRules: {
          name: [{
            required: true,
            trigger: 'blur',
            message: '请输入图书名称',
          }],
          status: [{
            required: true,
            trigger: 'change',
            message: '请选择图书状态',
          }],
          total: [{
                    required: true,
                    trigger: 'blur',
                    message: '请输入总体库存',
                  },
                  {
                    validator: countValid,
                    trigger: 'change',
          }],
          unit: [{
            required: true,
            trigger: 'change',
            message: '请选择计量单位',
          }],
          recommendation_index: [{
                                   required: true,
                                   trigger: 'change',
                                   message: '请选择推荐指数',
                                 },
                                 {
                                   validator: recommendationValid,
                                   trigger: 'change',
          }],
          introduction: [{
            required: true,
            trigger: 'blur',
            message: '请输入图书简介',
          }],
        },
        formBorrowData: {
          id: '',
          status: '',
          actual_return_date: '',
        },
        formBorrowRules: {
          status: [{
            required: true,
            trigger: 'change',
            message: '请选择借阅状态',
          }],
          actual_return_date: [],
        },
        datepickerOptions: {},
      }
    },
    created() {
      if (this.$route.params.id) {
        this.fetch()
      }
    },
    beforeRouteLeave(to, from, next) {
      if (this.isSubmitSuccess) {
        next()
      } else {
        next(false)
        setTimeout(() => {
          this.$confirm('系统可能不会保存您所做的更改，确认离开？', '提示', {
            type: 'warning',
          }).then(() => next()).catch(() => next(false))
        }, 0)
      }
    },
    methods: {
      fetch() {
        this.preloading = true
        const { id } = this.$route.params
        this.$axios({
          method: 'post',
          url: this.$api.oa.books.shareDetails,
          data: {
            id,
          },
        })
          .then((data) => {
            this.preloading = false
            this.isEdit = true
            this.infoData = data.data
            if (!this.infoData.body) {
              this.infoData.body = []
            }
            const {
              name,
              status,
              unit,
              recommendation_index,
              total,
              introduction,
            } = this.infoData
            this.formData = {
              name,
              recommendation_index,
              total,
              introduction,
              status: status.toString(),
              unit: unit.toString(),
            }
            this.breadcrumb.push({
              name: this.formData.name,
              to: `/books/details/${this.id}?isEdit=1`,
            })
            this.breadcrumb.push({
              name: '修改',
            })
          }).catch(() => {
            this.preloading = false
          })
      },
      changeBorrowStatus(value) {
        if (value === '1') {
          this.formBorrowRules.actual_return_date = [{
            required: true,
            trigger: 'change',
            message: '请选择实际归还日期',
          }]
        } else {
          this.formBorrowRules.actual_return_date = []
        }
      },
      confirmBorrow() {
        this.$refs.formBorrow.validate((valid) => {
          if (valid) {
            const borrow = this.infoData.body[this.borrowIndex]
            borrow.status = this.formBorrowData.status
            borrow.actual_return_date = this.formBorrowData.actual_return_date
            borrow.status_name = this.$refs.borrowStatus.selected.label
            this.dialogVisible = false
          }
        })
      },
      cancelBorrow() {
        this.dialogVisible = false
      },
      editBorrow(row, index) {
        this.dialogVisible = true
        this.borrowInfo = row
        this.borrowIndex = index
        this.formBorrowData.id = row.id
        this.formBorrowData.status = row.status.toString()
        this.formBorrowData.actual_return_date = row.actual_return_date
        this.datepickerOptions = {
          disabledDate: (time) => {
            const date1 = Number(this.$utils.tools.formatDate(time).replace(/-/g, ''))
            const date2 = Number(row.borrowing_date.replace(/-/g, ''))
            return date1 < date2
          },
        }
      },
      submit() {
        if (this.loading) return
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.loading = true
            const submitData = Object.assign({}, this.formData)
            if (this.isEdit) {
              submitData.id = this.infoData.id
            }
            let url = this.$api.oa.books.shareCreate
            if (this.isEdit) {
              url = this.$api.oa.books.shareEdit
            }
            submitData.borrow_list = JSON.stringify(this.infoData.body)
            this.$axios({
              url,
              method: 'post',
              data: submitData,
            })
              .then((data) => {
                this.loading = false
                this.$message({
                  type: 'success',
                  message: '保存成功',
                })
                this.isSubmitSuccess = true
                window.setTimeout(() => {
                  let id = ''
                  const query = {}
                  if (this.isEdit) {
                    // eslint-disable-next-line prefer-destructuring
                    id = this.$route.params.id
                    query.isEdit = 1
                  } else {
                    // eslint-disable-next-line prefer-destructuring
                    id = data.data.id
                    query.isCreate = 1
                  }
                  this.$router.push({
                    query,
                    path: `/books/details/${id}`,
                  })
                }, 1000)
              })
              .catch(() => {
                this.loading = false
              })
          }
        })
      },
      changePageIndex(value) {
        this.pageIndex = value
      },
      cancel() {
        this.$router.push({
          path: '/books/list/share',
        })
      },
    },
  }
</script>

<style lang="scss">
  .page-book-create {
    .dialog-borrow {
      min-width: 550px !important;
      width: 550px !important;

      &__btn {
        white-space: nowrap;
        padding-top: 18px;
        margin-bottom: -12px;
      }

      .el-form {
        margin-left: 40px;
        padding-top: 10px;
      }

      .el-form-item__content {
        width: 253px;
      }

      .el-input,
      .el-select {
        width: 100%;
      }
    }

    .el-rate {
      position: relative;
      top: 7px;
    }
  }
</style>
