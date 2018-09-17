const { api } = window.Lib.utils.default

api.install('oa', {
  contact: '/ent-directories/get-list',
  // 图书管理
  books: {
    // 图书清单列表
    listAll: '/books-management/get-detail-list',
    // 我借阅列表
    listBorrow: 'book-borrow/get-list',
    // 我要分享
    listShare: '/books-management/get-list',
    // 图书勾选操作
    listShareSelected: 'books-management/multi',
    // 图书管理导入模板下载
    importDownloadTemplate: '/books-management/download-template',
    // 图书分享导入
    shareImport: '/books-management/import',
    // 分享新建
    shareCreate: '/books-management/add',
    // 分享编辑
    shareEdit: '/books-management/edit',
    // 修改借阅人信息
    editBorrow: '/book-borrow/edit',
    // 分享详情
    shareDetails: '/books-management/get-detail',
    // 图书借阅
    borrow: '/book-borrow/add',
  },
  // 知识仓库
  mine: {
    list: '/knowledge/get-list',
    delete: '/knowledge/delete',
    add: '/knowledge/add',
    edit: '/knowledge/edit',
  },
  // 会议管理
  meeting: {
    // 新建会议
    add: '/meeting/add',
    // 编辑会议
    edit: '/meeting/edit',
    // 上传附件
    atta: '/meeting/upload-atta',
    // 会议详情
    detail: '/meeting/get-detail',
    // 所有本人相关会议列表
    meetingList: '/meeting/get-index-list',
    // 所有本人相关会议删除撤销多选操作
    multi: '/meeting/multi',
    // 全部区域及会议室
    roomList: '/conference-room/get-all',
    // 会议室详情
    roomDetail: '/conference-room/get-detail',
    // 查询条件已预定会议列表
    roomMeetingList: '/meeting/get-list',
    // 会议室查询已预定会议列表详情
    roomMeetingListDetail: '/meeting/get-meeting-detail',
  },
  // 知识仓库
  warehouse: {
    // 获取首页列表
    list: '/knowledge/get-index-list',
    // 获取单列组织列表（可抽取组件TODO）
    orgs: '/common/get-org-list',
    // 获取详情
    detail: '/knowledge/get-detail',
  },
})

export default api
