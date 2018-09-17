<template>
  <m-section
    title="申请表单"
    :data="data">

    <m-section-row>
      <m-section-cell
        title="流程编码"
        prop="code" />
      <m-section-cell
        title="申请日期"
        prop="apply_date" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="流程状态"
        prop="status_name" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="预算金额"
        :content="`${data.xzyyzcbgfsq_money / 100}元`" />
      <m-section-cell
        title="大写金额"
        :content="(data.xzyyzcbgfsq_money / 100) | digitUppercase" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="期望完成时间"
        prop="xzyyzcbgfsq_finish_date" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="申请原因"
        prop="xzyyzcbgfsq_reason" />
    </m-section-row>

    <m-section-row>
      <m-section-cell title="附件列表">
        <m-attachment :data="data.attachment_list || []" />
      </m-section-cell>
    </m-section-row>
  </m-section>
</template>

<script>
  export default {
    name: 'AOExpressForm',

    props: {
      data: {
        type: Object,
        required: true,
      },
    },
  }
</script>
