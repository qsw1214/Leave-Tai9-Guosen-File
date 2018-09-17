<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="page page-adjust page-adjust-merge">

    <m-breadcrumb :items="breadcrumb" />

    <div class="content">
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
                label="合并方案名称"
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
                  type="date"
                  placeholder="选择日期"
                  v-model="formData.valid_date" />
              </el-form-item>
            </m-section-row>

            <el-form-item
              label="合并原因">

              <el-input
                type="textarea"
                :maxlength="200"
                :autosize="{ minRows: 4 }"
                v-model="formData.reason" />
            </el-form-item>

            <el-form-item
              label="合并内容">

              <el-input
                type="textarea"
                :maxlength="200"
                :autosize="{ minRows: 4 }"
                v-model="formData.content" />
            </el-form-item>

          </div>
        </m-section>

        <!-- 组织选择 编辑状态 -->
        <template>
          <m-section
            is-form
            v-for="(item, index) in mergeList"
            :class="{ 'valid-error': item.errorMessage }"
            :key="item.renderKey">

            <div
              class="dividing-container"
              v-if="index === 0">*说明：选择被合并组织（可多选），再选择或新建接收组织。</div>

            <merge-panel
              :merge-ids="mergeIds"
              :accept-ids="acceptIds"
              :data="item.initData"
              :render-key="item.renderKey"
              @change="changeMergeItem"
              @jump="jump" />

            <el-button
              class="remove-button error"
              type="text"
              icon="el-icon-delete"
              v-if="mergeLength > 1"
              @click="removeMergeItem(index)" />

            <transition name="el-zoom-in-top">
              <span
                class="valid-error-message"
                v-if="item.errorMessage">{{ item.errorMessage }}</span>
            </transition>
          </m-section>

          <el-button
            class="add-button"
            type="text"
            icon="el-icon-plus"
            @click="addMergeItem">
            新建组织合并
          </el-button>
        </template>

      </el-form>
    </div>

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
   * @description 组织合并
   * @route '/adjust/merge'
   */
  import MergePanel from './MergePanel'

  export default {
    name: 'AdjustMerge',
    components: {
      MergePanel,
    },
    data() {
      return {
        breadcrumb: [
          { name: '组织管理' },
          { name: '组织调整', to: '/adjust' },
          { name: '组织合并' },
        ],
        isToCreated: false,
        isSubmit: false,
        loading: false,
        subLoading: false,
        isEdit: false,
        // 表单数据
        formData: {
          id: '',
          name: '',
          valid_date: '',
          reason: '',
          content: '',
        },
        // 被合并组织所选择的组织id
        mergeIds: [],
        // 接收组织所选择的组织id
        acceptIds: [],
        // 选择合并组织列表
        mergeList: [
          {
            merge: [],
            accept: '',
            // 初始数据，用于编辑状态赋值
            initData: null,
            errorMessage: '',
            renderKey: Date.now(),
          },
        ],
        // 表达验证规则
        formRules: {
          name: [
            { required: true, message: '请输入合并方案名称', trigger: 'blur' },
          ],
          valid_date: [
            { required: true, type: 'date', message: '请输入生效日期', trigger: 'blur' },
          ],
        },
      }
    },
    computed: {
      mergeLength() {
        return this.mergeList.filter(item => item !== null).length
      },
    },
    created() {
      if (this.$route.params.id) {
        if (!this.$route.params.status) {
          this.isSubmit = true
          this.$router.push({ path: '/adjust' })
        } else if (this.$route.params.status === '0') {
          this.getData()
        }
      }
    },
    beforeRouteLeave(to, from, next) {
      if (this.isSubmit || this.isToCreated) {
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
      // 获取数据
      getData() {
        this.loading = true
        this.$axios({
          url: this.$api.organization.adjustDetails,
          params: {
            id: this.$route.params.id,
          },
        }).then((data) => {
          this.loading = false
          this.isEdit = true
          this.setSubmitData(data.data)
        }).catch(() => {
          this.loading = false
        })
      },
      /*
      * 提交数据校验
      * @params isSubmit {Boolean} 是否提交生效
      */
      validate(isSubmit) {
        let result = true
        this.$refs.form.validate((valid) => {
          if (!valid) result = false
        })
        const mergeList = []
        this.mergeList.forEach((item) => {
          if (!item) return
          const mergeLength = item.merge.filter(k => k !== '').length
          if (isSubmit) {
            if (mergeLength === 0 && !item.accept) {
              item.errorMessage = '请选择被合并和接收组织'
            } else {
              if (mergeLength === 0) {
                item.errorMessage = '请选择被合并组织'
                result = false
              }
              if (!item.accept) {
                item.errorMessage = '请选择接收组织'
                result = false
              }
            }
          } else {
            item.errorMessage = ''
          }
          mergeList.push(item)
        })
        this.mergeList = mergeList
        return result
      },
      // 获取提交数据
      getSubmitData() {
        const operation = []
        this.mergeList.forEach((item) => {
          if (!item) return
          operation.push({
            from: {
              org_ids: item.merge.filter(id => id !== '').join(','),
            },
            to: {
              pid: item.accept,
            },
          })
        })
        const data = Object.assign({}, this.formData, {
          operation: JSON.stringify(operation),
          type: '100002',
          status: 0,
        })
        data.valid_date = window.Lib.utils.default.tools.formatDate(data.valid_date)
        return data
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
        this.mergeList = []
        data.operation.forEach((item, index) => {
          this.mergeList.push({
            renderKey: Date.now() + index,
            merge: item.from.org_ids.split(','),
            accept: item.to.pid,
            initData: {
              merge: item.from.org_ids.split(','),
              accept: item.to.pid,
            },
            errorMessage: '',
          })
        })
        this.updateIds()
      },
      /*
      * 保存
      * @params callback {Function} 回调函数
      */
      save(callback) {
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
          this.$message({
            message: '组织合并方案已保存成功',
            type: 'success',
          })
          this.isEdit = true
          this.formData.id = data.data.id || this.formData.id
          this.$router.replace({ params: { id: this.formData.id, status: '0' } })
          if (typeof callback === 'function') setTimeout(() => { callback() })
        }).catch(() => {
          this.subLoading = false
        })
      },
      // 提交生效
      submit() {
        if (this.subLoading) return
        if (!this.validate(true)) return
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
            this.subLoading = false
            this.isSubmit = true
            this.$router.push({
              path: '/adjust',
            })
          }).catch(() => {
            this.subLoading = false
          })
        }).catch(() => {
        })
      },
      // 移除合并项目
      removeMergeItem(index) {
        this.mergeList.splice(index, 1)
        this.updateIds()
      },
      // 添加合并项目
      addMergeItem() {
        this.mergeList.push({
          renderKey: Date.now(),
          merge: [],
          accept: '',
          errorMessage: '',
        })
      },
      // 更新被合并和接收组织id数组集合
      updateIds() {
        const newAcceptIds = []
        const newMergeIds = []
        this.mergeList.forEach((item) => {
          newAcceptIds.push(item.accept)
          item.merge.forEach((id) => {
            if (id) {
              newMergeIds.push(id)
            }
          })
        })
        this.mergeIds = newMergeIds
        this.acceptIds = newAcceptIds
      },
      // 被合并选项修改回调
      changeMergeItem(item) {
        const mergeItem = this.mergeList
          .find(_ => _.renderKey === item.renderKey)
        mergeItem.merge = item.merge
        mergeItem.accept = item.accept
        mergeItem.errorMessage = ''
        this.updateIds()
      },
      // 取消，调回组织调整首页
      cancel() {
        this.$router.push({
          path: '/adjust',
        })
      },
      toCreateDep(redirect) {
        this.isToCreated = true
        this.$router.push(`/department?redirect=${encodeURIComponent(redirect)}`)
      },
      // 去往新建组织页面
      jump() {
        // 验证页面是否包含数据
        const values = Object.values(this.formData)
        let isHaveData = false
        if (values.filter(item => item).length > 0) {
          isHaveData = true
        }
        if (!isHaveData) {
          this.mergeList.forEach((item) => {
            if (!item) return
            const mergeLength = item.merge.filter(k => k !== '').length
            if (mergeLength > 0 || item.accept) isHaveData = true
          })
        }
        if (isHaveData) {
          this.$confirm('是否保存当前页面数据？', '提示', {
            type: 'warning',
          })
            .then(() => {
              this.save(() => {
                const redirect = encodeURIComponent(window.location.href)
                this.toCreateDep(redirect)
              })
            }).catch(() => {
              this.toCreateDep(window.location.href)
            })
        } else {
          this.toCreateDep(window.location.href)
        }
      },
    },
  }
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  .page-adjust-merge {
    .dividing-container ~ .remove-button {
      top: 44px;
    }

    .valid-error-message {
      top: unset;
      bottom: 6px;
    }

    .m-section.valid-error {
      .el-input__inner {
        border: 1px solid #ff4949 !important;
      }
    }
  }
</style>
