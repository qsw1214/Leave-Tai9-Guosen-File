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
        title="申请说明"
        :content="tips" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        prop="mpsq_user_name"
        title="名片人名称" />

      <m-section-cell
        prop="mpsq_user_broker_code"
        title="经纪号" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        prop="mpsq_user_org_name"
        title="所属部门" />

      <m-section-cell
        prop="mpsq_user_job_name"
        title="职位" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        prop="mpsq_user_finance_attribute"
        title="营业部" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        prop="mpsq_user_mobile"
        title="手机号码" />

      <m-section-cell
        prop="mpsq_user_email_outside"
        title="电子邮箱" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        prop="mpsq_num"
        title="名片数量" />

      <m-section-cell
        title="是否加开户二维码"
        :content="needQrcode" />
    </m-section-row>

    <m-section-row
      v-if="data.mpsq_is_need_qrcode === '1'">
      <m-section-cell
        title="附件列表">
        <m-attachment :data="data.attachment_list" />
      </m-section-cell>
    </m-section-row>
  </m-section>
</template>

<script>
  export default {
    name: 'BusinessCardForm',

    props: {
      data: {
        type: Object,
        default: () => ({}),
      },
    },

    data() {
      return {
        tips: '请填写名片信息，流程完成提交后，请下周二到所在部门运营经理处领取。',
      }
    },

    computed: {
      needQrcode() {
        return this.data.mpsq_is_need_qrcode === '1' ? '是' : '否'
      },
    },
  }
</script>
