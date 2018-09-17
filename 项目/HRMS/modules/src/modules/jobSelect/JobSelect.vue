<template>
  <div
    class="m-job-select m-dialog-select"
    :class="{ 'is-opened': dialogVisible }">
    <el-input
      v-model="chooseOutputLabel"
      :placeholder="placeholder"
      :style="{ width: width + 'px' }">
      <i
        class="el-icon-search"
        slot="append" />
    </el-input>

    <span
      class="m-dialog-select__label"
      @click="dialogVisible = true" />

    <el-form-item>
      <el-dialog
        custom-class="m-dialog-select__dialog"
        title="请选择职务"
        size="tiny"
        :visible.sync="dialogVisible"
        :modal-append-to-body="false"
        :lock-scroll="true"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false">

        <div class="m-dialog-select__top">
          <div class="m-dialog-select__has-choose">
            已选列表：
          </div>

          <div class="m-dialog-select__choose-list">
            <el-tag
              type="white"
              v-for="choose in chooseList"
              :key="choose.id"
              :closable="true"
              :close-transition="false"
              @close="removeChoose(choose)">
              <span class="m-dialog-select__choose-tag">
                {{ choose.name }}({{ choose.code }})
              </span>
            </el-tag>
          </div>

          <el-input
            class="search"
            placeholder="输入关键字进行查询"
            v-model="search"
            @keyup.enter.native="getTableChange">
            <el-button
              icon="el-icon-search"
              slot="append"
              @click="getTableChange" />
          </el-input>
        </div>

        <m-table
          class="m-dialog-select__table"
          :data="selectOptions"
          :total="searchOptions.length"
          :is-pagination="true"
          :is-update-router="false"
          @current-change="changePage"
          @size-change="changeSize">
          <template slot-scope="props">
            <el-table
              v-loading.body="isLoading"
              border
              stripe
              max-height="400"
              row-key="id"
              :data="props.data"
              @row-click="selectChoose">
              <el-table-column
                label="职务编码"
                align="center"
                prop="code" />

              <el-table-column
                label="职务名称"
                align="center"
                prop="name" />

              <el-table-column
                label="职务类别"
                align="center"
                prop="type" />

              <el-table-column
                label="职级"
                align="center"
                prop="level" />
            </el-table>
          </template>
        </m-table>

        <div class="m-dialog-select__btn">
          <el-button
            type="primary"
            @click="confirm">确定</el-button>
          <el-button
            type="info"
            @click="cancel">取消</el-button>
        </div>
      </el-dialog>
    </el-form-item>
  </div>
</template>

