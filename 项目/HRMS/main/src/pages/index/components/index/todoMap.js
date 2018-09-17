// todo 跳转映射表
// REF. http://gitlab.gxtr9.com:8980/t9/hr/wikis/消息类型表
// 员工服务和考勤管理所有流程的待我审批、我提交的（退回、审批通过、系统退回、待确认和已作废）
// 流程状态(状态：0-审批中、90-审批通过、91-待确认、93-作废、94-已退回、99-已完成)
const status = {
  30: 'approving',
  94: 'application', // 退回
  90: 'application', // 审核通过
  91: 'application', // 待确认
  99: 'application', // 已完成
  93: 'application', // 已作废
}

export default {
  100001: '/oa.html#/books/details',
  100002: '/oa.html#/books/list/borrow',
  200001: { uri: '/services.html#/{{status}}/personal-cert/200001', status },
  200002: { uri: '/services.html#/{{status}}/temp-card/200002', status },
  200003: { uri: '/services.html#/{{status}}/official-card/200003', status },
  200005: { uri: '/services.html#/{{status}}/material-printing/200005', status },
  200006: { uri: '/services.html#/{{status}}/high-speed-market/200006', status },
  200007: { uri: '/services.html#/{{status}}/ao-express/200007', status },
  200008: { uri: '/services.html#/{{status}}/business-card/200008', status },
  200009: { uri: '/services.html#/{{status}}/fixed-assets/200009', status },
  200010: { uri: '/services.html#/{{status}}/car/200010', status },
  200011: { uri: '/services.html#/{{status}}/it/200011', status },
  200013: { uri: '/employee.html#/to-entry/{{status}}/200013', status },
  200014: { uri: '/employee.html#/entry/{{status}}/200014', status },
  200015: { uri: '/employee.html#/leave/{{status}}/200015', status },
  200016: { uri: '/employee.html#/transfer/{{status}}/200016', status },
  200017: { uri: '/employee.html#/become-regular/{{status}}/200017', status },
  200018: { uri: '/services.html#/attendance/{{status}}/ask-for-leave/200018', status },
  200019: { uri: '/services.html#/attendance/{{status}}/away-for-business/200019', status },
  200020: { uri: '/services.html#/attendance/{{status}}/punch-card-compaint/200020', status },
  200021: { uri: '/services.html#/attendance/{{status}}/business-travel/200021', status },
  200022: { uri: '/services.html#/attendance/{{status}}/punch-card-method/200022', status },
  200023: { uri: '/services.html#/attendance/{{status}}/group-report/200023', status },
  300001: { uri: '/settings.html#/notification/{{status}}', status },
  300002: '/index.html#/notification',
}
