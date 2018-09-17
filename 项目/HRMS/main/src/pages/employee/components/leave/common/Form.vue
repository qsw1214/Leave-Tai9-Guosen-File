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
        content="离职"
        title="操作类型" />
      <m-section-cell
        prop="rslzgl_type_name"
        title="操作原因" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        prop="rslzgl_reason_name"
        title="离职原因" />
      <m-section-cell
        prop="rslzgl_goto_name"
        title="离职去向" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        prop="rslzgl_goto_explain"
        title="去向具体说明" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        prop="rslzgl_work_end_date"
        title="计划最后工作日" />
      <m-section-cell
        prop="rslzgl_opinion"
        title="对公司意见" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        prop="rslzgl_quit_mobile"
        title="离职后手机号码" />
      <m-section-cell
        prop="rslzgl_quit_mail"
        title="离职后邮箱" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        prop="rslzgl_quit_address"
        title="离职后通讯地址" />
    </m-section-row>
  </m-section>
</template>

<script>
  export default {
    name: 'StaticForm',
    props: {
      data: {
        require: true,
        type: Object,
        default: () => ({}),
      },
    },
  }
</script>
