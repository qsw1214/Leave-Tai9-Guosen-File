<template>
  <el-form
    class="m-section--form"
    label-width="140px"
    ref="approvalForm"
    :rules="$parent.$parent.rules"
    :model="result">

    <m-section-row>
      <el-form-item
        label="审批日期">
        <span>由系统自动生成</span>
      </el-form-item>
    </m-section-row>

    <m-section-row>
      <el-form-item
        prop="approval_apply_url"
        label="申请链接">
        <el-input
          placeholder="请输入申请链接"
          v-model="result.approval_apply_url" />
      </el-form-item>
      <el-form-item
        prop="approval_apply_id"
        label="账号">
        <el-input
          placeholder="请输入账号"
          v-model="result.approval_apply_id" />
      </el-form-item>
    </m-section-row>

    <el-form-item
      label="审批意见"
      prop="approval_subject">
      <el-input
        type="textarea"
        placeholder="请输入审批意见"
        :rows="2"
        v-model="result.approval_subject" />
    </el-form-item>

    <el-form-item
      label="填报指引上传">
      <m-upload
        ref="upload"
        :before-upload= "beforeUpload"
        :on-success="uploadHandler"
        :on-remove="uploadHandler"
        :accept="upload.accept"
        :file-list="upload.files"
        :action="upload.action" />
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: 'PXApprovingForm',

    props: {
      result: {
        type: Object,
        default: () => ({}),
      },
    },

    data() {
      const { upload } = this.$parent.$parent

      return {
        upload,
      }
    },

    methods: {
      uploadHandler() {
        this.$parent.$parent.form.approval_aids = this.$refs.upload.getFiles('string')
      },

      beforeUpload(file) {
        const isLt5M = file.size / 1024 / 1024 < 10

        if (!isLt5M) {
          this.$message.error('上传文件大小不能超过 10M!')
        }

        return isLt5M
      },

      success(response) {
        const { id } = response.data
        this.form.zsgpsq_aid = id
      },
    },
  }
</script>
