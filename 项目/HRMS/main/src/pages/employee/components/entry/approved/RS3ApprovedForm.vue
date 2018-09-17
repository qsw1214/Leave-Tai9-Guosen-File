<template>
  <m-section
    :title="title"
    :style-object="styleObject"
    :data="result">

    <m-section-row>
      <m-section-cell
        prop="approval_time"
        title="审批日期" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        prop="approval_user_file_code"
        title="档案编号" />
      <m-section-cell
        prop="approval_user_contracts_begin_date"
        title="合同起始日期" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        prop="approval_user_contracts_end_date"
        title="合同终止日期" />
      <m-section-cell
        prop="approval_user_contracts_employment_form_name"
        title="用工形式" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        prop="approval_user_contracts_subject_unit_name"
        title="合同主体单位" />
      <m-section-cell
        prop="approval_user_contracts_term_type_name"
        title="合同期限类型" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        prop="approval_user_contracts_sign_date"
        title="签订日期" />
      <m-section-cell
        prop="approval_user_contracts_probation_begin_date"
        title="试用期开始日期" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        prop="approval_user_contracts_probation_end_date"
        title="试用期结束日期" />
      <m-section-cell
        prop="approval_user_contracts_probation_term"
        title="试用期限" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        prop="approval_user_contracts_plan_regular_date"
        title="拟转正日期" />
      <m-section-cell
        prop="approval_user_contracts_finance_attribute_name"
        title="财务属性" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        prop="approval_subject"
        title="审批意见" />
    </m-section-row>
  </m-section>
</template>

<script>
  import props from './props'

  export default {
    name: 'RS3ApprovedForm',

    mixins: [props],
  }
</script>