<script>
  /**
   * @description 职务选择器，必须放置在form表单内
   * @prop width {Number} select宽度
   * @prop inputOptions {Array} 选项数据 如果传入则不会主动去 fetch 数据
   * @prop storeName {String} 存储vuex的名字
   * @prop cached {Boolean} 选择器移除后是否不删除缓存数据，默认false
   * @prop jobs {String} sync，传入的话必须sync，当前选中的职务id
   * @prop remote {String} watch，远程数据源path（如果你希望获取其它数据，如带查询参数的path等）
   * @prop initChange {Boolean} 初始化是是否发生change事件，查询初始值
   * @event change {Function} 选择时触发
   * @event fetchCompleted {Function} 数据获取完成触发，只在非传入inputOptions情况下触发
   * @event selectCompleted {Function} 选择了数据并收起菜单时触发
   * @example <m-job-select :jobs.sync="jobs" />
   */

  import job from './job'

  export default {
    name: 'MJobSelect',
    props: {
      // 参数设置
      width: {
        type: Number,
        default: 200,
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
      jobs: {
        type: String,
        default: '',
      },
      remote: {
        type: String,
        default: '',
      },
      // 默认不相应初始化数据
      initChange: {
        type: Boolean,
        default: false,
      },
      placeholder: {
        type: String,
        default: '请选择',
      },
    },
    data() {
      return {
        storeNameDefault: 'JOB_SELECT_LIST',
        storeNameLocal: '',
        search: '',
        choose: [],
        dialogVisible: false,
        chooseList: [],
        chooseOutputLabel: '',
        options: [],
        searchOptions: [],
        selectOptions: [],
        selectPage: 1,
        selectSize: 20,
        jobUrl: this.$api.common.jobList,
        inputIsLoaded: false,
      }
    },
    computed: {
      chooseLabel() {
        let showString = ''
        this.chooseList.forEach((item) => {
          if (showString) showString += ','
          showString += `${item.name}(${item.code})`
        })
        return showString
      },
      chooseOutput() {
        let outPutIds = ''
        this.chooseList.forEach((item) => {
          if (outPutIds) outPutIds += ','
          outPutIds += item.id
        })
        return outPutIds
      },
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
        this.$store.registerModule(this.storeNameLocal, job)
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
      this.$watch('dialogVisible', (newValue, oldValue) => {
        if (!newValue && oldValue) this.$emit('selectCompleted', newValue)
        if (newValue && !oldValue && !this.isLoaded && !this.isLoading) this.fetchData()
      })
      // 监控查询参数，判断数据是否失效
      this.$watch('remote', () => {
        this.$store.commit(`${this.storeNameLocal}/isLoaded`, false)
      })
    },
    methods: {
      // 处理传入参数
      jobsDeal() {
        this.choose = this.jobs.split(',')
        this.chooseList = []
        this.options.forEach((item) => {
          if (this.chooseList.length) return
          if (this.choose.includes(item.id)) {
            this.chooseList.push(item)
          }
        })
        this.chooseOutputLabel = this.chooseLabel
      },
      jobsHandler() {
        let secondSelect = false
        // 有值二次遍寻，就要触发confirm事件了
        if (this.choose.length) {
          secondSelect = true
        }
        this.jobsDeal()
        // 如果二次遍寻，则直接触发数据变化，否则判断是否初次触发Change事件
        // 如果初次初始化选择相信后台数据，不判断是否无法查到值，不做confirm触发，否则可能触发表单校验
        if (secondSelect) {
          this.$emit('update:jobs', this.chooseOutput)
        } else if (this.initChange) {
          this.$emit('change', this.chooseList)
        }
        this.$watch('jobs', () => {
          this.jobsDeal()
          this.$emit('change', this.chooseList)
        })
      },
      // 拉取数据
      async fetchData() {
        // 处理传入数据
        if (this.inputOptions && this.inputOptions.length) {
          this.options = this.inputOptions
          this.jobsHandler()
          this.getTableChange()
          // 完成本次加载
          this.inputIsLoaded = true
          return
        }

        // 如果数据已经缓存或者正在读取中就直接读取
        if (this.isLoaded || this.isLoading) {
          this.options = await this.$store.dispatch(`${this.storeNameLocal}/options`)
          this.$emit('fetchCompleted', this.options)
          this.jobsHandler()
          this.getTableChange()
          return
        }

        const { remote, jobUrl } = this
        const url = remote || jobUrl
        this.$store.commit(`${this.storeNameLocal}/isLoading`, true)
        await this.$axios
          .post(url)
          .then((res) => {
            const { data } = res
            // 数据格式化
            this.options = data.list
            this.jobsHandler()
            this.getTableChange()
          })
          .then(() => {
            // 完成本次加载
            if (!this.$store.state[this.storeNameLocal]) return
            this.$store.commit(`${this.storeNameLocal}/options`, this.options)
            this.$store.commit(`${this.storeNameLocal}/isLoaded`, true)
          })
          .catch((error) => {
            // 非渲染错误接口已处理
            if (error.constructor !== Error) return
            /**
             * 调用 element-ui $message
             * 应用对象（app 或者 vm）需要挂载到 window 对象上
             */
            const app = window.app || window.vm
            if (app && app.$message) {
              app.$message({
                message: '出错了！成本中心选择器接口有误。',
                type: 'error',
                showClose: true,
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
      getTableChange() {
        const searchArray = this.$utils.tools.splitKeyword(this.search)
        const start = (this.selectPage - 1) * this.selectSize
        const end = this.selectPage * this.selectSize
        const searchKeys = ['code', 'level', 'name', 'type']

        if (!searchArray.length) {
          this.searchOptions = this.options
        } else if (searchArray.length === 1) {
          const { convertRegStr } = this.$utils.tools
          const searchExp = new RegExp(convertRegStr(searchArray.join('|')))
          this.searchOptions = this.options.filter((item) => {
            // 处理能搜索
            const testObject = {}
            searchKeys.forEach((key) => {
              testObject[key] = item[key]
            })
            return searchExp.test(Object.values(testObject).join(' '))
          })
        } else {
          this.searchOptions = this.options.filter((item) => {
            // 处理能搜索
            const testObject = {}
            searchKeys.forEach((key) => {
              testObject[key] = item[key]
            })
            return Object.keys(testObject).some(key => searchArray.includes(item[key]))
          })
        }
        this.selectOptions = this.searchOptions.slice(start, end)
      },
      changePage(page) {
        this.selectPage = page
        this.getTableChange()
      },
      changeSize(size) {
        this.selectSize = size
        this.getTableChange()
      },
      selectChoose(value) {
        this.chooseList.splice(0, this.chooseList.length, value)
      },
      removeChoose(value) {
        const index = this.chooseList.indexOf(value)
        this.chooseList.splice(index, 1)
      },
      confirm() {
        this.$emit('update:jobs', this.chooseOutput)
        this.dialogVisible = false
      },
      cancel() {
        this.jobsDeal()
        this.dialogVisible = false
      },
    },
  }
</script>
