<template>
  <section
    v-loading.fullscreen.lock="loading"
    class="page page--approving-temp__card">

    <m-breadcrumb :items="breadcrumb" />

    <userinfo :userinfo="userinfo" />

    <m-section
      title="申请表单"
      :is-form="false">
      <m-section-row>
        <m-section-cell
          title="流程编码"
          :content="info.code" />
        <m-section-cell
          title="申请日期"
          :content="info.apply_date" />
      </m-section-row>
      <m-section-row>
        <m-section-cell
          title="流程状态"
          :content="info.status_name" />
        <m-section-cell
          title="预计归还时间"
          v-show="info.flow_form_data.lsgpsq_reason == '2'"
          :content="info.flow_form_data.lsgpsq_return_date" />
      </m-section-row>
      <m-section-row>
        <m-section-cell
          title="申请原因"
          :content="info.flow_form_data.lsgpsq_reason_name" />
        <m-section-cell
          title="实际使用人"
          v-show="info.flow_form_data.lsgpsq_reason == '2'"
          :content="info.flow_form_data.lsgpsq_user_name" />
      </m-section-row>
    </m-section>

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
        ref="form"
        :rules="rules"
        :model="form">
        <m-section-row>
          <el-form-item
            required
            prop="approval_lsgp_num"
            label="临时工牌编号"
            :rules="rules.approval_lsgp_num">
            <el-input
              placeholder="请输入临时工牌编号"
              v-model="form.approval_lsgp_num" />
          </el-form-item>
          <el-form-item
            label="审批日期">
            <span>由系统自动生成</span>
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

    <div class="page--approving-actions">
      <el-button
        type="primary"
        :loading="button.agree"
        @click="agree">同意</el-button>

      <el-button
        type="info"
        :loading="button.reject"
        @click="reject">退回</el-button>

      <el-button
        type="info"
        @click="cancel">取消</el-button>
    </div>
  </section>
</template>

<script>
  import mixin from '~services/mixin'
  import ApprovalSteps from '@/components/ApprovalSteps'
  import Userinfo from '../common/Userinfo'

  export default {
    name: 'ApprovingTempCard',
    components: { Userinfo, ApprovalSteps },
    mixins: [mixin.flow, mixin.router],
    data() {
      const numValidator = (rule, value, callback) => {
        if (this.step === '2') {
          if (value === '') {
            callback(new Error('请填写临时工牌编号'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }

      return {
        form: {
          approval_lsgp_num: '',
          approval_subject: '',
        },
        rules: {
          approval_lsgp_num: [
            { validator: numValidator, trigger: 'blur' },
          ],
          approval_subject: [
            { required: true, message: '请填写审批意见', trigger: 'blur' },
          ],
        },
        userinfo: {},
        step: '',
        breadcrumb: this.$breadcrumb([
          { name: '待我审批', to: '/approving/index' },
          { name: '临时工卡申请' },
        ]),
      }
    },
    created() {
      this.getInfo()
        .then((res) => {
          this.userinfo = res.data.applier_user_info
        })
      this.getLogs()
        .then((res) => {
          this.form = Object.assign({}, this.form, res.data.last_approval_form_data)
        })
    },
    methods: {
      agree() {
        this.step = '2'
        this.approval({ step: '2' })
      },

      reject() {
        this.step = '4'
        this.approval({ step: '4' })
      },

      validator(success) {
        this.$refs.form
          .validate()
          .then(success)
          .catch(() => {})
      },

      paramsHandler({ step }) {
        return {
          step,
          id: this.$route.params.id,
          approval_form_data: JSON.stringify(this.form),
        }
      },
    },
  }
</script>
