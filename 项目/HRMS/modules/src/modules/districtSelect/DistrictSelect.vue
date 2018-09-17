<template>
  <div
    class="m-district-select m-cascader-select glass"
    :class="{ isLoading: isLoading }">
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
   * @description 地区级联选择器
   * @prop width {Number} select宽度
   * @prop inputOptions {Array} 传入不会自动fetch数据 { 是否取消参数，改为传入选择层级？：1-3 }
   * @prop storeName {String} 存储vuex的名字
   * @prop cached {Boolean} 选择器移除后是否不删除缓存数据，默认true
   * @prop district {String} sync，传入的话必须sync，当前选中的地区
   * @event change {Function} 选择时触发
   * @event fetchCompleted {Function} fetch 完成后触发
   * 其他参数参考ele说明
   * @example <m-district-select :district="district" />
   */

  import district from './district'

  export default {
    name: 'MDistrictSelect',
    props: {
      // 自定义字段
      width: {
        type: Number,
        default: 200,
      },
      inputOptions: {
        type: [Array, String],
        default: '',
      },
      // 默认名称，通用，不更新
      storeName: {
        type: String,
        default: 'DISTRICT_LIST',
      },
      // 默认缓存
      cached: {
        type: Boolean,
        default: true,
      },
      district: {
        type: [String, Number],
        default: '',
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
      // 默认可清除
      clearable: {
        type: Boolean,
        default: true,
      },
      // 默认点击切换
      expandTrigger: {
        type: String,
        default: 'click',
      },
      // 默认显示所有节点
      showAllLevels: {
        type: Boolean,
        default: true,
      },
      // 默认可搜索
      filterable: {
        type: Boolean,
        default: true,
      },
      // eslint-disable-next-line vue/require-default-prop
      debounce: { type: Number },
      // 默认选择变化
      changeOnSelect: {
        type: Boolean,
        default: true,
      },
      // eslint-disable-next-line vue/require-default-prop
      size: { type: String },
    },
    data() {
      return {
        options: [],
        choose: [],
        loadingText: { value: '', label: '加载中', disabled: true },
        noData: { value: '', label: '暂无数据', disabled: true },
      }
    },
    computed: {
      isLoading() {
        return !!this.$store && !!this.$store.getters[`${this.storeName}/isLoading`]
      },
    },
    created() {
      // 注册store
      if (!this.$store.state.DISTRICT_LIST) {
        this.$store.registerModule(this.storeName, district)
      }
      this.$store.commit(`${this.storeName}/modulesCountPlus`)
      // 初次执行一次
      this.fetchData()
    },
    destroyed() {
      // 清除store
      this.$store.commit(`${this.storeName}/modulesCountMinus`)
      if (!this.$store.getters[`${this.storeName}/modulesCount`] && !this.cached) {
        setTimeout(() => this.$store.unregisterModule(this.storeNameLocal), 1)
      }
    },
    mounted() {
      // 特殊样式处理
      const input = this.$refs.cascader.$el.querySelector('.el-input__inner')
      const elInput = this.$refs.cascader.$refs.input.$el
      input.onfocus = () => elInput.classList.add('focus')
      input.onblur = () => elInput.classList.remove('focus')
    },
    methods: {
      // 预处理组织找到ID路径提供参数给elm选择器
      find(item, target) {
        if (!target) return false
        this.choose.push(item.code)
        if (item.code === target) return true
        // 递归便利所有子列表
        if (item.children && item.children.length) {
          return item.children.find(value => this.find(value, target)) || !this.choose.pop()
        }
        return !this.choose.pop()
      },
      // 处理dis
      districtHandler() {
        this.options.find(value => this.find(value, Number(this.district)))
        this.$watch('district', () => {
          this.choose = []
          this.options.find(value => this.find(value, Number(this.district)))
        })
      },
      // store获取，并存储
      async fetchData() {
        if (this.inputOptions && this.inputOptions.length) {
          this.options = this.inputOptions
          this.districtHandler()
          return
        }

        // store 拉取
        this.options = [this.loadingText]
        await this.$store.dispatch(`${this.storeName}/get`)
          .then((fetchOptions) => {
            if (!fetchOptions.length) {
              this.options = [this.noData]
            } else {
              this.options = fetchOptions
              this.districtHandler()
            }
            this.$emit('fetchCompleted', fetchOptions)
          })
      },
      // 直接处理change事件，不用回传对象
      change(values) {
        const index = values.length - 1
        const select = values[index] || ''
        this.$emit('update:district', select)
        this.$emit('change', select)
      },
      activeItemChange(values) {
        this.$emit('activeItemChange', values)
      },
    },
  }
</script>
