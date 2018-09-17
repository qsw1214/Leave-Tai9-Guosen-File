<template>
  <section
    v-loading.lock="loading"
    class="page page--approving-personal__cert">
    <m-breadcrumb :items="breadcrumb" />

    <userinfo :data="info.applier_user_info" />

    <personal-cert-form :data="detail" />

    <Cert
      v-if="detail.rszm_internship_template !== '2'"
      :form="cert" />

    <m-section
      title="审批记录">
      <ApprovalSteps :data="logs.approval_list" />
    </m-section>

    <m-section
      title="审批表单"
      is-form>

      <el-form
        class="m-section--form"
        label-width="140px"
        ref="approvalForm"
        :rules="rules"
        :model="form">
        <m-section-row>
          <el-form-item
            label="审批日期">
            <span>由系统自动生成</span>
          </el-form-item>

          <el-form-item
            prop="approval_money"
            label="月工资收入"
            v-if="info.flow_form_data.rszm_type === '1'"
            :rules="rules.approval_money">

            <el-input
              type="number"
              placeholder="月工资收入确认金额"
              :min="1"
              v-model.number="form.approval_money">
            <template slot="append">元</template></el-input>
          </el-form-item>
        </m-section-row>

        <el-form-item
          label="审批意见"
          prop="approval_subject"
          :rules="rules.approval_subject">

          <el-input
            type="textarea"
            placeholder="请输入审批意见"
            :rows="2"
            v-model="form.approval_subject" />
        </el-form-item>
      </el-form>
    </m-section>

    <ApprovalButton />
  </section>
</template>

<script>
  import mixin from '~services/mixin'
  import ApprovalSteps from '@/components/ApprovalSteps'
  import Userinfo from '../common/Userinfo'
  import Cert from '../common/Cert'
  import PersonalCertForm from '../common/PersonalCertForm'
  import ApprovalButton from '../common/ApprovalButton'

  export default {
    name: 'ApplicationPersonalCert',

    components: {
      Userinfo,
      Cert,
      ApprovalSteps,
      PersonalCertForm,
      ApprovalButton,
    },
    mixins: [mixin.approving, mixin.flow, mixin.router],
    data() {
      const inputMoney = (rule, value, callback) => {
        const reg = /^\d+(\.\d{1,2})?$/
        if (!reg.test(value)) {
          this.$nextTick(() => {
            this.form.approval_money = value.toFixed(2)
          })
        } else {
          callback()
        }
      }

      return {
        userinfo: {},
        cert: {},
        breadcrumb: this.$breadcrumb([
          { name: '待我审批', to: '/approving/index' },
          { name: '人事证明' },
        ]),
        form: {
          approval_money: '',
          approval_subject: '',
        },
        rules: {
          approval_money: [
            { required: true, message: '请输入月工资确认金额', trigger: 'blur' },
            {
              message: '确认金额必须大于0',
              pattern: /^([0-9]*[1-9][0-9]*(.[0-9]+)?|[0]+.[0-9]*[1-9][0-9]*)$/,
            },
            { validator: inputMoney, trigger: 'blur' },
          ],
          approval_subject: [{ required: true, message: '请输入审批意见', trigger: 'blur' }],
        },
      }
    },

    methods: {
      fetch() {
        this.getInfo()
          .then(() => {
            const form = Object.assign({}, this.info.flow_form_data)
            form.rszm_money = (Number(form.rszm_money) / 100).toFixed(2)
            this.cert = form
          })
        this.getLogs()
          .then((res) => {
            const money = res.data.last_approval_form_data.approval_money
            if (money) this.form.approval_money = (Number(money) / 100).toFixed(2)
          })
      },

      paramsHandler({ step }) {
        const form = {
          approval_subject: this.form.approval_subject,
          approval_money: Number(this.form.approval_money).toFixed(2) * 100,
        }

        return {
          step,
          id: this.$route.params.id,
          approval_form_data: JSON.stringify(form),
        }
      },
    },
  }
</script>
