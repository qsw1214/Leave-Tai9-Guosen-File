<template>
  <div class="correction-fix">
    <el-dialog
      autotest="fix"
      custom-class="correction-fix__dialog"
      title="考勤数据修正"
      lock-scroll
      :visible.sync="show"
      :modal-append-to-body="false"
      :show-close="false"
      :close-on-click-modal="false">

      <el-form
        v-loading="preloading"
        label-position="right"
        label-width="115px"
        ref="correction"
        :model="correction"
        :rules="correctionRules">

        <el-form-item
          label="姓名"
          prop="name">
          <div>{{ correction.name }}</div>
        </el-form-item>

        <el-form-item
          label="上午修正为"
          prop="on_status">
          <el-radio-group
            v-model="correction.on_status">
            <el-radio :label="1">迟到</el-radio>
            <el-radio :label="0">正常</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          label="下午修正为"
          prop="off_status">
          <el-radio-group
            v-model="correction.off_status">
            <el-radio :label="2">早退</el-radio>
            <el-radio :label="0">正常</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <div class="correction-fix__btn">
            <el-button
              autotest="btn-save"
              type="primary"
              :loading="loading"
              @click="save">提交
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
  export default {
    name: 'CorrectionFix',
    data() {
      return {
        show: false,
        isSave: false,
        preloading: false,
        loading: false,
        scheduleList: [],

        correction: {
          ids: '',
          name: '',
          on_status: '',
          off_status: '',
        },
        correctionTemp: {},

        correctionRules: {},
      }
    },
    created() {
      // 初始化数据
      if (!Object.keys(this.correctionTemp).length) {
        Object.assign(this.correctionTemp, this.correction)
      }

      // 本页面执行错误处理
      this.$on('error', this.$message.error)
      this.$on('ok', this.$message.success)
    },
    methods: {
      // 打开方法
      open(row) {
        this.show = true

        // 获取详情信息
        if (row) {
          this.$nextTick(() => {
            this.correction.ids = row.ids || row.id
            this.correction.name = row.name
          })
        }
      },

      // 保存
      async save(e, type) {
        // 表单校验
        try {
          await this.$refs.correction.validate()
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

        // 提交表单
        if (this.loading) return
        this.loading = true

        try {
          const url = this.$api.settings.attendance.recordFix
          const tips = '修正成功'
          const data = Object.assign({}, this.correction)
          delete data.name

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
          Object.assign(this.correction, this.correctionTemp)
          this.$refs.correction.resetFields()
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
  .correction-fix {
    &__dialog {
      min-width: 550px !important;
      width: 550px !important;
    }

    .el-form {
      margin-left: 40px;
      padding-top: 10px;
    }

    .el-form-item__content {
      width: 353px;
    }

    &__btn {
      white-space: nowrap;
      padding-top: 18px;
      margin-bottom: -12px;
    }
  }
</style>
