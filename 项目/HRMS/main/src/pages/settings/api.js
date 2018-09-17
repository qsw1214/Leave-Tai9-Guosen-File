const { api } = window.Lib.utils.default

api.install('settings', {
  // 角色列表
  roleList: '/role/get-list',
  // role,编辑查看等接口
  role: {
    detail: '/role/get-detail',
    add: '/role/add',
    edit: '/role/edit',
    authList: '/auth/get-auth-list',
  },
  // 权限列表
  permissionList: '/auth/get-list',
  // 导入上传excel
  permissionUploadExcelUrl: '/auth/import',
  // 导入下载模板
  permissionDownloadExcelUrl: '/auth/download-template',
  // 导出权限数据
  permissionExport: '/auth/multi',
  // permission,编辑查看等接口
  permission: {
    detail: '/auth/get-detail',
    edit: '/auth/edit',
    // 角色列表为roleList接口
    // 组织范围为组织选择器接口
  },
  // 订餐服务接口
  orderFood: {
    // 列表接口
    list: '/bookdinner/get-list',
    // 添加
    add: '/bookdinner/add',
    // 修改
    edit: '/bookdinner/edit',
    // 获取添加订餐商品配置数据接口
    config: '/bookdinner/init',
    // 上传导入
    upload: '/bookdinner/import',
    // 列表选择操作
    selectedOperateUrl: '/bookdinner/multi',
    // 模板下载
    templateDownloadUrl: '/bookdinner/download-template',
  },
  // 在线HR小助手
  helper: {
    // 问题类型列表
    typeList: '/helperchannel/get-list',
    // 类型新增
    typeAdd: '/helperchannel/add',
    // 类型编辑
    typeEdit: '/helperchannel/edit',
    // 类型删除
    typeDelete: '/helperchannel/del',
    // 问题列表接口
    questionList: '/helperposts/get-list',
    // 问题新增
    questionAdd: '/helperposts/add',
    // 问题编辑
    questionEdit: '/helperposts/edit',
    // 问题删除
    questionDelete: '/helperposts/del',
    // 文件上传
    upload: '/helperposts/upload-atta',
  },
  // 流程管理
  process: {
    // 设置列表接口
    list: '/flow-config/get-list',
    // 配置修改
    configEdit: '/flow-config/edit',
    // 流程列表勾选操作
    listSelected: '/flow-config/multi',
    // 获取详情接口
    detail: '/flow-config/get-detail',
    // 修改详情接口
    edit: '/flow-config/edit-approval',
    // flowConfig
    flowConfig: '/flow-config/get-flow-config-init',
    // 流程监控列表
    monitor: '/flow-config/get-monitor-list',
    // 流程监控列表导出
    monitorSelected: '/flow-config/multi',
  },
  // 会议管理
  meeting: {
    // 会议室管理列表接口
    mGetList: '/conference-room/get-list',
    // 会议室管理详情
    mDetail: '/conference-room/get-detail',
    // 会议室管理新增
    mAdd: '/conference-room/add',
    // 会议室管理修改
    mEdit: '/conference-room/edit',
    // 会议室管理导入
    mImport: '/conference-room/import',
    // 会议室导入模板
    mTemplate: '/conference-room/download-template',
    // 会议室管理更改状态
    mStatus: '/conference-room/update-status',
    // 会议室管理删除
    mDelete: '/conference-room/delete',
    // 设备列表
    eGetList: '/equipmennt/get-list',
    // 设备新增
    eAdd: '/equipmennt/add',
    // 设备编辑
    eEdit: '/equipmennt/edit',
    // 设备删除
    eDelete: '/equipmennt/delete',
  },

  // 通知公告
  notification: {
    list: '/notice/get-list', // 已起草列表
    add: '/notice/add', // 新增
    edit: '/notice/edit', // 重新提交
    detail: '/notice/get-detail', // 详情
    multi: '/notice/multi', // 多选操作
    approvingList: '/notice/get-list-by-approvaler', // 待我审核列表
    approvedList: '/notice/get-approvaled-list', // 我已审核
    approve: '/notice/approval', // 审核
    badge: '/notice/get-tip-info', // 待审核角标数
  },

  // 链接导航
  navigator: {
    list: '/system-link/get-list', // 列表
    add: '/system-link/add',
    edit: '/system-link/edit',
    multi: '/system-link/multi',
  },

  // 考勤管理
  attendance: {
    // 考勤数据修正·列表
    recordList: '/attendance-record/get-list',
    // 考勤数据修正·修正记录列表
    recordHistory: '/attendance-record/get-edit-attendance-list',
    // 考勤数据修正·修正记录导出
    recordHistoryExport: '/attendance-record/export-edit-record',
    // 考勤数据修正·修正
    recordFix: '/attendance-record/edit',
    // 员工考勤设置·列表
    confList: '/attendance-conf/get-list',
    // 员工考勤设置·导入
    confImport: '/attendance-conf/import',
    // 员工考勤设置·导入模板
    confITemplate: '/attendance-conf/download-template',
    // 员工考勤设置·编辑
    confEdit: '/attendance-conf/edit',
    // 员工考勤设置·导出
    confExport: '/attendance-conf/export',
    // 员工考勤设置@所有班次
    confSchedule: '/schedule/get-all',
    // 班次设置·列表
    scheduleList: '/schedule/get-list',
    // 班次设置·详情
    scheduleDetail: '/schedule/get-detail',
    // 班次设置·删除
    scheduleDel: '/schedule/delete',
    // 班次设置·编辑
    scheduleEdit: '/schedule/edit',
    // 班次设置·新增
    scheduleAdd: '/schedule/add',
    // 班次设置·检查班次
    scheduleCheck: '/schedule/check',
    // 异常考勤规则·详情
    ruleDet: '/attendance-rule/get-detail',
    // 异常考勤规则·编辑
    ruleEdit: '/attendance-rule/edit',
    // 节假日·列表
    holidayList: '/holiday/get-holiday-list',
    // 节假日·周末列表
    weekendList: '/holiday/get-weekend-list',
    // 节假日·新增
    holidayAdd: '/holiday/add',
    // 节假日·编辑
    holidayEdit: '/holiday/edit',
    // 节假日·删除节假日
    holidayDel: '/holiday/delete',
  },
})

export default api
