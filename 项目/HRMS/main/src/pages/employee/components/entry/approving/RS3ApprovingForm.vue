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
        prop="approval_user_file_code"
        label="档案编号">
        <el-input
          placeholder="请输入档案编号"
          v-model="result.approval_user_file_code" />
      </el-form-item>
      <el-form-item
        prop="approval_user_contracts_employment_form"
        label="用工形式">
        <el-select
          placeholder="请选择"
          v-model="result.approval_user_contracts_employment_form">
          <el-option
            v-for="item in options.type"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </el-select>
      </el-form-item>
    </m-section-row>

    <m-section-row>
      <el-form-item
        prop="approval_user_contracts_begin_date"
        label="合同起始日期">
        <el-date-picker
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          v-model="result.approval_user_contracts_begin_date" />
      </el-form-item>
      <el-form-item
        prop="approval_user_contracts_end_date"
        label="合同终止日期">
        <el-date-picker
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          v-model="result.approval_user_contracts_end_date" />
      </el-form-item>
    </m-section-row>

    <m-section-row>
      <el-form-item
        label="合同主体单位"
        prop="approval_user_contracts_subject_unit">
        <m-legal-entity-select
          :width="260"
          :legal-entity.sync="result.approval_user_contracts_subject_unit" />
      </el-form-item>
      <el-form-item
        prop="approval_user_contracts_term_type"
        label="合同期限类型">
        <el-select
          placeholder="请选择"
          v-model="result.approval_user_contracts_term_type">
          <el-option
            v-for="item in options.contract"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </el-select>
      </el-form-item>
    </m-section-row>

    <m-section-row>
      <el-form-item
        prop="approval_user_contracts_sign_date"
        label="签订日期">
        <el-date-picker
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          v-model="result.approval_user_contracts_sign_date" />
      </el-form-item>
      <el-form-item
        prop="approval_user_contracts_finance_attribute"
        label="财务属性">
        <m-legal-entity-select
          :width="260"
          :legal-entity.sync="result.approval_user_contracts_finance_attribute" />
      </el-form-item>
    </m-section-row>

    <m-section-row v-if="!back">
      <el-form-item
        prop="approval_user_contracts_probation_begin_date"
        label="试用期开始日期">
        <el-date-picker
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          v-model="result.approval_user_contracts_probation_begin_date" />
      </el-form-item>
      <el-form-item
        prop="approval_user_contracts_probation_end_date"
        label="试用期结束日期">
        <el-date-picker
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          v-model="result.approval_user_contracts_probation_end_date" />
      </el-form-item>
    </m-section-row>

    <m-section-row v-if="!back">
      <el-form-item
        prop="approval_user_contracts_plan_regular_date"
        label="拟转正日期">
        <el-date-picker
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          v-model="result.approval_user_contracts_plan_regular_date" />
      </el-form-item>
      <el-form-item
        prop="approval_user_contracts_probation_term"
        label="试用期限">
        <el-input
          placeholder="请输入试用期限"
          v-model="result.approval_user_contracts_probation_term" />
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
    name: 'RS3ApprovingForm',

    props: {
      result: {
        type: Object,
        default: () => ({}),
      },
    },

    data() {
      const $root = this.$parent.$parent
      // 默认签订日期为今天
      $root.form.approval_user_contracts_sign_date
        = this.$utils.tools.formatDate(new Date().getTime())
      // 若是重新雇佣，则默认返聘
      if ($root.detail.rsrzgl_reason === '4') {
        $root.form.approval_user_contracts_employment_form = '8'
      }
      // 若是重新雇佣切仍是在职状态
      if ($root.detail.rsrzgl_reason === '4' && $root.detail.rsrzgl_user_status === '4') {
        // 清空默认试用期
        $root.form.approval_user_contracts_probation_term = ''
        this.getFileCode()
      }

      return {
        options: {
          yesno: [
            { value: '1', label: '是' },
            { value: '0', label: '否' },
          ],
          type: [
            { value: '1', label: '正式' },
            { value: '2', label: '派遣' },
            { value: '4', label: '外包' },
            { value: '8', label: '返聘' },
          ],
          contract: [
            { value: '1', label: '固定期限' },
            { value: '2', label: '无固定期限' },
            { value: '4', label: '以完成一定工作任务为期限' },
            { value: '8', label: '三年固定期限' },
            { value: '16', label: '五年固定期限' },
          ],
        },
      }
    },

    computed: {
      back() {
        const $root = this.$parent.$parent
        // 若是重新雇佣切入职状态为在职
        return ($root.detail.rsrzgl_reason === '4' && $root.detail.rsrzgl_user_status === '4')
      },
    },

    methods: {
      getFileCode() {
        const $root = this.$parent.$parent

        this.$axios
          .post(this.$api.employee.entry.getFileCode, {
            code: $root.detail.rsrzgl_code,
          })
          .then(({ data }) => {
            $root.form.approval_user_file_code = data.file_code
          })
      },
    },
  }
</script>
