export default {
  data() {
    return {
      tags: {
        title: '',
        head: [],
        show: false,
        list: [],
      },
    }
  },

  methods: {
    fetch() {
      const { pagination, keyword } = this

      this.loading = true
      this.$axios
        .get(this.uri, {
          params: {
            page: pagination.currentPage,
            per_page: pagination.pageSize,
            keywords: keyword ? this.$utils.tools.splitKeyword(keyword).join(',') : '',
          },
        })
        .then(({ data }) => {
          this.list = data.list
          this.pagination.total = data.count
        })
        .catch(() => {})
        .then(() => {
          this.loading = false
        })
    },
  },
}
