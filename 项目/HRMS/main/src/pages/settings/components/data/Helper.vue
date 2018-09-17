<template>
  <div
    v-loading.fullscreen.lock="loading.init"
    class="page page-data-helper">

    <m-breadcrumb :items="breadcrumb" />

    <m-section
      v-loading="loading.type && !loading.init"
      title="类型定义"
      is-form>
      <m-section-row
        v-show="!isShowFormType">
        <el-button
          type="text"
          icon="el-icon-plus"
          @click="clickShowForm('type', true)">添加问题类型</el-button>
      </m-section-row>

      <!-- 类型表单-->
      <el-form
        class="m-section--form"
        label-width="140px"
        label-position="left"
        v-show="isShowFormType"
        ref="formType"
        :rules="formTypeRules"
        :model="formTypeData">
        <el-form-item
          label="类型名称"
          prop="name">
          <el-input
            :maxlength="20"
            v-model="formTypeData.name" />
        </el-form-item>

        <m-section-row>
          <el-form-item>
            <el-button
              type="primary"
              :loading="loading.subType"
              @click="submitType">保存</el-button>
            <el-button
              type="info"
              v-if="typeList.length > 0"
              @click="clickShowForm('type', false)">取消</el-button>
          </el-form-item>
        </m-section-row>
      </el-form>

      <m-section-row>
        <el-table
          border
          stripe
          :max-height="600"
          :data="typeList">
          <el-table-column
            label="序号"
            align="center"
            width="120"
            prop="b_district_value">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            label="类型名称"
            show-overflow-tooltip
            align="center"
            prop="value" />
          <el-table-column
            label="操作"
            align="center"
            width="120"
            prop="b_district_value">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="clickEdit('type', scope.row)">编辑</el-button>
              <el-button
                type="text"
                class="error"
                @click="clickDelete('type', scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </m-section-row>
    </m-section>

    <m-section
      v-loading="loading.question && !loading.init"
      title="问题设置"
      is-form>
      <m-section-row
        v-show="!isShowFormQuestion">
        <el-button
          type="text"
          icon="el-icon-plus"
          @click="clickShowForm('question', true)">添加问题</el-button>
      </m-section-row>

      <el-form
        class="m-section--form"
        label-width="140px"
        v-show="isShowFormQuestion"
        ref="formQuestion"
        :rules="formQuestionRules"
        :model="formQuestionData">
        <m-section-row>
          <el-form-item
            label="类型名称"
            prop="channel_key">
            <el-select
              placeholder="请选择类型"
              v-model="formQuestionData.channel_key">
              <el-option
                v-for="item in typeList"
                :key="item.key"
                :label="item.value"
                :value="item.key" />
            </el-select>
          </el-form-item>

          <el-form-item
            label="是否置顶"
            prop="is_top">
            <el-select
              placeholder="请选择是否置顶"
              v-model="formQuestionData.is_top">
              <el-option
                label="否"
                value="0" />
              <el-option
                label="是"
                value="1" />
            </el-select>
          </el-form-item>
        </m-section-row>

        <el-form-item
          label="问题描述"
          prop="question">
          <el-input
            type="textarea"
            :maxlength="50"
            :autosize="{ minRows: 4 }"
            v-model="formQuestionData.question" />
        </el-form-item>

        <el-form-item
          label="办事指南"
          prop="answer">
          <quill-editor
            ref="editor"
            v-model="formQuestionData.answer"
            :options="editorOption" />
          <div style="display: none;">
            <el-upload
              accept="image/jpg, image/jpeg, image/png"
              ref="editorUpload"
              :action="editorUploadUrl"
              :headers="headers"
              :on-success="uploadEditorSuccess"
              :on-error="uploadEditorError">
              <div ref="clickUploadEditor">上传</div>
            </el-upload>
          </div>
          <!-- <el-input
            :maxlength="300"
            type="textarea"
            :autosize="{ minRows: 4 }"
            v-model="formQuestionData.answer" /> -->
        </el-form-item>

        <m-section-row>
          <el-form-item
            label="附件上传">
            <m-upload
              class="upload"
              accept="image,pdf,ppt,word,excel,zip"
              ref="upload"
              :file-list="formQuestionData.aids"
              :before-upload="uploadBefore"
              :action="uploadUrl" />
          </el-form-item>
        </m-section-row>

        <el-form-item>
          <el-button
            type="primary"
            :loading="loading.subQuestion"
            @click="submitQuestion">保存</el-button>
          <el-button
            type="info"
            v-if="questionList.length > 0"
            @click="clickShowForm('question', false)">取消</el-button>
        </el-form-item>
      </el-form>

      <m-section-row>
        <m-table
          :data="questionList"
          :total="questionList.length"
          :is-update-router="false"
          :remote="false">
          <template slot-scope="props">
            <el-table
              border
              stripe
              :max-height="600"
              :data="props.data">
              <el-table-column
                label="问题类型"
                align="center"
                width="200"
                show-overflow-tooltip
                prop="channel_name" />
              <el-table-column
                label="是否置顶"
                align="center"
                width="100"
                prop="b_district_value">
                <template slot-scope="scope">
                  {{ scope.row.is_top === 0 ? '否' : '是' }}
                </template>
              </el-table-column>
              <el-table-column
                label="问题描述"
                align="center"
                show-overflow-tooltip
                prop="question" />
              <el-table-column
                label="操作"
                align="center"
                width="120">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="clickEdit('question', scope.row)">编辑</el-button>
                  <el-button
                    type="text"
                    class="error"
                    @click="clickDelete('question', scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </m-table>
      </m-section-row>
    </m-section>
  </div>
