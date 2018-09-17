<template>
  <div>
    <m-section
      v-for="(log, index) in nodes"
      :key="index"
      :data="log"
      :style-object="{ fontSize: '14px' }"
      :title="`审批表单-${log.approvaler_name}`">

      <m-section-row>
        <m-section-cell
          prop="approval_time"
          title="审批日期" />

        <m-section-cell
          prop="approval_move_date"
          title="调动日期"
          v-if="
            (log.approval_form_type === '200016004' || log.approval_form_type === '200016005')
              && log.approval_move_date
          " />

        <m-section-cell
          prop="approval_is_need_move_customers_name"
          title="是否需要划转客户"
          v-if="
            log.approval_form_type === '200016010'
              && log.approval_is_need_move_customers_name
          " />

        <m-section-cell
          prop="approval_is_move_customers_name"
          title="客户是否完成划转"
          v-if="log.approval_is_move_customers_name" />

        <m-section-cell
          prop="approval_is_move_fee_name"
          title="费用是否清算划转"
          v-if="log.approval_is_move_fee_name" />

        <m-section-cell
          prop="approval_is_move_fee_recheck_name"
          title="资产是否完成复核"
          v-if="log.approval_is_move_fee_recheck_name" />

        <m-section-cell
          prop="approval_is_confirm_salary_level_name"
          title="是否完成定薪定级"
          v-if="log.approval_is_confirm_salary_level_name" />

        <m-section-cell
          prop="approval_move_status_name"
          title="调动状态"
          v-if="log.approval_move_status_name" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          prop="approval_subject"
          title="审批意见" />
      </m-section-row>

      <m-section-row
        v-if="log.approval_hr_json">
        <m-section-cell>
          <check-list
            :list="log.approval_hr_json"
            :checkable="false" />
        </m-section-cell>
      </m-section-row>
    </m-section>
  </div>
</template>

<script>
  import CheckList from '../../common/ApprovalCheckList'

  export default {
    name: 'ApprovalLogNodes',
    components: { CheckList },

    props: {
      nodes: {
        type: Array,
        default: () => ([]),
      },
    },
  }
</script>
