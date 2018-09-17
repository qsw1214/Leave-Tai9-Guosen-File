<template>
  <div class="page page-data-order-food">

    <m-breadcrumb :items="breadcrumb" />

    <div class="block-margin-bottom">
      <el-button
        v-permission="1050001"
        type="primary"
        icon="el-icon-plus"
        @click="handleClick('create')">新建
      </el-button>
      <el-button
        v-permission="1050001"
        icon="el-icon-download"
        @click="handleClick('import')">导入
      </el-button>
      <el-button
        v-permission="1050001"
        icon="el-icon-upload2"
        @click="handleClick('export')">导出
      </el-button>
      <el-button
        v-permission="1050001"
        icon="el-icon-delete"
        @click="handleClick('delete')">删除
      </el-button>
      <el-input
        class="search"
        placeholder="输入商家区域，商家名称或商品名称搜索"
        v-model="searchValue"
        @keyup.enter.native="search">
        <el-button
          icon="el-icon-search"
          slot="append"
          @click="search" />
      </el-input>
    </div>

    <m-table
      is-full-table
      :data="data"
      :total="total"
      :loading="loading"
      :current-page="pageIndex"
      @size-change="changeSize"
      @current-change="changePage">
      <template slot-scope="props">
        <el-table
          border
          stripe
          :max-height="props.maxHeight"
          :data="props.data"
          @selection-change="selectionChange">
          <el-table-column
            type="selection"
            column-key="select"
            align="center"
            class-name="checkbox autotest-checkbox"
            width="75" />

          <el-table-column
            label="商家区域"
            align="center"
            class-name="autotest-district"
            prop="b_district_value" />

          <el-table-column
            label="商家名称"
            align="center"
            class-name="autotest-name"
            prop="b_name" />

          <el-table-column
            label="商品名称"
            align="center"
            class-name="autotest-goodName"
            prop="p_name" />

          <el-table-column
            label="商品类型"
            align="center"
            class-name="autotest-goodType"
            prop="p_type_value" />

          <el-table-column
            label="商品单价"
            align="center"
            class-name="autotest-price"
            prop="p_price" />

          <el-table-column
            label="计量单位"
            align="center"
            class-name="autotest-unit"
            prop="p_unit" />

          <el-table-column
            label="操作"
            class-name="autotest-options"
            align="center"
            fixed="right"
            width="75"
            column-key="operate"
            prop="operate"
            v-if="$permission.valid('1050001')">
            <template slot-scope="scope">
              <el-button
                type="text"
                icon="el-icon-edit"
                @click="clickEdit(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      </template>
    </m-table>

    <!-- 新建弹层 -->
    <el-dialog
      custom-class="dialog-order-food"
      :title="formData.id ? '修改' : '新建'"
      :visible.sync="dialogEditVisible">
      <div v-loading="isSubmit">
        <el-form
          label-width="98px"
          class="form-create"
          ref="form"
          :model="formData"
          :rules="formRules">
          <el-form-item
            label="商家区域"
            prop="b_district">
            <el-select
              filterable
              placeholder="请选择商家区域"
              v-model="formData.b_district">
              <el-option
                v-for="(item, index) in configData.b_district || []"
                :key="'area_' + index"
                :value="item.key.toString()"
                :label="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item
            label="商家名称"
            prop="b_name">
            <el-input
              :maxlength="50"
              v-model="formData.b_name" />
          </el-form-item>
          <el-form-item
            label="商品名称"
            prop="p_name">
            <el-input
              :maxlength="50"
              v-model="formData.p_name" />
          </el-form-item>
          <el-form-item
            label="商品类别"
            prop="p_type">
            <el-select
              placeholder="请选择商家区域"
              v-model="formData.p_type">
              <el-option
                v-for="(item, index) in configData.p_type || []"
                :key="'type_' + index"
                :value="item.key.toString()"
                :label="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item
            label="商品单价"
            prop="p_price">
            <el-input
              :maxlength="50"
              v-model="formData.p_price" />
          </el-form-item>
          <el-form-item
            label="计量单位"
            prop="p_unit">
            <el-input
              :maxlength="50"
              v-model="formData.p_unit" />
          </el-form-item>
          <el-form-item>
            <div class="btns">
              <el-button
                type="primary"
                v-if="!formData.id"
                @click="clickSave($event, true)">保存并继续新建</el-button>
              <el-button
                :type="formData.id ? 'primary' : ''"
                @click="clickSave">保存</el-button>
              <el-button
                type="info"
                @click="handleClick('cancel')">取消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <!-- 上传弹层 -->
    <m-import
      :upload-excel-url="uploadUrl"
      :template-download-url="templateDownloadUrl"
      :show-import.sync="dialogImportVisible"
      @completed="uploadCompleted"
      @completedPart="uploadCompletedPart" />
  </div>
