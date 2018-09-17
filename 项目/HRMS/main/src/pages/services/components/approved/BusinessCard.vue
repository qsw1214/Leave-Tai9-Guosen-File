<template>
  <section
    v-loading.fullscreen.lock="loading"
    class="page page--approved-business__card">

    <m-breadcrumb :items="breadcrumb" />

    <userinfo :data="info.applier_user_info" />

    <business-card-form :data="detail" />

    <m-section
      title="审批表单">

      <m-section-row>
        <m-section-cell
          title="职位确认"
          :content="result.approval_job_name" />
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
  import BusinessCardForm from '../common/BusinessCardForm'

  export default {
    name: 'BusninessCard',

    components: {
      Userinfo,
      BusinessCardForm,
    },
    mixins: [mixin.approved, mixin.flow],

    data() {
      return {
        breadcrumb: this.$breadcrumb([
          { name: '我已审批', to: '/approved/index' },
          { name: '名片申请' },
        ]),
      }
    },
  }
</script>
