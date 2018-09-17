<template>
  <section
    v-loading.lock="loading"
    class="page page--application-personal__cert">
    <m-breadcrumb :items="breadcrumb" />

    <userinfo :data="info.applier_user_info" />

    <personal-cert-form :data="detail" />

    <Cert
      v-if="detail.rszm_internship_template !== '2'"
      :form="cert" />

    <logsAndPath :data="logsAndPath" />

    <StatusButton />
  </section>
</template>

<script>
  import mixin from '~services/mixin'
  import logsAndPath from '@/components/logsAndPath'
  import Userinfo from '../common/Userinfo'
  import Cert from '../common/Cert'
  import StatusButton from '../common/StatusButton'
  import PersonalCertForm from '../common/PersonalCertForm'

  export default {
    name: 'ApplicationPersonalCert',
    components: {
      Userinfo,
      Cert,
      logsAndPath,
      StatusButton,
      PersonalCertForm,
    },
    mixins: [mixin.detailData, mixin.breadcrumb, mixin.flow],
    data() {
      return {
        userinfo: {},
        cert: {},
        breadcrumb: this.$breadcrumb([
          { name: '我发起的', to: '/application/index' },
          { name: '人事证明' },
        ]),
      }
    },
    created() {
      this.getInfo()
        .then(() => {
          this.userinfo = this.info.applier_user_info
          const form = Object.assign({}, this.info.flow_form_data)
          form.rszm_money = (Number(form.rszm_money) / 100).toFixed(2)
          this.cert = form
        })
      this.getLogsAndPath()
    },
  }
</script>
