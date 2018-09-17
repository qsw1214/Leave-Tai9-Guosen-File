/**
 * @description 人事盛情、临时工卡、正式工卡使用该mixin
 */
const commomMethod = {
  methods: {
    // 获取详情
    getInfo() {
      this.loading = true
      return new Promise((resolve, reject) => {
        this.$axios
          .post(this.$api.services.flowDetail, {
            id: this.$route.params.id,
          })
          .then((res) => {
            this.loading = false
            this.info = res.data
            resolve(res)
          })
          .catch(() => {
            reject()
          })
      })
    },
    // 我发起的
    getLogsAndPath() {
      this.loading = true
      return new Promise((resolve, reject) => {
        this.$axios
          .post(this.$api.services.application.detail, {
            id: this.$route.params.id,
          })
          .then((res) => {
            this.loading = false
            this.logs = res.data
            resolve(res)
          })
          .catch(() => {
            this.loading = false
            reject()
          })
      })
    },
    // 待我审批
    getLogs() {
      this.loading = true
      return new Promise((resolve, reject) => {
        this.$axios
          .post(this.$api.services.approving.detail, {
            id: this.$route.params.id,
          })
          .then((res) => {
            this.loading = false
            this.steps = res.data.approval_list
            resolve(res)
          })
          .catch(() => {
            this.loading = false
            reject()
          })
      })
    },
    // 我已审批
    getResult() {
      this.loading = true
      return new Promise((resolve, reject) => {
        this.$axios
          .post(this.$api.services.approved.detail, {
            approval_id: this.$route.query.approval_id,
          })
          .then((res) => {
            this.loading = false
            this.result = res.data.approval_form_data
            resolve(res)
          })
          .catch(() => {
            this.loading = false
            reject()
          })
      })
    },
    // 提交流程
    submit(url, params, tip) {
      this.$axios
        .post(url, params).then((res) => {
          const { status, message } = res.data
          const isSuccess = Number(status) !== 92
          this.$message({
            message: isSuccess ? tip : message,
            type: isSuccess ? 'success' : 'error',
            duration: isSuccess ? 2000 : 3000,
            onClose: () => {
              this.clearLoading()
              this.canRedirect = true
              this.$parent.$parent.canRedirect = true
              this.$router.push('/application/index')
            },
          })
        })
        .catch(() => {
          this.clearLoading()
          this.canRedirect = true
          this.$parent.$parent.canRedirect = false
        })
    },
    // 清除Loading
    clearLoading() {
      this.btn_loading = false
      this.btn_stash_loading = false
      this.btn_abort_loading = false
    },
    // 验证表单
    validateForm(formName, callback) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          /* eslint no-unused-expressions:0 */
          return callback && callback()
        }
        return false
      })
    },
    // 取消
    onCancle() {
      this.$router.go(-1)
    },
    // 审批
    approveing(url, params, tips) {
      this.$axios
        .post(url, params).then(() => {
          this.$message({
            message: tips,
            type: 'success',
            duration: 3000,
            onClose: () => {
              this.clearLoading()
              this.$router.push('/approving/index')
            },
          })
        })
        .catch(() => {
          this.clearLoading()
        })
    },
  },
}

const commonData = {
  data() {
    return {
      loading: false,
      info: {
        flow_form_data: {},
      },
      result: {},
      logs: {},
      steps: [],
      btn_loading: false,
      canRedirect: false,
      btn_stash_loading: false,
      btn_abort_loading: false,
    }
  },
}

export default {
  commomMethod,
  commonData,
}
