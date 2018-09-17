const { api } = window.Lib.utils.default

api.install('report', {
  // 考勤
  attendance: {
    // 明细列表
    listDetails: '/report-attendance/get-detail-list',
    // 汇总列表
    listSummary: '/report-attendance/get-collect-list',
    // 算薪列表
    listSalary: '/report-attendance/get-salary-month-list',
    // 导出接口
    listExport: '/report-attendance/multi',
  },
})

export default api
