<template>
  <section
    v-loading.fullscreen.lock="loading"
    class="page page--application-askforleave">

    <m-breadcrumb :items="breadcrumb" />

    <userinfo :data="info.applier_user_info" />

    <AskForLeaveForm :data="detail" />

    <ApprovedForm :data="result" />
  </section>
</template>

<script>
  import mixin from '~services/mixin'
  import Userinfo from '../../common/Userinfo'
  import AskForLeaveForm from '../common/AskForLeaveForm'
  import ApprovedForm from '../common/ApprovedForm'

  export default {
    name: 'AskForLeave',

    components: {
      Userinfo,
      AskForLeaveForm,
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
