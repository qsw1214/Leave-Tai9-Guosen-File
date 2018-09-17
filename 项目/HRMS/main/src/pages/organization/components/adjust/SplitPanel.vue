<template>
  <div
    v-loading="loading"
    class="organization-adjust--panel">

    <div class="organization-adjust--panel-box">
      <div class="page-adjust--box">
        <div class="page-adjust--box-item">
          <div class="page-adjust--box-label">被拆分组织</div>
          <m-cascader
            init-change
            change-on-select
            :value-disabled="disabledSource"
            :organization.sync="sourceSync"
            :input-options="[sourceOptions]"
            :width="260"
            :disabled="disabled"
            :show-all-levels="false"
            @change="selectSource"
            @selectCompleted="selectSourceComplete" />
        </div>

        <div class="page-adjust--box-item spliter">
          <m-icon-next />
        </div>

        <div class="page-adjust--box-item">
          <div
            style="padding-left: 0;"
            class="page-adjust--box-label">拆分后组织</div>
          <m-cascader
            change-on-select
            init-change
            :organization.sync="receiveSync"
            :width="260"
            :disabled="disabled"
            :input-options="[receiveOptions]"
            :show-all-levels="false"
            @change="selectReceive"
            @selectCompleted="selectReceiveComplete" />
        </div>
      </div>

      <el-button
        class="new-organization"
        plain
        @click="jump">新建组织？</el-button>
    </div>

    <div
      class="page-adjust--box receive-panel"
      v-show="receivePanels.length">

      <div class="page-adjust--box-item" />
      <div class="page-adjust--box-item spliter" />

      <div class="page-adjust--box-item">
        <ul class="receive-panel--list">
          <li
            class="receive-panel--item"
            v-for="(panel, index) in receivePanels"
            :key="index"
            :class="{
              'is-active': activedReceivePanel === index,
            }"
            @click="switchReceivePanel(panel.id, index)">
            {{ panel.label }}
          </li>
        </ul>
      </div>
    </div>

    <el-button
      class="remove-button error"
      type="text"
      icon="el-icon-delete"
      v-show="panels.length > 1"
      @click="deletePanel" />

    <div class="transfer-container">
      <el-transfer
        filterable
        ref="transfer"
        :class="{
          'is-active': (typeof activedReceivePanel === 'number'),
          'is-disabled': disabled,
        }"
        v-model="receiveList[activedReceivePanel]"
        :props="{
          key: 'id',
          label: 'name',
        }"
        :titles="transferTitle"
        :data="sourceList[activedReceivePanel || 0]"
        @change="transfer" />

      <div
        class="btn-hack">
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
  </div>
</template>

