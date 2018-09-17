<template>
  <section
    v-loading.fullscreen.lock="loading"
    class="page page--application-temp__card">

    <m-breadcrumb :items="breadcrumb" />

    <userinfo :data="info.applier_user_info" />

    <GroupReportForm :data="detail" />

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
  import GroupReportForm from '../common/GroupReportForm'

  export default {
    name: 'GroupReport',

    components: {
      Userinfo,
      logsAndPath,
      StatusButton,
      GroupReportForm,
    },

    mixins: [mixin.application, mixin.breadcrumb, mixin.flow],

    data() {
      return {
        userinfo: {},
        breadcrumb: this.$breadcrumb([
          { name: '我发起的', to: '/attendance/application' },
          { name: '批量报备' },
        ], 'attendance'),
      }
    },

  }
</script>
