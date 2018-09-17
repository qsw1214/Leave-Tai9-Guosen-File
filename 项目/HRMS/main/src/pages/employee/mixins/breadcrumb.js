export default {
  created() {
    const { from } = this.$route.query
    const index = this.breadcrumb.length - 2

    if (from && from.indexOf('/settings.html#/process/index/monitor') !== -1) {
      this.breadcrumb[index] = { name: '流程监控', to: from, type: 'link' }
    } else if (from && from.indexOf('/services.html#/op') !== -1) {
      this.breadcrumb[index - 1] = { name: '员工自助' }
      this.breadcrumb[index] = { name: '组织人事', to: from, type: 'link' }
    }
  },
}
