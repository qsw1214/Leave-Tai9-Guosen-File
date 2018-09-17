<template>
  <el-dialog
    custom-class= "m-import-excel"
    title="导入模板"
    :close-on-click-modal="!bigFileUpload"
    :close-on-press-escape="!bigFileUpload"
    :show-close="!bigFileUpload"
    :visible.sync="visible"
    @close="close">
    <div class="steps">
      <div class="steps--left">
        <el-steps
          direction="vertical"
          :space="90"
          :active="active">
          <el-step />
          <el-step />
          <el-step />
          <el-step />
        </el-steps>
      </div>
      <div class="steps--right">
        <div class="item">
          <div class="item--body">
            <h2>下载模板</h2>
            <p>请点击按钮下载模版文件，并按照文件格式要求填写数据。</p>
            <div class="option">
              <el-button
                type="primary"
                @click.native="handleOption('download')">下载模板</el-button>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="item--body">
            <h2>上传文件</h2>
            <p>请点击按钮上传填充了要导入数据的模板格式文件。</p>
            <div class="option">
              <el-upload
                class="upload"
                show-file-list
                ref="upload"
                :data="data"
                :headers="headers"
                :action="action"
                :on-success="handleSuccess"
                :on-error="handleError"
                :before-upload="handleBeforeUpload"
                :auto-upload="false">
                <el-button
                  type="primary"
                  slot="trigger"
                  @click.native="clearFiles">选择文件</el-button>
                <el-button
                  type="primary"
                  plain
                  :loading="isUpload"
                  @click="handleOption('upload')">开始上传</el-button>
              </el-upload>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="item--body">
            <h2>检验数据</h2>
            <p>
              <i
                class="el-icon-loading"
                v-if="isPass" />
              <span v-if="!isBigFile">系统将检验导入文件中相关数据的逻辑是否合理。</span>
              <span v-else>{{ validMessage }}</span>
            </p>
          </div>
        </div>
        <div class="item">
          <div
            class="item--body"
            v-if="!hasError">
            <h2>完成操作</h2>
            <p>2s后关闭弹窗。</p>
          </div>
          <div
            class="item--body"
            v-else>
            <h2 class="red">操作失败。</h2>
            <p>
              {{ errorMsg }}
              <span v-if="isShowDetail">, 详情：
                <span
                  target="_blank"
                  class="red"
                  @click="downloadReport">查看错误报告</span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  /**
   * A ImportExcel component.
   * Created on 2017/10/11
   * @author Yangleilei
   * @updated 2017/11/10 新增字段data 协同File文件额外需要传给后台参数容器
   * @updated 2017/11/22 新增字段isBigFile/queryProgressUrl 大文件上传进度显示
   */

  import utils from '../../utils'

  export default {
    name: 'MImport',
    props: {
      showImport: {
        type: Boolean,
        default: false,
      },
      uploadExcelUrl: {
        type: String,
        required: true,
      },
      templateDownloadUrl: {
        type: String,
        required: true,
      },
      /* eslint-disable vue/require-default-prop */
      data: Object,
      isBigFile: {
        type: Boolean,
        default: false,
      },
      queryProgressUrl: String,
      /* eslint-enable vue/require-default-prop */
    },
    data() {
      const { headers } = utils.config
      const action = utils.config.baseURL + this.uploadExcelUrl

      return {
        visible: this.showImport,
        active: 1,
        isUpload: false,
        hasError: false,
        isPass: false,
        isShowDetail: false,
        errorMsg: '',
        reportUrl: '',
        headers,
        action,
        validMessage: '系统将检验导入文件中相关数据的逻辑是否合理。',
        bigFileUpload: false,
      }
    },
    watch: {
      /* eslint func-names: ["error", "never"] */
      /* eslint object-shorthand: 0 */
      showImport: function (val) {
        this.visible = val
      },
      visible: function (val) {
        if (!val) {
          this.clearFiles()
          this.active = 1
          this.isUpload = false
          this.hasError = false
          this.isPass = false
          this.isShowDetail = false
          this.errorMsg = ''
          this.reportUrl = ''
          this.validMessage = '系统将检验导入文件中相关数据的逻辑是否合理。'
          this.bigFileUpload = false
          this.handleAbort()
        }
      },
    },
    methods: {
      // 关闭Dialog
      close() {
        this.$emit('update:showImport', false)
      },
      // 相关操作
      handleOption(option) {
        switch (option) {
        case 'download':
          utils.axios.post(`${utils.config.baseURL}${this.templateDownloadUrl}`)
            .then((res) => {
              const { url } = res.data
              utils.tools.windowOpen(url)
              this.active = 2
            })
            .catch((error) => {
              console.dir(error)
            })
          break
        case 'upload':
          if (this.$refs.upload.uploadFiles.length === 0) {
            this.$message.error('尚未选择上传的文件')
            break
          }
          if (this.hasError) {
            this.$message.error('上传已出错，请关闭弹层重试！')
            break
          }
          this.isUpload = true
          this.active = 2
          this.$refs.upload.submit()
          break
        default:
        }
      },
      clearFiles() {
        this.$refs.upload.clearFiles()
      },
      // 上传前的验证
      handleBeforeUpload(file) {
        const isXLSX = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        const isXLS = file.type === 'application/vnd.ms-excel'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 2MB!')
        }
        if (!(isXLSX || isXLS)) {
          this.$message.error('请选择.xlsx或者.xls结尾的Excel文件!')
        }
        if ((isXLSX || isXLS) && isLt2M) {
          this.isUpload = true
        } else {
          this.isUpload = false
        }
        return (isXLSX || isXLS) && isLt2M
      },
      // 上传成功
      handleSuccess(response) {
        this.isUpload = false
        this.active = 3
        this.isPass = true
        if ((!this.isBigFile) || (response.code !== 0)) {
          window.setTimeout(() => {
            this.showImportResult(response)
          }, 3000)
        } else {
          const id = response.data.import_id
          this.checkBigFileProgress(id)
        }
      },
      // 显示结果
      showImportResult(response) {
        this.isPass = false
        this.active = 4
        const {
          is_false: isFalse, url, message, success_count: successCount,
        } = response.data
        const isSuccess = isFalse === 0
        if (isSuccess) {
          this.hasError = false
          this.$emit('completed')
          setTimeout(() => {
            this.visible = false
          }, 2000)
        } else {
          const { code, msg } = response
          this.hasError = true
          this.reportUrl = url
          if (code === 0) {
            this.isShowDetail = true
            this.errorMsg = message
          } else {
            this.isShowDetail = false
            this.errorMsg = msg
          }
          if (successCount > 0) {
            this.$emit('completedPart')
          } else {
            this.$emit('failure')
          }
        }
      },
      // 上传错误
      handleError(error) {
        this.active = 2
        console.dir(error)
      },
      // 关闭弹窗取消上传操作
      handleAbort() {
        this.$refs.upload.abort()
      },
      downloadReport() {
        utils.tools.windowOpen(this.reportUrl)
      },
      // 检查大文件上传进度
      checkBigFileProgress(id) {
        this.bigFileUpload = true
        utils.axios.post(`${utils.config.baseURL}${this.queryProgressUrl}`, {
          import_id: id,
        }, {
          showProgressBar: false,
        })
          .then((response) => {
            if (response.data.is_finish === 0) {
              this.validMessage = response.data.valid_message
              setTimeout(() => {
                this.checkBigFileProgress(id)
              }, 1000 * 5)
            } else {
              this.validMessage = response.data.valid_message
              this.bigFileUpload = false
              this.showImportResult(response)
            }
          })
          .catch((error) => {
            this.bigFileUpload = false
            console.dir(error)
          })
      },
    },
  }
</script>
