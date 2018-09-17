export default {
  data() {
    return {
      loading: false,
      keyword: '',
      keywordValues: '',
      pageIndex: 1,
      pageSize: 20,
      total: 0,
      data: [],
      selectedItems: [],
      fetchUrl: '',
    }
  },
  methods: {
    fetch() {
      if (this.loading) return
      this.loading = true
      this.$axios({
        method: 'post',
        url: this.fetchUrl,
        data: {
          keywords: this.keywordValues,
          per_page: this.pageSize,
          page: this.pageIndex,
        },
      })
        .then((data) => {
          this.loading = false
          this.data = data.data.list
          this.total = data.data.count
        }).catch(() => {})
    },
    // 搜索
    search() {
      this.keywordValues = this.$utils.tools.splitKeyword(this.keyword).join(',')
      this.pageIndex = 1
      this.fetch()
    },
    changePageIndex(value) {
      this.pageIndex = value
      this.fetch()
    },
    changePageSize(value) {
      this.pageSize = value
      this.pageIndex = 1
      this.fetch()
    },
    rowSelected(items) {
      this.selectedItems = items
    },
  },
}
