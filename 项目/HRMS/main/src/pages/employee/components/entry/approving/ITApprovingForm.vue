<template>
  <el-form
    class="m-section--form"
    label-width="140px"
    ref="approvalForm"
    :rules="$parent.$parent.rules"
    :model="result">

    <m-section-row>
      <el-form-item
        label="审批日期">
        <span>由系统自动生成</span>
      </el-form-item>
    </m-section-row>

    <m-section-row>
      <el-form-item
        style="width: 100%;"
        label="流程说明">
        <span>请帮忙为新员工开通NEP、运筹等相关系统权限， 并将账号和密码发至员工邮箱。</span>
      </el-form-item>
    </m-section-row>

    <el-form-item
      label="审批意见"
      prop="approval_subject">
      <el-input
        type="textarea"
        placeholder="请输入审批意见"
        :rows="2"
        v-model="result.approval_subject" />
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: 'ITApprovingForm',

    props: {
      result: {
        type: Object,
        default: () => ({}),
      },
    },
  }
</script>
