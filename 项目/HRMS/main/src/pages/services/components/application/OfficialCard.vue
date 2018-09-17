<template>
  <section
    v-loading.fullscreen.lock="loading"
    class="page page--application-official__card">

    <m-breadcrumb :items="breadcrumb" />

    <userinfo :data="info.applier_user_info" />

    <official-card-form :data="detail" />

    <logsAndPath :data="logsAndPath" />

    <StatusButton />

  </section>
</template>

<script>
  import mixin from '~services/mixin'
  import logsAndPath from '@/components/logsAndPath'
  import StatusButton from '../common/StatusButton'
  import Userinfo from '../common/Userinfo'
  import OfficialCardForm from '../common/OfficialCardForm'

  export default {
    name: 'ApplicationContent',
    components: {
      Userinfo,
      logsAndPath,
      StatusButton,
      OfficialCardForm,
    },
    mixins: [mixin.application, mixin.breadcrumb, mixin.flow],
    data() {
      return {
        breadcrumb: this.$breadcrumb([
          { name: '我发起的', to: '/application/index' },
          { name: '正式工卡申请' },
        ]),
      }
    },
  }
</script>
