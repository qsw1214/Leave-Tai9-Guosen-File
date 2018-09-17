<template>
  <section
    v-loading.fullscreen.lock="loading"
    class="page page--application-temp__card">

    <m-breadcrumb :items="breadcrumb" />

    <userinfo :data="info.applier_user_info" />

    <AskForLeaveForm :data="detail" />

    <logsAndPath :data="logsAndPath" />

    <StatusButton
      module="2"
      path="/attendance/application" />

  </section>
</template>

<script>
  import mixin from '~services/mixin'
  import logsAndPath from '@/components/logsAndPath'
  import StatusButton from '../../common/StatusButton'
  import Userinfo from '../../common/Userinfo'
  import AskForLeaveForm from '../common/AskForLeaveForm'


  export default {
    name: 'AskForLeave',

    components: {
      Userinfo,
      logsAndPath,
      StatusButton,
      AskForLeaveForm,
    },

    mixins: [mixin.application, mixin.breadcrumb, mixin.flow],

    data() {
      return {
        userinfo: {},
        breadcrumb: this.$breadcrumb([
          { name: '我发起的', to: '/attendance/application' },
          { name: '请假' },
        ], 'attendance'),
      }
    },

  }
</script>
