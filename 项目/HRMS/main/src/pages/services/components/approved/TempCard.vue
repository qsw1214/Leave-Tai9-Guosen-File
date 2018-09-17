<template>
  <section class="page page--approved-temp__card">
    <m-breadcrumb :items="breadcrumb" />

    <userinfo :data="info.applier_user_info" />

    <temp-card-form :data="detail" />

    <m-section
      title="审批结果">
      <m-section-row>
        <m-section-cell
          title="临时工牌编号"
          :content="result.approval_lsgp_num" />
        <m-section-cell
          title="审批日期"
          :content="result.approval_time" />
      </m-section-row>
      <m-section-row>
        <m-section-cell
          title="审批意见"
          :content="result.approval_subject" />
      </m-section-row>
    </m-section>

  </section>
</template>

<script>
  import mixin from '~services/mixin'
  import Userinfo from '../common/Userinfo'
  import TempCardForm from '../common/TempCardForm'

  export default {
    name: 'ApprovedTempCard',
    components: {
      Userinfo,
      TempCardForm,
    },
    mixins: [mixin.approved, mixin.flow],
    data() {
      return {
        breadcrumb: this.$breadcrumb([
          { name: '我已审批', to: '/approved/index' },
          { name: '临时工卡申请' },
        ]),
      }
    },
  }
</script>

