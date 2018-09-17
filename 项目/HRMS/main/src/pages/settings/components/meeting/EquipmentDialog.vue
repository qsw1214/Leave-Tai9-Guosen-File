<template>
  <div class="equip-edit">
    <el-dialog
      autotest="edit"
      custom-class="equip-edit__dialog"
      lock-scroll
      :title="!equip.id ? '新建' : '修改'"
      :visible.sync="show"
      :modal-append-to-body="false"
      :show-close="false"
      :close-on-click-modal="false">

      <el-form
        label-position="right"
        label-width="115px"
        ref="equip"
        :model="equip"
        :rules="equipRules">

        <el-form-item label="设备序号">
          <span>{{ equip.code || '由系统生成' }}</span>
        </el-form-item>

        <el-form-item
          label="设备名称"
          prop="name">
          <el-input
            autotest="edit-equipName"
            v-model="equip.name" />
        </el-form-item>

        <el-form-item>
          <div class="equip-edit__btn">
            <el-button
              autotest="btn-saveAndContinue"
              type="primary"
              v-if="!equip.id && show"
              :loading="loading"
              @click="save($event, true)">保存并继续新增
            </el-button>
            <el-button
              autotest="btn-save"
              :type="!equip.id && show ? '' : 'primary'"
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
    name: 'EquipEdit',
    data() {
      return {
        show: false,
        isSave: false,
        loading: false,

        equip: {
          id: '',
          code: '',
          name: '',
        },
        equipTemp: {},

        equipRules: {
          name: [
            { required: true, message: '请输入设备名称', trigger: ['blur', 'change'] },
            { max: 30, message: '不超过30个字符', trigger: ['blur', 'change'] },
          ],
        },
      }
    },
    created() {
      // 初始化数据
      Object.assign(this.equipTemp, this.equip)
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
            this.equip.id = row.id
            this.equip.code = row.code
            this.equip.name = row.name
          })
        }
      },

      // 保存
      async save(e, type) {
        // 表单校验
        try {
          await this.$refs.equip.validate()
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
          const url = !this.equip.id
            ? this.$api.settings.meeting.eAdd
            : this.$api.settings.meeting.eEdit
          const tips = !this.equip.id ? '新建成功' : '修改成功'
          const data = Object.assign({}, this.equip)
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
          Object.assign(this.equip, this.equipTemp)
          this.$refs.equip.resetFields()
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
  .equip-edit {
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
