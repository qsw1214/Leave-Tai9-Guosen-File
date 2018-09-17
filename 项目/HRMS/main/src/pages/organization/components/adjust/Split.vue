<template>
  <div
    v-loading.fullscreen.lock="loading || fetchingOrganization"
    class="page page-adjust page-adjust--transfer">

    <m-breadcrumb :items="breadcrumb" />

    <m-section is-form>
      <el-form
        class="m-section--form"
        label-width="140px"
        label-position="left"
        ref="form"
        :model="formData"
        :rules="formRules">

        <m-section-row>
          <el-form-item
            label="拆分方案名称"
            prop="name">
            <el-input
              placeholder="方案名称"
              :maxlength="50"
              v-model="formData.name" />
          </el-form-item>

          <el-form-item
            label="生效日期"
            prop="date">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              v-model="formData.date" />
          </el-form-item>
        </m-section-row>

        <el-form-item
          label="拆分原因">
          <el-input
            type="textarea"
            :maxlength="200"
            :autosize="{ minRows: 4 }"
            v-model="formData.reason" />
        </el-form-item>

        <el-form-item
          label="拆分内容">
          <el-input
            type="textarea"
            :maxlength="200"
            :autosize="{ minRows: 4 }"
            v-model="formData.content" />
        </el-form-item>
      </el-form>
    </m-section>

    <m-section
      v-loading="fetchingOrganization"
      v-for="(panel, index) in panels"
      :key="index">
      <div
        class="dividing-container"
        v-if="original && index === 0">
        * 说明：选择被拆分组织（可多选），再新建拆分后组织。
      </div>

      <split-panel
        v-if="panels && original && panel"
        :key="index"
        :index="index"
        :data-index="index"
        :date="valid_date"
        :original="original"
        :source="source"
        :disabled-source="disabledSource"
        :disabled-level="disabledLevel"
        :jump="jump"
        :panels="panels"
        :panel="panel"
        @updateDisabled="updateDisabled"
        @deletePanel="deletePanel"
        @receiveHandler="receiveHandler" />
    </m-section>

    <el-button
      class="add-button"
      type="text"
      icon="el-icon-plus"
      v-if="original"
      @click="newPanel">
      新建组织拆分
    </el-button>

    <div
      v-if="original">
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
        @click="$router.go(-1)">取消</el-button>
    </div>
  </div>

</template>

