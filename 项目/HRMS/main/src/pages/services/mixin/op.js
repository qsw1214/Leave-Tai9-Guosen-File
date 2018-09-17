const list = {
  data() {
    return {
      code: '',
      loading: false,
      data: [],
      total: 0,
      pageSize: 20,
      pageIndex: 1,
      currentPage: 1,
      submitPath: '',
      approvingPath: '',
      detailsPath: '',
    }
  },
  computed: {
    // 是否有审批中的流程
    hasApproval() {
      if (this.data.length === 0) return false
      if (this.data.filter(item => Number(item.status) === 30).length > 0) return true
      return false
    },
  },
  methods: {
    // 获取数据
    fetch() {
      this.loading = true
      this.$axios({
        url: this.$api.services.op.list,
        params: {
          code: this.code,
        },
      })
        .then((data) => {
          this.loading = false
          if (data.code === 0) {
            this.data = data.data.list
          }
        }).catch(() => {
          this.loading = false
        })
    },
    // 页面更改
    changePage(value) {
      this.currentPage = value
    },
    // 重新提交
    toSubmit(row, type) {
      this.$router.push({
        path: `${type ? this.approvingPath : this.submitPath}/${row.id}`,
      })
    },
    toDetails(row) {
      const from = encodeURIComponent(`${window.location.pathname}${window.location.hash}`)
      const url = `${this.detailsPath}/${row.flow_config_code}/${row.id}?from=${from}`
      this.$router.push(url)
    },
    // 点击操作
    handledClick(type) {
      switch (type) {
      case 'initiated':
        this.$router.push({
          path: this.submitPath,
        })
        break
      case 'delete':
        if (this.selectedItems.length > 0) {
          this.$confirm('确认删除选中数据', '提示', {
            type: 'warning',
          })
            .then(() => {
              this.delete()
            }).catch(() => {})
        } else {
          this.$message({
            type: 'warning',
            message: '请勾选需要删除的数据',
          })
        }
        break
      default:
        break
      }
    },
  },
}

export default {
  list,
}
