<template>
  <div class="m-img-cropper">
    <div
      class="m-img-show-wrap"
      @click="openDialog">
      <slot />
    </div>

    <el-dialog
      custom-class="m-dialog-select__dialog"
      title="请选择图片"
      size="tiny"
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
      :lock-scroll="true"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false">

      <div class="m-dialog-select__top">
        <el-upload
          ref="upload"
          :headers="requestHeader"
          :action="uploadUrl"
          :accept="uploadType"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="uploadChange"
          :on-progress="uploadProgress"
          :on-error="uploadError"
          :on-success="uploadSuccess">
          <el-button
            slot="trigger"
            :disabled="uploading">
            {{ cropperOptions.img ? '重选' : '选择' }}图片
          </el-button>
          <el-button
            v-if="!confirmSelect"
            :loading="!confirmSelect && uploading"
            @click="uploadStart">{{
              uploading
                ? `${uploadPercent || 0}%`
                : '图片上传'
            }}</el-button>
        </el-upload>
        <div class="avatar-tip">{{ tip }}</div>
      </div>

      <div class="m-dialog-wrap">
        <vueCropper
          v-if="allwaysNew || dialogVisible"
          ref="cropper"
          :auto-crop-width="autoCropWidth"
          :auto-crop-height="autoCropHeight"
          :fixed="fixed"
          :fixed-box="fixedBox"
          v-bind="cropperOptions" />
        <div
          class="cropper-shadow"
          v-if="!cropperOptions.img || uploading" />
      </div>

      <div class="m-dialog-select__btn">
        <el-button
          type="primary"
          :disabled="!confirmSelect && uploading"
          :loading="confirmSelect && uploading"
          @click="confirmBefore">{{
            confirmSelect && uploading
              ? `${uploadPercent || 0}%`
              : '确定'
          }}</el-button>
        <el-button
          type="info"
          @click="cancel">取消</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
  /**
   * @description 图像选择剪裁上传器，请不要放到表单校验中
   * @prop allwaysNew {Boolean} 是否每次打开都是用新传入图片，重置编辑状态（适合立即提交类型）
   * @prop confirmSelect {Boolean} 是否点击确定上传（适用简单场景）
   * @prop imgSrc {String sync} 图片传入地址，传入后会保留原有图片
   * @prop autoCropWidth {Number} 剪裁框宽度
   * @prop autoCropHeight {Number} 剪裁框高度
   * @prop fixed {Boolean} 是否锁定剪裁框的宽高比
   * @prop fixedBox {Boolean} 是否锁定修改剪裁框大小
   * @prop tip {String} 图片提示
   * @event outputData {Function} 上传后关闭弹窗触发，回调参数是{ url, id }
   * @example <m-img-cropper v-bind="options" />
   */

  import vueCropper from 'vue-cropper'

  export default {
    name: 'ImgCropper',
    components: { vueCropper },
    props: {
      allwaysNew: {
        type: Boolean,
        default: false,
      },
      confirmSelect: {
        type: Boolean,
        default: true,
      },
      imgSrc: {
        type: String,
        default: '',
      },
      autoCropWidth: {
        type: Number,
        default: 200,
      },
      autoCropHeight: {
        type: Number,
        default: 200,
      },
      fixed: {
        type: Boolean,
        default: false,
      },
      fixedBox: {
        type: Boolean,
        default: false,
      },
      tip: {
        type: String,
        default: '200x200像素以上',
      },
    },
    data() {
      return {
        // 弹窗flag
        dialogVisible: false,

        // 图片选择select
        uploadType: 'image/jpeg,image/jpg,image/png',
        uploading: false,
        uploadPercent: '',

        imgBackup: '',

        // 剪裁框其他配置
        cropperOptions: {
          img: '',
          autoCrop: true,
          fixedNumber: [this.autoCropWidth, this.autoCropHeight],
          outputType: 'png',
        },

        // 输出内容
        outputUrl: '',
        outputId: '',
      }
    },
    computed: {
      requestHeader() {
        return this.$utils.config.headers
      },
      uploadUrl() {
        return this.$utils.config.baseURL + this.$api.common.employeeAvatar
      },
    },
    created() {
      // 本页面执行错误处理
      this.$on('error', (msg) => {
        this.$message({
          message: msg,
          type: 'error',
        })
      })
      this.$on('ok', (msg) => {
        this.$message({
          message: msg,
          type: 'success',
        })
      })
    },
    methods: {
      openDialog() {
        // 打开弹窗，获取传入图片
        // 如果options.img已经存在并重用时，不再次获取
        this.dialogVisible = true
        if (!this.allwaysNew && this.cropperOptions.img) {
          return
        }

        this.$nextTick(() => {
          this.imgBackup = this.imgSrc
          this.cropperOptions.img = this.imgSrc
        })
      },

      uploadChange(e) {
        // 选择文件回调
        if (e.status === 'ready') {
          this.cropperOptions.img = e.url
        }
      },

      uploadStart() {
        // 点击上传
        this.$refs.cropper.getCropBlob((data) => {
          if (!data) return
          this.uploading = true
          this.uploadPercent = ''
          const { uploadFiles } = this.$refs.upload
          uploadFiles.splice(0, 1, {})
          uploadFiles[0].raw = new File([data], 'avatar.png')
          uploadFiles[0].status = 'ready'
          uploadFiles[0].percentage = 0
          this.$refs.upload.submit()
        })
      },

      uploadProgress(event) {
        // 上传附件进度回调
        this.uploadPercent = parseInt(event.percent, 10)
      },

      uploadError() {
        // 上传错误回调
        this.uploading = false
        this.uploadPercent = ''
        this.$refs.upload.clearFiles()
        this.$emit('error', '头像上传失败，请重新上传')
      },

      uploadSuccess(data) {
        // 上传附件成功回调
        this.uploading = false
        this.uploadPercent = ''
        this.$refs.upload.clearFiles()
        switch (data.code) {
        case 0:
          this.outputUrl = data.data.url
          this.outputId = data.data.id
          if (this.confirmSelect) this.confirm()
          break
        default:
          this.$emit('error', data.msg)
          break
        }
      },

      confirmBefore() {
        // 判断状态，是否立即确认
        if (this.confirmSelect) this.uploadStart()
        else this.confirm()
      },

      confirm() {
        // output数据
        if (this.outputUrl) {
          this.$emit('update:imgSrc', this.outputUrl)
          this.$emit('outputData', {
            url: this.outputUrl,
            id: this.outputId,
          })
        }
        this.imgBackup = this.cropperOptions.img
        this.cancel()
      },

      cancel() {
        // 取消弹窗方法
        // 如果重用则恢复，否则清空
        if (!this.allwaysNew) {
          this.cropperOptions.img = this.imgBackup
        } else {
          this.cropperOptions.img = ''
        }
        this.dialogVisible = false
      },
    },
  }
</script>