</template>

<script>
  /**
    * @description 在线HR小助手数据管理
    * @router /helper
    */

  import { quillEditor } from 'vue-quill-editor'

  export default {
    components: {
      quillEditor,
    },
    data() {
      const { baseURL, headers } = this.$utils.config

      return {
        headers,
        editorUploadUrl: baseURL + this.$api.settings.helper.upload,
        uploadUrl: this.$api.settings.helper.upload,
        breadcrumb: [
          { name: '数据管理' },
          { name: '在线HR小助手', to: '/helper' },
        ],
        loading: {
          init: true,
          type: true,
          question: true,
          subType: false,
          subQuestion: false,
        },
        isShowFormType: false,
        isShowFormQuestion: false,
        formTypeData: {
          id: '',
          name: '',
        },
        formTypeRules: {
          name: {
            required: true,
            message: '请输入类型名称',
            trigger: 'blur',
          },
        },
        formQuestionData: {
          channel_key: '',
          is_top: '',
          question: '',
          answer: '',
          aids: [],
        },
        formQuestionRules: {
          channel_key: {
            required: true,
            message: '请选择类型名称',
            trigger: 'blur',
          },
          question: {
            required: true,
            message: '请输入问题描述',
            trigger: 'blur',
          },
          is_top: {
            required: true,
            message: '请选择是否置顶',
            trigger: 'blur',
          },
          answer: {
            required: true,
            message: '请输入办事指南',
            trigger: 'blur',
          },
        },
        // 是否处于上传中
        // 类型列表
        typeList: [],
        // 问题列表
        questionList: [],
        editorOption: {
          placeholder: '',
          modules: {
            toolbar: [
              ['link', 'image'],
            ],
          },
        },
      }
    },
    watch: {
      loading: {
        handler(newVal) {
          if (newVal.init && !newVal.type && !newVal.question) {
            this.loading.init = false
          }
        },
        deep: true,
      },
    },
    created() {
      this.getTypeData()
      this.getQuestionData()
    },
    mounted() {
      this.$refs.editor.quill
        .getModule('toolbar').addHandler('image', this.imgHandler)
    },
    methods: {
      // 富文本图片上传
      imgHandler(state) {
        if (state) {
          this.$refs.clickUploadEditor.click()
        }
      },
      // 更新类型列表数据
      getTypeData() {
        this.loading.type = true
        this.$axios({
          url: this.$api.settings.helper.typeList,
        })
          .then((data) => {
            this.loading.type = false
            if (data.code === 0) {
              this.typeList = data.data.list
              if (this.typeList.length === 0) {
                this.isShowFormType = true
              }
            }
          }).catch(() => {
            this.loading.type = false
          })
      },
      // 更新问题列表数据
      getQuestionData() {
        this.loading.question = true
        this.$axios({
          url: this.$api.settings.helper.questionList,
        })
          .then((data) => {
            this.loading.question = false
            if (data.code === 0) {
              this.questionList = data.data.list
              if (this.questionList.length === 0) {
                this.isShowFormQuestion = true
              }
            }
          }).catch(() => {
            this.loading.question = false
          })
      },
      // 提交类型表单
      submitType() {
        if (this.loading.subType) return

        this.$refs.formType.validate((valid) => {
          if (valid) {
            this.loading.subType = true
            let url = ''
            if (this.formTypeData.id) {
              url = this.$api.settings.helper.typeEdit
            } else {
              url = this.$api.settings.helper.typeAdd
            }
            this.$axios({
              url,
              method: 'post',
              data: {
                id: this.formTypeData.id,
                name: this.formTypeData.name.trim(),
              },
            })
              .then((data) => {
                if (data.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '问题类型已保存',
                  })
                  this.loading.subType = false
                  this.isShowFormType = false
                  this.getTypeData()
                  this.getQuestionData()
                  this.formTypeData.id = ''
                  this.$refs.formType.resetFields()
                }
              }).catch(() => {
                this.loading.subType = false
              })
          }
        })
      },
      // 提交问题表单
      submitQuestion() {
        if (this.$refs.upload.processing) {
          this.$message({
            type: 'error',
            message: '附件正在上传中，请稍后再保存',
          })
          return
        }
        if (this.loading.subQuestion) return

        this.$refs.formQuestion.validate((valid) => {
          if (valid) {
            this.loading.subQuestion = true
            let url = ''
            if (this.formQuestionData.id) {
              url = this.$api.settings.helper.questionEdit
            } else {
              url = this.$api.settings.helper.questionAdd
            }
            const submitData = Object.assign({}, this.formQuestionData)
            submitData.question = submitData.question.trim()
            submitData.answer = submitData.answer.trim()
            submitData.aids = this.$refs.upload.getFiles('string')
            this.$axios({
              url,
              method: 'POST',
              data: submitData,
            })
              .then((data) => {
                if (data.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '问题已保存',
                  })
                  this.loading.subQuestion = false
                  this.isShowFormQuestion = false
                  this.getQuestionData()
                  this.$refs.formQuestion.resetFields()
                  this.formQuestionData.id = ''
                  this.formQuestionData.aids = []
                }
              }).catch(() => {
                this.loading.subQuestion = false
              })
          }
        })
      },
      // 删除问题类型
      deleteType(row) {
        this.$axios({
          url: this.$api.settings.helper.typeDelete,
          params: {
            id: row.key,
          },
        }).then((data) => {
          if (data.code === 0) {
            this.$message({
              type: 'success',
              message: '问题类型已删除',
            })
            this.getTypeData()
            this.getQuestionData()
          }
        }).catch(() => {})
      },
      // 删除问题
      deleteQuestion(row) {
        this.$axios({
          url: this.$api.settings.helper.questionDelete,
          params: {
            id: row.id,
          },
        }).then(() => {
          this.$message({
            type: 'success',
            message: '问题已删除',
          })
          this.getQuestionData()
        }).catch(() => {})
      },
      // 显示表单
      clickShowForm(type, value) {
        switch (type) {
        case 'type':
          this.isShowFormType = value
          this.formTypeData.id = ''
          this.$refs.formType.resetFields()
          break
        case 'question':
          this.isShowFormQuestion = value
          this.$refs.formQuestion.resetFields()
          this.formQuestionData.id = ''
          this.formQuestionData.aids = []
          break
        default:
          break
        }
      },
      // 点击删除
      clickDelete(type, row) {
        switch (type) {
        case 'type':
          this.$confirm('删除问题类型将连带删除所属问题，确认继续？', '提示', {
            type: 'warning',
          })
            .then(() => {
              this.deleteType(row)
            }).catch(() => {})
          break
        case 'question':
          this.$confirm('确认删除该问题吗？', '提示', {
            type: 'warning',
          })
            .then(() => {
              this.deleteQuestion(row)
            }).catch(() => {})
          break
        default:
          break
        }
      },
      // 点击修改
      clickEdit(type, row) {
        switch (type) {
        case 'type':
          this.isShowFormType = true
          this.$refs.formType.resetFields()
          this.formTypeData.id = row.key
          this.formTypeData.name = row.value
          break
        case 'question':
          this.isShowFormQuestion = true
          this.$refs.formQuestion.resetFields()
          this.formQuestionData = Object.assign({}, row)
          delete this.formQuestionData.channel_name
          this.formQuestionData.is_top = this.formQuestionData.is_top.toString()
          break
        default:
          break
        }
      },
      // 上传之前的回调
      uploadBefore() {
        let result = true
        if (this.$refs.upload.processing) {
          this.$message({
            type: 'error',
            message: '附件正在上传中，请稍后再上传',
          })
          result = false
        }
        return result
      },
      // 富文本图片上传错误回调
      uploadEditorError() {
        this.$message({
          type: 'error',
          message: '图片上传失败',
        })
      },
      // 富文本图片上传成功回调
      uploadEditorSuccess(data) {
        const token = localStorage.getItem('token')
        this.formQuestionData.answer =
          `${this.formQuestionData.answer}<img src="${data.data.url}&token=${token}" />`
      },
      // 下载附件
      downloadAttchment(item) {
        this.$utils.tools.windowOpen(item.url)
      },
    },
  }
