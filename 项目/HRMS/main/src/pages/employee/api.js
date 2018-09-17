const { api } = window.Lib.utils.default

api.install('employee', {
  // maintain
  employList: '/user/index',
  employeeImportTemplate: '/user/download-template',
  employeeUploadExcelUrl: '/user/import',
  employeeUploadProgressUrl: '/user/import-result',
  employeeExportUrl: '/user/multi',
  employeeDel: '/user/multi',
  // case
  caseBaseInformation: '/query/init',
  caseAllCase: '/query/user-list',
  delOneCase: '/query/delete',
  addOneCase: '/query/add',
  // 获取员工信息详情
  employeeDetail: '/user/get-detail',
  // 头像上传
  employeeAvatar: '/user/upload-avatar',
  // 新建员工信息
  employeeCreate: '/user/add',
  // 修改员工详情
  employeeEdit: '/user/edit',
  approved: {
    list: '/flow/get-approvaled-list',
    detail: '/flow/get-detail-by-approvaled',
  },

  // 流程公用接口
  flow: {
    // 待我审批 badge
    tip: '/common/get-tip-info',
    // 更新 badge
    updateTip: '/common/update-tip-info',
    // 入离调转列表
    list: '/flow/get-rldz-list-by-pro',
    // 入离调转已审批列表
    approvedList: '/flow/get-rldz-approvaled-list-by-pro',
    // 入离调转待审批列表
    approvingList: '/flow/get-rldz-approvaler-list-by-pro',
    // 审批记录详情
    approvalLogNodes: '/flow/get-approval-node-list',
    // 流程多选操作
    multi: '/flow/multi',
  },

  toEntry: {
    applicationList: '/flow/get-applier-list',
    getEmployeeBaseinfo: 'flow/get-to-entry-detail',
    getUserBeforeStatus: '/common/get-flow-before-user-status',
  },

  entry: {
    getFileCode: '/common/get-user-info-by-code',
  },

  // 获取当前用户任职信息和部门生效日期
  transfer: {
    validDate: '/common/get-user-job-info-org-info-now',
  },
})

export default api
