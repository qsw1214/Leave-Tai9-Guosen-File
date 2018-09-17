<template>
  <section
    v-loading.fullscreen.lock="loading"
    class="page page--application-awayforbusiness">

    <m-breadcrumb :items="breadcrumb" />

    <userinfo :data="info.applier_user_info" />

    <AwayForBusinessForm :data="detail" />

    <ApprovedForm :data="result" />
  </section>
</template>

<script>
  import mixin from '~services/mixin'
  import Userinfo from '../../common/Userinfo'
  import AwayForBusinessForm from '../common/AwayForBusinessForm'
  import ApprovedForm from '../common/ApprovedForm'

  export default {
    name: 'AwayForBusiness',

    components: {
      Userinfo,
      AwayForBusinessForm,
      ApprovedForm,
    },

    mixins: [mixin.approved, mixin.breadcrumb, mixin.flow],

    data() {
      return {
        userinfo: {},
        breadcrumb: this.$breadcrumb([
          { name: '我已审批', to: '/attendance/approved' },
          { name: '因公外出' },
        ], 'attendance'),
      }
    },

  }
</script>