</script>

<style lang="scss" type="text/scss">
@import '~quill/dist/quill.core.css';
@import '~quill/dist/quill.snow.css';
@import '~quill/dist/quill.bubble.css';

.ql-snow .ql-tooltip[data-mode=link]::before {
  content: "输入链接地址";
}

.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  content: "确定";
}

.ql-snow .ql-tooltip::before {
  content: "链接地址";
}

.ql-snow .ql-tooltip a.ql-preview {
  line-height: unset;
}

.ql-snow .ql-tooltip a.ql-action::after {
  content: "编辑";
}

.ql-snow .ql-tooltip a.ql-remove::before {
  content: "删除地址";
}

.quill-editor:hover {
  .ql-toolbar.ql-snow,
  .ql-container.ql-snow {
    border-color: #999;
  }
}

.quill-editor:focus-within {
  .ql-toolbar.ql-snow,
  .ql-container.ql-snow {
    border-color: #5090f7;
  }
}

.el-form-item.is-error {
  .ql-toolbar.ql-snow,
  .ql-container.ql-snow {
    border-color: #f75050;
  }
}

.ql-snow .ql-tooltip {
  z-index: 2;
}

.ql-toolbar.ql-snow {
  line-height: 0;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-color: #dadada;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.ql-container.ql-snow {
  min-height: 100px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  border-color: #dadada;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.ql-container.ql-snow .ql-editor {
  min-height: 100px;
}

.page-data-helper {
  .m-section--form {
    max-width: 940px;
  }

  .m-table,
  .el-table {
    display: block;
    max-width: 860px;
  }
}
</style>
