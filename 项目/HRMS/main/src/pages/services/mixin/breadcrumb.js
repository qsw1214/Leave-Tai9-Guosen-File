export default {
  created() {
    const { from } = this.$route.query

    if (from && from.indexOf('/settings.html#/process/index/monitor') !== -1) {
      this.breadcrumb[2] = { name: '流程监控', to: from, type: 'link' }
    }
  },
}
