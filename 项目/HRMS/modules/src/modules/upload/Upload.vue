<template>
  <el-upload
    class="color-primary m-upload"
    ref="upload"
    :headers="headers"
    :accept="acceptTypes"
    :name="name"
    :multiple="multiple"
    :show-file-list="showFileList"
    :file-list="fileList"
    :before-remove="beforeRemoveFile"
    :before-upload="beforeUploadFile"
    :on-error="onUploadError"
    :on-success="onUploadSuccess"
    :on-remove="onRemoveFile"
    :on-progress="onProgress"
    :on-change="onChange"
    :action="url">
    <el-button
      type="text"
      size="medium">
      <m-icon-attachment />上传
    </el-button>
    <slot
      name="tip"
      slot="tip" />
  </el-upload>
</template>

<script>
  export default {
    name: 'MUpload',

    // 大部分参数可参考 element el-upload 组件：
    // http://element-cn.eleme.io/#/zh-CN/component/upload
    props: {
      // 'jpg,jpeg,png,pdf,word,excel,ppt'
      // 传 'image' 包含 'jpg,jpeg,png'
      /* eslint-disable vue/require-default-prop */
      accept: String,

      // 上传 url
      action: {
        type: String,
        required: true,
      },

      // 上传的文件字段名
      name: {
        type: String,
        default: 'file',
      },

      // 是否显示已上传文件列表
      showFileList: {
        type: Boolean,
        default: true,
      },

      fileList: {
        type: Array,
        default: () => [],
      },

      // 最大允许上传个数
      limit: Number,

      // 是否支持多选文件
      multiple: Boolean,

      // 删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false，则停止上传。
      // function(file, fileList) => Boolean
      beforeRemove: Function,

      beforeUpload: Function,

      // 文件上传失败时的钩子, function(err, file, fileList)
      onError: Function,

      // 文件上传成功时的钩子, function(response, file, fileList)
      onSuccess: Function,

      // 文件列表移除文件时的钩子, function(file, fileList)
      onRemove: Function,

      // 文件上传时的钩子, function(event, file, fileList)
      onProgress: Function,

      // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用, function(file, fileList)
      onChange: Function,

      // 文件超出个数限制时的钩子, function(files, fileList)
      onExceed: Function,
      /* eslint-enable vue/require-default-prop */
    },

    data() {
      const { baseURL, headers } = this.$utils.config

      return {
        headers,
        url: baseURL + this.action,

        /**
         * @param processing {Number}
         * @event before-upload: += 1
         * @event on-remove: file.status === 'uploading', -= 1
         * @event on-success: -= 1
         */
        processing: 0,
      }
    },

    computed: {
      acceptTypes() {
        let { accept } = this
        const map = {
          jpg: 'image/jpg',
          jpeg: 'image/jpeg',
          png: 'image/png',
          image: 'image/jpg, image/jpeg, image/png',
          pdf: 'application/pdf',
          word: '.doc, application/msword, .docx, application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          excel: '.xls, application/vnd.ms-excel, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          ppt: '.ppt, application/vnd.ms-powerpoint, .pptx, application/vnd.openxmlformats-officedocument.presentationml.presentation',
          zip: '.zip',
        }

        if (typeof accept !== 'string') return '*'
        accept = accept.split(',')

        let res = ''
        accept.forEach((it, i) => {
          const prop = it.trim()
          if (i === 0 || accept.length === 1) res += map[prop]
          else res += `, ${map[prop]}`
        })

        return res
      },

      uploadFiles() {
        return this.$refs.upload.uploadFiles.map((file) => {
          if (file.response) {
            return file.response.data
          }

          return file
        })
      },
    },

    methods: {
      beforeRemoveFile(file, fileList) {
        if ((typeof this.beforeRemove === 'function' &&
          !this.beforeRemove(file, fileList))) {
            this.$message({
              message: '不能删除该附件！',
              type: 'error',
            })

            return false
          }

        return true
      },

      beforeUploadFile(file) {
        const { limit, processing } = this
        let flag = typeof this.beforeUpload === 'function'
          ? this.beforeUpload(file)
          : true

        if (processing && this.uploadFiles.length > limit) {
          flag = false
          this.$message({
            type: 'warning',
            message: `仅可上传${limit}个文件`,
          })
        } else if (processing === 0 && limit > 1 && this.uploadFiles.length > limit) {
          flag = false
          this.$message({
            type: 'warning',
            message: `仅可上传${limit}个文件，请先删除后再重新上传`,
          })
        }

        if (flag) this.processing += 1
        return flag
      },

      onRemoveFile(file, fileList) {
        if (file.status === 'uploading') {
          this.processing -= 1
          return false
        }

        if (typeof this.onRemove === 'function') {
          return this.onRemove(file, fileList)
        }

        return true
      },

      onUploadError(err, file, fileList) {
        this.$message({
          type: 'error',
          message: '附件上传失败，请重新上传',
        })

        this.processing -= 1

        if (typeof this.onError === 'function') {
          this.onError(err, file, fileList)
        }
      },

      onUploadSuccess(res, file, fileList) {
        const { code, msg } = res

        switch (code) {
        case 0:
          this.$message({
            type: 'success',
            message: '附件上传成功',
          })

          if (this.limit === 1) {
            this.$refs.upload.uploadFiles = [file]
          }

          if (typeof this.onSuccess === 'function') {
            this.onSuccess(res, file, fileList)
          }
          break
        default:
          fileList.some((item, index) => {
            if (item.uid === file.uid) {
              fileList.splice(index, 1)
              return true
            }

            return false
          })

          this.$message({
            type: 'error',
            message: msg,
          })
          break
        }

        this.processing -= 1
      },

      getFiles(type) {
        const files = this.uploadFiles.map((file) => {
          if (file.response) return file.response.data
          return file
        })

        if (type === 'string') return files.map(file => file.id).join(',')
        return files
      },
    },
  }
</script>
