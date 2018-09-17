<template>
  <section
    v-loading.fullscreen.lock="detailLoading"
    class="page page--edit">

    <m-breadcrumb :items="breadcrumb" />

    <m-section
      title="资料基本信息"
      is-form>

      <el-form
        class="m-section--form"
        label-width="140px"
        ref="form"
        :rules="rules"
        :model="form">

        <el-form-item
          prop="title"
          label="资料标题">
          <el-input
            style="width: 100%;"
            placeholder="请输入资料标题"
            v-model="form.title" />
        </el-form-item>

        <el-form-item
          prop="introduction"
          label="资料简介">
          <el-input
            style="width: 100%;"
            placeholder="请输入资料简介"
            v-model="form.introduction" />
        </el-form-item>

        <m-section-row>
          <el-form-item
            prop="type"
            label="资料类型">
            <el-select
              v-model="form.type">
              <el-option
                v-for="item in options.types"
                :key="item.code"
                :label="item.label"
                :value="item.code" />
            </el-select>
          </el-form-item>

          <el-form-item
            prop="year"
            label="资料年份">
            <el-select
              v-model="form.year">
              <el-option
                v-for="item in options.years"
                :key="item.code"
                :label="item.label"
                :value="item.code" />
            </el-select>
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            prop="aids"
            label="附件上传">

            <m-upload
              ref="upload"
              :file-list="fileList"
              :on-success="uploadHandler"
              :on-remove="uploadHandler"
              :action="upload.action" />
          </el-form-item>
        </m-section-row>
      </el-form>
    </m-section>

    <m-section
      title="资料权限设置"
      is-form>
      <m-section-row>
        <m-section-cell>
          <el-alert
            title="权限设置说明"
            type="warning"
            description="请授权至少一个部门或一个用户，二者为并集关系；若全部留空，则不可提交。"
            show-icon
            :closable="false" />
        </m-section-cell>
      </m-section-row>


      <m-section-row>
        <m-section-cell>
          <el-alert
            title="可查阅部门"
            type="info"
            description="勾选以下部门，表示将该份资料授权给该部门下所有员工，可供查阅和下载。"
            closable />
        </m-section-cell>
      </m-section-row>

      <m-section-row>
        <m-section-cell>
          <m-organzition-select
            ref="orgs" />
        </m-section-cell>
      </m-section-row>

      <m-section-row>
        <m-section-cell>
          <el-alert
            title="可查阅用户"
            type="info"
            description="单击列表中员工，则表示将该份资料授权给该员工，可供查阅和下载。"
            closable />
        </m-section-cell>
      </m-section-row>

      <m-section-row>
        <m-section-cell>
          <m-async-employee-select
            :employee="employeeChoosed"
            @selected="selectEmployee" />
        </m-section-cell>
      </m-section-row>
    </m-section>

    <div>
      <el-button
        type="primary"
        :loading="saveLoading"
        @click="save">保存
      </el-button>
      <el-button
        type="info"
        @click="cancel">取消
      </el-button>
    </div>
  </section>
</template>

