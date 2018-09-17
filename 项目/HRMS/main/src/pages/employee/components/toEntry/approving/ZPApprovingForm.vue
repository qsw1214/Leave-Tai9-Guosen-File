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
        prop="approval_rz_status"
        label="入职状态确认">
        <el-select
          placeholder="请选择"
          v-model="result.approval_rz_status">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </el-select>
      </el-form-item>
    </m-section-row>

    <m-section-row>
      <el-form-item
        label="入职部门"
        prop="approval_org">
        <m-cascader
          placeholder="请选择入职部门"
          glass
          :width="260"
          :organization.sync="result.approval_org" />
      </el-form-item>

      <el-form-item
        label="任职职位"
        prop="approval_job">
        <m-position-select
          :width="260"
          :positions.sync="result.approval_job" />
      </el-form-item>
    </m-section-row>

    <el-form-item
      label="入职日期"
      prop="approval_rz_date">
      <el-date-picker
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择日期"
        v-model="result.approval_rz_date" />
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
    name: 'GTApprovingForm',

    props: {
      result: {
        type: Object,
        default: () => ({}),
      },
    },

    data() {
      return {
        options: [
          { value: '2', label: '已入职' },
          { value: '1', label: '放弃入职' },
        ],
      }
    },
  }
</script>
