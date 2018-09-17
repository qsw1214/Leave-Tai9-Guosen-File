const { api } = window.Lib.utils.default

api.install('services', {
  // 员工服务，流程发起
  pa: {
    // 流程发起初始化
    init: '/flow/init',
    // 发起流程
    add: '/flow/add',
    // 修改流程
    edit: '/flow/edit',
    // 审批流程
    approval: 'flow/approval',
    // 流程上传附件
    upload: '/flow/upload-atta',
    // 获取流程配置项目
    config: 'flow/get-flow-config-list',
    // 获取上方角标
    tip: '/common/get-tip-info',
    // 获取上方角标
    updateTip: '/common/update-tip-info',
  },

  // 待我审批
  approving: {
    list: '/flow/get-approvaler-list',
    detail: '/flow/get-detail-by-approvaler',
  },

  // 我已审批:
  approved: {
    list: '/flow/get-approvaled-list',
    detail: '/flow/get-detail-by-approvaled',
  },

  flowDetail: '/flow/get-detail',

  // 由我发起
  application: {
    list: '/flow/get-applier-list',
    delProcess: '/flow/multi',
    detail: '/flow/get-detail-by-applier',
  },

  // 订餐列表
  foodList: '/bookdinner/get-list',
  // 组织人事
  op: {
    // 列表数据
    list: '/flow/get-rldz-list',
    userJob: '/common/get-user-job-now',
  },
  // 在线HR小助手
  helper: {
    // 列表数据
    list: '/hr-helper/get-list',
    // 下载全部附件
    downloadAll: '/helperposts/export',
  },

  // 考勤
  attendance: {
    getDaysOfLeave: '/flow/get-kqqj-type-day-num',
    getDaysOfRange: '/common/get-kq-date-range',
    getRestDayNum: 'flow/get-kq-rest-day-num',
  },
})

export default api