</template>

<script>
  /*
  * 订餐服务
  * @route /data/order/food
  */
  export default {
    data() {
      const { page, size, keyword } = this.$route.query
      const keywords = keyword ? this.$utils.tools.splitKeyword(keyword).join(',') : ''

      // 商品价格验证
      const validatorPrice = (rule, value = '', callback) => {
        const newValue = value.trim()
        if (!newValue) {
          callback(new Error('请输入商品价格'))
          return
        }
        const regx = new RegExp(/^[0-9]+(.[0-9]+)?$/)
        if (!regx.test(newValue)) {
          callback(new Error('商品单价仅可录入正整数或正小数请重新输入'))
          return
        }
        callback()
      }

      const requestHeader = this.$utils.config.headers

      return {
        // 上传url
        uploadUrl: this.$api.settings.orderFood.upload,
        // 上传请求头
        requestHeader,
        templateDownloadUrl: this.$api.settings.orderFood.templateDownloadUrl,
        // 列表数据
        data: [],
        // 总条数
        total: 0,
        // 添加订餐商品的设置数据
        configData: {},
        pageSize: parseInt((size || 20), 10),
        pageIndex: parseInt((page || 1), 10),
        searchValue: keyword || '',
        keywords,
        loading: false,
        isSubmit: false,
        dialogEditVisible: false,
        dialogImportVisible: false,
        selectItems: [],
        formData: {
          id: '',
          b_district: '',
          b_name: '',
          p_name: '',
          p_type: '0',
          p_price: '',
          p_unit: '份',
        },
        formRules: {
          b_name: {
            required: true,
            message: '请输入商家名称',
            trigger: 'blur',
          },
          b_district: {
            required: true,
            message: '请选择商家区域',
            trigger: 'blur',
          },
          p_name: {
            required: true,
            message: '请输入商品名称',
            trigger: 'blur',
          },
          p_type: {
            required: true,
            message: '请选择商品类型',
            trigger: 'blur',
          },
          p_price: {
            required: true,
            validator: validatorPrice,
            trigger: 'blur',
          },
          p_unit: {
            required: true,
            message: '请输入计量单位',
            trigger: 'blur',
          },
        },
        breadcrumb: [
          { name: '数据管理' },
          { name: '订餐服务', to: '/order/food' },
        ],
        operating: false,
      }
    },
    created() {
      this.getConfigData()
      this.getData()
    },
    methods: {
      // 获取数据
      getData() {
        this.loading = true
        this.$axios({
          url: this.$api.settings.orderFood.list,
          params: {
            per_page: this.pageSize,
            page: this.pageIndex,
            keywords: this.keywords,
          },
        })
          .then((data) => {
            if (data.code === 0) {
              this.data = data.data.list
              this.total = data.data.count
              this.loading = false
            }
          }).catch(() => {
            this.loading = false
          })
      },
      // 获取添加订餐商品配置参数
      getConfigData() {
        this.$axios({
          url: this.$api.settings.orderFood.config,
        })
          .then((data) => {
            if (data.code === 0) {
              this.formData.p_type = data.data.list.p_type[0].key.toString()
              this.configData = data.data.list
            }
          }).catch(() => {})
      },
      /*
      * 提交数据
      * @params callback { Funciton } 回调函数
      */
      submit(callback) {
        if (this.isSubmit) return
        this.isSubmit = true
        const submitData = Object.assign({}, this.formData)
        submitData.b_name = submitData.b_name.trim()
        submitData.p_name = submitData.p_name.trim()
        submitData.p_unit = submitData.p_unit.trim()
        let url = this.$api.settings.orderFood.add
        if (this.formData.id) {
          url = this.$api.settings.orderFood.edit
        }
        this.$axios({
          url,
          method: 'post',
          data: submitData,
        })
          .then((data) => {
            this.isSubmit = false
            if (data.code === 0) {
              this.$message({
                type: 'success',
                message: `商品 ${submitData.p_name} 已保存`,
              })
              if (callback) callback()
            }
          }).catch(() => {
            this.isSubmit = false
          })
      },
      /*
      * 发送选择操作
      * @params operate {String} 选择操作 删除：delete / 导出：export
      * @params callback {Function} 回调函数
      */
      sendSelected(operate = 'export', callback) {
        if (this.operating) return
        this.operating = true
        const ids = this.selectItems.map(item => item.id).join(',')
        this
          .$axios({
            url: this.$api.settings.orderFood.selectedOperateUrl,
            params: {
              ids,
              keywords: this.keywords,
              type: operate,
            },
          })
          .then((data) => {
            if (data.code === 0 && callback) {
              callback(data)
            }
          })
          .catch(() => {})
          .then(() => {
            this.operating = false
          })
      },
      /*
      * 保存
      * @params isContinue { Boolean } 是否继续创建
      */
      clickSave(event, isContinue = false) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$confirm('是否确认保存？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }).then(() => {
              this.submit(() => {
                if (!isContinue) {
                  this.dialogEditVisible = false
                }
                this.getData()
                this.resetForm()
              })
            }).catch(() => {})
          }
        })
      },
      // 查找
      search() {
        const { query } = this.$route

        this.$router.replace({
          query: Object.assign({}, query, { page: 1, keyword: this.searchValue.trim() }),
        })
        this.keywords = this.$utils.tools.splitKeyword(this.searchValue).join(',')

        this.pageIndex = 1
        this.getData()
      },
      // 更改每页显示条数
      changeSize(value) {
        this.pageSize = value
        this.pageIndex = 1
        this.getData()
      },
      // 翻页
      changePage(value) {
        this.pageIndex = value
        this.getData()
      },
      // 上传成功
      uploadCompleted() {
        this.$message({
          type: 'success',
          message: '文件数据已导入',
        })
        this.pageIndex = 1
        this.getData()
      },
      // 导入部分数据
      uploadCompletedPart() {
        this.pageIndex = 1
        this.getData()
      },
      // 上传失败
      uploadFailure() {
        this.$message({
          type: 'error',
          message: '文件导入失败，请重新导入',
        })
      },
      // 表单还原
      resetForm() {
        this.formData.id = ''
        this.$refs.form.resetFields()
      },
      // 列表勾选回调
      selectionChange(items) {
        this.selectItems = items
      },
      /*
      * 点击操作
      * @params type {String} 操作类型
      */
      handleClick(type) {
        switch (type) {
        case 'delete':
          if (this.selectItems.length === 0) {
            this.$message({
              type: 'error',
              message: '请勾选需要删除的商品',
            })
            return
          }
          this.$confirm('确认删除选中的商品数据？', '提示', {
            type: 'warning',
          })
            .then(() => {
              this.sendSelected('delete', () => {
                this.$message({
                  type: 'success',
                  message: '勾选的商品已经删除',
                })
                this.pageIndex = 1
                this.getData()
              })
            }).catch(() => {})
          break
        case 'export':
          this.sendSelected('export', (data) => {
            this.$utils.tools.windowOpen(data.data.url)
          })
          break
        case 'create':
          if (this.formData.id) {
            this.formData.id = ''
            this.$refs.form.resetFields()
          }
          this.dialogEditVisible = true
          break
        case 'import':
          this.dialogImportVisible = true
          break
        case 'cancel':
          this.resetForm()
          this.dialogEditVisible = false
          break
        default:
          break
        }
      },
      // 点击修改
      clickEdit(item) {
        this.formData.id = item.id
        this.formData.b_name = item.b_name
        this.formData.b_district = item.b_district_key.toString()
        this.formData.p_name = item.p_name
        this.formData.p_type = item.p_type_key.toString()
        this.formData.p_price = item.p_price.toString()
        this.formData.p_unit = item.p_unit
        this.dialogEditVisible = true
      },
    },
  }
</script>

<style type="text/scss" lang="scss">
  .page-data-order-food {
    .dialog-order-food {
      width: 650px;
      min-width: 650px;

      .btns {
        padding-top: 12px;
      }

      .form-create {
        margin-left: 40px;

        .el-input {
          width: 353px;
        }

        .el-form-item:last-child {
          margin-bottom: 10px;
        }
      }
    }
  }
</style>
