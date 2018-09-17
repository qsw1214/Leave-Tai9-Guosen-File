<template>
  <section
    v-loading.fullscreen.lock="loading"
    class="page page--application-business__card">

    <m-breadcrumb :items="breadcrumb" />

    <entry-form
      title="入职员工信息"
      :data="detail" />

    <component
      ref="view"
      :result="result"
      :is="currentView" />

  </section>
</template>

<script>
  import mixins from '~employee/mixins'
  import EntryForm from '../common/EntryForm'
  import RSApprovedForm from './approved/RSApprovedForm'
  import HGApprovedForm from './approved/HGApprovedForm'
  import ITApprovedForm from './approved/ITApprovedForm'
  import XZApprovedForm from './approved/XZApprovedForm'
  import RS2ApprovedForm from './approved/RS2ApprovedForm'
  import RS3ApprovedForm from './approved/RS3ApprovedForm'
  import PXApprovedForm from './approved/PXApprovedForm'

  export default {
    name: 'EntryApproved',

    components: {
      EntryForm,
      RSApprovedForm,
      HGApprovedForm,
      ITApprovedForm,
      XZApprovedForm,
      RS2ApprovedForm,
      RS3ApprovedForm,
      PXApprovedForm,
    },

    mixins: [
      mixins.approved,
      mixins.flow,
      mixins.formType.entryApproved,
    ],

    computed: {
      currentView() {
        const type = this.result.approval_form_type

        return this.formType[type]
      },

      breadcrumb() {
        let applierName = ''
        if (this.detail.rsrzgl_name) {
          applierName = this.detail.rsrzgl_name
        }

        return [
          { name: '员工服务' },
          { name: '入职管理', to: '/entry/application' },
          { name: '我已审批', to: '/entry/approved' },
          { name: applierName },
        ]
      },
    },
  }
</script>