<script>
  /**
   * @description 组织拆分
   * @route '/adjust/split'
   */

  import SplitPanel from './SplitPanel'

  const deepCopy = data => JSON.parse(JSON.stringify(data))

  export default {
    name: 'OrganizationSplit',
    components: { SplitPanel },

    data() {
      // 默认组织拆分面板数据
      const defaultPanel = {
        from: {},
        to: [],
      }

      const { id, status } = this.$route.params
      const formData = { name: '', date: '', reason: '', content: '' }

      return {
        breadcrumb: [
          { name: '组织管理' },
          { name: '组织调整', to: '/adjust' },
          { name: '组织拆分' },
        ],
        formData,
        formRules: {
          name: [
            { required: true, message: '请输入拆分方案名称', trigger: 'blur' },
          ],
          date: [
            { required: true, message: '请输入生效日期', trigger: 'blur', type: 'date' },
          ],
        },

        // 标记获取组织层级状态
        fetchingOrganization: false,
        // 原始组织数据
        original: null,
        // 被拆分组织数据，匹配对应多个接收数组 {Array}
        source: null,
        // 被拆分组织已选中列表
        disabledSource: [],
        // 被拆分组织已选中列表对应层级
        disabledLevel: [],

        defaultPanel,
        // 拆分面板
        panels: null,

        // 方案 id
        id,
        // 方案状态
        status,
        loading: false,
        subLoading: false,

        // 是否已保存状态
        saved: false,
        // 是否前往新建组织页面
        isToCreated: false,
      }
    },

    computed: {
      valid_date() {
        let { date } = this.formData

        if (date) {
          date = (new Date(date)).getTime()
          date = this.$utils.tools.formatDate(date)
        }
        return date
      },
    },

    watch: {
      /* eslint func-names: ["error", "never"] */
      /* eslint object-shorthand: 0 */
      'formData.date'(newValue, oldValue) {
        console.warn(`date changed, new value: ${newValue}, old value: ${oldValue}`)
        // 日期变动且没有选择组织时，重置 transfer 组数据
        if (oldValue && !this.disabledSource.length) {
          this.panels = []
          this.fetchOrganization()
        }
      },
    },

    mounted() {
      const { id } = this
      if (id) this.fetch(id)
    },

    methods: {
      // 获取详情数据
      fetch(id) {
        this.loading = true

        this.$axios
          .get(this.$api.organization.adjustDetails, {
            params: { id },
          })
          .then((res) => {
            const { data } = res

            Object.assign(this.formData, {
              content: data.content,
              name: data.name,
              reason: data.reason,
              date: new Date(data.valid_date),
            })
            this.status = data.status
            if (data.operation.length > 0) {
              this.fetchOrganization(data.operation)
            }
          })
          .catch(() => {})
          .then(() => {
            this.loading = false
          })
      },

      // fetch 组织列表
      // 此处没有采取组件内缓存方式，由页面单独获取组织层级数据填充
      fetchOrganization(operation) {
        this.fetchingOrganization = true
        this.$axios.post(this.$api.common.organizationLevel, {
          valid_date: this.valid_date,
        })
          .then((res) => {
            const { data } = res

            this.$set(this, 'original', deepCopy(data))
            this.$set(this, 'source', deepCopy(data))
            this.$set(this, 'disabledSource', [])
            this.$set(this, 'disabledLevel', [])

            if (operation) this.operationHandler(operation)
            else this.panels = [deepCopy(this.defaultPanel)]
          })
          .catch(() => {})
          .then(() => {
            this.fetchingOrganization = false
          })
      },

      newPanel() {
        this.panels.push(deepCopy(this.defaultPanel))
        this.saved = false
      },

      // 处理服务器返回的 operation 数据
      operationHandler(operation) {
        console.log('handle operation data: ', operation)
        const panels = []
        const disabled = []

        operation.forEach((item, i) => {
          disabled[i] = item.from.pid
          if (!item.to) item.to = []
          panels[i] = item
        })
        this.disabledSource = disabled
        this.panels = panels
      },

      // 提交数据校验
      validate() {
        let flag = true
        this.$refs.form.validate((valid) => {
          if (!valid) {
            window.scrollTo(0, 30)
            flag = false
          }
        })

        return flag
      },

      // 处理接收组织列表数据
      receiveHandler({ index, receivePanels, list }) {
        const { to, from } = this.panels[index]
        const { disabledSource } = this

        from.pid = disabledSource[index]
        receivePanels.forEach((receivePanel, i) => {
          const item = list[i]
          const uids = item.filter(it => it.type === 'user')
          const orgIds = item.filter(it => it.type === 'org')

          to[i] = {
            pid: receivePanel.id,
            uids: uids.map(it => it.id).join(','),
            org_ids: orgIds.map(it => it.id).join(','),
          }
        })

        this.panels[index] = { from, to }
        this.saved = false
      },

      // 处理提交数据
      dataHanlder(status) {
        const { valid_date, formData, panels, id } = this
        const { name, reason, content } = formData
        const operation = []

        panels.forEach((item) => {
          if (item) {
            if (!item.from.pid) item.from.pid = ''
            operation.push(item)
          }
        })

        const res = {
          valid_date,
          name,
          reason,
          content,
          type: 100003,
          status,
          operation: JSON.stringify(operation),
        }

        if (id) res.id = id
        return res
      },

      // 验证拆分数据
      validData() {
        const { panels } = this
        let flag = true
        let message = ''

        panels.some((panel, i) => {
          if (!panel) return false

          const { from, to } = panel

          if (!from.pid) {
            message = '请选择被拆分组织'
            flag = false
          } else if (!to.length || !to[0].pid) {
            message = '被拆分组织未进行任何拆分操作，请确认后再提交'
            flag = false
          }

          if (!flag) {
            window.scrollTo(
              0,
              document.querySelector(`[data-index="${i}"]`).offsetTop - 20
            )
            return true
          }

          return false
        })

        if (message) {
          this.$message({
            message,
            type: 'error',
          })
        }

        return flag
      },

      /*
      * 保存
      * @params callback {Function} 回调函数
      */
      save(callback) {
        const url = this.id ? this.$api.organization.adjustEdit : this.$api.organization.adjustAdd

        if (!this.validate()) return
        if (this.subLoading) return

        this.subLoading = true
        this.$axios
          .post(url, {
            ...this.dataHanlder(0),
          })
          .then((res) => {
            const { id } = res.data

            if (id) {
              this.id = id
              this.$router.replace({ params: { id } })
            }

            this.$message({
              message: '组织拆分方案已保存成功',
              type: 'success',
            })

            this.saved = true
            if (typeof callback === 'function') setTimeout(() => { callback(res) }, 0)
          })
          .catch(() => {})
          .then(() => {
            this.subLoading = false
          })
      },

      // 提交生效
      submit() {
        if (!this.validate() || !this.validData()) return

        const url = this.id ? this.$api.organization.adjustEdit : this.$api.organization.adjustAdd

        this.$confirm('确定要提交该拆分方案吗？', '提示', { type: 'warning' })
          .then(() => {
            if (this.subLoading) return

            this.subLoading = true
            this.$axios
              .post(url, {
                ...this.dataHanlder(30),
              })
              .then(() => {
                this.status = 30
                setTimeout(() => {
                  this.$router.replace({ path: '/adjust' })
                }, 0)
              })
              .catch(() => {})
              .then(() => {
                this.subLoading = false
              })
          })
      },

      // 取消，返回组织调整首页
      cancel(next) {
        next(false)
        setTimeout(() => {
          this.$confirm('系统可能不会保存您所做的更改，确认离开？', '提示', {
            type: 'warning',
          })
            .then(() => {
              if (typeof next === 'function') next()
            })
            .catch(() => {
              if (typeof next === 'function') next(false)
            })
        })
      },

      // 更新被拆分组织选中列表
      updateDisabled({ index, id, organization }) {
        const { disabledSource, disabledLevel } = this
        const { from } = this.panels[index]

        from.pid = id
        this.$set(disabledSource, index, id)
        this.$set(disabledLevel, index, organization)
        this.saved = false
      },

      deletePanel(index) {
        const { disabledSource, disabledLevel } = this

        disabledSource.splice(index, 1, '')
        disabledLevel.splice(index, 1, [])
        this.panels.splice(index, 1, null)
        this.saved = false
      },

      toCreateDep(redirect) {
        this.isToCreated = true
        this.$router.push(`/department?redirect=${encodeURIComponent(redirect)}`)
      },

      jump() {
        // 验证页面是否包含数据
        const paramsValue = Object.values(this.dataHanlder(0))
        let isHaveData = false

        if (paramsValue.filter(item => item).length > 0) isHaveData = true

        if (isHaveData) {
          this.$confirm('是否保存当前页面数据？', '提示', {
            type: 'warning',
          })
            .then(() => {
              this.save(() => {
                const redirect = window.location.href
                this.toCreateDep(encodeURIComponent(redirect))
              })
            }).catch(() => {
              this.toCreateDep(window.location.href)
            })
        } else {
          this.panels.forEach((item) => {
            if (item.from.id || item.to.length > 0) isHaveData = true
          })

          this.toCreateDep(window.location.href)
        }
      },
    },

    beforeRouteLeave(to, from, next) {
      // 跳转到新建组织时，保存当前数据
      if (this.isToCreated) {
        next()
      } else if (this.loading || !this.saved) {
        this.cancel(next)
      } else {
        next()
      }
    },

    beforeRouteEnter: (to, from, next) => {
      next((vm) => {
        const { status, id } = vm
        if ((!status || status < '30') && !id) vm.fetchOrganization()
      })
    },
  }
</script>
