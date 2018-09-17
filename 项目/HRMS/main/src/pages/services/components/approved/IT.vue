<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="page">

    <m-breadcrumb :items="breadcrumb" />
    <userinfo :data="info.applier_user_info" />

    <detail-form
      :is-form="false"
      :data="detail" />

    <m-section
      title="审批表单"
      :data="result">

      <m-section-row>
        <m-section-cell
          title="审批日期"
          prop="approval_time" />
        <m-section-cell
          title="审批意见"
          prop="approval_subject" />
      </m-section-row>
    </m-section>

  </div>
</template>

<script>
  import mixin from '~services/mixin'
  import DetailForm from '../common/ITForm'
  import Userinfo from '../common/Userinfo'

  export default {
    name: 'ApprovedIT',
    components: { DetailForm, Userinfo },
    mixins: [mixin.flow, mixin.approved],

    data() {
      const { approval_id } = this.$route.query

      return {
        breadcrumb: this.$breadcrumb([
          { name: '我已审批', to: '/approved/index' },
          { name: 'IT 服务' },
        ]),

        approval_id,
      }
    },
  }
</script>
