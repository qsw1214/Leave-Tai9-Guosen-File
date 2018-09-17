export default {
  data() {
    const { page, size, keyword } = this.$route.query
    const keywords = keyword ? this.$utils.tools.splitKeyword(keyword).join(',') : ''

    return {
      pagination: {
        pageSize: Number(size) || 20,
        currentPage: Number(page) || 1,
        total: 0,
      },
      keyword: keyword || '',
      keywords,
    }
  },

  methods: {
    setRouterQuery(obj) {
      const { query } = this.$route
      this.$router.replace({
        query: Object.assign({}, query, { ...obj, keyword: this.keyword }),
      })
    },

    doSearch() {
      const keywords = this.keyword
        ? this.$utils.tools.splitKeyword(this.keyword).join(',')
        : ''

      this.keywords = keywords
      this.setRouterQuery({ page: 1 })
      this.pagination.currentPage = 1
      this.fetch()
    },
  },
}
