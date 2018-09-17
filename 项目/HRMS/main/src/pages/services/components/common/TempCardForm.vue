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

      <m-section-cell
        prop="lsgpsq_reason_name"
        title="申请原因" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        content="<p style='margin-top: 0;'>1.访客临时领用，无须工单申领，到前台签收即可；</p>
            <p>2.实习生临时申领，由其对接人代替发起申领流程；</p>
            <p> 3.新人入职及遗失补办临时申领，一旦正式工牌制作完成，申请人须退还临时工牌。否则申请人须承担50元工本费。</p>"
        title="申请说明" />
    </m-section-row>

    <m-section-row
      v-if="data.lsgpsq_reason == '2'">
      <m-section-cell
        prop="lsgpsq_return_date"
        title="预计归还时间" />

      <m-section-cell
        prop="lsgpsq_user_name"
        title="实际使用人" />
    </m-section-row>
  </m-section>
</template>

<script>
  export default {
    name: 'TempCardForm',

    props: {
      data: {
        type: Object,
        default: () => ({}),
      },
    },
  }
</script>
