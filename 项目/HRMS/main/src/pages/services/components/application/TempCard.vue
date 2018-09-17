<template>
  <section
    v-loading.fullscreen.lock="loading"
    class="page page--application-temp__card">

    <m-breadcrumb :items="breadcrumb" />

    <userinfo :data="info.applier_user_info" />

    <temp-card-form :data="detail" />

    <logsAndPath :data="logsAndPath" />

    <StatusButton />

  </section>
</template>

<script>
  import mixin from '~services/mixin'
  import logsAndPath from '@/components/logsAndPath'
  import StatusButton from '../common/StatusButton'
  import Userinfo from '../common/Userinfo'
  import TempCardForm from '../common/TempCardForm'

  export default {
    name: 'ApplicationTempCard',
    components: {
      Userinfo,
      logsAndPath,
      StatusButton,
      TempCardForm,
    },
    mixins: [mixin.application, mixin.breadcrumb, mixin.flow],
    data() {
      return {
        userinfo: {},
        breadcrumb: this.$breadcrumb([
          { name: '我发起的', to: '/application/index' },
          { name: '临时工卡申请' },
        ]),
      }
    },
  }
</script>
