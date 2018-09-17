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
        prop="approval_is_send_key"
        label="是否已经发放密钥">
        <el-select
          placeholder="请选择"
          v-model="result.approval_is_send_key">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item
        prop="approval_is_hand_print"
        label="是否录入指/掌纹">
        <el-select
          placeholder="请选择"
          v-model="result.approval_is_hand_print">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </el-select>
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

    data() {
      return {
        options: [
          { value: '1', label: '是' },
          { value: '0', label: '否' },
        ],
      }
    },
  }
</script>
