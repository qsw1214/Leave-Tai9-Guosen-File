<template>
  <section
    v-loading.fullscreen.lock="loading"
    class="page page--approved-official__card">

    <m-breadcrumb :items="breadcrumb" />

    <userinfo :data="info.applier_user_info" />

    <official-card-form :data="detail" />

    <m-section
      title="审批结果">
      <m-section-row>
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
  import OfficialCardForm from '../common/OfficialCardForm'

  export default {
    name: 'ApprovedContent',
    components: {
      Userinfo,
      OfficialCardForm,
    },
    mixins: [mixin.approved, mixin.flow],
    data() {
      return {
        breadcrumb: this.$breadcrumb([
          { name: '我已审批', to: '/approved/index' },
          { name: '正式工卡申请' },
        ]),
      }
    },
  }
</script>
