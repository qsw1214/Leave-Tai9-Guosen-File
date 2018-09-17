<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="page page--application-ao-express">

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
  import LogsAndPath from '@/components/logsAndPath'
  import mixin from '~services/mixin'
  import Userinfo from '../common/Userinfo'
  import FormArea from '../common/AOExpressForm'
  import StatusButtons from '../common/StatusButton'

  export default {
    name: 'ApplicationAOExpress',
    components: {
      Userinfo, LogsAndPath, FormArea, StatusButtons,
    },
    mixins: [mixin.flow, mixin.application, mixin.breadcrumb],

    data() {
      return {
        breadcrumb: this.$breadcrumb([
          { name: '我发起的', to: '/application/index' },
          { name: '行政运营支持办公费申请' },
        ]),
      }
    },
  }
</script>
