<template>
  <section
    v-loading.fullscreen.lock="loading"
    class="page page--approving-official__card">

    <m-breadcrumb :items="breadcrumb" />

    <userinfo :data="info.applier_user_info" />

    <official-card-form :data="detail" />

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
        :model="result">
        <m-section-row>
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
  import ApprovalButton from '../common/ApprovalButton'
  import OfficialCardForm from '../common/OfficialCardForm'

  export default {
    name: 'ApprovingContent',

    components: {
      Userinfo,
      ApprovalSteps,
      ApprovalButton,
      OfficialCardForm,
    },

    mixins: [mixin.approving, mixin.flow, mixin.router],

    data() {
      return {
        result: {
          approval_subject: '',
        },
        rules: {
          approval_subject: [
            { required: true, message: '请填写审批意见', trigger: 'blur' },
          ],
        },
        breadcrumb: this.$breadcrumb([
          { name: '待我审批', to: '/approving/index' },
          { name: '正式工卡申请' },
        ]),
      }
    },
  }
</script>

