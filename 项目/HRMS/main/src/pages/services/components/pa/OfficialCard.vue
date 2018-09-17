<template>
  <section
    v-loading.fullscreen.lock="loading"
    class="page page--pa-official__card">

    <m-breadcrumb :items="breadcrumb" />

    <userinfo />

    <m-section
      title="申请表单"
      is-form>
      <m-section-row>
        <m-section-cell
          title="流程编码"
          :content="info.code || '由系统自动生成'" />
        <m-section-cell
          title="申请日期"
          :content="date" />
      </m-section-row>
      <m-section-row>
        <m-section-cell
          title="流程状态"
          :content="status" />
      </m-section-row>

      <el-form
        class="m-section--form"
        label-width="140px"
        ref="form"
        :rules="rules"
        :model="form">
        <m-section-row>
          <el-form-item
            label="申请原因"
            prop="zsgpsq_reason"
            :rules="rules.zsgpsq_reason">
            <el-select
              placeholder="请选择申请原因"
              v-model="form.zsgpsq_reason">
              <el-option
                label="新人入职申请"
                value="1" />
              <el-option
                label="遗失补办申领"
                value="2" />
            </el-select>
          </el-form-item>
        </m-section-row>
        <m-section-row>
          <el-form-item
            label="照片上传"
            prop="zsgpsq_aid"
            :rules="rules.zsgpsq_aid">
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
                仅可上传一张照片，大小1M~5M以内，白底全身，1200×1200像素及以上。
              </div>
            </m-upload>
          </el-form-item>
        </m-section-row>
      </el-form>
    </m-section>

    <logsAndPath
      v-if="info.status == '94'"
      :data="logsAndPath" />

    <application-button />
  </section>
</template>

<script>
  import mixin from '~services/mixin'
  import logsAndPath from '@/components/logsAndPath'
  import Userinfo from '../common/Userinfo'
  import ApplicationButton from '../common/ApplicationButton'

  export default {
    name: 'PAOfficialCard',
    components: {
      Userinfo,
      logsAndPath,
      ApplicationButton,
    },
    mixins: [mixin.pa, mixin.flow, mixin.router],
    data() {
      return {
        action: this.$api.services.pa.upload,
        form: {
          zsgpsq_reason: '',
          zsgpsq_aid: '',
        },
        rules: {
          zsgpsq_reason: [
            { required: true, message: '请维护申请原因', trigger: 'blur' },
          ],
          zsgpsq_aid: [
            { required: true, message: '请上传照片', trigger: 'blur' },
          ],
        },
        breadcrumb: this.$breadcrumb([
          { name: '正式工卡申请' },
        ]),
        fileList: [],
        submitMessage: '提交完成，工卡月末将集中制定，周期约15天，请留意流程审批状态',
      }
    },
    computed: {
      date() {
        const date = this.info.apply_date
        return date || '由系统自动生成'
      },
      status() {
        return this.id ? this.info.status_name : '草稿'
      },
    },
    created() {
      const { id } = this.$route.params
      if (id) {
        this.getInfo()
          .then((res) => {
            this.info = res.data
            this.form = this.info.flow_form_data
            const file = this.info.flow_form_data.attachment_list[0]
            const { url: imgUrl, name } = file
            this.fileList = [{ url: imgUrl, name }]

            if (Number(this.info.status) === 94) {
              this.getLogsAndPath()
            }
          })
      }
    },
    methods: {
      beforeUpload(file) {
        const isJPGorPNG = (file.type === 'image/jpeg' || file.type === 'image/png')
        const isLt5M = file.size / 1024 / 1024 < 5
        const isMt1M = file.size / 1024 / 1024 > 1

        if (!isLt5M) {
          this.$message.error('上传文件大小不能超过 5M!')
        }
        if (!isMt1M) {
          this.$message.error('上传文件大小不能少于 1M!')
        }
        if (!isJPGorPNG) {
          this.$message.error('请选择png/jpg格式图片')
        }
        return isLt5M && isJPGorPNG && isMt1M
      },

      success(response) {
        const { id } = response.data
        this.form.zsgpsq_aid = id
      },
      remove() {
        this.form.zsgpsq_aid = ''
      },
    },
  }
</script>


<style lang="scss" type="text/scss">
  .upload {
    width: 440px;
    position: relative;

    .el-upload__tip {
      line-height: 1.2;
      color: #999;
    }
  }
</style>
