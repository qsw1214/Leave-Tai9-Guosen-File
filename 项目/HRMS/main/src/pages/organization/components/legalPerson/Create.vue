<template>
  <div
    v-loading.fullscreen.lock="preloading"
    class="page">

    <m-breadcrumb :items="breadcrumb" />

    <el-form
      label-width="140px"
      ref="form"
      :model="formData"
      :rules="formRules">

      <m-section
        title="营业执照信息"
        is-form>
        <div class="m-section--form">
          <m-section-row>
            <el-form-item
              label="生效日期"
              prop="yyzz_valid_date">
              <el-date-picker
                type="date"
                placeholder=""
                v-model="formData.yyzz_valid_date"
                :picker-options="pickerOptions1" />
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="统一社会信用代码"
              prop="yyzz_credit_code">
              <el-input
                :maxlength="50"
                :value="formData.yyzz_credit_code"
                @input="changeCode" />
            </el-form-item>

            <el-form-item
              label="主体类型"
              prop="yyzz_entity_type">
              <el-input
                :maxlength="50"
                v-model="formData.yyzz_entity_type" />
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="法人名称"
              prop="yyzz_legal_name">
              <el-input
                :maxlength="100"
                :value="formData.yyzz_legal_name"
                @input="changeLegalName" />
            </el-form-item>

            <el-form-item
              label="负责人"
              prop="yyzz_charge">
              <el-input
                :maxlength="20"
                :value="formData.yyzz_charge"
                @input="changeManage" />
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="成立日期"
              prop="yyzz_es_date">
              <el-date-picker
                type="date"
                placeholder=""
                v-model="formData.yyzz_es_date" />
            </el-form-item>
          </m-section-row>

          <el-form-item
            label="经营场所"
            prop="address">
            <el-input
              type="textarea"
              :maxlength="200"
              :autosize="{ minRows: 4 }"
              :value="formData.yyzz_address"
              @input="changeAddress" />
          </el-form-item>
        </div>
      </m-section>

      <m-section
        title="经营许可证信息"
        is-form>
        <div class="m-section--form">
          <m-section-row>
            <el-form-item
              label="生效日期"
              prop="jyxkz_valid_date">
              <el-date-picker
                type="date"
                placeholder=""
                v-model="formData.jyxkz_valid_date"
                :picker-options="pickerOptions2" />
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="统一社会信用代码"
              prop="jyxkz_credit_code">
              <el-input
                disabled
                :maxlength="50"
                v-model="formData.jyxkz_credit_code" />
            </el-form-item>

            <el-form-item
              label="注册资本"
              prop="jyxkz_capital">
              <el-input
                :maxlength="50"
                v-model="formData.jyxkz_capital" />
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="法人名称"
              prop="jyxkz_legal_name">
              <el-input
                disabled
                :maxlength="100"
                v-model="formData.jyxkz_legal_name" />
            </el-form-item>

            <el-form-item
              label="负责人"
              prop="jyxkz_charge">
              <el-input
                disabled
                :maxlength="20"
                v-model="formData.jyxkz_charge" />
            </el-form-item>
          </m-section-row>

          <el-form-item
            label="经营场所"
            prop="jyxkz_address">
            <el-input
              disabled
              type="textarea"
              :maxlength="200"
              :autosize="{ minRows: 4 }"
              v-model="formData.jyxkz_address" />
          </el-form-item>

          <el-form-item
            label="业务范围"
            prop="jyxkz_business_scope">
            <el-input
              type="textarea"
              :maxlength="200"
              :autosize="{ minRows: 4 }"
              v-model="formData.jyxkz_business_scope" />
          </el-form-item>
        </div>
      </m-section>

      <m-section
        title="附件"
        is-form>
        <div class="m-section--form">
          <m-section-row>
            <el-form-item
              label="附件上传">
              <m-upload
                multiple
                accept="image,pdf,word,zip"
                ref="upload"
                :file-list="modelData.attachment_list"
                :action="uploadUrl" />
            </el-form-item>
          </m-section-row>
        </div>
      </m-section>
    </el-form>

    <el-button
      type="primary"
      :loading="loading"
      @click="submit">保存</el-button>
    <el-button
      type="info"
      @click="cancel">取消</el-button>

  </div>
</template>

