<template>
  <section
    v-loading.fullscreen.lock="loading"
    class="page page--application-business__card">

    <m-breadcrumb :items="breadcrumb" />

    <userinfo :data="info.applier_user_info" />

    <fixed-assets-form :data="detail" />

    <logs-and-path :data="logsAndPath" />

    <StatusButton />
  </section>
</template>

<script>
  import mixin from '~services/mixin'
  import LogsAndPath from '@/components/logsAndPath'
  import Userinfo from '../common/Userinfo'
  import StatusButton from '../common/StatusButton'
  import FixedAssetsForm from '../common/FixedAssetsForm'

  export default {
    name: 'FixedAssets',

    components: {
      Userinfo,
      LogsAndPath,
      FixedAssetsForm,
      StatusButton,
    },
    mixins: [mixin.breadcrumb, mixin.application, mixin.flow],

    data() {
      return {
        breadcrumb: this.$breadcrumb([
          { name: '我发起的', to: '/application/index' },
          { name: '固定资产申请' },
        ]),
      }
    },
  }
</script>

<style lang="scss">
  .m-employee-select {
    .el-form-item {
      height: 0;
      margin: 0;
    }
  }
</style>
