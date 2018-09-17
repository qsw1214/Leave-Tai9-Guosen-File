<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="page">

    <m-breadcrumb :items="breadcrumb" />
    <userinfo :data="info.applier_user_info" />

    <form-area
      :is-form="false"
      :data="detail" />

    <logs-and-path :data="logsAndPath" />

    <status-buttons />

  </div>
</template>

<script>
  import mixin from '~services/mixin'
  import LogsAndPath from '@/components/logsAndPath'
  import Userinfo from '../common/Userinfo'
  import FormArea from '../common/CarForm'
  import StatusButtons from '../common/StatusButton'

  export default {
    name: 'ApplicationCar',
    components: {
      Userinfo, LogsAndPath, FormArea, StatusButtons,
    },
    mixins: [mixin.flow, mixin.application, mixin.breadcrumb],

    data() {
      return {
        breadcrumb: this.$breadcrumb([
          { name: '我发起的', to: '/application/index' },
          { name: '车辆服务' },
        ]),
      }
    },
  }
</script>
