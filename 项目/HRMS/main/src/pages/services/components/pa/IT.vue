<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="page">

    <m-breadcrumb :items="breadcrumb" />
    <userinfo />

    <p class="page-pa-it--description">
      <!-- eslint-disable-next-line max-len -->
      温馨提示：我们已将 IT 常见问题解决方案归档，点击<router-link :to="`/helper?id=${helperId}`">这里</router-link>查看。若无法自助解决，请填写一下工单提交。
    </p>

    <m-section
      title="申请表单"
      is-form>

      <m-section-row>
        <m-section-cell
          title="流程编码"
          :content="info.code || '由系统自动生成'" />

        <m-section-cell
          title="申请日期"
          :content="info.apply_date || '由系统自动生成'" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="流程状态"
          :content="info.status_name || '草稿'" />
      </m-section-row>

      <el-form
        class="m-section--form"
        label-width="140px"
        ref="form"
        :rules="rules"
        :model="info.flow_form_data">

        <el-form-item
          prop="itfw_type"
          label="故障类别">

          <el-select
            placeholder="请选择"
            v-model="info.flow_form_data.itfw_type">
            <el-option
              value="1"
              label="硬件问题" />
            <el-option
              value="2"
              label="软件问题" />
            <el-option
              value="4"
              label="网络问题" />
          </el-select>
        </el-form-item>

        <el-form-item
          prop="itfw_describe"
          label="故障描述">
          <el-input
            style="width: 100%;"
            v-model="info.flow_form_data.itfw_describe" />
        </el-form-item>

        <m-section-row>
          <el-form-item
            label="附件上传">
            <m-upload
              ref="upload"
              :on-success="uploadHandler"
              :on-remove="uploadHandler"
              :accept="upload.accept"
              :file-list="upload.files"
              :action="upload.action" />
          </el-form-item>
        </m-section-row>

      </el-form>

    </m-section>

    <logs-and-path
      v-if="info.status === 94"
      :data="logsAndPath" />

    <div class="page--pa-actions">
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
  import mixin from '~services/mixin'
  import LogsAndPath from '@/components/logsAndPath'
  import Userinfo from '../common/Userinfo'

  export default {
    name: 'PAIT',
    components: {
      Userinfo,
      LogsAndPath,
    },
    mixins: [mixin.pa, mixin.flow, mixin.router],

    data() {
      return {
        breadcrumb: this.$breadcrumb([
          { name: 'IT 服务' },
        ]),

        rules: {
          itfw_type: [
            { required: true, message: '请选择故障类别', trigger: 'blur' },
          ],
          itfw_describe: [
            { required: true, message: '请填写故障描述', trigger: 'blur' },
          ],
        },

        info: {
          flow_form_data: { itfw_aids: '' },
        },

        submitMessage: '提交完成，IT 收到请求后，会及时联系你解决',
      }
    },

    computed: {
      helperId() {
        return this.$store.state.services.initData.helper_channels_itfw_id
      },
    },

    created() {
      this.fetch()
    },

    methods: {
      uploadHandler() {
        this.info.flow_form_data.itfw_aids = this.$refs.upload.getFiles('string')
      },
    },
  }
</script>

