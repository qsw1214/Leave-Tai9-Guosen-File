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
        <span>请及时进行新员工入职合规面谈， 并将面谈记录填写在下框中。</span>
      </el-form-item>
    </m-section-row>

    <el-form-item
      label="面谈记录"
      prop="approval_hegui_chat_log">
      <el-input
        type="textarea"
        placeholder="请输入面谈记录"
        :rows="2"
        v-model="result.approval_hegui_chat_log" />
    </el-form-item>

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
    name: 'HGApprovingForm',

    props: {
      result: {
        type: Object,
        default: () => ({}),
      },
    },
  }
</script>
