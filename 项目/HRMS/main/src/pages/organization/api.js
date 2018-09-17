const { api } = window.Lib.utils.default

api.install('organization', {
  // 组织管理接口列表
  maintainList: '/org/get-list',
  // 下载导出模板Excel
  downloadExcel: '/org/download-template',
  // 上传导入文件
  uploadExcel: '/org/import',
  // 导出操作
  exportUrl: '/org/multi',
  // 删除操作
  delUrl: '/org/multi',
  // 导出树状图
  exportOrgTree: '/org/export-org-full-tree',
  // 组织新建、查询、修改、历史
  org: {
    edit: '/org/edit',
    add: '/org/add',
    get: 'org/get-detail',
    history: '/org/get-profiles-list',
  },
  // 法人设置列表
  legalPersonList: '/legal-entity/get-list',
  // 法人设置详情
  legalPersonDetials: '/legal-entity/get-detail',
  // 法人设置修改
  legalPersonEdit: '/legal-entity/edit',
  // 法人设置新增
  legalPersonAdd: '/legal-entity/add',
  // 法人设置历史
  legalPersonHistory: '/legal-entity/get-profiles-list',
  // 法人设置上传附件
  legalPersonUpload: '/legal-entity/upload-atta',
  // 法人设置列表勾选之后的操作
  legalPersonSelected: '/legal-entity/multi',
  // 组织调整：列表
  adjustList: '/workorder/get-org-list',
  // 组织调整：详情
  adjustDetails: '/workorder/get-detail',
  // 组织调整：新增
  adjustAdd: '/workorder/add',
  // 组织调整：编辑
  adjustEdit: '/workorder/edit',
  // 组织调整快照
  adjustSnap: '/workorder/get-detail-snap',

  // 员工列表
  user: {
    list: '/user/get-list',
    multiSelect: '/user/multi',
  },
})

export default api
