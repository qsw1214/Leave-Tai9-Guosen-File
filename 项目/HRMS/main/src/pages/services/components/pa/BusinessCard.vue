<template>
  <section
    v-loading.fullscreen.lock="loading"
    class="page page--pa-business__card">
    <m-breadcrumb :items="breadcrumb" />

    <userinfo :data="userinfo" />

    <m-section
      title="申请表单"
      is-form>

      <m-section-row>
        <m-section-cell
          title="流程编码"
          :content="info.code || '提交后由系统生成'" />
        <m-section-cell
          title="申请日期"
          :content="info.apply_date || '提交后由系统生成'" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="流程状态"
          :content="info.status_name || '草稿'" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          content="请填写名片信息，流程完成提交后，请下周二到所在部门运营经理处领取。"
          title="申请说明" />
      </m-section-row>

      <el-form
        class="m-section--form"
        label-width="140px"
        ref="form"
        :rules="rules"
        :model="form">

        <m-section-row>
          <el-form-item
            prop="mpsq_user_uid"
            label="名片人名称">
            <m-employee-select
              class="employee-select"
              init-change
              :width="260"
              :employees.sync="form.mpsq_user_uid"
              @change="getEmployeeCharge" />
          </el-form-item>

          <el-form-item
            label="经纪号">
            <el-input
              disabled
              v-model="extForm.broker_code" />
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="所属部门">
            <el-input
              disabled
              v-model="extForm.org_name" />
          </el-form-item>

          <el-form-item
            label="职位">
            <el-input
              disabled
              v-model="extForm.job_name" />
          </el-form-item>
        </m-section-row>

        <el-form-item
          prop="mpsq_user_finance_attribute"
          label="营业部">
          <el-input
            disabled
            type="textarea"
            resize="none"
            :rows="1"
            v-model="form.mpsq_user_finance_attribute" />
        </el-form-item>

        <m-section-row>
          <el-form-item
            label="手机号码">
            <el-input
              disabled
              v-model="extForm.mobile" />
          </el-form-item>

          <el-form-item
            label="电子邮箱">
            <el-input
              disabled
              v-model="extForm.email_outside" />
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="名片数量"
            prop="mpsq_num">
            <el-select
              v-model="form.mpsq_num">
              <el-option
                v-for="option in 5"
                :value="option"
                :key="option" />
            </el-select>
          </el-form-item>

          <el-form-item
            label="加个人开户二维码"
            prop="mpsq_is_need_qrcode">
            <el-select
              v-model="form.mpsq_is_need_qrcode">
              <el-option
                value="1"
                label="是" />
              <el-option
                value="0"
                label="否" />
            </el-select>
          </el-form-item>
        </m-section-row>

        <el-form-item
          style="width: 580px;"
          label="二维码上传"
          prop="mpsq_aids"
          v-if="form.mpsq_is_need_qrcode == '1'">
          <m-upload
            class="upload"
            accept="image"
            ref="upload"
            :action="action"
            :before-upload="beforeUpload"
            :on-success="success"
            :limit="1"
            :file-list="fileList">
            <div
              class="el-upload__tip"
              slot="tip">
              仅可上传一张二维码照片，大小500Kb以内jpg/png图
            </div>
          </m-upload>
        </el-form-item>
      </el-form>
    </m-section>

    <logs-and-path
      v-if="info.status === 94"
      :data="logsAndPath" />

    <application-button />
  </section>
</template>

<script>
  import mixin from '~services/mixin'
  import LogsAndPath from '@/components/logsAndPath'
  import Userinfo from '../common/Userinfo'
  import ApplicationButton from '../common/ApplicationButton'

  export default {
    name: 'BusninessCard',

    components: {
      Userinfo,
      LogsAndPath,
      ApplicationButton,
    },
    mixins: [mixin.pa, mixin.flow, mixin.router],

    data() {
      const { id } = this.$route.params
      return {
        action: this.$api.services.pa.upload,
        breadcrumb: this.$breadcrumb([
          { name: '名片申请' },
        ]),
        userinfo: {},
        form: {
          mpsq_user_uid: '',
          mpsq_user_finance_attribute: '',
          mpsq_num: '',
          mpsq_is_need_qrcode: '',
          mpsq_aids: '',
        },
        extForm: {
        },
        rules: {
          mpsq_user_uid: [{ required: true, message: '请选择名片人名称', trigger: 'blur' }],
          mpsq_user_finance_attribute: [{ required: true, message: '请确保用户在营业部内', trigger: 'blur' }],
          mpsq_num: [{ required: true, message: '请输入名片数量', trigger: 'blur' }],
          mpsq_is_need_qrcode: [{ required: true, message: '请选择', trigger: 'blur' }],
          mpsq_aids: [{ required: true, message: '请上传对应二维码图片', trigger: 'blur' }],
        },
        id,
        fileList: [],
        submitMessage: '提交完成，名片将集中制定，周期约5天，请留意流程审批状态',
      }
    },

    created() {
      if (!this.id) {
        this.getInitUser()
          .then((res) => {
            const { id, finance_attribute } = res.data
            this.userinfo = res.data
            this.form.mpsq_user_finance_attribute = finance_attribute
            this.form.mpsq_user_uid = id
          })
      } else {
        this.getInfo()
          .then(() => {
            this.form = this.info.flow_form_data
            this.fileList = this.form.attachment_list
            this.userinfo = this.info.applier_user_info

            if (Number(this.info.status) === 94) {
              this.getLogsAndPath()
            }
          })
      }
    },

    methods: {
      success(response) {
        const { id } = response.data
        this.form.mpsq_aids = id
        this.$refs.form.validateField('mpsq_aids')
      },

      remove() {
        this.form.mpsq_aids = ''
      },

      beforeUpload(file) {
        const isJPGorPNG = (file.type === 'image/jpeg' || file.type === 'image/png')
        const isLt5M = file.size / 1024 / 1024 < 0.5

        if (!isLt5M) {
          this.$message.error('上传文件大小不能超过 500kb!')
        }
        return isLt5M && isJPGorPNG
      },

      getEmployeeCharge(item) {
        const { id } = item[0]

        this.$axios
          .post(this.$api.common.userBaseinfo, {
            id,
          })
          .then((res) => {
            this.extForm = res.data
            this.form.mpsq_user_uid = id
            this.form.mpsq_user_finance_attribute = res.data.finance_attribute
          })
      },
    },
  }
</script>

<style lang="scss">
  .m-employee-select {
    .el-form-item {
      height: 0;
      margin: 0;
    }
  }
</style>
