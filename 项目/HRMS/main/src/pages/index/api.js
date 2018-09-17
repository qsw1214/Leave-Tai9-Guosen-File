const { api } = window.Lib.utils.default

api.install('index', {
  // 初始化数据
  init: '/flow/init',
  notification: '/notice/get-front-end-detail',

  index: {
    // 待办列表
    todo: '/message/get-todo-list',
    // 标记代办项已读
    readed: '/message/edit',
    // 通知公告
    notification: '/message/get-notice-list',
    // 系统链接
    navigator: '/system-link/get-index-list',
    // 考勤记录列表
    attendanceRecord: '/report-attendance/get-month-record-list',
    // 流程申请列表
    flows: '/flow/get-flow-config-list',
  },

  // 建议反馈
  feedback: {
    // 处理列表
    listProcess: '/feedback/get-index-list',
    // 处理列表勾选操作
    listProcessSelected: '/feedback/multi',
    // 我的建议
    listSelf: '/feedback/get-list',
    listSelfSelected: '/feedback/multi',
    // 新建操作
    create: '/feedback/add',
    // 编辑
    edit: '/feedback/edit',
    // 上传附件
    upload: '/feedback/upload-atta',
    // 处理
    process: '/feedback/edit-feedback',
    // 详情页面
    details: '/feedback/get-detail',
  },
})

export default api
