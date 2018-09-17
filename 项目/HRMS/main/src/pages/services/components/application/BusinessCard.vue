<template>
  <section
    v-loading.fullscreen.lock="loading"
    class="page page--application-business__card">

    <m-breadcrumb :items="breadcrumb" />

    <userinfo :data="info.applier_user_info" />

    <business-card-form :data="detail" />

    <logs-and-path :data="logsAndPath" />

    <StatusButton />
  </section>
</template>

<script>
  import mixin from '~services/mixin'
  import LogsAndPath from '@/components/logsAndPath'
  import Userinfo from '../common/Userinfo'
  import StatusButton from '../common/StatusButton'
  import BusinessCardForm from '../common/BusinessCardForm'

  export default {
    name: 'BusninessCard',

    components: {
      Userinfo,
      LogsAndPath,
      BusinessCardForm,
      StatusButton,
    },

    mixins: [mixin.breadcrumb, mixin.application, mixin.flow],

    data() {
      return {
        breadcrumb: this.$breadcrumb([
          { name: '我发起的', to: '/application/index' },
          { name: '名片申请' },
        ]),
      }
    },
  }
</script>
