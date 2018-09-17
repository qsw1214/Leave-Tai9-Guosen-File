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

    validator(success) {
      this.$refs.approvalForm
        .validate()
        .then(success)
        .catch(() => {})
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
      const url = id
        ? this.$api.services.pa.edit
        : this.$api.services.pa.add

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
      this.canRedirect = true
      this.button[type] = false
      this.$router.replace({
        path: this.submitRedirectPath || '/application/index',
      })
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

    submit(type) {
      // 有正在上传附件的话，return 并弹提示
      const submitName = type === 'stash' ? '暂存' : '提交'

      if (this.$refs.upload && this.$refs.upload.processing) {
        return this.$message({
          message: `附件正在上传中，请稍后再${submitName}`,
          type: 'warning',
        })
      }

      return (() => {
        if (this.$refs.form) {
          return this.$refs.form.validate()
        }
        return Promise.resolve()
      })()
        .then(() => {
          if (type === 'stash') {
            // 暂存无需确认
            this.submitPost(type)
          } else {
            this
              .$confirm('是否提交？', '提示', {
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

const pl = {
  data() {
    return {
      loading: false,
      currentPage: 1,
      selectedItems: [],
    }
  },
  methods: {
    // 删除确认
    delConfirm() {
      if (this.selectedItems.length > 0) {
        this.$confirm('确认删除选中数据', '提示', {
          type: 'warning',
        })
          .then(() => {
            this.delRequest()
          }).catch(() => {})
      } else {
        this.$message({
          type: 'warning',
          message: '请勾选需要删除的数据',
        })
      }
    },
    // 删除请求发送
    delRequest() {
      if (this.loading) return
      this.loading = true
      const ids = this.selectedItems.map(item => item.id)
      this.$axios({
        url: this.$api.services.application.delProcess,
        params: {
          ids: ids.join(','),
          type: 'delete',
        },
      })
        .then((data) => {
          this.loading = false
          if (data.code === 0) {
            this.$message({
              message: '删除成功',
              type: 'success',
            })
            this.currentPage = 1
            this.fetch()
          }
        }).catch(() => {
          this.loading = false
        })
    },
    // 列表数据勾选回调
    rowSelected(rows) {
      this.selectedItems = rows
    },
    // 列表提交操作按钮文本，为空则代表不能提交
    operateEditText(data, type) {
      switch (data.status) {
      case 0:
        return '提交'
      case 30:
        // 如果发起人和审批者同名不同人就杯具，tip
        return type && data.approvaler_names === data.name ? '审批' : ''
      case 94:
      case 92:
        return '重新提交'
      default:
        return ''
      }
    },
    // 列表详情按钮文本
    operateDetailsText(data, type) {
      switch (data.status) {
      case 30:
        // 如果发起人和审批者同名不同人就杯具，tip
        return type && data.approvaler_names === data.name ? '' : '查看'
      case 90:
        return '查看'
      case 91:
        return '待确认'
      default:
        return '详情'
      }
    },
    // 列表内容是否可勾选
    isSelected(data) {
      const status = Number(data.status)
      if (status === 0 || status === 92) {
        return true
      }
      return false
    },
  },
}
export default {
  application,
  approved,
  approving,
  pl,
  pa,
  detailData: mixin,
}
