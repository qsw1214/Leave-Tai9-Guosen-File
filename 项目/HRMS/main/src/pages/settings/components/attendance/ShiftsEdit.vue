<template>
  <!-- 班次编辑 -->
  <div
    v-loading.fullscreen.lock="preloading"
    class="page shifts-edit--details">

    <m-breadcrumb :items="breadcrumb" />

    <!-- 内容部分 -->
    <m-section
      is-form>
      <el-form
        class="wrap m-section--form"
        label-position="right"
        label-width="140px"
        ref="detData"
        :model="detData"
        :rules="detDataRules">

        <m-section-row>
          <m-section-cell
            title="班次编码"
            :content="detDataTemp.code" />
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="班次名称"
            prop="name">
            <el-input
              v-model="detData.name" />
          </el-form-item>

          <el-form-item
            label="是否默认班次"
            prop="default">
            <el-select
              v-model="detData.default">
              <el-option
                label="是"
                :value="1" />
              <el-option
                label="否"
                :value="2" />
            </el-select>
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="上班时间"
            prop="on_time">
            <el-time-picker
              format="HH:mm"
              value-format="HH:mm"
              v-model="detData.on_time"
              @change="
                validErr.has('off_time')
                  && $refs.detData.validateField('off_time')
              " />
          </el-form-item>

          <el-form-item
            label="下班时间"
            prop="off_time">
            <el-time-picker
              format="HH:mm"
              value-format="HH:mm"
              v-model="detData.off_time"
              @change="
                validErr.has('on_time')
                  && $refs.detData.validateField('on_time')
              " />
          </el-form-item>
        </m-section-row>

        <el-form-item
          label="备注"
          class="textarea"
          prop="remark"
          key="remark">
          <el-input
            type="textarea"
            v-model="detData.remark"
            :autosize="{ minRows: 4 }"
            :rows="4" />
        </el-form-item>

      </el-form>
    </m-section>

    <!-- 提交返回 -->
    <div>
      <el-button
        type="primary"
        :loading="loading"
        @click="update">保存
      </el-button>
      <el-button
        type="info"
        @click="cancel">取消
      </el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      const { id } = this.$route.params

      const validatorTime = (rule, value = '', callback) => {
        const onTime = this.detData.on_time
        const offTime = this.detData.off_time
        const key = value === onTime
          ? 'on_time'
          : 'off_time'
        const tip = value === onTime
          ? '上班时间不能晚于下班时间'
          : '下班时间不能早于上班时间'
        if (!onTime || !offTime) {
          this.validErr.delete(key)
          return callback()
        }
        const tPlus = this.$utils.tools.formatDate(new Date())
        const onTimeCompare = new Date(`${tPlus} ${onTime}`)
        const offTimeCompare = new Date(`${tPlus} ${offTime}`)
        if (onTimeCompare > offTimeCompare) {
          this.validErr.add(key)
          return callback(new Error(tip))
        }

        this.validErr.delete(key)
        return callback()
      }

      return {
        noConfirm: false,
        preloading: false,
        loading: false,
        validErr: new Set(),
        // --添加接口要求字段
        // 默认字段，用于恢复默认
        clearDetData: {},
        // 接口字段，用于显示
        queryDetData: {},
        // 编辑字段，用于编辑绑定
        detData: {
          name: '',
          default: 2,
          on_time: '',
          off_time: '',
          remark: '',
        },
        // --其他显示字段
        // 默认字段，用于恢复默认
        clearDetDataTemp: {},
        // 接口字段，用于显示
        queryDetDataTemp: {},
        // 编辑显示字段，用于编辑绑定
        detDataTemp: {
          id: id || '',
          name: '',
          code: '由系统生成',
        },
        // 表单校验条件
        detDataRules: {
          name: [
            { required: true, message: '请输入班次名称', trigger: ['blur', 'change'] },
          ],
          default: [
            { required: true, message: '请选择是否默认班次', trigger: ['blur', 'change'] },
          ],
          on_time: [
            { validator: validatorTime, trigger: ['blur', 'change'] },
          ],
          off_time: [
            { validator: validatorTime, trigger: ['blur', 'change'] },
          ],
        },
      }
    },
    computed: {
      dictionary() {
        return this.$utils.config.dictionary.settings
      },
      ajaxPath() {
        return this.$api.settings.attendance
      },
      breadcrumb() {
        const defaultBC = [
          { name: '基础配置' },
          { name: '考勤管理', to: '/attendance' },
          { name: '考勤班次设置', to: '/attendance/shifts' },
          { name: this.detDataTemp.id ? '修改' : '新建' },
        ]

        if (!this.detDataTemp.name) return defaultBC

        const parent = {
          name: defaultBC[1].name,
          to: defaultBC[2].to,
        }

        const name = {
          name: this.detDataTemp.name,
          to: `/attendance/shifts/details/${this.detDataTemp.id}`,
        }

        defaultBC.splice(1, 1, parent)
        defaultBC.splice(2, 1, name)
        return defaultBC
      },
    },
    created() {
      // 数据初始化和缓存
      Object.assign(this.clearDetData, JSON.parse(JSON.stringify(this.detData)))
      Object.assign(this.clearDetDataTemp, JSON.parse(JSON.stringify(this.detDataTemp)))
      // 本页面执行错误处理
      this.$on('error', this.$message.error)
      this.$on('ok', this.$message.success)
      if (this.detDataTemp.id) this.getDetail()
    },
    methods: {
      // 获取详情
      async getDetail() {
        this.preloading = true
        await this.$axios({
          url: this.ajaxPath.scheduleDetail,
          params: { id: this.detDataTemp.id },
        }).then((data) => {
          if (data.code === 0) {
            Object.keys(this.detData).forEach((key) => {
              this.detData[key] = data.data[key]
            })
            Object.keys(this.detDataTemp).forEach((key) => {
              this.detDataTemp[key] = data.data[key]
            })
          }
        }).catch(() => {})
        this.preloading = false
      },

      async update() {
        if (this.loading) return
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

        // 检查是否默认班次
        if (this.detData.default === 1) {
          this.loading = true
          try {
            const { code, msg, data: { status } } = await this.$axios({
              url: this.ajaxPath.scheduleCheck,
              params: { id: this.detDataTemp.id },
            })
            if (code) await Promise.reject(msg)

            if (status === 2) {
              await this.$confirm('已存在默认班次，是否确认替换？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
              })
            }
          } catch (err) {
            this.loading = false
            console.log(err)
            return
          }
          this.loading = false
        }

        // 提交数据
        this.loading = true

        try {
          const url = !this.detDataTemp.id
            ? this.ajaxPath.scheduleAdd
            : this.ajaxPath.scheduleEdit
          const tips = !this.detDataTemp.id ? '新建成功' : '修改成功'
          const data = Object.assign({}, this.detData)
          if (this.detDataTemp.id) {
            data.id = this.detDataTemp.id
          }
          if (!data.on_time) data.on_time = ''
          if (!data.off_time) data.off_time = ''

          const { code, msg } = await this.$axios
            .post(url, data)
          // 失败
          if (code) await Promise.reject(msg)
          // 成功
          this.$emit('ok', tips)
          this.isSave = true
        } catch (err) {
          this.loading = false
          console.log(err)
          return
        }

        this.loading = false
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
        window.history.back()
      },
    },
    beforeRouteLeave(to, from, next) {
      if (this.noConfirm) return next()

      return setTimeout(() => {
        this
          .$confirm('系统可能不会保存您所做的更改，确认离开？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            closeOnHashChange: false,
          })
          .then(() => next())
          .catch(() => next(false))
      }, 0)
    },
  }
</script>
