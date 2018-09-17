<template>
  <section
    v-loading.fullscreen.lock="loading"
    class="page page--application-businesstravel">

    <m-breadcrumb :items="breadcrumb" />

    <userinfo :data="info.applier_user_info" />

    <BusinessTravelForm :data="detail" />

    <ApprovedForm :data="result" />
  </section>
</template>

<script>
  import mixin from '~services/mixin'
  import Userinfo from '../../common/Userinfo'
  import BusinessTravelForm from '../common/BusinessTravelForm'
  import ApprovedForm from '../common/ApprovedForm'

  export default {
    name: 'BusinessTravel',

    components: {
      Userinfo,
      BusinessTravelForm,
      ApprovedForm,
    },

    mixins: [mixin.approved, mixin.breadcrumb, mixin.flow],

    data() {
      return {
        userinfo: {},
        breadcrumb: this.$breadcrumb([
          { name: '我已审批', to: '/attendance/approved' },
          { name: '出差' },
        ], 'attendance'),
      }
    },

  }
</script>
