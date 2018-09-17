<template>
  <section
    v-loading.fullscreen.lock="loading"
    class="page page--application-business__card">
    <m-breadcrumb :items="breadcrumb" />

    <to-entry-form :data="detail" />

    <component
      ref="view"
      :result="result"
      :is="currentView" />
  </section>
</template>

<script>
  import mixins from '~employee/mixins'
  import ToEntryForm from '../common/ToEntryForm'
  import GTApprovedForm from './approved/GTApprovedForm'
  import RSApprovedForm from './approved/RSApprovedForm'
  import YYApprovedForm from './approved/YYApprovedForm'
  import ZPApprovedForm from './approved/ZPApprovedForm'

  export default {
    name: 'ToEntryApprovedDetail',

    components: {
      ToEntryForm,
      GTApprovedForm,
      RSApprovedForm,
      YYApprovedForm,
      ZPApprovedForm,
    },

    mixins: [
      mixins.flow,
      mixins.approved,
      mixins.formType.toEntryApproved,
    ],

    computed: {
      currentView() {
        const type = this.result.approval_form_type

        return this.formType[type]
      },

      breadcrumb() {
        let applierName = ''
        if (this.info.applier_user_info) {
          applierName = this.info.applier_user_info.name
        }

        return [
          { name: '员工服务' },
          { name: '待入职管理', to: '/to-entry/application' },
          { name: '我已审批', to: '/to-entry/approved' },
          { name: applierName },
        ]
      },
    },
  }
</script>
