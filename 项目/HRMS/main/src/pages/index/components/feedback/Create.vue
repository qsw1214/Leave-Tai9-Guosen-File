<template>
  <div
    v-loading="loading"
    class="page page-feedback-created">
    <m-breadcrumb :items="breadcrumb" />
    <user-info :data="data.user_info" />
    <m-section
      title="反馈内容"
      is-form>
      <m-section-row>
        <m-section-cell
          title="反馈日期"
          :content="data.date || '由系统自动生成'" />
      </m-section-row>

      <el-form
        class="m-section--form"
        label-width="140px"
        ref="form"
        :model="formData"
        :rules="formRules">

        <el-form-item
          label="标题"
          prop="title">
          <el-input
            class="el-input__title"
            v-model="formData.title" />
        </el-form-item>

        <el-form-item
          label="详细描述"
          prop="content">
          <el-input
            type="textarea"
            :rows="3"
            v-model="formData.content" />
        </el-form-item>
        <el-form-item label="附件上传">
          <m-upload
            class="upload"
            accept="image,pdf,ppt,word,excel,zip"
            ref="upload"
            :file-list="formData.aids"
            :before-upload="uploadBefore"
            :action="uploadUrl" />
        </el-form-item>
      </el-form>
    </m-section>
    <div class="btn-actions">
      <el-button
        type="primary"
        @click="submit">提交</el-button>

      <el-button
        type="info"
        @click="save">暂存</el-button>

      <el-button
        type="info"
        @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
  import mixins from '~index/mixins'
  import UserInfo from '../common/UserInfo'


  export default {
    components: {
      UserInfo,
    },
    mixins: [mixins.routerHook],
    data() {
      const { id } = this.$route.params
      const uploadUrl = this.$api.index.feedback.upload
      return {
        uploadUrl,
        id,
        loading: false,
        canRedirect: false,
        breadcrumb: [
          { name: '主页', to: '/index' },
          {
            name: '建议反馈',
            to: '/feedback/list/self',
          },
          { name: '新建' },
        ],
        data: {},
        formRules: {
          title: [
            {
              required: true,
              trigger: 'blur',
              message: '请输入标题',
            },
            {
              max: 20,
              message: '不能超过20个字符',
              trigger: 'blur',
            },
          ],
          content: [{
            required: true,
            trigger: 'blur',
            message: '请输入详情描述',
          }],
        },
        formData: {
          title: '',
          content: '',
          aids: [],
        },
      }
    },
    created() {
      if (this.$route.params.id) {
        this.fetch()
      }
    },
    methods: {
      fetch() {
        this.loading = true
        this.$axios({
          url: this.$api.index.feedback.details,
          method: 'post',
          data: {
            id: this.id,
          },
        })
          .then((data) => {
            this.loading = false
            this.data = data.data
            this.formData.title = this.data.title
            this.formData.content = this.data.content
            this.formData.aids = this.data.aids
          }).catch(() => {})
      },
      save() {
        if (!this.uploadBefore('附件正在上传中，请稍后暂存')) return
        this.$refs.form.validate((result) => {
          if (result) {
            this.handleSubmit(1, () => {
              this.$message({
                type: 'success',
                message: '保存成功',
              })
            })
          }
        })
      },
      handleSubmit(type, callback) {
        this.loading = true
        const submitData = {
          title: this.formData.title,
          content: this.formData.content,
          aids: this.$refs.upload.getFiles('string'),
          status: type,
        }
        let url = ''
        if (this.id) {
          url = this.$api.index.feedback.edit
          submitData.id = this.id
        } else {
          url = this.$api.index.feedback.create
        }
        this.$axios({
          url,
          method: 'post',
          data: submitData,
        })
          .then(() => {
            this.canRedirect = true
            this.loading = false
            callback()
            window.setTimeout(() => {
              this.$router.push({
                path: '/feedback/list/self',
              })
            }, 1000)
          }).catch(() => {
            this.loading = false
          })
      },
      submit() {
        if (!this.uploadBefore('附件正在上传中，请稍后提交')) return
        this.$refs.form.validate((result) => {
          if (result) {
            this.$confirm('点击确认将会提交建议反馈，是否继续？', '提示', {
              type: 'warning',
            })
              .then(() => {
                this.handleSubmit(2, () => {
                  this.$message({
                    type: 'success',
                    message: '提交成功',
                  })
                })
              })
          }
        })
      },
      // 上传之前的回调
      uploadBefore(message) {
        if (this.$refs.upload.processing) {
          this.$message({
            type: 'error',
            message: message || '附件正在上传中，请稍后再上传',
          })
          return false
        }
        return true
      },
      cancel() {
        this.$router.push({
          path: '/feedback/list/self',
        })
      },
    },
  }
</script>

<style lang="scss" type="text/scss">
.page-feedback-created {
  .el-input__title {
    display: block;
    width: auto !important;
  }
}
</style>
