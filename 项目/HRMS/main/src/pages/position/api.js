const { api } = window.Lib.utils.default

api.install('position', {
  // job
  jobList: '/duty/get-list',
  // job -- 职务类型及职级
  jobChildList: '/common/get-duty-child-list',
  // job -- 职务新增
  jobAdd: 'duty/add',
  // job -- 职务修改
  jobEdit: '/duty/edit',
  jobOption: '/duty/multi',
  jobImportTemplate: '/duty/download-template',
  jobUploadExcelUrl: '/duty/import',
  // position
  positionList: '/job/get-list',
  positionOption: '/job/multi',
  positionImportTemplate: '/job/download-template',
  positionUploadExcelUrl: '/job/import',
  // position -- 职位新建、修改、详情、上传附件
  position: {
    add: '/job/add',
    edit: '/job/edit',
    get: '/job/get-detail',
    attachment: '/job/upload-atta',
  },
})

export default api
