<template>
  <div class="holidays-edit">
    <el-dialog
      autotest="edit"
      custom-class="holidays-edit__dialog"
      lock-scroll
      :title="!holidays.id ? '新建' : '修改'"
      :visible.sync="show"
      :modal-append-to-body="false"
      :show-close="false"
      :close-on-click-modal="false">

      <el-form
        v-loading="preloading"
        label-position="right"
        label-width="115px"
        ref="holidays"
        :model="holidays"
        :rules="holidaysRules">

        <el-form-item
          label="节假日名称"
          prop="name">
          <el-input
            autotest="edit-holidaysName"
            v-model="holidays.name" />
        </el-form-item>

        <el-form-item
          label="开始日期"
          prop="start_date">
          <el-date-picker
            autotest="edit-holidaysStart_date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="holidays.start_date"
            :picker-options="pickerOptions"
            @change="
              validErr.has('end_date')
                && $refs.holidays.validateField('end_date')
            " />
        </el-form-item>

        <el-form-item
          label="结束日期"
          prop="end_date">
          <el-date-picker
            autotest="edit-holidaysEnd_date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="holidays.end_date"
            :picker-options="pickerOptions"
            @change="
              validErr.has('start_date')
                && $refs.holidays.validateField('start_date')
            " />
        </el-form-item>

        <el-form-item
          label="备注"
          prop="remark">
          <el-input
            autotest="edit-holidaysRemark"
            v-model="holidays.remark" />
        </el-form-item>

        <el-form-item>
          <div class="holidays-edit__btn">
            <el-button
              autotest="btn-saveAndContinue"
              type="primary"
              v-if="!holidays.id && show"
              :loading="loading"
              @click="save($event, true)">保存并继续新增
            </el-button>
            <el-button
              autotest="btn-save"
              :type="!holidays.id && show ? '' : 'primary'"
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
  export default {
    name: 'HolidaysEdit',
    data() {
      const validatorTime = (rule, value = '', callback) => {
        const startTime = this.holidays.start_date
        const endTime = this.holidays.end_date
        const key = value === startTime
          ? 'start_date'
          : 'end_date'
        const tip = value === startTime
          ? '开始时间不能晚于结束时间'
          : '结束时间不能早于开始时间'
        if (!endTime || !startTime) {
          this.validErr.delete(key)
          return callback()
        }
        const startTimeCompare = new Date(startTime)
        const endTimeCompare = new Date(endTime)
        if (startTimeCompare > endTimeCompare) {
          this.validErr.add(key)
          return callback(new Error(tip))
        }

        this.validErr.delete(key)
        return callback()
      }

      return {
        show: false,
        isSave: false,
        preloading: false,
        loading: false,
        validErr: new Set(),
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now()
          },
        },

        holidays: {
          id: '',
          name: '',
          type: 1,
          start_date: '',
          end_date: '',
          remark: '',
        },
        holidaysTemp: {},

        holidaysRules: {
          name: [
            { required: true, message: '请输入节假日名称', trigger: ['blur', 'change'] },
            { max: 30, message: '不超过30个字符', trigger: ['blur', 'change'] },
          ],
          start_date: [
            { required: true, message: '请输入开始日期', trigger: ['blur', 'change'] },
            { validator: validatorTime, trigger: ['blur', 'change'] },
          ],
          end_date: [
            { required: true, message: '请输入结束日期', trigger: ['blur', 'change'] },
            { validator: validatorTime, trigger: ['blur', 'change'] },
          ],
        },
      }
    },
    created() {
      // 初始化数据
      if (!Object.keys(this.holidaysTemp).length) {
        Object.assign(this.holidaysTemp, this.holidays)
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
            Object.keys(this.holidays).forEach((key) => {
              this.holidays[key] = row[key] || this.holidays[key]
            })
          })
        }
      },

      // 保存
      async save(e, type) {
        // 表单校验
        try {
          await this.$refs.holidays.validate()
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
          const url = !this.holidays.id
            ? this.$api.settings.attendance.holidayAdd
            : this.$api.settings.attendance.holidayEdit
          const tips = !this.holidays.id ? '新建成功' : '修改成功'
          const data = Object.assign({}, this.holidays)
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
          Object.assign(this.holidays, this.holidaysTemp)
          this.$refs.holidays.resetFields()
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
  .holidays-edit {
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

    .el-date-editor.el-input,
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
