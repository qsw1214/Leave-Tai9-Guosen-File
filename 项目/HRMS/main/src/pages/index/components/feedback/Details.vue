<template>
  <div
    v-loading="loading"
    class="page page-feedback-details">
    <m-breadcrumb :items="breadcrumb" />
    <user-info :data="data.user_info" />
    <m-section
      title="反馈内容"
      :is-form="isPcoess">
      <m-section-row>
        <m-section-cell
          title="反馈日期"
          :content="data.date || '由系统自动生成'" />
      </m-section-row>
      <m-section-row>
        <m-section-cell
          title="标题"
          :content="data.title || '由系统自动生成'" />
      </m-section-row>
      <m-section-row>
        <m-section-cell
          title="详细描述"
          :content="data.content || '由系统自动生成'" />
      </m-section-row>
      <m-section-row>
        <m-section-cell title="附件上传">
          <m-attachment
            :download-all-fn="downloadAll"
            :data="data.aids || []" />
        </m-section-cell>
      </m-section-row>
      <m-section-row v-if="!isPcoess">
        <m-section-cell
          title="处理状态"
          :content="data.status_name" />
      </m-section-row>
      <m-section-row v-if="!isPcoess">
        <m-section-cell
          title="处理结果"
          :content="data.result" />
      </m-section-row>

      <el-form
        class="m-section--form"
        label-width="140px"
        v-if="isPcoess"
        ref="form"
        :model="formData"
        :rules="formRules">
        <el-form-item
          label="处理状态"
          prop="status">
          <el-select v-model="formData.status">
            <el-option
              label="已解决"
              value="8" />
            <el-option
              label="后续解决"
              value="16" />
            <el-option
              label="暂不处理"
              value="4" />
          </el-select>
        </el-form-item>

        <el-form-item
          label="处理结果"
          prop="result">
          <el-input
            type="textarea"
            :rows="3"
            v-model="formData.result" />
        </el-form-item>
      </el-form>
    </m-section>
    <div
      class="btn-action"
      v-if="isPcoess">
      <el-button
        type="primary"
        @click="submit">提交</el-button>
      <el-button
        type="info"
        @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
  import UserInfo from '../common/UserInfo'

  export default {
    components: {
      UserInfo,
    },
    data() {
      const { id } = this.$route.params
      let isPcoess = false
      if (this.$route.params.process) isPcoess = true
      let listPath = '/feedback/list'
      if (this.$route.query.tab) {
        listPath = `${listPath}/${this.$route.query.tab}`
      }
      return {
        id,
        isPcoess,
        loading: false,
        canRedirect: false,
        breadcrumb: [
          { name: '主页', to: '/index' },
          {
            name: '建议反馈',
            to: listPath,
          },
          { name: '详情' },
        ],
        data: {},
        formData: {
          status: '',
          result: '',
        },
        formRules: {
          status: [{
            required: true,
            tagger: 'change',
            message: '请选择处理状态',
          }],
          result: [{
            required: true,
            tagger: 'blur',
            message: '请输入处理结果',
          }],
        },
      }
    },
    beforeRouteLeave(to, from, next) {
      if (this.isPcoess) {
        if (this.canRedirect) {
          next()
        } else {
          next(false)
          setTimeout(() => {
            this.$confirm('系统可能不会保存您所做的更改，确认离开？', '提示', {
              type: 'warning',
            }).then(() => next()).catch(() => next(false))
          }, 0)
        }
      } else {
        next()
      }
    },
    created() {
      this.fetch()
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
            if (this.data.status > 2) {
              this.formData.status = this.data.status.toString()
              this.formData.result = this.data.result
            }
            this.breadcrumb[2].name = this.data.title
          }).catch(() => {})
      },
      downloadAll() {
        const ids = this.data.aids.map(i => i.id)
        this.$axios({
          url: this.$api.common.attachmentsDownload,
          method: 'post',
          data: {
            aids: ids.join(','),
          },
        })
          .then((data) => {
            this.$utils.tools.windowOpen(data.data.url)
          })
      },
      cancel() {
        this.$router.push({
          path: '/feedback/list',
        })
      },
      submit() {
        if (this.loading) return
        this.$refs.form.validate((result) => {
          if (result) {
            this.canRedirect = true
            this.loading = true
            this.$axios({
              url: this.$api.index.feedback.process,
              method: 'post',
              data: {
                id: this.id,
                status: this.formData.status,
                result: this.formData.result,
              },
            })
              .then(() => {
                this.loading = false
                this.$message({
                  message: '提交成功',
                  type: 'success',
                })
                window.setTimeout(() => {
                  this.isPcoess = false
                  this.$router.push({
                    path: '/feedback/list/process',
                  })
                  this.fetch()
                }, 1000)
              })
          }
        })
      },
    },
  }
</script>
