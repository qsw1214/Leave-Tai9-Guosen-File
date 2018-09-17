<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="page page--application-high-speed-market">

    <m-breadcrumb :items="breadcrumb" />
    <userinfo :data="info.applier_user_info" />
    <form-area :data="detail" />
    <logs-and-path :data="logsAndPath" />

    <status-buttons />

  </div>
</template>

<script>
  import mixin from '~services/mixin'
  import LogsAndPath from '@/components/logsAndPath'
  import Userinfo from '../common/Userinfo'
  import FormArea from '../common/HighSpeedMarketForm'
  import StatusButtons from '../common/StatusButton'

  export default {
    name: 'ApplicationHighSpeedMarket',
    components: {
      Userinfo, LogsAndPath, FormArea, StatusButtons,
    },
    mixins: [mixin.application, mixin.flow, mixin.breadcrumb],

    data() {
      return {
        breadcrumb: this.$breadcrumb([
          { name: '我发起的', to: '/application/index' },
          { name: '高速行情采购' },
        ]),
      }
    },
  }
</script>
