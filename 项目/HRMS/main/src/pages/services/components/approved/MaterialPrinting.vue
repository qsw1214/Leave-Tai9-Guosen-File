<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="page page--approved-material-printing">

    <m-breadcrumb :items="breadcrumb" />
    <userinfo :data="info.applier_user_info" />

    <detail-form :data="detail" />

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

      <m-section-row v-if="result.approval_aids">
        <m-section-cell title="附件列表">
          <m-attachment :data="result.attachment_list" />
        </m-section-cell>
      </m-section-row>

    </m-section>

  </div>
</template>

<script>
  import mixin from '~services/mixin'
  import DetailForm from '../common/MaterialPrintingForm'
  import Userinfo from '../common/Userinfo'

  export default {
    name: 'ApprovedMaterialPrinting',
    components: { DetailForm, Userinfo },
    mixins: [mixin.approved, mixin.flow],

    data() {
      const { approval_id } = this.$route.query

      return {
        breadcrumb: this.$breadcrumb([
          { name: '我已审批', to: '/approved/index' },
          { name: '宣传品印刷制作' },
        ]),

        approval_id,
      }
    },
  }
</script>
