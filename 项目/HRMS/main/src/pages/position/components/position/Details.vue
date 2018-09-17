<template>
  <div
    v-loading.fullscreen.lock="preloading"
    class="page page__position--details">

    <!-- 面包屑，固定层级 -->
    <m-breadcrumb :items="breadcrumb" />

    <!-- 顶部按钮 -->
    <div v-show="!edit">
      <el-button
        v-permission="1020001"
        autotest="btn-edit"
        type="primary"
        icon="el-icon-edit"
        @click="getEditChange">编辑
      </el-button>
      <el-button
        v-permission="1020001"
        autotest="btn-add"
        icon="el-icon-plus"
        v-if="routeFromCreate"
        @click="getToCreate">继续新建
      </el-button>
      <el-button
        autotest="btn-back"
        icon="el-icon-d-arrow-left"
        v-if="redirect"
        @click="getToBack">返回
      </el-button>
      <el-button
        autotest="btn-previous"
        icon="el-icon-caret-left"
        v-if="!redirect && !routeFromCreate"
        :disabled="!toPrevId"
        @click="getTo('prev')">上一条
      </el-button>
      <el-button
        autotest="btn-next"
        v-if="!redirect && !routeFromCreate"
        :disabled="!toNextId"
        @click="getTo('next')">下一条<i class="el-icon-caret-right el-icon--right" />
      </el-button>
    </div>

    <!-- 内容部分 -->
    <m-section
      autotest="baseinfo"
      title="基本信息"
      is-form
      v-if="edit">
      <el-form
        class="m-section--form"
        label-position="right"
        label-width="140px"
        ref="detData"
        :model="detData"
        :rules="detDataRules">
        <m-section-row>
          <el-form-item
            label="职位编码">
            {{ detDataTemp.code || '由系统生成' }}
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="职位名称"
            prop="name">
            <el-input
              autotest="baseinfo-name"
              v-model="detData.name" />
          </el-form-item>

          <el-form-item
            label="职等">
            <el-select
              autotest="baseinfo-level"
              clearable
              v-model="detData.level">
              <el-option
                v-for="n in 22"
                :autotest="'baseinfo-level-' + n"
                :key="n + 39"
                :label="n + 39"
                :value="n + 39" />
            </el-select>
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="上级职位"
            prop="pid"
            :required="detDataTemp.code != 200001">
            <m-position-select
              autotest="baseinfo-position"
              class="job-select"
              title="请选择上级职位"
              init-change
              v-if="edit && detDataTemp.code != 200001"
              :width="260"
              :positions.sync="detData.pid"
              :disabled-list="[detDataTemp.id]"
              @change="getPositionSelect" />
            <el-input
              disabled
              v-else />
          </el-form-item>

          <el-form-item
            label="职务"
            prop="duty_id">
            <m-job-select
              autotest="baseinfo-job"
              class="job-select"
              init-change
              :width="260"
              :jobs.sync="detData.duty_id"
              @change="getJob" />
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="职务类别">
            <el-input
              autotest="baseinfo-type"
              disabled
              placeholder="由职务指定"
              v-model="detDataTemp.duty_type_name" />
          </el-form-item>

          <el-form-item
            label="职级">
            <el-input
              autotest="baseinfo-level"
              disabled
              placeholder="由职务指定"
              v-model="detDataTemp.duty_type_level_name" />
          </el-form-item>
        </m-section-row>
      </el-form>
    </m-section>

    <m-section
      title="基本信息"
      v-else>
      <m-section-row>
        <m-section-cell
          title="职位编码"
          :content="detDataTemp.code || '由系统生成'" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="职位名称"
          :content="detData.name" />

        <m-section-cell
          title="职等"
          :content="String(detData.level)" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="上级职位"
          :content="detDataTemp.pname" />

        <m-section-cell
          title="职务"
          :content="detDataTemp.duty_name" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="职务类别"
          :content="detDataTemp.duty_type_name" />

        <m-section-cell
          title="职级"
          :content="detDataTemp.duty_type_level_name" />
      </m-section-row>
    </m-section>

    <!-- 主要职责 -->
    <m-section
      autotest="responsibility"
      title="主要职责">
      <div
        class="table"
        :class="{ noedit: !edit }">
        <div class="table-tr">
          <div class="table-th th0">序号</div>
          <div class="table-th th">职责描述</div>
          <div class="table-th th">衡量标准</div>
          <div
            class="table-th th2"
            v-if="edit" />
        </div>

        <div
          class="table-tr"
          v-for="(item, index) in detData.main_responsibilitys"
          :key="item.timestamp || item.id">
          <div class="table-td td0">{{ index + 1 }}</div>
          <div class="table-td td">
            <el-input
              type="textarea"
              autosize
              v-if="edit"
              v-model="item.description"
              :rows="1" />
            <span
              class="td-view"
              v-else
              v-html="item.description.replace(/\n/g, '<br>')" />
          </div>
          <div class="table-td td">
            <el-input
              type="textarea"
              autosize
              v-if="edit"
              v-model="item.standard"
              :rows="1" />
            <span
              class="td-view"
              v-else
              v-html="item.standard.replace(/\n/g, '<br>')" />
          </div>
          <div
            class="table-td td2"
            v-if="edit">
            <div>
              <el-button
                type="text"
                icon="el-icon-circle-plus"
                @click="tablePlus(index)" />
              <el-button
                class="error"
                type="text"
                icon="el-icon-circle-close"
                v-if="detData.main_responsibilitys.length > 1"
                @click="tableDelete(index)" />
            </div>
          </div>
        </div>
      </div>
    </m-section>

    <!-- 任职资格要求 -->
    <m-section
      autotest="requirements"
      title="任职资格要求">
      <div
        class="table table2"
        :class="{ noedit: !edit }">
        <div class="table-tr">
          <div class="table-th th0">维度</div>
          <div class="table-th th">基本要求</div>
          <div
            class="table-th th2"
            v-if="edit" />
        </div>

        <div class="table-tr">
          <div class="table-td td0">教育背景</div>
          <div class="table-td td">
            <el-input
              autotest="requirements-education"
              type="textarea"
              autosize
              v-if="edit"
              v-model="detData.requirements.edu_bg"
              :rows="1" />
            <span
              class="td-view"
              v-else
              v-html="detData.requirements.edu_bg.replace(/\n/g, '<br>')" />
          </div>
          <div
            class="table-td td2"
            v-if="edit" />
        </div>
        <div class="table-tr">
          <div class="table-td td0">工作经验</div>
          <div class="table-td td">
            <el-input
              autotest="requirements-experiences"
              type="textarea"
              autosize
              v-if="edit"
              v-model="detData.requirements.hands_on_bg"
              :rows="1" />
            <span
              class="td-view"
              v-else
              v-html="detData.requirements.hands_on_bg.replace(/\n/g, '<br>')" />
          </div>
          <div
            class="table-td td2"
            v-if="edit" />
        </div>
        <div class="table-tr">
          <div class="table-td td0">所需培训与资质</div>
          <div class="table-td td">
            <el-input
              autotest="requirements-train"
              type="textarea"
              autosize
              v-if="edit"
              v-model="detData.requirements.train_qualification"
              :rows="1" />
            <span
              class="td-view"
              v-else
              v-html="detData.requirements.train_qualification.replace(/\n/g, '<br>')" />
          </div>
          <div
            class="table-td td2"
            v-if="edit" />
        </div>
        <div class="table-tr">
          <div class="table-td td0-1 first" />
          <div class="table-td td0">基本技能</div>
          <div class="table-td td">
            <el-input
              autotest="requirements-knowledge"
              type="textarea"
              autosize
              v-if="edit"
              v-model="detData.requirements.knowledge_base"
              :rows="1" />
            <span
              class="td-view"
              v-else
              v-html="detData.requirements.knowledge_base.replace(/\n/g, '<br>')" />
          </div>
          <div
            class="table-td td2"
            v-if="edit" />
        </div>
        <div class="table-tr">
          <div class="table-td td0-1">知识技能</div>
          <div class="table-td td0">专业技能</div>
          <div class="table-td td">
            <el-input
              autotest="requirements-knowledge_pro"
              type="textarea"
              autosize
              v-if="edit"
              v-model="detData.requirements.knowledge_pro"
              :rows="1" />
            <span
              class="td-view"
              v-else
              v-html="detData.requirements.knowledge_pro.replace(/\n/g, '<br>')" />
          </div>
          <div
            class="table-td td2"
            v-if="edit" />
        </div>
        <div class="table-tr">
          <div class="table-td td0-1" />
          <div class="table-td td0">
            <div>
              综合技能
              <div class="lowline">（分析判断、人际沟通、统筹协调、管理等方面）</div>
            </div>
          </div>
          <div class="table-td td">
            <el-input
              autotest="requirements-knowledge_composite"
              type="textarea"
              v-if="edit"
              v-model="detData.requirements.knowledge_composite"
              :rows="3"
              :autosize="{ minRows: 3 }" />
            <span
              class="td-view"
              v-else
              v-html="detData.requirements.knowledge_composite.replace(/\n/g, '<br>')" />
          </div>
          <div
            class="table-td td2"
            v-if="edit" />
        </div>
      </div>
    </m-section>

    <!-- 上传附件 -->
    <m-section
      title="附件"
      :is-form="edit">
      <el-form
        class="m-section--form"
        label-width="140px"
        v-if="edit">
        <m-section-row>
          <el-form-item
            class="files"
            label="附件上传">
            <m-upload
              autotest="attachment-upload"
              multiple
              ref="upload"
              :file-list="detDataTemp.attachment_list"
              :accept="uploadType"
              :action="uploadUrl" />
          </el-form-item>
        </m-section-row>
      </el-form>
      <m-section-row
        v-else>
        <m-section-cell
          title="附件列表">
          <m-attachment :data="detDataTemp.attachment_list" />
        </m-section-cell>
      </m-section-row>
    </m-section>

    <!-- 提交返回 -->
    <div
      v-show="edit">
      <el-button
        autotest="btn-save"
        type="primary"
        :loading="loading"
        @click="update">保存</el-button>
      <el-button
        type="info"
        autotest="btn-cancel"
        @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PositionDetails',
    data() {
      // 名称校验不能包含非法字符
      const nameValid = (rule, value, callback) => {
        const test = /[//]/im
        if (test.test(value)) {
          return callback('名称中不能包含非法字符')
        }
        return callback()
      }

      // 上级职位是否必填校验器
      const validatorPid = (rule, value, callback) => {
        if (Number(this.detDataTemp.code) === 200001) {
          callback()
        } else if (!value) {
          callback(new Error('请选择上级职位'))
        } else {
          callback()
        }
      }

      return {
        edit: false,
        noConfirm: false,
        routeFromCreate: false,
        preloading: false,
        loading: false,
        redirect: this.$route.query.redirect,
        // 附件上传
        uploadType: 'image,pdf,word,excel,zip',

        // 添加接口要求字段
        clearDetData: {},
        queryDetData: {},
        detData: {
          name: '',
          level: '',
          pid: '',
          duty_id: '',
          main_responsibilitys: [],
          requirements: {
            edu_bg: '',
            hands_on_bg: '',
            train_qualification: '',
            knowledge_base: '',
            knowledge_pro: '',
            knowledge_composite: '',
          },
          aids: '',
        },

        main_responsibilitys_temp: {
          description: '',
          standard: '',
        },

        // 其他显示字段
        clearDetDataTemp: {},
        queryDetDataTemp: {},
        detDataTemp: {
          id: '',
          name: '',
          code: '',
          pname: '',
          duty_name: '',
          duty_type_name: '',
          duty_type_level_name: '',
          attachment_list: [],
        },

        // 表单校验
        detDataRules: {
          name: [
            { required: true, message: '请输入职位名称', trigger: ['blur', 'change'] },
            { validator: nameValid, trigger: ['blur', 'change'] },
            { max: 30, message: '不超过30个字符', trigger: ['blur', 'change'] },
          ],
          pid: [{ validator: validatorPid, trigger: ['blur', 'change'] }],
          duty_id: [{ required: true, message: '请选择职务', trigger: ['blur', 'change'] }],
        },
      }
    },
    computed: {
      dictionary() {
        return this.$utils.config.dictionary.position
      },
      ajaxPath() {
        return this.$api.position.position
      },
      breadcrumb() {
        const defaultBC = [
          { name: '职位管理' },
          { name: '职位维护', to: '/position' },
          { name: '职位详情' },
        ]

        const status = {
          name: this.detDataTemp.id ? '修改' : '新建',
        }
        if (!this.detDataTemp.id) defaultBC.pop()
        if (this.edit) defaultBC.push(status)
        if (!this.detDataTemp.name) return defaultBC

        const name = {
          name: this.detDataTemp.name,
        }

        if (this.edit) {
          name.to = {
            name: this.$route.name,
            params: { id: this.detDataTemp.id },
          }
        }

        defaultBC.splice(2, 1, name)
        return defaultBC
      },
      uploadUrl() {
        return this.ajaxPath.attachment
      },
      toNextId() {
        if (!this.detDataTemp.id || !this.$store.getters.getPositionIds) return ''
        const ids = this.$store.getters.getPositionIds
        const thisIndex = ids.findIndex(v => v === this.detDataTemp.id)
        if (thisIndex === ids.length - 1) return ''
        return ids[thisIndex + 1]
      },
      toPrevId() {
        if (!this.detDataTemp.id || !this.$store.getters.getPositionIds) return ''
        const ids = this.$store.getters.getPositionIds
        const thisIndex = ids.findIndex(v => v === this.detDataTemp.id)
        if (thisIndex === 0) return ''
        return ids[thisIndex - 1]
      },
    },
    watch: {
      // 如果路由发生变化，拉取新数据，更新编辑状态
      $route(to, from) {
        // 1、从新建跳转到其他ID
        // 2、ID发生变化
        // 3、从已有ID跳新建
        const case1 = !from.params.id && String(to.params.id) !== String(this.detDataTemp.id)
        const case2 = to.params.id &&
          from.params.id &&
          String(to.params.id) !== String(from.params.id)
        const case3 = from.params.id && !to.params.id
        if (case1 || case2 || case3) this.getRouteChange()
        this.edit = !!to.query.edit || !to.params.id
        // 从编辑跳非编辑，恢复数据，用暂存恢复
        if (!this.edit) {
          this.$refs.detData.resetFields()
          Object.assign(this.detData, JSON.parse(JSON.stringify(this.queryDetData)))
          Object.assign(this.detDataTemp, JSON.parse(JSON.stringify(this.queryDetDataTemp)))
        }
      },
    },
    created() {
      // 数据初始化和缓存
      this.tablePlus(0)
      Object.assign(this.clearDetData, JSON.parse(JSON.stringify(this.detData)))
      Object.assign(this.clearDetDataTemp, JSON.parse(JSON.stringify(this.detDataTemp)))
      this.getRouteChange()
      this.edit = !!this.$route.query.edit || !this.$route.params.id
      this.routeFromCreate = !this.$route.params.id
      // 本页面执行错误处理
      this.$on('error', this.$message.error)
      this.$on('ok', this.$message.success)
    },
    methods: {
      getRouteChange() {
        // 恢复原始状态，获取routeID和数据
        Object.assign(this.detData, JSON.parse(JSON.stringify(this.clearDetData)))
        Object.assign(this.detDataTemp, JSON.parse(JSON.stringify(this.clearDetDataTemp)))
        Object.assign(this.queryDetData, JSON.parse(JSON.stringify(this.clearDetData)))
        Object.assign(this.queryDetDataTemp, JSON.parse(JSON.stringify(this.clearDetDataTemp)))
        this.detDataTemp.id = this.$route.params.id || ''
        if (this.detDataTemp.id) this.getPosition()
      },

      getEditChange(flag) {
        // 调整模式，手动触发路由变化
        if (this.edit || !flag) {
          const query = Object.assign({}, this.$route.query)
          if (query.edit) delete query.edit
          if (this.$route.params.id) {
            this.$router.push({
              path: this.$route.path,
              query,
            })
          } else {
            this.$router.push({
              name: this.$route.name,
              params: { id: this.detDataTemp.id },
              query,
            })
          }
        } else {
          this.$router.push({
            path: this.$route.path,
            query: Object.assign({}, this.$route.query, {
              edit: true,
            }),
          })
        }
      },

      getToCreate() {
        // 继续新建
        this.$router.push({
          name: this.$route.name,
          query: Object.assign({}, this.$route.query),
        })
      },

      getToBack() {
        // 返回回传地址
        window.location.href = this.redirect
      },

      getTo(type) {
        // 上一条下一条
        this.$router.replace({
          name: this.$route.name,
          params: { id: type === 'prev' ? this.toPrevId : this.toNextId },
          query: Object.assign({}, this.$route.query),
        })
      },

      async getPosition() {
        if (!this.detDataTemp.id) {
          return
        }

        // 获取数据
        if (this.preloading) return
        this.preloading = true
        try {
          const { code, msg, data } = await this.$axios
            .post(this.ajaxPath.get, { id: this.detDataTemp.id })

          if (code) await Promise.reject(msg)

          // 数据处理
          data.main_responsibilitys = data.main_responsibility_list || []
          delete data.main_responsibility_list
          data.requirements = data.requirement_list || {}
          delete data.requirement_list
          Object.keys(this.detData).forEach((i) => {
            this.detData[i] = data[i]
          })
          Object.keys(this.detDataTemp).forEach((i) => {
            this.detDataTemp[i] = data[i]
          })
          // 添加一个空的
          if (!data.main_responsibilitys.length) {
            this.tablePlus(0)
          }

          this.preloading = false
        } catch (err) {
          this.preloading = false
          console.log(err)
          return
        }

        // 查询结果暂存一份
        Object.assign(this.queryDetData, JSON.parse(JSON.stringify(this.detData)))
        Object.assign(this.queryDetDataTemp, JSON.parse(JSON.stringify(this.detDataTemp)))
      },

      getJob(job) {
        // 获取职务
        if (job.length) {
          const selectJob = job[job.length - 1]
          this.detDataTemp.duty_name = selectJob.name
          this.detDataTemp.duty_type_name = selectJob.type
          this.detDataTemp.duty_type_level_name = selectJob.level
        } else {
          this.detDataTemp.duty_name = ''
          this.detDataTemp.duty_type_name = ''
          this.detDataTemp.duty_type_level_name = ''
        }
      },

      getPositionSelect(position) {
        // 获取职位
        if (position.length) {
          const selectPosition = position[position.length - 1]
          this.detDataTemp.pname = selectPosition.name
        } else {
          this.detDataTemp.pname = ''
        }
      },

      tablePlus(index) {
        // 主要职责新增
        const item = Object.assign({}, this.main_responsibilitys_temp, {
          // 用于标记唯一性便于dom复用样式不变化
          timestamp: Date.now(),
        })
        this.detData.main_responsibilitys.splice(index + 1, 0, item)
      },

      tableDelete(index) {
        this.detData.main_responsibilitys.splice(index, 1)
      },

      async update() {
        // 是否文件在上传
        if (this.$refs.upload.processing) {
          this.$message({
            type: 'warning',
            message: '请在附件上传完成后保存',
          })
          return
        }

        // 表单校验
        try {
          await this.$refs.detData.validate()
        } catch (err) {
          console.log(err)
          return
        }

        // 提交确认
        try {
          await this.$confirm('是否确认提交？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
        } catch (err) {
          console.log(err)
          return
        }

        // 提交数据
        if (this.loading) return
        this.loading = true
        try {
          let url = ''
          let dataPost = {}
          // 数据拼接
          if (this.detDataTemp.id) {
            url = this.ajaxPath.edit
            dataPost = Object
              .assign(dataPost, this.detData, { id: this.detDataTemp.id })
          } else {
            url = this.ajaxPath.add
            dataPost = Object.assign(dataPost, this.detData)
          }
          // 去空
          const emptyIndexs = []
          dataPost.main_responsibilitys.forEach((item, index) => {
            delete item.timestamp
            delete item.id
            if (!Object.keys(item).some(key => item[key])) {
              emptyIndexs.push(index)
            }
          })
          emptyIndexs.reverse().forEach((index) => {
            dataPost.main_responsibilitys.splice(index, 1)
          })
          // 至少保留一个
          if (!dataPost.main_responsibilitys.length) {
            this.tablePlus(0)
          }
          dataPost.main_responsibilitys.forEach((item, index) => {
            item.id = index + 1
          })
          // 数据处理
          dataPost.main_responsibilitys = JSON.stringify(dataPost.main_responsibilitys)
          dataPost.requirements = JSON.stringify(dataPost.requirements)
          dataPost.aids = this.$refs.upload.getFiles('string')

          const { code, msg, data } = await this.$axios
            .post(url, dataPost)

          if (code) await Promise.reject(msg)

          this.detDataTemp.id = data.id || this.detDataTemp.id
          this.detDataTemp.code = data.code || this.detDataTemp.code
          this.detDataTemp.name = this.detData.name
          this.detDataTemp.attachment_list = [...this.$refs.upload.getFiles()]
          this.$emit('ok', '提交成功！')

          this.loading = false
        } catch (err) {
          this.loading = false
          console.log(err)
          return
        }

        // 更新暂存结果
        Object.assign(this.queryDetData, JSON.parse(JSON.stringify(this.detData)))
        Object.assign(this.queryDetDataTemp, JSON.parse(JSON.stringify(this.detDataTemp)))
        this.pageBack()
      },

      async cancel() {
        // 取消确认
        try {
          await this.$confirm('系统可能不会保存您所做的更改，确认离开？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
        } catch (err) {
          console.log(err)
          return
        }

        this.pageBack()
      },

      pageBack() {
        // 页面返回
        this.noConfirm = true
        if (this.detDataTemp.id) {
          this.getEditChange()
        } else if (this.redirect) {
          this.getToBack()
        } else {
          window.history.back()
        }
      },
    },
    beforeRouteUpdate(to, from, next) {
      // 阻止未保存离开
      if (this.noConfirm) {
        this.noConfirm = false
        next()
        return
      }
      // 1、从编辑到非编辑
      // 2、从编辑到编辑但ID变更
      // 3、从新建到非编辑
      // 4、从新建到编辑
      const case1 = from.query.edit && !to.query.edit
      const case2 = from.query.edit &&
        to.query.edit &&
        String(to.params.id) !== String(from.params.id)
      const case3 = !from.query.edit && !from.params.id && !to.query.edit
      const case4 = !from.query.edit &&
        !from.params.id &&
        to.query.edit &&
        to.params.id
      if (case1 || case2 || case3 || case4) {
        next(false)
        setTimeout(() => {
          this.$confirm('系统可能不会保存您所做的更改，确认离开？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => next()).catch(() => next(false))
        }, 0)
      } else {
        next()
      }
    },
    beforeRouteLeave(to, from, next) {
      // 阻止未保存离开
      if (this.noConfirm) {
        this.noConfirm = false
        next()
        return
      }
      // 1、从编辑到其他
      // 2、从新建到其他
      if (from.query.edit || (!from.query.edit && !from.params.id)) {
        next(false)
        setTimeout(() => {
          this.$confirm('系统可能不会保存您所做的更改，确认离开？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => next()).catch(() => next(false))
        }, 0)
      } else {
        next()
      }
    },
  }
</script>


<style lang="scss">
  .page__position--details {
    .el-upload.el-upload--text .el-button {
      padding-top: 3px;
      padding-bottom: 3px;
    }

    .files.m-section--cell {
      width: 50% !important;
      padding-right: 30px;
    }

    .table {
      word-break: break-all;
      margin-top: 18px;
      margin-left: 20px;
      margin-bottom: 22px;
      max-width: calc(50% + 390px + 80px);

      &.noedit {
        max-width: 100%;
        margin-right: 20px;

        .table-tr {
          .td0,
          .td0-1 {
            line-height: initial;
          }
        }

        .lowline {
          margin-top: 6px;
        }
      }

      &-tr {
        display: flex;
        border-left: 1px solid #d7d7d7;

        &:last-child {
          .td0,
          .td {
            border-bottom: 1px solid #d7d7d7;
          }
        }

        .th0,
        .th {
          background-color: #f4f4f4;
        }

        .th0,
        .th2,
        .td0,
        .td2 {
          width: 80px;
        }

        .th,
        .td {
          flex: 1;
        }

        .td {
          display: flex;
          align-items: center;
        }

        .th0,
        .th,
        .td0,
        .td {
          border-top: 1px solid #d7d7d7;
          border-right: 1px solid #d7d7d7;
        }

        .td0,
        .td0-1 {
          text-align: center;
          color: #333;
          line-height: 33px;
          align-items: center;
          display: flex;
          justify-content: center;
        }

        .td-view {
          color: #000;
        }
      }

      &-th {
        text-align: center;
        font-size: 14px;
        color: #666;
        padding: 8px 0;
      }

      &-td {
        font-size: 14px;
        padding: 8px;
      }

      .lowline {
        font-size: 14px;
        color: #999;
        text-align: left;
        line-height: 20px;
        padding: 0 20px;
      }
    }

    .table2 {
      .table-tr {
        .th0,
        .td0 {
          width: 380px;
        }

        .td0-1 {
          width: 120px;
          border-right: 1px solid #d7d7d7;
        }

        .td0-1 + .td0 {
          width: 260px;
        }

        .td0-1.first {
          border-top: 1px solid #d7d7d7;
        }

        &:last-child {
          .td0-1 {
            border-bottom: 1px solid #d7d7d7;
          }
        }
      }
    }
  }

</style>
