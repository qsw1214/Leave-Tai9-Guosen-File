<template>
  <div
    v-loading="loading"
    class="m-table"
    ref="mTable">
    <slot
      :data="listdata"
      :max-height="maxHeight" />
    <slot
      name="bottom" />
    <div
      class="m-table--pagination"
      v-if="isPagination && listdata.length">
      <el-pagination
        ref="pagination"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :layout="layout"
        :total="total"
        @size-change="changeSize"
        @current-change="changePage" />
    </div>
  </div>
</template>

<script>
  /**
   * @description 常用表格，内嵌翻页，取决参数传入
   * @prop data {String} 表格数据
   * @prop remote {Boolean} 表格数据是否远程，默认值: true
   * @prop loading {Boolean} 加载状态，默认值: false
   * @prop isFullTable {Boolean} 是否弹性table，默认值：false
   *  如果设置为true，请在slot.el-table中设置，:max-height="props.maxHeight"
   * @prop isPagination {Boolean} 是否需要翻页空间，默认值: true
   * @prop isUpdateRouter {Boolean} 翻页后是否需要更新 $route.query，默认值: true
   * @prop total {Number} 总条数
   * @prop pageSize {Number} 每页显示条数，默认值：20
   * @prop currentPage {Number} 当前页数，默认值：1
   * @prop pageSizes {Number[]} 每页显示条数选择器的选项设置，默认值：[10, 20, 50, 100]
   * @prop layout {String} 组件功能布局，默认值：'sizes, prev, pager, next, jumper'
   * @event current-change {Function} 当前页数发生改变时出发
   * @event size-change {Function} 每页显示条数发生改变时出发
   * @slot bottom 表格和翻页空间之间的填充片段
   * @example <m-table :data="data" />
   */

  // 此处采用了饿了么内部工具，用于快速处理响应式变化
  import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event'

  export default {
    name: 'MTable',
    props: {
      data: {
        type: Array,
        required: true,
      },
      remote: {
        type: Boolean,
        default: true,
      },
      loading: {
        type: Boolean,
        default: false,
      },
      isFullTable: {
        type: Boolean,
        default: false,
      },
      isPagination: {
        type: Boolean,
        default: true,
      },
      isUpdateRouter: {
        type: Boolean,
        default: true,
      },
      total: {
        type: Number,
        default: 0,
      },
      pageSize: {
        type: Number,
        default: 20,
      },
      // 当前页码
      currentPage: {
        type: Number,
        default: 1,
      },
      pageSizes: {
        type: Array,
        default() {
          return [20, 50, 100]
        },
      },
      layout: {
        type: String,
        default: 'total, sizes, prev, pager, next, jumper',
      },
    },
    data() {
      return {
        isCreated: false,
        isListening: false,
        offsetTop: 0,
        maxHeight: 600,
        maxHeighting: 0,
        orderType: '',
        orderAttr: '',
        pIndex: this.currentPage,
        pSize: this.pageSize,
      }
    },
    computed: {
      listdata() {
        if (this.remote) return this.data
        let list = this.data.slice(0, this.data.length)
        if (this.isPagination) {
          list = list.slice((this.pIndex - 1) * this.pSize, this.pIndex * this.pSize)
        }
        return list
      },
    },
    watch: {
      currentPage(newVal) {
        this.pIndex = newVal
      },
      pageSize(newVal) {
        this.pSize = newVal
      },
    },
    mounted() {
      if (!this.isFullTable) return
      window.addEventListener('resize', this.autoResize, true)
    },
    beforeUpdate() {
      if (!this.isFullTable || this.isCreated) return
      this.autoResize()
    },
    beforeDestroy() {
      if (!this.isFullTable) return
      window.removeEventListener('resize', this.autoResize, true)
    },
    methods: {
      setQuery(obj) {
        if (!(this.isPagination && this.isUpdateRouter)) return false

        const { query } = this.$route
        return this.$router.replace({
          query: Object.assign({}, query, obj),
        })
      },
      autoResize() {
        // 获取并判断是否需要更新高度
        const height = window.innerHeight || document.body.clientHeight
        const table = this.$refs.mTable.firstChild
        const offsetTop = this.offsetTop || table.getBoundingClientRect().top
        this.maxHeighting = height - offsetTop - (this.isPagination ? 72 : 20) - 17
        if (this.maxHeight === this.maxHeighting) return

        // 获取到就更新，并更新完初始化数据
        if (offsetTop) {
          setTimeout(() => {
            this.maxHeight = this.maxHeighting
          }, 0)
          this.isCreated = true
          // 缓存一下，可能会隐藏下刷新，如果上部高度变化可能出错
          this.offsetTop = offsetTop
          return
        }

        // 否则如果没绑定监听函数就绑定
        if (this.isListening) return
        this.isListening = true
        addResizeListener(table, this.handlerTableObserver)
      },
      handlerTableObserver() {
        const table = this.$refs.mTable.firstChild
        removeResizeListener(table, this.handlerTableObserver)
        this.autoResize()
      },
      changeSize(val) {
        this.setQuery({ size: val, page: 1 })

        if (this.remote) {
          this.$emit('size-change', val)
        } else {
          this.pSize = val
        }
      },
      changePage(val) {
        this.setQuery({ page: val })

        if (this.remote) {
          this.$emit('current-change', val)
        } else {
          this.pIndex = val
        }
      },
    },
  }
</script>
