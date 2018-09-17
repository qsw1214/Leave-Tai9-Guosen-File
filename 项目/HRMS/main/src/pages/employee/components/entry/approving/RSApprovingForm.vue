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

      <el-form-item
        prop="approval_emp_code"
        label="员工ID">
        <el-input
          placeholder="请输入员工ID"
          v-model="result.approval_emp_code" />
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
    name: 'RSApprovingForm',

    props: {
      result: {
        type: Object,
        default: () => ({}),
      },
    },
  }
</script>