<script>
  const deepCopy = data => JSON.parse(JSON.stringify(data))

  export default {
    name: 'SplitPanel',
    props: {
      index: {
        type: Number,
        default: 0,
      },
      date: {
        type: String,
        default: '',
      },
      disabled: {
        type: Boolean,
        default: false,
      },

      panels: {
        type: Array,
        default: () => ([]),
      },

      // { receiveList }
      panel: {
        type: Object,
        required: true,
      },

      // 组织列表原始数据
      original: {
        type: Object,
        required: true,
      },

      // 被拆分组织原始数据
      source: {
        type: Object,
        required: true,
      },

      disabledSource: {
        type: Array,
        required: true,
      },

      disabledLevel: {
        type: Array,
        required: true,
      },

      jump: {
        type: Function,
        required: true,
      },
    },

    data() {
      const { source, original, disabledSource, index, panel } = this

      return {
        transferTitle: ['成员列表', '接收列表'],

        // 初始状态
        initSourceInput: disabledSource[index],
        sourceSync: disabledSource[index],
        // 被拆分组织选项列表
        sourceOptions: source,
        originalSourceList: [],
        // 被拆分成员列表
        sourceList: [],
        selectSourceChanged: false,

        initReceiveInput: panel.from.pid,
        // 接收组织选项列表
        receiveOptions: deepCopy(original),
        // 接收组织列表
        receiveList: [],
        // 接收组织 Tab 列表
        receivePanels: [],
        // 临时同步接收组织选项
        receiveSync: '',
        // 本次操作选中的接收组织
        currentReceive: null,
        // 当前的选中的接收组织
        activedReceivePanel: null,

        loading: false,
        transferBtn1Disabled: true,
        transferBtn2Disabled: true,
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

    methods: {
      // 删除拆分面板
      deletePanel() {
        this.$emit('deletePanel', this.index)
      },

      /**
       * 针对被拆分组织。判断选中的组织是否有子部门（不含本身）在禁用列表中
       * @return Boolean
       */
      hasChildren(organiazation) {
        // level: 各个 panel 选中组织的层级
        const { disabledLevel, index } = this
        let flag = false

        disabledLevel.forEach((item, i) => {
          const parent = item.join(',')
          const children = organiazation.join(',')

          if (i !== index && parent.includes(children)) {
            flag = true
            return true
          }

          return false
        })

        return flag
      },

      // 被拆分组织：更新选中列表
      selectSource(organizations) {
        console.log('select-source changed: ', organizations, this.index)

        if (!organizations.length) return

        const { index } = this
        let { id } = organizations[organizations.length - 1]
        let organization = []

        this.selectSourceChanged = organizations

        organizations.forEach((item) => {
          organization.push(item.id)
        })

        // 已有子组织正在拆分，不能拆分该父组织
        const children = this.hasChildren(organization)
        if (organization.length < 2 || children) {
          id = ''
          organization = []
        }

        this.$emit('updateDisabled', { index, organization, id })

        if (this.initSourceInput) {
          this.initSourceInput = false
          if (organization.length > 1) this.selectSourceComplete({ status: 0 })
        }
      },

      // 选择被拆分组织后数据处理
      selectSourceComplete({ status }) {
        console.warn('select-source complete !!!')

        const { index, disabledSource, selectSourceChanged } = this
        const id = disabledSource[index]
        let message = '操作失败！该组织有子组织正在被拆分'

        // 数据没变化，return
        if (!selectSourceChanged) return undefined

        // 只有一级（即顶级组织）不能被拆分，return
        if (selectSourceChanged.length < 2) message = '操作失败！顶级组织不能被拆分'

        // 重置数据变化标识
        this.selectSourceChanged = false

        if (!id) {
          this.$message({
            message,
            type: 'error',
          })

          this.sourceList = []
          this.originalSourceList = []
          return undefined
        }

        return this.fetchSourceList({ status })
      },

      // 获取被拆分成员列表
      fetchSourceList({ status }) {
        console.info('fetch-source-list, status is ', status)
        const { index, date } = this
        const id = this.disabledSource[index]

        if (this.loading) return undefined
        this.loading = true

        const params = { id }
        if (date) params.valid_date = date

        return this.$axios
          .get(this.$api.common.organizationAndEmployee, { params })
          .then((res) => {
            this.initSource({ status, list: res.data.list })
          })
          .catch(() => {})
          .then(() => {
            this.loading = false
          })
      },

      // 初始化被拆分成员
      initSource({ status, list }) {
        console.info('init-source: ', this.index)

        this.originalSourceList = list.map((item) => {
          item.disabled = (typeof this.activedReceivePanel !== 'number')
          return item
        })

        // if (status !== 0) {
        this.sourceList[0] = deepCopy(this.originalSourceList)
        // }

        setTimeout(() => {
          this.initReceive({ status })
        }, 0)
      },

      /**
       * 初始化接收 panel 相关数据
       * @param status {Number} 是否初始化传入的接收组织数据，0 已有数据
       */
      initReceive({ status }) {
        if (status === 0) {
          const { to } = this.panel

          to.forEach((item, i) => {
            setTimeout(() => {
              this.receiveSync = item.pid
              this.initReceiveInput = i + 1
            }, 0)
          })

          return
        }

        this.receivePanels = []
        this.receiveList = []
        this.receiveSync = []
        this.receiveOptions = deepCopy(this.original)
        this.activedReceivePanel = null
      },

      // 选择接收组织，未完成，仅数据变动
      selectReceive(organization) {
        console.log('select-receive changed: ', organization)
        const { initReceiveInput, panel } = this
        const len = organization.length
        const receive = organization[len - 1]

        if (len > 1) this.currentReceive = receive
        if (initReceiveInput && len) {
          this.selectReceiveComplete()
          if (initReceiveInput === panel.to.length) this.initReceiveInput = false
        }
      },

      // 选择接收组织完成
      selectReceiveComplete() {
        console.warn('select-receive complete !!!')
        const { currentReceive, initReceiveInput, panel } = this

        if (!currentReceive) {
          this.receiveSync = []
          return undefined
        }

        const { id, label } = currentReceive
        const index = this.receivePanels.length
        let receiveList = []
        let isInPanel = false

        this.receivePanels.some((item) => {
          if (item.id === id) {
            isInPanel = true
            return true
          }

          return false
        })

        // 该组织已被选中，不错操作
        if (isInPanel) return false

        if (initReceiveInput) {
          const { to } = panel
          if (to[index]) {
            const uids = to[index].uids.split(',')
            const orgs = to[index].org_ids.split(',')
            receiveList = uids.concat(orgs).filter(it => it)
          }
        }

        this.$set(this.receivePanels, index, { id, label })
        this.$set(this.receiveList, index, receiveList)
        this.$set(this.sourceList, index, deepCopy(this.originalSourceList))
        this.currentReceive = null
        this.receiveSync = []

        // 自动切换到该组织
        return this.switchReceivePanel(id, index)
      },

      switchReceivePanel(id, index) {
        const { sourceList, originalSourceList, activedReceivePanel } = this
        const hasPanel = typeof activedReceivePanel === 'number'

        if (!hasPanel) {
          // 第一个接收组织选中后，重置被拆分组织的成员列表 disabled 状态
          this.originalSourceList = originalSourceList.map((item) => {
            item.disabled = false
            return item
          })

          this.$set(sourceList, index, deepCopy(this.originalSourceList))
        }

        this.handleSourceList(index)
        this.activedReceivePanel = index
      },

      // 处理成员列表 disabled 状态 => 每个接收组织对应的拆分列表
      handleSourceList(index) {
        const { receiveList, sourceList } = this
        const receive = receiveList[index]
        const source = sourceList[index]
        const receiveListString = receiveList.map(item => item.join(',')).join(',')

        // 更新源接收组织数据
        this.originalSourceList.forEach((item, i) => {
          item.disabled = receiveListString.includes(item.id)
          this.$set(this.originalSourceList, i, item)
          return false
        })

        // 更新接收列表数据 disabled 状态
        this.originalSourceList.forEach((item, i) => {
          if (receive.includes(item.id)) return false
          this.$set(source[i], 'disabled', item.disabled)
          return false
        })
      },

      transfer(items) {
        console.log('transfer: ', items)

        const {
          originalSourceList,
          activedReceivePanel,
          sourceList,
          receiveList,
        } = this

        // 处理被拆分列表 disabled 状态
        sourceList.forEach((list, i) => {
          if (i === activedReceivePanel) return false

          list.forEach((item, j) => {
            item.disabled = items.includes(item.id)
            this.$set(list, j, item)
          })

          return false
        })

        const receiveListString = receiveList.map(item => item.join(',')).join(',')

        // 处理原始拆分组织集合的 disabled 状态
        originalSourceList.forEach((item, i) => {
          item.disabled = receiveListString.includes(item.id)
          this.$set(originalSourceList, i, item)
        })

        this.receiveHandler()
      },

      // 接收列表数据处理
      receiveHandler() {
        const newReceiveList = []
        const { sourceList, receivePanels, receiveList, index } = this

        receiveList.forEach((receive, i) => {
          newReceiveList[i] = []
          const source = sourceList[i]

          source.forEach((item) => {
            const { id, type } = item
            const j = receive.indexOf(id)

            if (j > -1) {
              newReceiveList[i][j] = { type, id }
            }
          })
        })

        this.$emit('receiveHandler', { index, receivePanels, list: newReceiveList })
      },
    },
  }
</script>
