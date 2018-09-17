<template>
  <m-section
    title="申请表单"
    :data="data">
    <m-section-row>
      <m-section-cell
        prop="code"
        title="流程编码" />
      <m-section-cell
        prop="apply_date"
        title="申请日期" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        prop="status_name"
        title="流程状态" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        prop="gdzcsq_applier_join_date"
        title="入职日期" />

      <m-section-cell
        title="转正日期"
        :content="data.gdzcsq_applier_correction_date || '未转正'" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        prop="gdzcsq_goods_name"
        title="申请物品" />

      <m-section-cell
        title="申请数量"
        :content="data.gdzcsq_num + '台'" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        prop="gdzcsq_reason"
        title="申请原因" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        prop="gdzcsq_liabler_name"
        title="责任人" />

      <m-section-cell
        prop="gdzcsq_user_name"
        title="使用人" />
    </m-section-row>

  </m-section>
</template>

<script>
  export default {
    name: 'FixedAssetsForm',

    props: {
      data: {
        type: Object,
        default: () => ({}),
      },
    },
  }
</script>
