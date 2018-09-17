const { api } = window.Lib.utils.default

api.install('manager', {
  attendance: {
    // 获取每日看板信息
    getTodayInfo: '/report-attendance/get-today-info',
    // 获取平均工时
    getWorkTimeRank: '/report-attendance/get-avg-workhours-rank-list',
    // 获取迟到
    getDelayRank: '/report-attendance/get-late-rank-list',
    // 获取平均工时
    exportWorkTimeRank: '/report-attendance/export-avg-workhours-rank',
    // 获取迟到
    exportDelayRank: '/report-attendance/export-late-rank',
  },
})

export default api
