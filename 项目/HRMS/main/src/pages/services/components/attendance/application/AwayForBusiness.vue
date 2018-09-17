<template>
  <section
    v-loading.fullscreen.lock="loading"
    class="page page--application-awayforbuiness">

    <m-breadcrumb :items="breadcrumb" />

    <userinfo :data="info.applier_user_info" />

    <AwayForBusinessForm :data="detail" />

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
  import AwayForBusinessForm from '../common/AwayForBusinessForm'


  export default {
    name: 'AwayForBusiness',

    components: {
      Userinfo,
      logsAndPath,
      StatusButton,
      AwayForBusinessForm,
    },

    mixins: [mixin.application, mixin.breadcrumb, mixin.flow],

    data() {
      return {
        userinfo: {},
        breadcrumb: this.$breadcrumb([
          { name: '我发起的', to: '/attendance/application' },
          { name: '因公外出' },
        ], 'attendance'),
      }
    },

  }
</script>
