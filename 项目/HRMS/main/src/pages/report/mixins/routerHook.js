export default {
  beforeRouteLeave(to, from, next) {
    if (this.canRedirect) {
      return next()
    }

    setTimeout(() => {
      this
        .$confirm('系统可能不会保存您所做的更改，确认离开？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnHashChange: false,
        })
        .then(() => next())
        .catch(() => next(false))
    }, 0)

    return true
  },
}
