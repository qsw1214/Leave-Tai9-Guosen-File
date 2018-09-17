
<template>
  <section
    v-loading.fullscreen.lock="loading"
    class="page page--approved-business__card">

    <m-breadcrumb :items="breadcrumb" />

    <userinfo :data="info.applier_user_info" />

    <fixed-assets-form :data="detail" />

    <m-section
      title="审批表单">

      <m-section-row>
        <m-section-cell
          title="审批日期"
          :content="result.approval_time" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="审批意见"
          :content="result.approval_subject" />
      </m-section-row>
    </m-section>
  </section>
</template>

<script>
  import mixin from '~services/mixin'
  import Userinfo from '../common/Userinfo'
  import FixedAssetsForm from '../common/FixedAssetsForm'

  export default {
    name: 'FixedAssets',

    components: {
      Userinfo,
      FixedAssetsForm,
    },
    mixins: [mixin.approved, mixin.flow],

    data() {
      return {
        breadcrumb: this.$breadcrumb([
          { name: '我已审批', to: '/approved/index' },
          { name: '固定资产申请' },
        ]),
      }
    },
  }
</script>
