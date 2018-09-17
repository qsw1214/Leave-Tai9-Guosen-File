export default {
  methods: {
    /*
     * 初始化用户信息
     */
    getInit() {
      this.loading = true
      return new Promise((resolve, reject) => {
        this.$axios
          .get('/flow/init')
          .then((res) => {
            resolve(res)
          })
          .catch(reject)
          .then(() => {
            this.loading = false
          })
      })
    },
    /*
     * 流程详情
     */
    getInfo() {
      this.loading = true
      return new Promise((resolve, reject) => {
        this.$axios
          .get('/flow/get-detail', {
            params: {
              id: this.$route.params.id,
            },
          })
          .then((res) => {
            const { data } = res
            const form = data.flow_form_data
            this.info = data

            if (form.attachment_list) {
              this.upload.files = this.upload.files.concat(form.attachment_list)
            }

            resolve(res)
          })
          .catch(reject)
          .then(() => {
            this.loading = false
          })
      })
    },

    /**
     * 获取审批记录 + 流程路径
     */
    getLogsAndPath() {
      this.loading = true
      return new Promise((resolve, reject) => {
        this.$axios
          .get('/flow/get-detail-by-applier', {
            params: {
              id: this.$route.params.id,
            },
          })
          .then((res) => {
            this.logsAndPath = res.data
            resolve(res)
          })
          .catch(reject)
          .then(() => {
            this.loading = false
          })
      })
    },

    /**
     * 获取审批记录
     */
    getLogs() {
      this.loading = true
      return new Promise((resolve, reject) => {
        this.$axios
          .get('/flow/get-detail-by-approvaler', {
            params: {
              id: this.$route.params.id,
            },
          })
          .then(({ data }) => {
            this.logs = data

            const lastForm = data.last_approval_form_data
            if (lastForm) {
              // 合并上一个审批者的审批结果到 result 数据中
              Object.assign(this.result, lastForm)

              // 上一个审批者有上传附件，合并到 upload.files
              if (lastForm.attachment_list && lastForm.attachment_list.length) {
                this.upload.files = lastForm.attachment_list
              }
            }

            resolve({ data })
          })
          .catch(reject)
          .then(() => {
            this.loading = false
          })
      })
    },

    /**
     * 获取审批结果
     */
    getResult() {
      this.loading = true
      return new Promise((resolve, reject) => {
        this.$axios
          .get('/flow/get-detail-by-approvaled', {
            params: {
              approval_id: this.$route.query.approval_id,
            },
          })
          .then((res) => {
            this.result = res.data.approval_form_data
            resolve(res)
          })
          .catch(reject)
          .then(() => {
            this.loading = false
          })
      })
    },

    // 取消
    cancel() {
      this.$router.go(-1)
    },

    /**
     * 审批流程
     * @param {String} step, 2-同意审批 | 4-退回 | 32-确认
     * @param {Function} success, success callback.
     * @param {Function} fail, fail callback.
     * @param {Function} onCloseMessage, call this after success message closed.
     */
    approval({ step, success, fail, onCloseMessage, debug }) {
      let type = 'agree'
      let tips = '同意'
      let message = '审批'

      if (step === '4') {
        type = 'reject'
        tips = '退回'
        message = '退回'
      }

      // 特殊处理，如果是同意并且没有填写approval_subject时，默认填写同意
      if (tips === '同意') {
        const formKeyWords = [
          'approvalResult',
          'form',
          'result',
        ]

        let isFix = false

        formKeyWords.forEach((key) => {
          if (
            Object.keys(this).includes(key)
            && Object.keys(this[key]).includes('approval_subject')
            && !this[key].approval_subject
          ) {
            this[key].approval_subject = tips
            isFix = true
          }
        })

        if (!isFix && this.result && !this.result.approval_subject) {
          this.result.approval_subject = tips
        }
      }

      // 有正在上传附件的话，return 并弹提示
      if (this.$refs.upload && this.$refs.upload.processing) {
        return this.$message({
          message: `附件正在上传中，请稍后再操作${tips}`,
          type: 'warning',
        })
      }

      return this.validator(() => {
        this.button[type] = true

        if (debug) {
          return console.log(this.paramsHandler({ step }))
        }

        return this
          .$confirm(`确定${tips}该申请吗？`, '提示', {
            type: 'warning',
          })
          .then(() => {
            this.$axios
              .post('flow/approval', {
                ...this.paramsHandler({ step }),
              })
              .then((res) => {
                this.canRedirect = true
                this.$message({
                  message: `该流程已${message}`,
                  type: 'success',
                  onClose: onCloseMessage,
                })

                setTimeout(() => {
                  if (typeof success === 'function') success(res)
                  this.$router.go(-1)
                }, 3000)
              })
              .catch(() => {
                if (typeof fail === 'function') fail()
              })
              .then(() => {
                this.resetLoading()
              })
          })
          .catch(() => {
            this.resetLoading()
          })
      }, { step })
    },

    resetLoading() {
      this.loading = false
      this.button = {
        reject: false,
        agree: false,
        submit: false,
        stash: false,
      }
    },
  },
}
