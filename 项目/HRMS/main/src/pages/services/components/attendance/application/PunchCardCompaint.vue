<template>
  <section
    v-loading.fullscreen.lock="loading"
    class="page page--application-temp__card">

    <m-breadcrumb :items="breadcrumb" />

    <userinfo :data="info.applier_user_info" />

    <PunchCardCompaintForm :data="detail" />

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
  import PunchCardCompaintForm from '../common/PunchCardCompaintForm'


  export default {
    name: 'ApplicationTempCard',

    components: {
      Userinfo,
      logsAndPath,
      StatusButton,
      PunchCardCompaintForm,
    },

    mixins: [mixin.application, mixin.breadcrumb, mixin.flow],

    data() {
      return {
        userinfo: {},
        breadcrumb: this.$breadcrumb([
          { name: '我发起的', to: '/attendance/application' },
          { name: '未打卡申诉' },
        ], 'attendance'),
      }
    },
  }
</script>
