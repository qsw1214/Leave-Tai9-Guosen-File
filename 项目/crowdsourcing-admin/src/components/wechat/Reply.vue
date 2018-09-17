<template>
  <div class="reply-container">
    <el-form :inline="true" label-position="left" class="toolbar">
      <el-row>
        <el-form-item label="关键字" style="margin-bottom: 0px;">
          <el-input v-model="word" placeholder="关键字"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 0px;">
          <el-button type="primary" @click.native="getKeywordList">查询</el-button>
        </el-form-item>
        <div class="right">
          <el-button type="info" @click="addKeyword">新增</el-button>
          <el-button type="success" @click="setDefaultReply">设置默认回复</el-button>
        </div>
      </el-row>
    </el-form>
    <el-table
      :data="keywordList"
      v-loading="loading"
      style="width: 100%">
      <el-table-column
        label="关键词"
        prop="keyword">
      </el-table-column>
      <el-table-column
        width="120"
        label="回复类型">
        <template scope="scope">
          <span>{{ scope.row.type | keywordType }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="内容">
        <template scope="scope">
          <span v-html="scope.row.content" v-if=" scope.row.type == 1"></span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column
        label="标题">
        <template scope="scope">
          <span>{{ scope.row.type == 3 ? scope.row.title : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        class-name="description"
        label="描述">
        <template scope="scope">
          <span>{{ scope.row.type == 3 ? scope.row.description : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="图片">
        <template scope="scope">
          <img :src="scope.row.picUrl" v-if="scope.row.type == 3 || scope.row.type == 2" class="images">
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column
        label="跳转链接">
        <template scope="scope">
          <a :href="scope.row.jumpUrl" v-if="scope.row.type == 3" target="_blank">{{ scope.row.jumpUrl }}</a>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button
            size="small"
            @click="editKeyword(scope.row)">编辑</el-button>
          <el-button
            size="small"
            type="danger"
            @click="delKeyword(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--父菜单编辑或者新增-->
    <el-dialog :title="title" v-model="formVisible" :close-on-click-modal="false" size="tiny" v-loading.body="dialogLoading">
      <!--:rules="modifyFormRules"-->
      <el-form :model="modifyForm" label-width="90px"  ref="modifyForm">
        <el-form-item label="关键词" prop="keyword" required>
          <el-input v-model="modifyForm.keyword" placeholder="多个以#分割" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="回复类型" required>
          <el-radio-group v-model="modifyForm.type">
            <el-radio class="radio" :label='"1"'>文字</el-radio>
            <el-radio class="radio" :label='"2"'>图片</el-radio>
            <el-radio class="radio" :label='"3"'>图文混排</el-radio>
          </el-radio-group>
        </el-form-item>

        <template v-if="modifyForm.type == 1">
          <el-form-item label="内容">
            <el-input type="textarea" v-model="modifyForm.content"></el-input>
          </el-form-item>
        </template>

        <template v-if="modifyForm.type == 2 || modifyForm.type == 3">
          <el-form-item label="图片" required>
            <input type="file" id="file" size="80" @change="previewImage" accept="image/*"/>
            <div style="margin-top: -10px; font-size: 10px;">(较好的效果为大图360*200，小图200*200)</div>
            <img v-if="modifyForm.picUrl" :src="modifyForm.picUrl" class="image" alt="上传预览">
          </el-form-item>
        </template>

        <template v-if="modifyForm.type == 3">
          <el-form-item label="标题" required>
            <el-input type="input" v-model="modifyForm.title"></el-input>
          </el-form-item>
          <el-form-item label="描述" required>
            <el-input type="textarea" v-model="modifyForm.description"></el-input>
          </el-form-item>
          <el-form-item label="跳转链接" required>
            <el-input type="input" v-model="modifyForm.jumpUrl"></el-input>
          </el-form-item>
        </template>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="formVisible = false">取消</el-button>
        <el-button type="primary" @click="actionToKeyword">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="默认回复设置" v-model="defaultVisible" :close-on-click-modal="false" size="tiny">
      <el-tabs v-model="activeName">
        <el-tab-pane label="关注回复" name="focus">
          <div>
            <el-input type="textarea" v-model="defaultSubscribeCopy" :rows="4"></el-input>
          </div>
        </el-tab-pane>
        <el-tab-pane label="关键词回复" name="keyword">
          <div>
            <el-input type="textarea" v-model="defaultReplyCopy" :rows="4"></el-input>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleDefaultReply">取消</el-button>
        <el-button type="primary" @click="submitDefaultReply">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import axios from '../../assets/axios'
  export default {
    name: 'Keyword',
    data() {
      return {
        msg: 'NiceChat--Reply',
        keywordList: [],
        loading: false,
        word: '',
        formVisible: false,
        defaultVisible: false,
        title: '编辑',
        action: '',
        defaultReply: '',
        defaultReplyCopy: '',
        defaultSubscribe: '',
        defaultSubscribeCopy: '',
        imageBlob: null,
        dialogLoading: false,
        modifyForm: {},
        defaultForm: {
          content: ''
        },
        activeName: 'focus'
      }
    },
    created () {
      this.getKeywordList()
      this.getDefaultForm()
    },
    methods: {
      // 取消默认设置
      cancleDefaultReply () {
        this.defaultReplyCopy = this.defaultReply
        this.defaultSubscribeCopy = this.defaultSubscribe
        this.defaultVisible = false
      },
      // 提交默认的回复设置
      submitDefaultReply () {
        let type,content
        if (this.activeName == 'focus') {
          [type, content] = [1, this.defaultSubscribeCopy]
        } else {
          [type, content] = [2, this.defaultReplyCopy]
        }
        axios
          .post('/wechat/pubDefaultWord', {type, content})
          .then(res => {
            this.loading = false
            const {code, error, data} = res.data
            if (code == 0) {
              this.$message({
                message: '恭喜你，成功！',
                type: 'success'
              })
              this.defaultVisible = false
              if (this.activeName == 'focus') {
                this.defaultSubscribe = this.defaultSubscribeCopy
              } else {
                this.defaultReply = this.defaultReplyCopy
              }
            }
          })
          .catch(e => {
            this.loading = false
            this.$message.error(error);
          })
      },
      // 上传图片是的与狼
      previewImage (){
        let _this = this
        // 检查是否为图像类型
        var simpleFile = document.getElementById("file").files[0]
        var reader = new FileReader()
        // 将文件以Data URL形式进行读入页面
        reader.addEventListener("load", function () {
          _this.modifyForm.picUrl = reader.result
        }, false)
        // 如果存在读取文件
        if (simpleFile) {
          reader.readAsDataURL(simpleFile)
        }
      },
      // 获取关键词列表
      getKeywordList () {
        this.loading = true
        axios
          .post('/wechat/wordlist', {page: 1, limit: 1000, word: this.word})
          .then(res => {
            this.loading = false
            const {code, error, data} = res.data
            const {list} = data
            if (code == 0) {
              this.keywordList = list
            } else {
              this.keywordList = []
            }
          })
          .catch(e => {
            this.loading = false
            this.$message.error(error);
          })
      },
      // 设置默认回复接口
      setDefaultReply () {
        this.defaultVisible = true
      },
      // 获取默认值
      getDefaultForm () {
        axios
          .post('/wechat/getDefaultReply')
          .then(res => {
            const {code, error, data} = res.data
            if (code == 0) {
              this.defaultReplyCopy = this.defaultReply = data.defaultReply
              this.defaultSubscribeCopy = this.defaultSubscribe = data.defaultSubscribe
            } else {
              this.$message.error(error);
            }
          })
          .catch(e => {
            this.$message.error(error);
          })
      },
      // 添加
      addKeyword () {
        this.modifyForm = Object.assign({}, {
          id: '',
          keyword: '',
          type: '1',
          content: '',
          title: '',
          picUrl: '',
          jumpUrl: ''
        })
        this.action = 'add'
        this.formVisible = true
        this.title = '新增关键字'
      },
      // 编辑
      editKeyword (row) {
        this.modifyForm = Object.assign({}, row)
        this.action = 'modify'
        this.formVisible = true
        this.title = '编辑关键字'
      },
      // 相关操作
      actionToKeyword () {
        var formData = new FormData();
        const type = this.modifyForm.type
        if (type == 1) {
          const {id, keyword, type, content} = this.modifyForm
          const data = {id, keyword, type, content}
          for (let i in data) {
            formData.append(i, data[i])
          }
        } else if (type == 2) {
          const {id, keyword, type} = this.modifyForm
          const data = {id, keyword, type}
          for (let i in data) {
            formData.append(i, data[i])
          }
          formData.append('image', document.getElementById("file").files[0])
        } else if (type == 3) {
          const {id, keyword, type, title, description, jumpUrl} = this.modifyForm
          const data = {id, keyword, type, title, description, jumpUrl}
          for (let i in data) {
            formData.append(i, data[i])
          }
          formData.append('image', document.getElementById("file").files[0])
        }
        this.dialogLoading = true
        axios
          .post('/wechat/pubword', formData)
          .then(res => {
            this.dialogLoading = false
            const {code, error, data} = res.data
            if (code == 0) {
              this.formVisible = false
              this.$message({
                message: '恭喜你，成功！',
                type: 'success'
              })
              this.getKeywordList()
            } else {
              this.$message.error(error)
            }
          })
          .catch(e => {
            this.loading = false
            this.$message.error(error)
          })
      },
      // 删除一条关键词
      delKeyword (id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios
            .post('/wechat/del', {id: id, type: 1})
            .then(res => {
              const {code, error, data} = res.data
              if (code == 0) {
                this.$message({
                  message: '恭喜你，删除成功！',
                  type: 'success'
                })
                this.getKeywordList()
              } else {
                this.$message.error(error)
              }
            })
            .catch(e => {
              this.loading = false
              this.$message.error(error)
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    watch: {
      // 模态框消失的时候清除文件的值
      formVisible (value) {
        if (!value) {
          document.getElementById("file").value = ""
        }
      }
    }
  }
</script>

<style lang="scss">
  .reply-container {
    .right {
      float: right;
    }

    tbody .description .cell  {
      line-height: 1.4;
      padding: 20px;
    }

    .images {
      padding: 20px 0px;
      max-width: 220px;
      max-height: 180px;
    }

    .image {
      max-width: 180px;
      max-height: 120px;
    }

  }
</style>
