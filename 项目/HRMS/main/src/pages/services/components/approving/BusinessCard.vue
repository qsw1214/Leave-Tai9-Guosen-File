<template>
  <section
    v-loading.fullscreen.lock="loading"
    class="page page--approving-business__card">

    <m-breadcrumb :items="breadcrumb" />

    <userinfo :data="info.applier_user_info" />

    <business-card-form :data="detail" />

    <m-section
      title="审批记录">
      <ApprovalSteps
        :data="logs.approval_list" />
    </m-section>

    <m-section
      title="审批表单"
      is-form>
      <el-form
        class="m-section--form"
        label-width="140px"
        ref="approvalForm"
        :rules="rules"
        :model="result">

        <m-section-row>
          <el-form-item
            label="审批日期">
            <span>由系统自动生成</span>
          </el-form-item>

          <el-form-item
            prop="approval_job_name"
            label="职位确认"
            :rules="rules.approval_job_name">
            <el-input
              placeholder="请输入职位"
              v-model="result.approval_job_name" />
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
            v-model="result.approval_subject" />
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
  import BusinessCardForm from '../common/BusinessCardForm'
  import ApprovalButton from '../common/ApprovalButton'

  export default {
    name: 'BusninessCard',

    components: {
      Userinfo,
      ApprovalSteps,
      BusinessCardForm,
      ApprovalButton,
    },
    mixins: [mixin.approving, mixin.flow, mixin.router],

    data() {
      return {
        breadcrumb: this.$breadcrumb([
          { name: '待我审批', to: '/approving/index' },
          { name: '名片申请' },
        ]),
        rules: {
          approval_job_name: [
            { required: true, message: '请填写职位', trigger: 'blur' },
          ],
          approval_subject: [
            { required: true, message: '请填写审批意见', trigger: 'blur' },
          ],
        },
        result: {
          approval_job_name: '',
          approval_subject: '',
        },
        submitMessage: '提交完成，名片将集中制定，周期约5天，请留意流程审批状态。',
      }
    },
  }
</script>
