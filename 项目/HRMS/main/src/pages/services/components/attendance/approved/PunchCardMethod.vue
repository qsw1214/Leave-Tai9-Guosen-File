<template>
  <section
    v-loading.fullscreen.lock="loading"
    class="page page--application-punchcardmethod">

    <m-breadcrumb :items="breadcrumb" />

    <userinfo :data="info.applier_user_info" />

    <PunchCardMethodForm :data="detail" />

    <ApprovedForm :data="result" />
  </section>
</template>

<script>
  import mixin from '~services/mixin'
  import Userinfo from '../../common/Userinfo'
  import PunchCardMethodForm from '../common/PunchCardMethodForm'
  import ApprovedForm from '../common/ApprovedForm'

  export default {
    name: 'PunchCardMethod',

    components: {
      Userinfo,
      PunchCardMethodForm,
      ApprovedForm,
    },

    mixins: [mixin.approved, mixin.breadcrumb, mixin.flow],

    data() {
      return {
        userinfo: {},
        breadcrumb: this.$breadcrumb([
          { name: '我已审批', to: '/attendance/approved' },
          { name: '打卡方式变更' },
        ], 'attendance'),
      }
    },

  }
</script>