<script>
  /**
   * @description 法人单位设置创建或修改
   * @route /legalperson/create/:id?，id有值为修改，否则为创建
   * @routerQuery callback，值为 details 跳转到详情页面，否则跳转首页
   */
  import { mapMutations, mapState } from 'vuex'
  import { legalPerson } from '~organization/store/mutationTypes'

  export default {
    name: 'LegalPersonEdit',
    data() {
      const { id } = this.$route.params
      const pageTitle = id ? '修改' : '新建'

      return {
        id,
        pageTitle,
        legalpersonTitle: '',
        // 附件上传后台接口
        uploadUrl: this.$api.organization.legalPersonUpload,
        loading: false,
        preloading: false,
        isSubmit: false,
        // 是否修改，当route.params.id 有值，并且能请求得到数据
        isEdit: false,
        // 详情接口拉取数据
        modelData: {},
        // 表单数据
        formData: {
          id: '',
          // 营业执照生效日期
          yyzz_valid_date: '',
          // 营业执照统一社会信用码
          yyzz_credit_code: '',
          // 营业执照法人名称
          yyzz_legal_name: '',
          // 营业执照主体类型
          yyzz_entity_type: '',
          // 营业执照记录的成立日期
          yyzz_es_date: '',
          // 营业执照记录的负责人
          yyzz_charge: '',
          // 营业执照记录的经营场所
          yyzz_address: '',
          // 经营许可证的生效日期
          jyxkz_valid_date: '',
          // 经营许可证的统一社会信用码
          jyxkz_credit_code: '',
          // 经营许可证的法人名称
          jyxkz_legal_name: '',
          // 经营许可证上的注册资本
          jyxkz_capital: '',
          // 经营许可证上的负责人
          jyxkz_charge: '',
          // 经营许可证上的业务范围
          jyxkz_business_scope: '',
          // 经营许可证的经营场所
          jyxkz_address: '',
          aids: '',
        },
        // 表单验证规则
        formRules: {
          yyzz_valid_date: [
            { required: true, type: 'date', message: '请输入生效日期', trigger: 'change' },
          ],
          yyzz_legal_name: [
            { required: true, message: '请输入法人名称', trigger: 'blur' },
            { pattern: /^[^/+]+$/, message: '名称中不能包含非法字符', trigger: 'blur' },
          ],
          yyzz_credit_code: [
            { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
          ],
          jyxkz_valid_date: [
            { required: true, type: 'date', message: '请输入生效日期', trigger: 'change' },
          ],
          jyxkz_legal_name: [
            { required: true, message: '请输入法人名称', trigger: 'blur' },
            { pattern: /^[^/+]+$/, message: '名称中不能包含非法字符', trigger: 'blur' },
          ],
          jyxkz_credit_code: [
            { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
          ],
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7
          },
        },
        pickerOptions1: {},
        pickerOptions2: {},
      }
    },
    computed: {
      ...mapState({
        current: state => state.legalPerson.current || {},
      }),
      breadcrumb() {
        const defaultBC = [
          { name: '组织管理' },
          { name: '法人单位设置', to: '/legalperson' },
          { name: this.pageTitle },
        ]

        if (!this.formData.id) return defaultBC

        const name = {
          name: this.legalpersonTitle,
          to: {
            name: 'legal-person-details',
            params: { id: this.formData.id },
          },
        }

        defaultBC.splice(2, 0, name)
        return defaultBC
      },
    },
    created() {
      if (this.id) this.getData()
    },
    beforeRouteLeave(to, from, next) {
      if (this.isSubmit) {
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
      ...mapMutations({
        updateCurrent: legalPerson.updateCurrent,
      }),
      // 设置日期控件禁选
      setPickerOptions() {
        const now = new Date()
        if (!(this.modelData.yyzz_valid_date > now)) {
          this.pickerOptions1 = {
            disabledDate: time => time.getTime()
              < this.modelData.yyzz_valid_date.getTime() - 8.64e7,
          }
        }
        if (!(this.modelData.yyzz_valid_date > now)) {
          this.pickerOptions2 = {
            disabledDate: time => time.getTime()
              < this.modelData.yyzz_valid_date.getTime() - 8.64e7,
          }
        }
      },
      // 获取修改数据
      getData() {
        if (this.preloading) return
        this.preloading = true

        this.$axios({
          url: this.$api.organization.legalPersonDetials,
          params: {
            id: this.$route.params.id,
          },
        }).then((data) => {
          this.modelData = Object.assign({}, data.data)
          this.modelData.yyzz_valid_date = new Date(this.modelData.yyzz_valid_date)
          this.modelData.jyxkz_valid_date = new Date(this.modelData.jyxkz_valid_date)
          this.legalpersonTitle = data.data.yyzz_legal_name
          this.updateCurrent(Object.assign({}, data.data))
          if (data.data.yyzz_valid_date) {
            data.data.yyzz_valid_date = new Date()
          }
          if (data.data.jyxkz_valid_date) {
            data.data.jyxkz_valid_date = new Date()
          }
          delete data.data.attachment_list
          this.formData = data.data
          this.setPickerOptions()
          this.isEdit = true
          this.preloading = false
        }).catch(() => {
          this.preloading = false
        })
      },
      // 提交
      submit() {
        if (this.loading) return

        // 是否文件在上传
        if (this.$refs.upload.processing) {
          this.$message({
            type: 'warning',
            message: '请在附件上传完成后保存',
          })
          return
        }


        this.$refs.form.validate((valid) => {
          if (valid) {
            const submitData = Object.assign({}, this.formData)
            submitData.yyzz_valid_date =
              this.$utils.tools.formatDate(submitData.yyzz_valid_date)

            if (submitData.yyzz_es_date) {
              submitData.yyzz_es_date =
                this.$utils.tools.formatDate(submitData.yyzz_es_date)
            }

            submitData.jyxkz_valid_date =
              this.$utils.tools.formatDate(submitData.jyxkz_valid_date)

            submitData.aids = this.$refs.upload.getFiles('string')

            if (this.isEdit) {
              if (this.formData.has_newer === '1') {
                this.$confirm('本次操作将覆盖原有未生效记录，是否继续？', '提示', {
                  type: 'warning',
                }).then(() => {
                  this.submitEdit(submitData)
                }).catch(() => {})
              } else {
                this.submitEdit(submitData)
              }
            } else {
              this.submitAdd(submitData)
            }
          }
        })
      },
      /*
       * 新建数据提交
       * @params submitData {Object} 提交数据
      */
      submitAdd(submitData) {
        this.loading = true
        this.$axios({
          url: this.$api.organization.legalPersonAdd,
          data: submitData,
          method: 'post',
        }).then((data) => {
          this.loading = false
          this.isSubmit = true
          submitData.id = data.data.id
          submitData.attachment_list = this.$refs.upload.getFiles()
          this.updateCurrent(submitData)
          this.$router.push({
            path: `/legalperson/details/${submitData.id}`,
            query: {
              create: 1,
            },
          })
        }).catch(() => {
          this.loading = false
        })
      },
      /*
       * 修改数据提交
       * @params submitData {Object} 提交数据
       */
      submitEdit(submitData) {
        this.loading = true
        this.$axios({
          url: this.$api.organization.legalPersonEdit,
          data: submitData,
          method: 'post',
        }).then(() => {
          this.loading = false
          this.isSubmit = true
          submitData.attachment_list = this.$refs.upload.getFiles()
          this.updateCurrent(submitData)
          this.$router.push({
            path: `/legalperson/details/${submitData.id}`,
          })
        }).catch(() => {
          this.loading = false
        })
      },
      // 取消返回
      cancel() {
        const callback = this.$route.query.callback || ''
        switch (callback) {
        case 'details':
          this.$router.push({
            path: `/legalperson/details/${this.$route.params.id}`,
          })
          break
        default:
          this.$router.push({
            path: '/legalperson',
          })
          break
        }
      },
      /*
       * 法人名称修改同步，并且单独验证
       */
      changeLegalName(value) {
        this.formData.jyxkz_legal_name = value
        this.formData.yyzz_legal_name = value
        this.$refs.form.validateField('yyzz_legal_name')
        this.$refs.form.validateField('jyxkz_legal_name')
      },
      /*
       * 统一社会信用代码修改同步，并且单独验证
       */
      changeCode(value) {
        this.formData.jyxkz_credit_code = value
        this.formData.yyzz_credit_code = value
        this.$refs.form.validateField('yyzz_credit_code')
        this.$refs.form.validateField('jyxkz_credit_code')
      },
      /*
       * 经营场所修改同步
       */
      changeAddress(value) {
        this.formData.jyxkz_address = value
        this.formData.yyzz_address = value
      },
      /*
       * 负责人修改同步
       */
      changeManage(value) {
        this.formData.jyxkz_charge = value
        this.formData.yyzz_charge = value
      },
    },
  }
</script>
