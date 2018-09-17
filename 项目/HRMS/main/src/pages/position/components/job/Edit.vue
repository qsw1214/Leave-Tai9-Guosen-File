<template>
  <div class="job-edit">
    <el-dialog
      autotest="edit"
      custom-class="job-edit__dialog"
      lock-scroll
      :title="!job.id ? '新建' : '修改'"
      :visible.sync="show"
      :modal-append-to-body="false"
      :show-close="false"
      :close-on-click-modal="false">

      <el-form
        label-position="right"
        label-width="115px"
        ref="job"
        :model="job"
        :rules="jobRules">

        <el-form-item label="职务编码">
          <span>{{ job.code || '由系统生成' }}</span>
        </el-form-item>

        <el-form-item
          label="职务名称"
          prop="name">
          <el-input
            autotest="edit-jobName"
            v-model="job.name" />
        </el-form-item>

        <el-form-item
          label="职务类别"
          prop="type_id">
          <el-select
            autotest="edit-jobCategory"
            placeholder="请选择"
            v-model="job.type_id"
            @change="setSubChild">
            <el-option
              v-for="(jobType, index) in jobChildList"
              :autotest="'edit-jobCategory-' + index"
              :key="jobType.type_id"
              :value="jobType.type_id"
              :label="jobType.type_name" />
          </el-select>
        </el-form-item>

        <el-form-item
          label="职级"
          prop="level_id">
          <el-select
            autotest="edit-jobLevels"
            placeholder="请选择"
            v-model="job.level_id">
            <el-option
              v-for="(jobLevel, index) in jobSubChildList"
              :autotest="'edit-jobLevels-' + index"
              :key="jobLevel.level_id"
              :value="jobLevel.level_id"
              :label="jobLevel.level_name" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <div class="job-edit__btn">
            <el-button
              autotest="btn-saveAndContinue"
              type="primary"
              v-if="!job.id && show"
              :loading="loading"
              @click="save($event, true)">保存并继续新增
            </el-button>
            <el-button
              autotest="btn-save"
              :type="!job.id && show ? '' : 'primary'"
              :loading="loading"
              @click="save">保存
            </el-button>
            <el-button
              autotest="btn-cancel"
              type="info"
              @click="cancel">取消
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import JOB_CHILD_LIST from './EditJobChildList'

  export default {
    name: 'JobEdit',
    data() {
      // 名称不能包含非法字符
      const nameValid = (rule, value, callback) => {
        const test = /[//]/im
        if (test.test(value)) {
          return callback('名称中不能包含非法字符')
        }
        return callback()
      }

      return {
        show: false,
        isSave: false,
        loading: false,
        jobChildList: [],
        jobSubChildList: [],

        job: {
          id: '',
          code: '',
          name: '',
          type_id: '',
          level_id: '',
        },
        jobTemp: {},

        jobRules: {
          name: [
            { required: true, message: '请输入职务名称', trigger: ['blur', 'change'] },
            { validator: nameValid, trigger: ['blur', 'change'] },
            { max: 30, message: '不超过30个字符', trigger: ['blur', 'change'] },
          ],
          type_id: [{ required: true, message: '请选择职务类别', trigger: ['blur', 'change'] }],
          level_id: [{ required: true, message: '请选择职级', trigger: ['blur', 'change'] }],
        },
      }
    },
    created() {
      // 初始化数据
      Object.assign(this.jobTemp, this.job)
      // 本页面执行错误处理
      this.$on('error', this.$message.error)
      this.$on('ok', this.$message.success)
    },
    methods: {
      // 打开方法
      open(job) {
        this.show = true
        if (job) {
          this.$nextTick(() => {
            Object.assign(this.job, job)
            this.setSubChild()
          })
        }

        if (!this.jobChildList.length) this.setChild()
      },

      // 获取并设置职务类别
      setChild() {
        // store 取值
        this.jobChildList = this.$store.getters['JOB_CHILD_LIST/get'] || []
        if (this.jobChildList.length) return
        // store 注册
        this.$store.registerModule('JOB_CHILD_LIST', JOB_CHILD_LIST)
        // store 拉取
        this.$store.dispatch('JOB_CHILD_LIST/get')
          .then((list) => {
            this.jobChildList = list
            this.setSubChild()
          })
      },

      // 获取并设置职级
      setSubChild() {
        const id = this.job.type_id
        if (!id) this.jobSubChildList = []
        this.jobChildList.some((item) => {
          if (item.type_id === id) {
            this.jobSubChildList = item.sub
            return true
          }
          return false
        })
      },

      // 保存
      async save(e, type) {
        // 表单校验
        try {
          await this.$refs.job.validate()
        } catch (err) {
          console.log(err)
          return
        }

        // 提交确认
        try {
          await this.$confirm('是否确认保存？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
        } catch (err) {
          console.log(err)
          return
        }

        // 提交表单
        if (this.loading) return
        this.loading = true

        try {
          const url = !this.job.id
            ? this.$api.position.jobAdd
            : this.$api.position.jobEdit
          const tips = !this.job.id ? '新建成功！' : '修改成功'
          const data = Object.assign({}, this.job)
          const { code, msg } = await this.$axios
            .post(url, data)
          // 失败
          if (code) await Promise.reject(msg)
          // 成功
          this.$emit('ok', tips)
          this.isSave = true
          this.resetForm()
          if (!type) this.close()
        } catch (err) {
          console.log(err)
        }

        this.loading = false
      },

      // 取消
      async cancel() {
        this.close()
        this.resetForm()
      },

      // 重置表单
      resetForm() {
        setTimeout(() => {
          Object.assign(this.job, this.jobTemp)
          this.setSubChild()
          this.$refs.job.resetFields()
        }, 500)
      },

      // 关闭表单
      close() {
        this.show = false
        this.$emit('end', this.isSave)
        this.isSave = false
      },
    },
  }
</script>

<style lang="scss">
  .job-edit {
    &__dialog {
      min-width: 650px !important;
      width: 650px !important;
    }

    .el-form {
      margin-left: 40px;
      padding-top: 10px;
    }

    .el-form-item__content {
      width: 353px;
    }

    .el-select {
      width: 100%;
    }

    &__btn {
      white-space: nowrap;
      padding-top: 18px;
      margin-bottom: -12px;
    }
  }
</style>
