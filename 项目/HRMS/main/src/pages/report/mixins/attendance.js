export default {
  data() {
    const today = this.$utils.tools.formatDate(new Date(), 'YYYY-MM-DD')
    const orgUrl = this.$api.common.organizationLevelAuth
    return {
      today,
      orgUrl,
      loading: false,
      keyword: '',
      keywordValues: '',
      pageIndex: 1,
      pageSize: 20,
      total: 0,
      data: [],
      orgId: '',
      selectedItems: [],
      exportType: '',
    }
  },
  methods: {
    // 搜索
    search() {
      this.keywordValues = this.$utils.tools.splitKeyword(this.keyword).join(',')
      this.validForm()
    },
    selectionChange(value) {
      this.selectedItems = value
    },
    changeDep() {
      this.validForm()
    },
    validForm() {
      this.$refs.form.validate((result) => {
        if (result) {
          this.pageIndex = 1
          this.fetch()
        }
      })
    },
    changePageIndex(value) {
      this.pageIndex = value
      this.fetch()
    },
    changePageSize(value) {
      this.pageSize = value
      this.fetch()
    },
    expxortExcel() {
      let ids = ''
      if (this.selectedItems.length > 0) {
        const idArr = this.selectedItems.map(item => item.id)
        ids = idArr.join(',')
      }
      const params = Object.assign({}, this.requestParams, {
        ids,
        export_type: this.exportType,
      })
      this.$axios({
        url: this.$api.report.attendance.listExport,
        method: 'post',
        data: params,
      })
        .then((data) => {
          this.$utils.tools.windowOpen(data.data.url)
        }).catch(() => {})
    },
  },
}
