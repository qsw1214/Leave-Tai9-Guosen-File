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
      dialogIntroductionVisible: false,
      bookIntroduction: '',
    }
  },
  methods: {
    fetch() {},
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
    // 显示书籍简介
    showBorrowIntroduction(row) {
      this.bookIntroduction = row.introduction
      this.dialogIntroductionVisible = true
    },
  },
}
