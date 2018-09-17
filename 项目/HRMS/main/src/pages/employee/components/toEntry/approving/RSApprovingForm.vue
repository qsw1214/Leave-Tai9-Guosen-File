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
        prop="approval_is_data_pass"
        label="材料审核是否通过">
        <el-select
          placeholder="请选择"
          v-model="result.approval_is_data_pass">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </el-select>
      </el-form-item>
    </m-section-row>

    <el-form-item
      label="流程说明">
      <p>
        点击
        <el-button
          type="text"
          style="font-size: 14px;"
          @click="viewEmployeeInfo">这里</el-button>
        审核员工信息及提交的入职材料。
      </p>

      <EmployeeBaseinfoDialog
        ref="dialog"
        :credential-num="credentialNum"
        :credential-type="credentialType" />
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
  import EmployeeBaseinfoDialog from './EmployeeBaseinfoDialog'

  export default {
    name: 'RSApprovingForm',

    components: {
      EmployeeBaseinfoDialog,
    },

    props: {
      result: {
        type: Object,
        default: () => ({}),
      },
    },

    data() {
      return {
        options: [
          { value: '1', label: '是' },
          { value: '0', label: '否' },
        ],
      }
    },

    computed: {
      credentialNum() {
        const num = this.$parent.$parent.detail.rsdrzgl_credential_num
        return num || ''
      },

      credentialType() {
        const type = this.$parent.$parent.detail.rsdrzgl_credential_type
        return type || ''
      },
    },

    methods: {
      viewEmployeeInfo() {
        this.$refs.dialog.show = true
      },
    },
  }
</script>
