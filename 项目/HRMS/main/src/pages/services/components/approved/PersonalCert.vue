<template>
  <section
    v-loading.lock="loading"
    class="page page--approved-personal__cert">
    <m-breadcrumb :items="breadcrumb" />

    <userinfo :data="userinfo" />

    <personal-cert-form :data="detail" />

    <Cert
      v-if="detail.rszm_internship_template !== '2'"
      id="printable"
      :form="cert" />

    <m-section
      title="审批表单">
      <m-section-row>
        <m-section-cell
          title="审批日期"
          :content="result.approval_time" />
        <m-section-cell
          title="月工资收入确认金额"
          v-show="info.flow_form_data.rszm_type === '1'"
          :content="String(result.approval_money)" />
      </m-section-row>
      <m-section-row>
        <m-section-cell
          title="审批意见"
          :content="result.approval_subject" />
      </m-section-row>
    </m-section>
    <div>
      <el-button
        type="primary"
        v-if="result.is_print == 1"
        :loading="btn_loading"
        @click="onPrint">打印</el-button>
    </div>
  </section>
</template>

<script>
  import mixin from '~services/mixin'
  import Userinfo from '../common/Userinfo'
  import Cert from '../common/Cert'
  import PersonalCertForm from '../common/PersonalCertForm'

  export default {
    name: 'ApplicationPersonalCert',

    components: {
      Userinfo,
      Cert,
      PersonalCertForm,
    },
    mixins: [mixin.detailData, mixin.breadcrumb, mixin.flow],
    data() {
      return {
        userinfo: {},
        cert: {},
        breadcrumb: this.$breadcrumb([
          { name: '我已审批', to: '/approved/index' },
          { name: '人事证明' },
        ]),
        btn_loading: false,
      }
    },

    created() {
      this.fetch()
    },

    methods: {
      fetch() {
        this.getInfo()
          .then(() => {
            this.userinfo = this.info.applier_user_info
            const form = Object.assign({}, this.info.flow_form_data)
            form.rszm_money = (Number(form.rszm_money) / 100).toFixed(2)
            this.cert = form
          })
        this.getResult()
          .then(() => {
            this.result.approval_money = (Number(this.result.approval_money) / 100).toFixed(2)
          })
      },
      onPrint() {
        window.print()
      },
    },
  }
</script>

<style lang="scss" type="text/scss">
  @media print {
    @page {
      margin: 2cm;
    }

    body * {
      visibility: hidden;
    }

    #printable,
    #printable * {
      visibility: visible;
      border: 0 !important;
    }

    #printable {
      position: absolute;
      left: 0;
      top: 0;
    }

    #printable .cert--content {
      font-size: 28px;
      font-family: 'SimSun', sans-serif;
      line-height: 1.5;
    }

    #printable .cert--content .unit {
      text-decoration: none !important;
      color: #333 !important;
    }

    #printable .cert--content h2 {
      font-size: 36px;
      font-family: 'SimSun', sans-serif;
      line-height: 1.2;
      margin-top: 0;
      margin-bottom: 10px;
    }

    #printable .footer,
    #printable .date {
      font-size: 24px;
      font-family: 'SimSun', sans-serif;
      line-height: 1.5;
      font-weight: normal;
    }

    #printable p span {
      text-decoration: none !important;
      color: #333 !important;
    }

    #printable p .left {
      font-weight: normal;
    }

    #printable .print-only {
      visibility: visible;
      display: block;
    }

    #printable .print-exclude {
      visibility: hidden;
      display: none;
    }
  }
</style>
