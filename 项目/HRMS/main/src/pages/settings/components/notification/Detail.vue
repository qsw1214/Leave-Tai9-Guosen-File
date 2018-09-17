<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="page notification-detail">
    <m-breadcrumb :items="breadcrumb" />

    <template v-if="detail">
      <detail-form :data="detail" />

      <m-section
        class="section-fix"
        title="通告权限设置">
        <m-section-cell
          title="可查阅部门"
          v-if="detail.org_list.length" />

        <organizations
          v-if="detail.org_list.length"
          :tree="organizations"
          :checked="detail.org_list" />

        <m-section-cell title="可查阅用户" />

        <users :users="detail.user_list" />
      </m-section>

      <template v-if="isApproving">
        <m-section
          is-form
          title="审核结果">
          <m-section-row>
            <m-section-cell
              title="审核时间"
              content="发布后由系统自动生成" />
          </m-section-row>

          <el-form
            class="m-section--form"
            label-width="140px"
            ref="form"
            :model="form"
            :rules="rules">
            <el-form-item
              prop="approval_subject"
              label="审核意见">
              <el-input
                style="width: 100%;"
                v-model="form.approval_subject" />
            </el-form-item>
          </el-form>
        </m-section>

        <div class="page--actions">
          <el-button
            type="primary"
            :loading="buttonLoading.agree"
            @click="submit('agree')">同意发布</el-button>

          <el-button
            type="info"
            :loading="buttonLoading.reject"
            @click="submit('reject')">退回</el-button>

          <el-button
            type="info"
            @click="cancel">取消</el-button>
        </div>
      </template>

      <m-section
        title="审核结果"
        v-else-if="showApprovalResult">
        <m-section-row>
          <m-section-cell
            title="审核时间"
            :content="detail.release_time || '未发布'" />
        </m-section-row>

        <m-section-row>
          <m-section-cell
            title="审核意见"
            :content="approval" />
        </m-section-row>
      </m-section>

    </template>
  </div>
</template>

<script>
  import DetailForm from './DetailForm'
  import Organizations from './DetailOrganizations'
  import Users from './DetailUsers'

  export default {
    name: 'NotificationDetail',
    components: {
      DetailForm,
      Organizations,
      Users,
    },

    data() {
      const { params, path } = this.$route
      let to = '/notification'
      let isApproving = false
      const breadcrumb = [
        { name: '数据管理' },
        { name: '通知公告' },
      ]

      if (path.indexOf('/approving') > 0) {
        to += '/approving'
        isApproving = true
        breadcrumb.push({ name: '待我审核', to })
      }

      breadcrumb[1].to = to

      return {
        loading: false,
        breadcrumb,
        id: params.id,
        detail: null,
        isApproving,
        buttonLoading: {
          agree: false,
          reject: false,
        },
        form: {
          approval_subject: '',
        },
        rules: {
          approval_subject: [
            { required: true, trigger: 'blur', message: '请填写审核意见' },
          ],
        },
        canRedirect: false,
        organizations: [],
      }
    },

    computed: {
      approval() {
        const { approval_subject, category } = this.detail
        if (category === 2) return '同意'
        return (approval_subject || '待审核')
      },

      showApprovalResult() {
        const { status } = this.detail

        if (!this.$permission.valid('1050004') && status === 4) {
          return false
        }

        return true
      },
    },

    created() {
      this.loading = true
      Promise.all([this.fetch(), this.fetchOrganizations()])
        .then((res) => {
          this.detail = res[0].data
          this.breadcrumb.push({ name: res[0].data.title })
          this.organizations = [res[1].data]
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },

    methods: {
      fetch() {
        return this.$axios.get(this.$api.settings.notification.detail, {
          params: { id: this.id },
        })
      },

      // 此处没有采取组件内获取数据，外部获取数据填充
      fetchOrganizations() {
        return this.$axios.get(this.$api.common.organizationLevel)
      },

      cancel() {
        this.$router.go(-1)
      },

      submit(type) {
        // 特殊处理，如果是同意并且没有填写approval_subject时，默认填写同意
        if (type === 'agree' && !this.form.approval_subject) {
          this.form.approval_subject = '同意'
        }

        this.$refs.form
          .validate()
          .then(() => {
            this.confirmation(type)
          })
          .catch(() => {})
      },

      confirmation(type) {
        const msg = type === 'agree' ? '发布' : '退回'
        this
          .$confirm(`确定${msg}该通知公告吗？`, '提示', {
            type: 'warning',
          })
          .then(() => {
            this.doSubmit(type)
          })
          .catch(() => {})
      },

      doSubmit(type) {
        const { id, form } = this
        this.buttonLoading[type] = true
        this.$axios
          .post(this.$api.settings.notification.approve, {
            id,
            status: type === 'agree' ? '2' : '8',
            approval_subject: form.approval_subject,
          })
          .then(() => {
            this.canRedirect = true
            const msg = type === 'agree' ? '发布' : '退回'
            this.$message({
              message: `该公告已${msg}`,
              type: 'success',
            })

            setTimeout(() => {
              this.$router.go(-1)
            }, 2000)
          })
          .catch(() => {})
          .then(() => {
            this.buttonLoading = false
          })
      },
    },

    beforeRouteLeave(to, from, next) {
      if (!this.isApproving || this.canRedirect) return next()

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

<style lang="scss">
.notification-detail {
  .section-fix {
    padding-bottom: 14px;

    .m-section--cell-title {
      margin-left: 20px;
    }

    .m-section--row {
      border: 0;
    }
  }
}
</style>
