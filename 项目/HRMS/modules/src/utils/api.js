const env = process.env.NODE_ENV
class API {
  constructor() {
    this.common = {
      // 获取当前登录用户权限配置
      configs: '/common/get-auth-config',
      // 获取当前登录用户的个人信息
      userinfo: '/common/get-user-info',

      // 无权限控制的全部组织层级
      organizationLevel: '/common/get-org-level',
      // 无权限控制的单列组织列表
      organizationSingleLevel: '/common/get-org-list',
      // 根据权限范围拉取相应组织层级数据
      organizationLevelAuth: '/common/get-org-level-by-auth',

      // 无权限控制拉取某个组织下的部门和员工（一层）
      organizationAndEmployee: '/common/get-org-child-list',

      // 无权限控制的员工列表
      employeeList: '/common/get-user-list',
      // 无权限员工列表后台分页
      employee: '/common/get-org-all-user-list',

      // 无权限控制的法人列表
      legalEntityList: '/common/get-legal-entitys-list',

      // 无权限控制的团队列表
      teamList: '/common/get-team-list',

      // 权限控制的职位列表
      jobList: '/duty/get-list',
      // 权限控制的职务列表
      positionList: '/job/get-list',

      // 无权限控制的获取员工信息维护配置字段信息
      dictionaryEmployee: '/common/get-user-option',
      // 无权限控制的获取地区信息
      districtList: '/common/get-district',

      // 无权限控制的获取某员工的基础信息
      userBaseinfo: '/common/get-user-base-info',
      // 无权限控制的下载公共附件
      attachmentsDownload: '/common/get-attachments-download-url',
      // 权限控制的头像上传
      employeeAvatar: '/user/upload-avatar',

      // 权限控制根据用户搜索
      search: '/user/search',
    }

    this.setup('common')
  }

  setup(name) {
    const api = this[name]

    if (env === 'development' && api !== undefined) {
      Object.keys(api).forEach((prop) => {
        api[prop] = `/mock${api[prop]}`
      })
    }
  }

  install(name, api) {
    if (!(name && api)) return false

    this[name] = api
    return this.setup(name)
  }
}

export default new API()
