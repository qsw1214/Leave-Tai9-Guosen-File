<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="page page-adjust page-adjust-higher-change">

    <m-breadcrumb :items="breadcrumb" />

    <el-form
      label-width="140px"
      label-position="left"
      ref="form"
      :model="formData"
      :rules="formRules">

      <m-section is-form>
        <div class="m-section--form">

          <m-section-row>
            <el-form-item
              label="调整方案名称"
              prop="name">

              <el-input
                placeholder="方案名称"
                :maxlength="50"
                v-model="formData.name" />
            </el-form-item>

            <el-form-item
              label="生效日期"
              prop="valid_date">

              <el-date-picker
                placeholder="选择日期"
                type="date"
                v-model="formData.valid_date" />
            </el-form-item>
          </m-section-row>

          <el-form-item
            label="调整原因">

            <el-input
              type="textarea"
              :maxlength="200"
              :autosize="{ minRows: 4 }"
              v-model="formData.reason" />
          </el-form-item>

          <el-form-item
            label="调整内容">

            <el-input
              type="textarea"
              :maxlength="200"
              :autosize="{ minRows: 4 }"
              v-model="formData.content" />
          </el-form-item>

        </div>
      </m-section>

      <m-section is-form>
        <div class="dividing-container">
          *说明：左侧为当前组织架构，请勾选待调整部门，点击向右箭头，转移至右侧目标组织下。
        </div>

        <!-- 组织选择 编辑状态 -->
        <div class="page-adjust--box">
          <div class="page-adjust--box-item">
            <m-cascader
              init-change
              store-name="orgHigherChangeSelect"
              change-on-select
              :organization.sync="adjustId"
              :show-all-levels="false"
              :class="{'cascader-valid-error': transferErrorMessage}"
              @change="changeAdjust" />
          </div>

          <div class="page-adjust--box-item spliter" />

          <div class="page-adjust--box-item">
            <m-cascader
              change-on-select
              init-change
              store-name="orgHigherChangeSelect"
              :organization.sync="acceptId"
              :class="{'cascader-valid-error': transferErrorMessage}"
              :show-all-levels="false"
              @change="changeAccept" />
          </div>
        </div>

        <div class="transfer-container">
          <el-transfer
            filterable
            ref="transfer"
            v-model="transferValues"
            :data="transferData"
            :class="{'transfer-valid-error': transferErrorMessage}"
            @change="changeTransfter" />
          <transition
            name="el-zoom-in-top">
            <span
              class="valid-error-message"
              v-if="transferErrorMessage">{{ transferErrorMessage }}</span>
          </transition>

          <div class="btn-hack">
            <el-button
              class="botton-right"
              plain
              :disabled="transferBtn1Disabled">
              <m-icon-next />
            </el-button>
            <el-button
              class="botton-left"
              plain
              :disabled="transferBtn2Disabled">
              <m-icon-next />
            </el-button>
          </div>
        </div>
      </m-section>
    </el-form>

    <div>
      <el-button
        type="primary"
        :loading="subLoading"
        @click="submit">提交生效</el-button>
      <el-button
        type="info"
        :loading="subLoading"
        @click="save">暂存</el-button>
      <el-button
        type="info"
        @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
  /**
   * @description 上级组织调整
   * @route '/adjust/higher/change/:id?'
   */

  export default {
    name: 'AdjustHigherChange',
    data() {
      return {
        breadcrumb: [
          { name: '组织管理' },
          { name: '组织调整', to: '/adjust' },
          { name: '上级组织变更' },
        ],
        isSubmit: false,
        loading: false,
        subLoading: false,
        // 是否修改，当route.params.id 有值，并且能查询到数据，才改为true
        isEdit: false,
        // 表单数据
        formData: {
          id: '',
          name: '',
          valid_date: '',
          reason: '',
          content: '',
        },
        // 表单验证规则
        formRules: {
          name: [
            { required: true, message: '请输入调整方案名称', trigger: 'blur' },
          ],
          valid_date: [
            { required: true, type: 'date', message: '请输入生效日期', trigger: 'blur' },
          ],
        },
        // 调整组织初始化
        initAdjust: true,
        // 调整组织id
        adjustId: '',
        // 被调整组织数据
        adjustData: {},
        // 被调整组织禁选项
        adjustDisabled: [],
        // 被调整组织下属一级组织列表转换成的穿梭框数据
        adjustTransferData: [],
        // 接受组织初始化
        initAccept: true,
        // 接受组织id
        acceptId: '',
        // 接受整组织数据
        acceptData: {},
        // 接受组织禁止选项
        acceptDisabled: [],
        // 接受组织下属一级组织列表转换成的穿梭框数据
        acceptTransferData: [],
        // 穿梭框数据
        transferData: [],
        // 穿梭框右侧选中值
        transferValues: [],
        // 穿梭框左侧选中更换值
        selectedValues: [],
        // 穿梭框验证错误消息
        transferErrorMessage: '',
        transferBtn1Disabled: true,
        transferBtn2Disabled: true,
      }
    },

    created() {
      if (this.$route.params.id) {
        if (!this.$route.params.status) {
          this.isSubmit = true
          this.$router.push({ path: '/adjust' })
        } else if (this.$route.params.status) {
          this.getData()
        }
      }
    },

    mounted() {
      this.transferBtn1Disabled =
        !this.$refs.transfer.rightChecked.length
      this.transferBtn2Disabled =
        !this.$refs.transfer.leftChecked.length

      this.$watch(
        '$refs.transfer.rightChecked.length',
        (newValue) => {
          this.transferBtn1Disabled = !newValue
        }
      )
      this.$watch(
        '$refs.transfer.leftChecked.length',
        (newValue) => {
          this.transferBtn2Disabled = !newValue
        }
      )
    },

    beforeRouteLeave(to, from, next) {
      if (this.isSubmit) {
        next()
      } else {
        next(false)
        setTimeout(() => {
          this.$confirm('系统可能不会保存您所做的更改，确认离开？', '提示', {
            type: 'warning',
          }).then(() => next()).catch(() => next(false))
        }, 0)
      }
    },

    methods: {
      // 获取详情数据
      getData() {
        this.loading = true
        this.$axios({
          url: this.$api.organization.adjustDetails,
          params: {
            id: this.$route.params.id,
          },
        }).then(({ data }) => {
          this.loading = false
          if (data.status === 0) this.isEdit = true
          this.setSubmitData(data)
        }).catch(() => {
          this.loading = false
        })
      },
      // 提交数据校验
      validate() {
        let result = true
        this.$refs.form.validate((valid) => {
          if (!valid) result = false
        })
        if (!this.adjustData.id) this.transferErrorMessage = '请选择需要变更的组织'
        if (!this.acceptData.id) this.transferErrorMessage = '请选择需要变更的组织'
        this.selectedValues = []
        this.transferValues.forEach((key) => {
          // 判断是否接受组织已存在数据
          if (this.acceptTransferData.filter(item => item.key === key).length === 0) {
            this.selectedValues.push(key)
          }
        })
        if (this.selectedValues.length === 0) this.transferErrorMessage = '请选择需要变更的组织'
        if (this.transferErrorMessage) result = false
        return result
      },
      /*
       * 获取详细数据，页面绑定赋值
       * @params {Object} 后台回去数据
       */
      setSubmitData(data) {
        this.formData.id = data.id
        this.formData.name = data.name
        this.formData.valid_date = new Date(data.valid_date)
        this.formData.reason = data.reason
        this.formData.content = data.content
        this.adjustId = data.operation.from.pid
        this.acceptId = data.operation.to.pid
        this.transferValues = [...this.transferValues, data.operation.from.org_ids]
      },
      // 获取提交数据
      getSubmitData() {
        const adjustObj = {
          from: {
            pid: this.adjustData.id,
            org_ids: this.selectedValues.join(','),
          },
          to: {
            pid: this.acceptData.id,
          },
        }
        this.formData.name = this.formData.name.trim()
        const data = Object.assign({}, this.formData, {
          type: '100001',
          status: 0,
          operation: JSON.stringify(adjustObj),
        })
        data.valid_date = window.Lib.utils.default.tools.formatDate(data.valid_date)
        return data
      },
      // 保存
      save() {
        if (this.subLoading) return
        if (!this.validate()) return
        this.subLoading = true
        this.$axios({
          url: this.isEdit ? this.$api.organization.adjustEdit : this.$api.organization.adjustAdd,
          data: this.getSubmitData(),
          method: 'post',
        }).then((data) => {
          this.isSubmit = true
          this.subLoading = false
          if (!this.isEdit) {
            this.isEdit = true
            this.formData.id = data.data.id || this.formData.id
            this.$router.replace({ params: { id: this.formData.id, status: '0' } })
          }
          this.$message({
            message: '上级组织调整方案已保存成功',
            type: 'success',
          })
        }).catch(() => {
          this.subLoading = false
        })
      },
      // 提交生效
      submit() {
        if (this.subLoading) return
        if (!this.validate()) return
        this.$confirm('是否确认提交生效？', '提示', {
          type: 'warning',
        }).then(() => {
          this.subLoading = true
          const submitData = this.getSubmitData()
          submitData.status = 30
          this.$axios({
            url: this.isEdit ? this.$api.organization.adjustEdit : this.$api.organization.adjustAdd,
            data: submitData,
            method: 'post',
          }).then(() => {
            this.isSubmit = true
            this.subLoading = false
            this.$router.push({
              path: '/adjust',
            })
          }).catch(() => {
            this.subLoading = false
          })
        }).catch(() => {})
      },
      // 修改左边接受组织
      changeAdjust(e) {
        if (!e || e.length === 0) return
        this.transferErrorMessage = ''
        const last = e[e.length - 1]
        this.adjustData = last
        this.acceptDisabled = [last.id]
        if (this.adjustData.children && this.adjustData.children.length) {
          const ids = []
          this.adjustTransferData = this.adjustData.children.map((item) => {
            ids.push(item.key || item.id)
            return {
              key: item.key || item.id,
              label: item.name,
            }
          })
          this.transferData = this.adjustTransferData.concat(this.acceptTransferData)
        } else {
          this.adjustTransferData = []
          this.transferData = this.acceptTransferData
        }
        if (!this.initAdjust) {
          this.transferValues = this.acceptTransferData.map(item => item.key)
        }
      },
      // 穿梭框变更回调
      changeTransfter() {
        this.transferErrorMessage = ''
      },
      // 修改右边接受组织
      changeAccept(e) {
        if (!e || e.length === 0) return
        this.transferErrorMessage = ''
        const last = e[e.length - 1]
        this.acceptData = last
        this.adjustDisabled = [last.id]
        const ids = []
        if (this.acceptData.children && this.acceptData.children.length) {
          this.acceptTransferData = this.acceptData.children.map((item) => {
            const key = `accept_${item.key || item.id}`
            ids.push(key)
            return {
              key,
              label: item.name,
              disabled: true,
            }
          })
          this.transferData = this.adjustTransferData.concat(this.acceptTransferData)
        } else {
          this.acceptTransferData = []
          this.transferData = this.adjustTransferData
        }
        // 初始化回调，穿梭框value数组拼接处理
        if (this.initAccept) {
          this.transferValues = [...this.transferValues, ...ids]
        } else if (this.acceptData.children && this.acceptData.children.length) {
          this.transferValues = ids
        } else {
          this.transferValues = []
        }
        this.initAccept = false
      },
      // 取消，调回组织调整首页
      cancel() {
        this.$router.push({
          path: '/adjust',
        })
      },
    },
  }
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  .page-adjust-higher-change {
    .transfer-valid-error {
      .el-transfer-panel {
        border: 1px solid #ff4949 !important;
      }
    }

    .cascader-valid-error {
      .el-input__inner {
        border: 1px solid #ff4949 !important;
      }
    }
  }
</style>
