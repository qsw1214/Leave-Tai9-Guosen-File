/**
 * @description 流程 mixins
 */

const mixin = {
  computed: {
    detail() {
      const {
        apply_date,
        code,
        status_name,
        flow_form_data,
      } = this.info

      return {
        apply_date,
        code,
        status_name,
        ...flow_form_data,
      }
    },
  },
}

const application = {
  ...mixin,

  created() {
    this.fetch()
  },

  methods: {
    fetch() {
      this.getInfo().then((detail) => {
        this.getLogsAndPath().then(({ data }) => {
          // 我发起的，合并审核附件跟发起附件
          const formAttachments = detail.data.flow_form_data.attachment_list || []
          const approvalAttachments = data.approval_attachment_list || []
          detail.data.flow_form_data.attachment_list =
            formAttachments.concat(approvalAttachments)
        }).catch((err) => {
          console.log(err)
        })
      })
    },
  },
}

const approved = {
  ...mixin,

  created() {
    this.getInfo()
      .then(this.getResult)
  },
}

const approving = {
  ...mixin,

  created() {
    this.fetch()
  },

  methods: {
    fetch() {
      this.getInfo()
        .then(this.getLogs)
    },

    paramsHandler({ step }) {
      const { id, result } = this

      return {
        id,
        step,
        approval_form_data: JSON.stringify(result),
      }
    },

    validator(success, { step }) {
      //  2-同意 | 4-退回 | 32-确认
      if (step === '4') {
        this.$refs.approvalForm
          .validateField('approval_subject', (error) => {
            if (!error) success()
          })
      } else {
        this.$refs.approvalForm
          .validate()
          .then(success)
          .catch(() => {})
      }
    },
  },
}

const pa = {
  methods: {
    fetch() {
      if (this.id) {
        this.getInfo()
          .then((res) => {
            if (res.data.status === 94) {
              this.getLogsAndPath()
            }
          })
      }
    },

    paramsHandler(type) {
      const { code, id, info } = this
      const data = this.form
        ? JSON.parse(JSON.stringify(this.form))
        : JSON.parse(JSON.stringify(info.flow_form_data))
      const status = type === 'stash' ? '0' : '30'
      const url = id ? '/flow/edit' : '/flow/add'

      const params = {
        status,
        flow_form_data: JSON.stringify(data),
      }

      if (id) params.id = id
      else params.flow_config_code = code

      return {
        url, params,
      }
    },

    submitHanleder(type) {
      const message = type === 'stash'
        ? '流程暂存成功。'
        : (this.submitMessage || '提交完成，预计三个工作日审批完成，请留意流程审批状态。')

      this.$message({
        type: 'success',
        message,
        duration: 2000,
        onClose: () => {
          this.link(type)
        },
      })
    },

    link(type) {
      const path = this.redirectPath

      if (!path) throw new Error('需设置发起流程完成后的跳转链接: redirectPath')

      this.canRedirect = true
      this.button[type] = false
      this.$router.replace({ path })
    },

    submitPost(type) {
      const { url, params } = this.paramsHandler(type)

      this.button[type] = true
      this.$axios
        .post(url, { ...params })
        .then((res) => {
          const { status, message } = res.data
          const success = Number(status) !== 92
          if (success) {
            this.submitHanleder(type)
          } else {
            this.$utils.tools.messageHandler(message, () => {
              this.link(type)
            })
          }
        })
        .catch(() => {
          this.button[type] = false
        })
    },

    submit(type, message) {
      // 有正在上传附件的话，return 并弹提示
      const submitName = type === 'stash' ? '暂存' : '提交'

      if (this.$refs.upload && this.$refs.upload.processing) {
        return this.$message({
          message: `附件正在上传中，请稍后再${submitName}`,
          type: 'warning',
        })
      }

      return this.$refs.form.validate()
        .then(() => {
          if (type === 'stash') {
            // 暂存无需确认
            this.submitPost(type)
          } else {
            const tip = message || '是否提交？'
            this
              .$confirm(tip, '提示', {
                type: 'warning',
              })
              .then(() => {
                this.submitPost(type)
              })
              .catch(() => {})
          }
        })
        .catch(() => {})
    },
  },
}

export default {
  application,
  approved,
  approving,
  pa,
  detailData: mixin,
}
