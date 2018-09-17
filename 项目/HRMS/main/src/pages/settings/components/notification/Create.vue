<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="page">

    <m-breadcrumb :items="breadcrumb" />

    <m-section
      is-form
      title="通告基本信息">

      <m-section-row>
        <m-section-cell
          title="起草人"
          :content="userinfo.name" />
        <m-section-cell
          title="起草时间"
          :content="time" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="通告状态"
          :content="detail.status_name || '草稿'" />

      </m-section-row>

      <el-form
        class="m-section--form"
        label-width="140px"
        ref="form"
        :rules="rules"
        :model="form">

        <el-form-item
          prop="title"
          label="通告标题">
          <el-input
            style="width: 100%;"
            :maxlength="20"
            v-model="form.title" />
        </el-form-item>

        <m-section-row>
          <el-form-item
            prop="category"
            label="通告类别">
            <el-select v-model="form.category">
              <el-option
                label="公司通告"
                :value="1" />
              <el-option
                label="一般通知"
                :value="2" />
            </el-select>
          </el-form-item>

          <el-form-item
            prop="type"
            label="通告类型">
            <el-select v-model="form.type">
              <el-option
                v-for="item in type[form.category]"
                :key="item.value"
                :value="item.value"
                :label="item.label" />
            </el-select>
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            prop="number"
            label="文号">
            <el-input v-model="form.number" />
          </el-form-item>
          <el-form-item
            prop="org_id"
            label="发文单位">
            <m-cascader
              glass
              :width="260"
              :organization.sync="form.org_id" />
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            prop="is_top"
            label="是否置顶">
            <el-select v-model="form.is_top">
              <el-option
                label="是"
                :value="1" />
              <el-option
                label="否"
                :value="2" />
            </el-select>
          </el-form-item>
        </m-section-row>

        <el-form-item
          prop="content"
          label="正文内容">
          <el-input
            type="textarea"
            v-model="form.content" />
        </el-form-item>

        <m-section-row>
          <el-form-item label="附件上传">
            <m-upload
              class="autotest-upload"
              multiple
              ref="upload"
              :accept="upload.accept"
              :file-list="upload.files"
              :action="upload.action" />
          </el-form-item>
        </m-section-row>

      </el-form>

    </m-section>

    <m-section
      is-form
      title="通知权限设置">
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
            description="勾选以下部门，表示通告发布后，该部门下所有员工可查阅和下载附件。"
            closable />
        </m-section-cell>
      </m-section-row>

      <m-section-row>
        <m-section-cell>
          <m-organzition-select ref="tree" />
        </m-section-cell>
      </m-section-row>

      <m-section-row>
        <m-section-cell>
          <el-alert
            title="可查阅用户"
            type="info"
            description="单击列表中员工，则表示通告发布后，该员工可查阅和下载附件。"
            closable />
        </m-section-cell>
      </m-section-row>

      <m-section-row>
        <m-section-cell>
          <m-async-employee-select
            :employee="users"
            @selected="selectEmployee" />
        </m-section-cell>
      </m-section-row>

    </m-section>

    <div class="page--actions">
      <el-button
        type="primary"
        :loading="submitting"
        @click="submit('submitting')">提交</el-button>

      <el-button
        type="info"
        :loading="stashing"
        @click="submit('stashing')">暂存</el-button>

      <el-button
        type="info"
        @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Create',

    data() {
      const userinfo = JSON.parse(sessionStorage.getItem('USER_INFO'))
      const { id, status } = this.$route.params

      return {
        breadcrumb: [
          { name: '数据管理' },
          { name: '通知公告', to: '/notification' },
          { name: '新建' },
        ],

        id,
        status,
        userinfo,
        detail: {},

        form: {
          title: '',
          category: '',
          type: '',
          number: '',
          org_id: userinfo.org_id || '',
          is_top: '',
          content: '',
          aids: '',
        },

        rules: {
          title: [
            { required: true, trigger: ['blur'], message: '请填写通告标题' },
          ],
          category: [
            { required: true, trigger: ['change', 'blur'], message: '请选择通告类别' },
          ],
          type: [
            { required: true, trigger: ['change', 'blur'], message: '请选择通告类型' },
          ],
          org_id: [
            { required: true, trigger: ['change', 'blur'], message: '请选择发文单位' },
          ],
          is_top: [
            { required: true, trigger: ['change', 'blur'], message: '请选择是否置顶' },
          ],
        },

        type: {
          1: [
            { label: '公司制度', value: 1 },
            { label: '架构调整', value: 2 },
            { label: '人员任免', value: 4 },
            { label: '其他', value: 8 },
          ],
          2: [
            { label: '行政', value: 16 },
            { label: '合规', value: 32 },
            { label: '财务', value: 64 },
            { label: '人事', value: 128 },
            { label: '业务', value: 256 },
            { label: '其他', value: 512 },
          ],
        },

        upload: {
          action: '/notice/upload-atta',
          files: [],
          accept: 'image, word, zip',
        },
        submitting: false,
        stashing: false,
        canRedirect: false,
        loading: false,
        users: [],
      }
    },

    computed: {
      time() {
        if (Number(this.detail.status) === 4) {
          return '由系统自动生成'
        }

        return (this.detail.create_time || '草稿')
      },
    },

    created() {
      if (this.id) this.fetch()
      if (this.status === '8') this.breadcrumb[2] = { name: '重新提交' }
    },

    methods: {
      fetch() {
        this.loading = true
        this.$axios
          .get(this.$api.settings.notification.detail, {
            params: { id: this.id },
          })
          .then(({ data }) => {
            this.detail = data
            this.upload.files = data.aids

            Object.assign(this.form, {
              title: data.title,
              category: data.category,
              type: data.type,
              number: data.number,
              org_id: data.org_id,
              is_top: data.is_top,
              content: data.content,
            })

            if (data.org_list.length) {
              this.$refs.tree.$refs.selected.setCheckedKeys(data.org_list.map(item => item.id))
            }

            if (data.user_list.length) {
              this.users = data.user_list
            }
          })
          .catch(() => {})
          .then(() => {
            this.loading = false
          })
      },

      submit(type) {
        if (this.$refs.upload.processing) {
          return this.$message({
            message: '附件正在上传中，请稍后再操作',
            type: 'warning',
          })
        }

        const params = {}
        const status = type === 'submitting' ? 1 : 4
        const uri = this.id
          ? this.$api.settings.notification.edit
          : this.$api.settings.notification.add

        params.org_ids = this.$refs.tree.$refs.selected.getCheckedNodes().map(it => it.id).join(',')
        params.user_ids = this.users.map(it => it.id).join(',')

        if (this.id) params.id = this.id

        return this.$refs.form.validate()
          .then(() => {
            Object.assign(params, this.form, { status })
            params.aids = this.$refs.upload.getFiles('string')
            params.org_ids = this.$refs.tree.$refs.selected.getCheckedNodes().map(it => it.id).join(',')

            if (type === 'submitting') {
              this.$confirm('是否确认提交？', '提示', {
                type: 'warning',
              }).then(() => {
                this.doSubmit({ uri, params, type })
              }).catch(() => {})
            } else {
              this.doSubmit({ uri, params, type })
            }
          })
          .catch(() => {
            this.$utils.tools.backToTop()
          })
      },

      doSubmit({ uri, params, type }) {
        this[type] = true
        this.$axios.post(uri, { ...params })
          .then(() => {
            const message = `通告${type === 'submitting' ? '创建' : '暂存'}成功`
            this.$message.success(message)
            this[type] = false
            this.canRedirect = true
            this.$router.go(-1)
          })
          .catch(() => {
            this[type] = false
          })
      },

      cancel() {
        this.$router.go(-1)
      },

      selectEmployee(employee) {
        this.users = [].concat(employee)
      },
    },

    beforeRouteLeave(to, from, next) {
      if (this.canRedirect) return next()

      return setTimeout(() => {
        this
          .$confirm('系统可能不会保存您所做的更改，确认离开？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            closeOnHashChange: false,
          })
          .then(() => next())
          .catch(() => next(false))
      }, 0)
    },
  }
</script>
