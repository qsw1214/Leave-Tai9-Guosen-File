/**
 * 公共参数，以对象命名
 * 用于下拉选项及数据过滤
 * @prop org: 组织单元对象
 * @prop org.typeList: 组织类型，1-实体组织、2-虚拟组织、4-团队
 * @prop org.flagList: 组织标记，1-前台、2-中台、4-后台
 * @prop org.lineList: 所属条线，1-无所属条线、2-财富线、4-机构线
 * @prop employee: 员工对象
 * @prop employee.sex: 员工性别，1-男、2-女、3-未知
 * @prop employee.recruit_channel_remark: 招聘渠道备注的提示信息
 * @prop employee.employee: employee后台设定字段的注册对象，注册并拉取后全局可用不用重复获取
 * 基本权限数据 - 由权限管理获取并缓存
 * 基本职务类型 - 由职务管理获取并缓存
 * @prop settings.isLock: 是否锁定用户，；0-正常、1-锁定
 * @prop settings.isSkipDuplicate 审批人重复跳过设置（1-不跳过、2-仅相邻重复审批人跳过、4-全部跳过）
 * @prop settings.approvalType 流转方式（1-并行、2-会审）
 * @prop settings.approvalerType 审批者分配方式，1-按员工分配、2-按职位分配、4-按角色分配
 * @prop settings.approvalerOrgRole 4-按角色分配时，角色类型，1-部门负责人，2-部门分管领导，4-部门联系人
 * @prop settings.process200001RszmType 流程200001的自定义字段
 * @prop settings.process200005MoneyRange 流程200005的自定义字段
 * @prop settings.process200007MoneyRange 流程200007的自定义字段
 * @prop settings.process200016 流程200016的自定义字段
 * @prop settings.process200017 流程200017的自定义字段
 * @prop settings.process2000 流程2000的自定义公用字段
 * @prop settings.process200018 流程200017的自定义字段
 * @prop settings.officeSpace 办公场所字段
 * @prop settings.signType 打卡方式字段
 */

import employee from './dictionary.employee'

const dictionary = {
  org: {
    typeList: {
      1: { label: '实体组织', value: 1 },
      2: { label: '虚拟组织', value: 2 },
      4: { label: '团队', value: 4 },
    },
    flagList: {
      1: { label: '前台', value: 1 },
      2: { label: '中台', value: 2 },
      4: { label: '后台', value: 4 },
    },
    lineList: {
      1: { label: '无所属条线', value: 1 },
      2: { label: '财富线', value: 2 },
      4: { label: '机构线', value: 4 },
    },
  },
  employee: {
    sex: {
      1: { label: '男', value: 1 },
      2: { label: '女', value: 2 },
      3: { label: '未知', value: 3 },
    },
    recruit_channel_remark: {
      1: '招聘网站名称',
      2: '猎头公司名称',
      4: '推荐人姓名',
    },
    employee,
  },
  settings: {
    isLock: [
      { label: '正常', value: 0 },
      { label: '锁定', value: 1 },
    ],
    isSkipDuplicate: {
      1: { label: '不跳过', value: 1 },
      2: { label: '仅相邻重复审批人跳过', value: 2 },
      4: { label: '全部跳过', value: 4 },
    },
    approvalType: {
      1: { label: '并行', value: 1 },
      2: { label: '会审', value: 2 },
    },
    approvalerType: {
      1: { label: '按员工分配', value: 1 },
      2: { label: '按职位分配', value: 2 },
      4: { label: '按角色分配', value: 4 },
      8: { label: '员工本人', value: 8 },
    },
    approvalerOrgRole: {
      1: { label: '部门负责人', value: 1 },
      2: { label: '部门分管领导', value: 2 },
      4: { label: '部门联系人', value: 4 },
    },
    process200001RszmType: {
      1: { label: '收入证明', value: '1' },
      2: { label: '在职证明', value: '2' },
      4: { label: '实习证明', value: '4' },
    },
    process200005MoneyRange: {
      ':1000000': '小于等于1万',
      '1000000:': '大于1万',
    },
    process200007MoneyRange: {
      ':1000000': '小于等于1万',
      '1000000:3000000': '大于1万小于等于3万',
      '3000000:': '大于3万',
    },
    process200016RsddglJobReason: {
      64: { label: '跨部门调动', value: '64' },
      128: { label: '同部门调动', value: '128' },
      256: { label: '竞聘调动', value: '256' },
    },
    process2000MoveOrgLine: {
      1: { label: '无所属条线', value: '1' },
      2: { label: '财富线', value: '2' },
      4: { label: '机构线', value: '4' },
    },
    process2000OrgFlag: {
      1: { label: '前台', value: '1' },
      2: { label: '中台', value: '2' },
      4: { label: '后台', value: '4' },
    },
    process2000YesOrNo: {
      1: { label: '是', value: '1' },
      2: { label: '否', value: '2' },
      3: { label: '不限制', value: '3' },
    },
    process200017RszzglType: {
      1: { label: '中后台转正', value: '1' },
      2: { label: '前台转正', value: '2' },
    },
    process2000DayRange: {
      ':6': '小于等于3天',
      '6:': '大于3天',
    },
    process200018KqqjType: {
      4096: { label: '年假', value: '4096' },
      131072: { label: '产假', value: '131072' },
      2048: { label: '事假', value: '2048' },
      16384: { label: '婚假', value: '16384' },
      8192: { label: '病假', value: '8192' },
      524288: { label: '丧假', value: '524288' },
      262144: { label: '流产假', value: '262144' },
      65536: { label: '陪产假', value: '65536' },
      32768: { label: '产检假', value: '32768' },
    },

    // 此字段要求排序，请调用输入选择时进行相应处理
    officeSpace: {
      256: { value: 256, label: '后海' },
      128: { value: 128, label: '泰然九路' },
      1: { value: 1, label: '松岗' },
      2: { value: 2, label: '龙华' },
      4: { value: 4, label: '宝安' },
      8: { value: 8, label: '龙岗' },
      16: { value: 16, label: '科苑北' },
      32: { value: 32, label: '深盐' },
      64: { value: 64, label: '人民南' },
      512: { value: 512, label: '北京' },
      1024: { value: 1024, label: '上海' },
    },
    signType: {
      1: { value: 1, label: '指纹打卡' },
      2: { value: 2, label: '掌静脉打卡' },
      4: { value: 4, label: '运筹系统打卡' },
    },

  },
}

export default dictionary
