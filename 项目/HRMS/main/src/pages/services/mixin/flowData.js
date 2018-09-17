export default {
  data() {
    // 上传参数
    const upload = {
      action: this.$api.services.pa.upload,
      files: [],
      accept: 'image, pdf, ppt, word, excel, zip',
    }

    const { id, code } = this.$route.params

    return {
      id, // 流程 id
      code, // 流程代码

      // 流程详情
      info: {
        flow_form_data: {},
      },

      // 审批结果
      result: {},

      // 审批记录
      logs: {
        approval_list: [],
      },

      // 审批记录 + 流程路径
      logsAndPath: {},

      // 附件上传
      upload,

      // 按钮状态
      button: {
        reject: false, // 退回
        agree: false, // 同意
        stash: false, // 暂存
        submit: false, // 提交
      },
      loading: false,

      // 是否进行 router 跳转拦截
      canRedirect: false,

      // 提交成功后提示语
      submitMessage: '',

      // 提交成功之后的返回路径
      submitRedirectPath: '',
    }
  },
}
