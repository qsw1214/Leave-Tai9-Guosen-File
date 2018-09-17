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

    <el-row>
      <el-col
        class="row--cell"
        v-if="info.status == 92"
        :span="24">
        <span style="color: #f00;">Tips:审批节点不存在/已离职/已退休/已锁定，流程被退回，请点击提交按钮重新发起。</span>
      </el-col>
      <el-col
        class="row--cell"
        v-if="info.status == 93"
        :span="24">
        <span style="color: #f00;">Tips:审批节点不存在/已离职/已退休/已锁定，系统无法自动发起，请调整审批链设置后手动提交。</span>
      </el-col>
    </el-row>

    <div>
      <el-button
        type="primary"
        :loading="button.submit"
        @click="submit('submit')">提交</el-button>

      <el-button
        type="info"
        :loading="button.stash"
        @click="submit('stash')">暂存</el-button>

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
    mixins: [mixin.pa, mixin.flow, mixin.router],
    data() {
      return {
        code: '200017',
        breadcrumb: [
          { name: '员工自助' },
          { name: '组织人事', to: '/op/become-regular' },
          { name: '转正申请' },
        ],
        // 表单数据
        approvalForm: {
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
  }
</script>
