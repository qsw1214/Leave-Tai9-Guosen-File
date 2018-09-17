<template>
  <div
    class="m-org-select m-cascader-select"
    :class="{ glass: glass, isLoading: isLoading }">
    <el-cascader
      ref="cascader"
      :style="{ width: width + 'px' }"
      :options="options"
      v-model="choose"
      :props="props"
      :popper-class="popperClass"
      :placeholder="placeholder"
      :disabled="disabled"
      :clearable="clearable"
      :expand-trigger="expandTrigger"
      :show-all-levels="showAllLevels"
      :filterable="filterable"
      :debounce="debounce"
      :change-on-select="changeOnSelect"
      :size="size"
      @change="change"
      @active-item-change="activeItemChange" />
  </div>
</template>

<script>
  /**
   * @description 公司组织结构级联选择器
   * @prop width {Number} select宽度
   * @prop glass {Boolean} 是否带放大镜小图标的样式
   * @prop inputOptions {Array} 选项数据 如果传入则不会主动去 fetch 数据
   * @prop storeName {String} 存储vuex的名字
   * @prop cached {Boolean} 选择器移除后是否不删除缓存数据，默认false
   * @prop organization {Array || String} sync，传入的话必须sync，当前选中的组织，数组列表或最后选择ID，传递什么类型回传什么类型
   * @prop valueDisabled {Array} watch，需要disabled的ID数组
   * @prop remote {String} watch，远程数据源path（如果你希望获取其它数据，如带查询参数的path等）
   * @prop parentId {String} watch，查询的父级ID，返回结果范围将在该父级下，结果包含父级
   * @prop validDate {Date || String} watch，生效日期，YYYY-MM-DD或Date，返回结果将在该生效日期之后（含）
   * @prop initChange {Boolean} 初始化是是否发生change事件，查询初始值
   * @event change {Function} 选择时触发
   * @event fetchCompleted {Function} 数据获取完成触发，只在非传入inputOptions情况下触发
   * @event selectStart {Function} 弹出下拉的时候触发
   * @event selectCompleted {Function} 选择了数据并收起菜单时触发
   * 其他参数参考ele说明
   * @example <m-cascader :organization="organization" />
   */

  import organization from './organization'

  export default {
    name: 'MOrgSelect',
    props: {
      // 自定义字段
      width: {
        type: Number,
        default: 200,
      },
      // 默认正常模式
      glass: {
        type: Boolean,
        default: false,
      },
      inputOptions: {
        type: Array,
        default: () => [],
      },
      storeName: {
        type: String,
        default: '',
      },
      // 默认不缓存
      cached: {
        type: Boolean,
        default: false,
      },
      organization: {
        type: [Array, String],
        default: () => [],
      },
      valueDisabled: {
        type: Array,
        default: () => [],
      },
      remote: {
        type: String,
        default: '',
      },
      parentId: {
        type: String,
        default: '',
      },
      validDate: {
        type: [Date, String],
        default: '',
      },
      // 默认不相应初始化数据
      initChange: {
        type: Boolean,
        default: false,
      },
      // 传递字段
      // eslint-disable-next-line vue/require-default-prop
      props: Object,
      // eslint-disable-next-line vue/require-default-prop
      popperClass: { type: String },
      placeholder: {
        type: String,
        default: '请选择',
      },
      // 默认可用
      disabled: {
        type: Boolean,
        default: false,
      },
      // 默认不可清除
      clearable: {
        type: Boolean,
        default: false,
      },
      // 默认点击切换
      expandTrigger: {
        type: String,
        default: 'click',
      },
      // 默认显示选中节点
      showAllLevels: {
        type: Boolean,
        default: false,
      },
      // 默认可搜索
      filterable: {
        type: Boolean,
        default: true,
      },
      // eslint-disable-next-line vue/require-default-prop
      debounce: { type: Number },
      // 默认可选任意一级
      changeOnSelect: {
        type: Boolean,
        default: true,
      },
      // eslint-disable-next-line vue/require-default-prop
      size: { type: String },
    },
    data() {
      return {
        storeNameDefault: 'ORG_SELECT_LIST',
        storeNameLocal: '',
        options: [],
        choose: [],
        type: (this.organization && this.organization.constructor === Array) ? 'Array' : 'String',
        orgUrl: this.$api.common.organizationLevel,
        inputIsLoaded: false,
        loadingText: { value: '', label: '加载中', disabled: true },
        noData: { value: '', label: '暂无数据', disabled: true },
        chooseUnWatch: '',
        dsiableUnWatch: '',
      }
    },
    computed: {
      isLoaded() {
        return (this.$store && !!this.$store.getters[`${this.storeNameLocal}/isLoaded`]) ||
          this.inputIsLoaded
      },
      isLoading() {
        return !!this.$store && !!this.$store.getters[`${this.storeNameLocal}/isLoading`]
      },
    },
    created() {
      // 注册store
      // 由于数据根据动态参数获取，因此非定义storeName，均采取临时存储
      if (!this.storeName) {
        this.storeNameLocal = `${this.storeNameDefault}${Date.now()}`
      } else {
        this.storeNameLocal = this.storeName
      }
      if (!this.$store.state[this.storeNameLocal]) {
        this.$store.registerModule(this.storeNameLocal, organization)
      }
      this.$store.commit(`${this.storeNameLocal}/modulesCountPlus`)
      // 初次执行一次
      this.fetchData()
    },
    beforeDestroy() {
      // 清除store
      this.$store.commit(`${this.storeNameLocal}/modulesCountMinus`)
      if (!this.$store.getters[`${this.storeNameLocal}/modulesCount`] && !this.cached) {
        setTimeout(() => this.$store.unregisterModule(this.storeNameLocal), 1)
      }
    },
    mounted() {
      // 监控关闭事件，触发确定选择，或者重新抓取数据
      this.$watch('$refs.cascader.menuVisible', (newValue, oldValue) => {
        if (newValue && !oldValue) this.$emit('selectStart', newValue)
        if (!newValue && oldValue) this.$emit('selectCompleted', newValue)
        if (newValue && !oldValue && !this.isLoaded && !this.isLoading) this.fetchData()
      })
      // 监控查询参数，判断数据是否失效
      this.$watch('remote', () => {
        this.$store.commit(`${this.storeNameLocal}/isLoaded`, false)
      })
      this.$watch('parentId', () => {
        this.$store.commit(`${this.storeNameLocal}/isLoaded`, false)
      })
      this.$watch('validDate', () => {
        this.$store.commit(`${this.storeNameLocal}/isLoaded`, false)
      })
      // 特殊样式处理
      if (this.glass) {
        const input = this.$refs.cascader.$el.querySelector('.el-input__inner')
        const elInput = this.$refs.cascader.$refs.input.$el
        input.onfocus = () => elInput.classList.add('focus')
        input.onblur = () => elInput.classList.remove('focus')
      }
    },
    methods: {
      // 日期格式处理
      getDate(date = '') {
        return date ? this.$utils.tools.formatDate(new Date(date), 'YYYY-MM-DD') : ''
      },
      // 处理内容兼容elm选择器
      makeValue(item) {
        // 兼容选择器字段
        item.value = item.id
        item.label = item.name
        if (item.children && !item.children.length) delete item.children
        if (!item.children) return false
        // 递归便利所有子列表
        return item.children.every((value) => {
          this.makeValue(value)
          return true
        })
      },
      // 预处理组织找到ID路径提供参数给elm选择器
      find(item, target) {
        if (!target) return false
        this.choose.push(item.id)
        if (item.id === target) return true
        // 递归便利所有子列表
        if (item.children && item.children.length) {
          return item.children.find(value => this.find(value, target)) || !this.choose.pop()
        }
        return !this.choose.pop()
      },
      // 处理disable options数据
      makeDisable(item, target) {
        if (!target) return false
        item.disabled = target.includes(item.id)
        // 递归便利所有子列表
        return item.children && item.children.every((value) => {
          this.makeDisable(value, target)
          return true
        })
      },
      // 找到选中对象用于输出
      findLabel(result, items, index = 0) {
        if (!this.choose[index] || !items) return true
        // 递归便利所有子列表
        return items.find((value) => {
          if (value.value === this.choose[index]) {
            result.push(value)
            return this.findLabel(result, value.children, index + 1)
          }
          return false
        })
      },
      // 处理options
      optionsHandler() {
        // 处理传入的全数据，根据Disable数组递归对象
        this.makeDisable(this.options[0], this.valueDisabled)
        // 如果界面已经打开，触发界面刷新，否则各种状态不更新
        if (this.$refs.cascader && this.$refs.cascader.menuVisible) this.$refs.cascader.showMenu()
        // 绑定监听数据更新
        if (this.dsiableUnWatch) this.dsiableUnWatch()
        this.dsiableUnWatch = ''
        this.dsiableUnWatch = this.$watch('valueDisabled', () => {
          this.makeDisable(this.options[0], this.valueDisabled)
          if (this.$refs.cascader && this.$refs.cascader.menuVisible) this.$refs.cascader.showMenu()
        })
      },
      // 处理org
      organizationHandler() {
        // 处理传入的组织，没传不做处理
        if (typeof this.organization === 'undefined') {
          return
        }
        // 有值二次遍寻，先清空选项
        let secondSelect = false
        if (this.choose.length) {
          this.choose = []
          secondSelect = true
        }
        // 初始化，字符串的话递归出层级数组，数组的话push/否则会触发表单验证
        if (this.type === 'String') {
          this.find(this.options[0], this.organization)
        } else {
          this.organization.forEach(org => this.choose.push(org))
        }
        // 如果二次遍寻，则直接触发数据变化，否则判断是否初次触发Change事件
        // 如果初次初始化选择相信后台数据，不判断是否无法查到值，不做change触发，否则可能触发表单校验
        if (secondSelect) {
          this.change(this.choose)
        } else if (this.initChange) {
          this.outputChange()
        }
        // 绑定监听数据更新
        if (this.chooseUnWatch) this.chooseUnWatch()
        this.chooseUnWatch = ''
        if (this.type === 'String') {
          this.chooseUnWatch = this.$watch('organization', () => {
            this.choose = []
            this.find(this.options[0], this.organization)
            this.outputChange()
          })
        } else {
          this.chooseUnWatch = this.$watch('organization', () => {
            this.choose = this.organization
            this.outputChange()
          })
        }
      },
      // 本地获取数据，store存储
      async fetchData() {
        // 拉取数据
        if (this.inputOptions && this.inputOptions.length) {
          this.options = this.inputOptions
          // 数据格式化
          this.makeValue(this.inputOptions[0])
          this.optionsHandler()
          this.organizationHandler()
          // 完成本次加载
          this.inputIsLoaded = true
          return
        }

        // 如果数据已经缓存或者正在读取中就直接读取
        if (this.isLoaded || this.isLoading) {
          if (this.isLoading) this.options = [this.loadingText]
          this.options = await this.$store.dispatch(`${this.storeNameLocal}/options`)
          this.$emit('fetchCompleted', this.options)
          this.optionsHandler()
          this.organizationHandler()
          return
        }

        // 获取数据
        const {
          remote, orgUrl, parentId, validDate,
        } = this
        const url = remote || orgUrl
        this.$store.commit(`${this.storeNameLocal}/isLoading`, true)
        this.options = [this.loadingText]
        await this.$axios
          .post(url, {
            id: parentId || '',
            valid_date: this.getDate(validDate),
          })
          .then((res) => {
            const { data } = res
            // 数据格式化
            if (!data.id) {
              this.options = [this.noData]
            } else {
              this.makeValue(data)
              this.options = [data]
              this.optionsHandler()
              this.organizationHandler()
            }
          })
          .then(() => {
            // 完成本次加载
            if (!this.$store.state[this.storeNameLocal]) return
            this.$store.commit(`${this.storeNameLocal}/options`, this.options)
            this.$store.commit(`${this.storeNameLocal}/isLoaded`, true)
          })
          .catch((error) => {
            this.options = [this.noData]
            // 非渲染错误接口已处理
            if (error.constructor !== Error) return
            /**
             * 调用 element-ui $message
             * 应用对象（app 或者 vm）需要挂载到 window 对象上
             */
            const app = window.app || window.vm
            if (app && app.$message) {
              app.$message({
                message: '出错了！组织选择器接口有误。',
                type: 'error',
              })
            }
            console.dir(error)
          })
          .then(() => {
            this.$emit('fetchCompleted', this.options)
            if (!this.$store.state[this.storeNameLocal]) return
            this.$store.commit(`${this.storeNameLocal}/isLoading`, false)
          })
      },
      // 调用强刷
      getFetchData() {
        this.$store.commit(`${this.storeNameLocal}/isLoaded`, false)
        this.$store.commit(`${this.storeNameLocal}/isLoading`, false)
        this.fetchData()
      },
      // 外部change事件，要把label等字段信息拿出来传递回去
      outputChange() {
        const resultValues = []
        this.findLabel(resultValues, this.options)
        this.$emit('change', resultValues)
      },
      // 内部change事件，处理返回数据
      change(values) {
        let resultValues = ''
        if (this.type === 'String') {
          if (!values.length) resultValues = ''
          resultValues = values[values.length - 1]
        } else {
          resultValues = values
        }
        if (typeof this.organization === 'undefined') {
          // 不触发更新organization并回传change事件
          this.outputChange()
        } else {
          // 触发更新
          this.$emit('update:organization', resultValues || '')
          // 由父组件传递回值触发change事件
        }
      },
      activeItemChange(values) {
        this.$emit('activeItemChange', values)
      },
    },
  }
</script>