<script>
  import mixin from '~oa/mixins'
  import Tag from './warehouse/Tag'

  export default {
    name: 'MineEdit',

    components: {
      Tag,
    },

    mixins: [mixin.routerHook],

    data() {
      const currentYears = new Date().getFullYear()
      const years = []

      for (let i = 2012; i <= currentYears; i += 1) {
        const temp = {}
        temp.label = i
        temp.code = i
        years.push(temp)
      }
      const { id } = this.$route.query
      const edit = (typeof id) !== 'undefined'

      return {
        form: {
          title: '', // 标题
          introduction: '', // 简介
          type: '', // 类型
          year: '', // 年份
          aids: '', // 附件列表，多个用英文逗号隔开
          org_ids: '', // 组织范options围
          user_ids: '', // 可见人员列
        },
        rules: {
          title: [
            { required: true, message: '请填写标题', trigger: 'blur' },
            { max: 20, message: '标题限制字符数20个以内', trigger: 'blur' },
          ],
          introduction: [
            { required: true, message: '请填写简介', trigger: 'blur' },
            { max: 40, message: '简介限制字符数40个以内', trigger: 'blur' },
          ],
          type: [
            { required: true, message: '请选择资料类型', trigger: 'blur' },
          ],
          year: [
            { required: true, message: '请选择资料年份', trigger: 'blur' },
          ],
        },
        options: {
          years,
          types: [
            {
              label: '内部文档',
              code: '1',
            },
            {
              label: '外部文档',
              code: '2',
            },
            {
              label: '其他',
              code: '4',
            },
          ],
        },
        upload: {
          action: '/knowledge/upload-atta',
        },
        fileList: [],
        edit,
        organization: '',
        pagination: {
          total: 0,
          pageSize: 20,
          currentPage: 1,
        },
        id,
        saveLoading: false,
        detailLoading: false,
        employeeChoosed: [],
        breadcrumb: [
          { name: '企业OA' },
          { name: '知识仓库', to: '/share' },
          { name: '我的资料', to: '/share/mine' },
          { name: edit ? '修改' : '新增' },
        ],
        canRedirect: false,
      }
    },

    created() {
      if (this.edit) this.getDetail()
    },

    methods: {
      getDetail() {
        this.detailLoading = true
        this.$axios
          .post(this.$api.oa.warehouse.detail, {
            id: this.id,
          })
          .then(({ data }) => {
            const { title,
                    introduction,
                    type,
                    year,
                    aids,
                    user_list,
                    org_list } = data

            this.form = Object.assign(
              {},
              this.form,
              { title, introduction, type: String(type), year }
            )
            this.fileList = aids
            this.form.aids = aids.map(item => item.id).join(',')
            this.employeeChoosed = user_list
            const orgIds = org_list.map(item => item.id)
            this.$refs.orgs.$refs.selected.setCheckedKeys(orgIds)
            this.breadcrumb.splice(this.breadcrumb.length - 1, 0, {
              name: data.title,
              to: `/share/mine/details/${this.id}`,
            })
          })
          .catch(() => {})
          .then(() => {
            this.detailLoading = false
          })
      },

      uploadHandler() {
        this.form.aids = this.$refs.upload.getFiles('string')
      },

      save() {
        this.$refs.form
          .validate()
          .then(() => {
            this.form.org_ids = this.$refs.orgs.$refs.selected.getCheckedKeys().join(',')
            this.form.user_ids = this.employeeChoosed.map(item => item.id).join(',')
            const bool = this.form.org_ids === '' && this.form.user_ids === ''

            if (bool) {
              this.$message.error('请授权至少一个部门或一个用户')
              return
            }

            if (this.$refs.upload.processing) {
              this.$message({
                message: '附件正在上传中，请稍后再重试！',
                type: 'warning',
              })
              return
            }

            this.saveLoading = true
            const url = this.edit ? this.$api.oa.mine.edit : this.$api.oa.mine.add
            const params = this.edit
              ? Object.assign({}, this.form, { id: this.id })
              : this.form

            this.$axios
              .post(url, params)
              .then(({ data }) => {
                const { id } = data
                this.$message({
                  message: this.edit ? '编辑成功' : '添加成功！',
                  type: 'success',
                  onClose: () => {
                    this.canRedirect = true
                    this.$router.replace({
                      name: 'shareMineDetails',
                      params: {
                        id,
                      },
                      query: {
                        from: this.edit ? 'edit' : 'add',
                      },
                    })
                  },
                })
              })
              .catch(() => {})
              .then(() => {
                this.saveLoading = false
              })
          })
          .catch(() => {
            this.$utils.tools.backToTop()
          })
      },

      cancel() {
        this.$router.go(-1)
      },

      selectEmployee(employee) {
        this.employeeChoosed = [].concat(employee)
      },
    },
  }
</script>
