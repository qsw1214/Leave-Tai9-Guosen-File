/**
 * 菜单权限 -> 路由映射
 */

export default {
  100: { index: 'index', path: '/index' },

  101: { index: 'organization' }, // 组织管理
  101001: { index: 'maintain', path: '/query' }, // 组织维护
  101002: { index: 'revision', path: '/adjust' }, // 组织调整
  101003: { index: 'legalPersonSettings', path: '/legalperson' }, // 法人单位设置
  101004: { index: 'organization', path: '/organization' }, // 组织架构

  102: { index: 'position' }, // 职位管理
  102001: { index: 'job', path: '/job' }, // 职务维护
  102002: { index: 'position', path: '/position' }, // 职位维护

  103: { index: 'employee' }, // 员工管理
  103001: { index: 'maintain', path: '/maintain' }, // 员工信息维护
  103002: { index: 'toEntry', path: '/to-entry' }, // 待入职管理
  103003: { index: 'entry', path: '/entry' }, // 入职管理
  103004: { index: 'leave', path: '/leave' }, // 离职管理
  103005: { index: 'transfer', path: '/transfer' }, // 调动管理
  103006: { index: 'becomeRegular', path: '/become-regular' }, // 转正管理

  104: { index: 'settings' }, // 基础配置
  104001: { index: 'role', path: '/role' }, // 角色管理
  104002: { index: 'permission', path: '/permission' }, // 权限管理
  104003: { index: 'process', path: '/process' }, // 流程管理
  104004: { index: 'attendance', path: '/attendance' }, // 考勤管理

  106: { index: 'services' }, // 员工自助
  106001: { index: 'pa', path: '/pa/index' }, // 员工服务
  106002: { index: 'helper', path: '/helper' }, // 在线 HR 小助手
  106003: { index: 'op', path: '/op' }, // 组织人事, Organization and personnel -> /op
  106004: { index: 'attendance', path: '/attendance' }, // 考勤管理

  105: { index: 'data', path: 'settings' }, // 数据管理
  105001: { index: 'orderFood', path: '/order/food' }, // 订餐服务
  105002: { index: 'helper', path: '/helper' }, // 在线 HR 小助手
  105003: { index: 'notification', path: '/notification' }, // 通知管理
  105004: { index: 'navigator', path: '/navigator' }, // 系统链接
  105005: { index: 'meeting', path: '/meeting' }, // 会议管理

  107: { index: 'oa' }, // 企业OA
  107001: { index: 'meeting', path: '/meeting' }, // 会议管理
  107002: { index: 'contact', path: '/contact' }, // 通讯录
  107003: { index: 'books', path: '/books/list' }, // 图书管理
  107004: { index: 'share', path: '/share' }, // 知识仓库

  108: { index: 'report' }, // 报表中心
  108001: { index: 'attendance', path: '/attendance' }, // 考勤数据

  109: { index: 'manager' }, // 经理自助
  109001: { index: 'attendance', path: '/attendance' }, // 考勤管理
}
