<template>
  <div class="uploader-container">
    <div class="uploader">
      <el-upload
        class="upload-demo"
        ref="upload"
        :on-success="success"
        :show-file-list="showFileList"
        :before-upload="beforeUpload"
        drag
        :headers="headers"
        :action="uploadUri">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传单个ZIP压缩文件，且不超过5M。</div>
      </el-upload>
    </div>
  </div>
</template>

<script>
  import Config from '../../helper/config'
  export default {
    name: 'Uploader',
    data () {
      return {
        showFileList: true,
        headers: {
          token: sessionStorage.getItem('token')
        },
        uploadUri: ''
      }
    },
    // 注释待补充
    created () {
      this.uploadUri = Config.uploadUri
      this.headers = {
        token: sessionStorage.getItem('token') || 'token',
        device: 'appName=backend'
      }
    },
    methods: {
      success (res, file) {
        console.log(res)
        const { code, data, error } = res
        if (code == 0) {
          const { isMatch, zipName } = data
          if (isMatch) {
            this.$message('成功上传并且成功匹配')
          } else {
            this.$confirm('文件上传成功！但是部分存在excel机构简称与排排网机构简称不一致,您是否前去修改排排网简称', '提示', {
              confirmButtonText: '去修改',
              cancelButtonText: '稍后再去',
              type: 'warning'
            }).then(() => {
              this.$router.push({
                path: '/uploader/rename_paipai',
                query: {
                  zipName
                }
              })
            })
          }
        } else if (error) {
          this.$refs.upload.clearFiles()
          this.$message.error(error)
        }
      },
      beforeUpload (file) {
        const isZip = /.zip$/.test(file.name)
        const isLt5M = file.size / 1024 / 1024 < 5
        if (!isZip) {
          this.$refs.upload.clearFiles()
          this.$message.error('上传的压缩文件不是zip压缩文件，请调整*.zip的压缩包上传。')
          return isZip
        }
        if (!isLt5M) {
          this.$refs.upload.clearFiles()
          this.$message.error('上传的压缩文件大小控制在 5MB!')
          return isLt5M
        }
      }
    }
  }
</script>

<style>
  .uploader
  {
    margin: 20px 0;
    border-bottom: 1px solid #C0CCDA;
    padding-bottom: 20px;
    width: 360px;
  }

  .uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .uploader .el-upload:hover {
    border-color: #20a0ff;
  }
</style>
