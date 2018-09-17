<template>
  <div class="page page-initiated-transfer">

    <m-breadcrumb :items="breadcrumb" />
    <userinfo />

    <m-section
      title="申请表单">
      <m-section-row>
        <m-section-cell
          title="流程编码"
          :content="info.code || '由系统自动生成'" />
        <m-section-cell
          title="申请日期"
          :content="info.apply_date" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="流程状态"
          :content="info.status_name" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="转正类型"
          :content="info.flow_form_data.rszzgl_type_name" />
        <m-section-cell
          title="拟转正日期"
          :content="info.flow_form_data.rszzgl_date" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="转正原因"
          :content="info.flow_form_data.rszzgl_reason" />
      </m-section-row>
    </m-section>

    <logs-and-path :data="logsAndPath" />

    <m-section
      title="审批表单"
      is-form>
      <m-section-row>
        <m-section-cell
          title="审批日期"
          content="由系统自动生成" />
      </m-section-row>
      <el-form
        class="m-section--form"
        label-width="140px"
        ref="form"
        :model="form"
        :rules="formRules">
        <el-form-item
          label="转正申请"
          prop="approval_subject">
          <el-input
            type="textarea"
            :rows="3"
            :maxlength="300"
            v-model="form.approval_subject" />
        </el-form-item>
      </el-form>
    </m-section>

    <div>
      <el-button
        type="primary"
        :loading="button.agree"
        @click="agree">提交</el-button>

      <el-button
        type="info"
        :loading="button.reject"
        @click="reject">退回</el-button>

      <el-button
        type="info"
        @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
  /**
   * @description 发起转正申请流程
   * @router /op/initiated/become-regular
   */

  import LogsAndPath from '@/components/logsAndPath'
  import mixin from '~services/mixin'
  import Userinfo from '../common/Userinfo'


  export default {
    components: {
      Userinfo,
      LogsAndPath,
    },
    mixins: [mixin.approving, mixin.flow, mixin.router],
    data() {
      return {
        code: '200017',
        breadcrumb: [
          { name: '员工自助' },
          { name: '组织人事', to: '/op/become-regular' },
          { name: '转正申请' },
        ],
        // 表单数据
        form: {
          approval_achievement_data: '',
          approval_is_end_zz: '',
          approval_subject: '',
          approval_form_type: '200017003',
        },
        // 表单验证规则
        formRules: {
          approval_subject: [{
            required: true,
            message: '请输入转正申请',
            trigger: 'blur',
          }],
        },
        submitRedirectPath: '/op/become-regular',
      }
    },
    created() {
      if (this.id) {
        this.getInfo()
          .then(this.getLogsAndPath)
      }
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
