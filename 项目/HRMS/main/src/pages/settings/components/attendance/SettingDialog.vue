<template>
  <div class="setting-edit">
    <el-dialog
      autotest="edit"
      custom-class="setting-edit__dialog"
      title="考勤设置"
      lock-scroll
      :visible.sync="show"
      :modal-append-to-body="false"
      :show-close="false"
      :close-on-click-modal="false">

      <el-form
        v-loading="preloading"
        label-position="right"
        label-width="115px"
        ref="setting"
        :model="setting"
        :rules="settingRules">

        <el-form-item
          label="打卡方式"
          prop="sign_type">
          <multiple-select
            autotest="edit-settingSignType"
            multiple
            placeholder="请选择"
            v-model="setting.sign_type">
            <el-option
              v-for="(signType, index) in dictionary.signType"
              :autotest="'edit-settingSignType-' + index"
              :key="signType.value"
              :value="signType.value"
              :label="signType.label" />
          </multiple-select>
        </el-form-item>

        <el-form-item
          label="打卡地点"
          prop="sign_area">
          <multiple-select
            autotest="edit-settingSignArea"
            multiple
            placeholder="请选择"
            v-model="setting.sign_area">
            <el-option
              :value="256"
              :label="dictionary.officeSpace[256].label" />
            <el-option
              :value="128"
              :label="dictionary.officeSpace[128].label" />
            <el-option
              v-for="(space, index) in dictionary.officeSpace"
              v-if="space.value !== 128 && space.value !== 256"
              :autotest="'edit-settingSignArea-' + index"
              :key="space.value"
              :value="space.value"
              :label="space.label" />
          </multiple-select>
        </el-form-item>

        <el-form-item
          label="适用班次"
          prop="schedule_id">
          <el-select
            autotest="edit-settingScheduleId"
            placeholder="请选择"
            v-model="setting.schedule_id">
            <el-option
              v-for="(schedule, index) in scheduleList"
              :autotest="'edit-settingScheduleId-' + index"
              :key="schedule.id"
              :value="schedule.id"
              :label="schedule.name" />
          </el-select>
        </el-form-item>

        <el-form-item
          label="班次有效期"
          prop="schedule_expire">
          <el-date-picker
            autotest="edit-settingScheduleExpire"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="setting.schedule_expire"
            :picker-options="{
              disabledDate(t) {
                return t.getTime() < (Date.now() - 8.64e7)
              }
            }" />
        </el-form-item>

        <el-form-item
          label="备注"
          prop="remark">
          <el-input
            autotest="edit-settingRemark"
            v-model="setting.remark" />
        </el-form-item>

        <el-form-item>
          <div class="setting-edit__btn">
            <el-button
              autotest="btn-save"
              type="primary"
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
    name: 'SettingEdit',
    data() {
      return {
        show: false,
        isSave: false,
        preloading: false,
        loading: false,
        scheduleList: [],

        setting: {
          id: '',
          sign_type: [],
          sign_area: [],
          schedule_id: '',
          schedule_expire: '',
          remark: '',
        },
        settingTemp: {},

        settingRules: {
          sign_type: [
            { required: true, type: 'array', message: '请选择打卡方式', trigger: ['blur', 'change'] },
          ],
          sign_area: [
            { required: true, type: 'array', message: '请选择打卡地点', trigger: ['blur', 'change'] },
          ],
          schedule_id: [
            { required: true, message: '请选择适用班次', trigger: ['blur', 'change'] },
          ],
        },
      }
    },
    computed: {
      dictionary() {
        return this.$utils.config.dictionary.settings
      },
    },
    created() {
      // 初始化数据
      if (!Object.keys(this.settingTemp).length) {
        Object.assign(this.settingTemp, this.setting)
      }

      // 本页面执行错误处理
      this.$on('error', this.$message.error)
      this.$on('ok', this.$message.success)
    },
    methods: {
      // 获取列表
      async getSchedule() {
        this.preloading = true
        await this.$axios({
          url: this.$api.settings.attendance.confSchedule,
        }).then(async ({ code, data }) => {
          if (code === 0) {
            this.scheduleList.push(...data.list)
          }
        })
        this.preloading = false
      },

      // 打开方法
      open(row) {
        this.show = true
        // 获取配置数据
        if (!this.scheduleList.length) {
          this.getSchedule()
        }

        // 获取详情信息
        if (row) {
          this.$nextTick(() => {
            this.setting.id = row.id
            this.setting.sign_area = row.sign_area.map(_ => _.sign_area)
            this.setting.sign_type = row.sign_type.map(_ => _.sign_type)
            this.setting.schedule_id = row.schedule_id
            this.setting.schedule_expire = row.schedule_expire
            this.setting.remark = row.remark
          })
        }
      },

      // 保存
      async save(e, type) {
        // 表单校验
        try {
          await this.$refs.setting.validate()
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
          const url = this.$api.settings.attendance.confEdit
          const tips = '修改成功'
          const data = Object.assign({}, this.setting)
          data.sign_area = data.sign_area.reduce((s, v) => Number(s) + Number(v), 0)
          data.sign_type = data.sign_type.reduce((s, v) => Number(s) + Number(v), 0)

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
          Object.assign(this.setting, this.settingTemp)
          this.$refs.setting.resetFields()
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
  .setting-edit {
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

    .el-input,
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
