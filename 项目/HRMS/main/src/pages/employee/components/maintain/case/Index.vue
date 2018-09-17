<template>
  <section
    v-loading.fullscreen.lock="isSave"
    class="page page--case">

    <m-breadcrumb :items="breadcrumb" />

    <m-section
      title="设置方案"
      is-form>
      <!--默认查询方案-->
      <m-section-row
        class="all-case"
        v-if="allCase">
        <m-section-cell
          title="查询方案列表">
          <template v-for="(item, index) in allCase">
            <tag
              :item="item"
              :current="item.isCurrent"
              :key="index"
              :index="index"
              @tabTag="switchCase"
              @delTag="delCaseItem" />
          </template>
        </m-section-cell>
      </m-section-row>

      <!--设置筛选条件-->
      <m-section-row
        v-loading.body="isSwitch"
        v-if="baseCondition.length > 0">
        <m-section-cell
          title="设置筛选条件">
          <div class="add">
            <el-button
              type="text"
              icon="el-icon-plus"
              @click="addOneCondition">新增筛选条件</el-button>

            <div
              class="valid-error-message"
              v-if="hasError">
              新增的第{{ errorIndex + 1 }}筛选条件尚有字段未填写,请填写完整后再操作。
            </div>
          </div>

          <div
            class="list"
            v-if="currentCase.detail.condition">
            <div
              v-for="(condition, index) in currentCase.detail.condition"
              :key="condition.timeStamp">
              <div
                class="one--condition"
                :class="{ 'error': (hasError && (index === errorIndex)) }">

                <OneCondition :index="index" />

                <el-button
                  class="error"
                  type="text"
                  icon="el-icon-circle-close"
                  @click="delOneCondition(index)" />
              </div>
            </div>
          </div>
        </m-section-cell>
      </m-section-row>

      <!--设置列表字段-->
      <m-section-row
        v-loading.body="isSwitch"
        class="option"
        v-if="baseHead.length > 0">
        <m-section-cell
          title="设置列表字段">
          <FieldDropMenu ref="fieldDropMenu" />

          <el-button
            class="option--center"
            plain
            :disabled="!transformEnable"
            @click="confirmChoose">
            <m-icon-next />
          </el-button>

          <FieldResult />
        </m-section-cell>
      </m-section-row>

      <!--操作列表-->
      <m-section-row
        v-if="!isLoading">
        <m-section-cell>
          <el-button
            type="primary"
            @click="saveNewCase">保存为查询方案</el-button>
          <el-button
            type="primary"
            @click="confirmCase">确定</el-button>
          <el-button
            type="info"
            @click="cancle">取消</el-button>
        </m-section-cell>
      </m-section-row>
    </m-section>
  </section>
</template>

<script>
  import md5 from 'md5'
  import { mapState } from 'vuex'
  import OneCondition from './OneCondition'
  import FieldDropMenu from './FieldDropMenu'
  import FieldResult from './FieldResult'
  import Tag from './Tag'

  export default {
    name: 'Case',
    components: {
      OneCondition,
      Tag,
      FieldDropMenu,
      FieldResult,
    },
    data() {
      return {
        hasError: false,
        errorIndex: '',
        allCase: [],
        // 永远保持不变的基础数据
        baseCondition: [],
        baseHead: [],
        staticCondition: [],
        options: {},
        isSwitch: false,
        isSave: false,
        isLoading: true,
        breadcrumb: [
          { name: '员工管理' },
          { name: '员工信息维护', to: '/maintain' },
          { name: '设置查询方案' },
        ],
      }
    },
    computed: mapState({
      // 获取前方案
      currentCase: state => state.casePage.currentCase,
      // 判断当前传输按钮是否能用
      transformEnable: state => (state.casePage.tempHead.length > 0),
    }),
    created() {
      this.isLoading = true
      this.init()
    },
    methods: {
      init(silent) {
        this.getBaseCondition(silent).then(() => {
          this.getAllCase(silent)
          this.isLoading = false
        })
      },
      // 获取基本的查询筛选数据
      getBaseCondition(silent) {
        const url = this.$api.employee.caseBaseInformation
        return this.$axios.post(url, {
          module: 1,
          showProgressBar: silent,
        }).then((res) => {
          const { condition, head } = res.data.list
          this.baseCondition = condition
          this.baseHead = head
          this.setStaticCondition()
        })
      },
      // 将条件过滤为一维的数组存储
      setStaticCondition() {
        let temp = []
        this.baseCondition.forEach((cate) => {
          if (cate.sub.length > 0) {
            temp = temp.concat(cate.sub)
          }
        })
        this.staticCondition = temp
      },
      // 获取所有Case num->当前选中第几个数据为currentCase
      getAllCase(silent, num) {
        const url = this.$api.employee.caseAllCase
        let currentNum = num
        this.$axios.post(url, {
          module: 1,
          showProgressBar: silent,
        }).then((res) => {
          const { list: allCase } = res.data
          this.allCase = allCase
          if (!currentNum) {
            this.allCase.forEach((item, index) => {
              if (item.status === 1) {
                item.isCurrent = true
                /* eslint no-param-reassign:0 */
                currentNum = index
              } else {
                item.isCurrent = false
              }
            })
          } else {
            this.allCase[currentNum].isCurrent = true
          }
          this.setCurrentCase(currentNum)
          this.setCurrentOptions()
        })
      },
      // 设置当前case
      setCurrentCase(num) {
        // 采用JSON做一次深拷贝
        const tempCase = JSON.parse(JSON.stringify(this.allCase[num]))
        const combCondition = []
        const combHead = []
        tempCase.detail.condition.forEach((condition, index) => {
          let temp = {}
          const { field } = condition
          const defaultCondition = this.staticCondition
            .filter(item => item.field === field)[0]
          const timeStamp = Date.parse(new Date()).toString() + index
          temp = Object.assign(
            {},
            condition,
            defaultCondition,
            { showDropMenu: false, timeStamp }
          )
          combCondition.push(temp)
        })
        Object.keys(tempCase.detail.head).forEach((index) => {
          let temp = {}
          temp = Object.assign({}, {
            name: tempCase.detail.head[index],
            field: index,
            disable: index !== 'tu-name',
          })
          combHead.push(temp)
        })
        this.$set(tempCase.detail, 'condition', combCondition)
        this.$set(tempCase.detail, 'head', combHead)
        this.$store.dispatch('setCurrentCase', tempCase)
      },
      // 设置当前操作项
      setCurrentOptions() {
        const fields = this.currentCase.detail.condition.map(oneCase => oneCase.field)
        const heads = this.currentCase.detail.head.map(item => item.field)
        const tempCondition = []
        this.baseCondition.forEach((cate) => {
          let temp = cate
          temp.isOpen = false
          temp.sub.forEach((sub) => {
            if (fields.includes(sub.field)) {
              sub.isChoose = true
            } else {
              sub.isChoose = false
            }
          })
          temp = Object.assign({}, temp)
          tempCondition.push(temp)
        })
        this.$set(this.options, 'condition', tempCondition)
        const tempHead = []
        this.baseHead.forEach((head) => {
          let temp = {}
          temp.name = head.name
          temp.isOpen = false
          temp.sub = []
          Object.keys(head.sub).forEach((field) => {
            const sub = {}
            sub.field = field
            if (heads.includes(field)) {
              sub.isChoose = true
              sub.isVisible = false
            } else {
              sub.isChoose = false
              sub.isVisible = true
            }
            sub.name = head.sub[field]
            temp.sub.push(sub)
          })
          temp = Object.assign({}, temp)
          tempHead.push(temp)
        })
        this.$set(this.options, 'head', tempHead)
        this.$store.dispatch('init_options', this.options)
      },
      // 删除一个查询条件
      delOneCondition(index) {
        this.$nextTick(() => {
          this.$store.dispatch('delOneCondition', index)
        })
      },
      // 新增一个查询条件
      addOneCondition() {
        if (!this.checkCaseValidate()) {
          this.$store.dispatch('addOneCondition')
        }
      },
      // 删除一个现存的方案
      delCaseItem({ item, index }) {
        this.$confirm('此操作将永久删除该查询方案, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          const { id, status, isCurrent } = item
          if (isCurrent) {
            this.isSwitch = true
          }
          const url = this.$api.employee.delOneCase
          this.$axios.post(url, { id }, { showProgressBar: false }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
            this.isSwitch = false
            this.allCase.splice(index, 1)
            if (isCurrent) {
              // 删除到默认方案
              if (status === 1) {
                this.allCase[0].status = 1
                this.allCase[0].isCurrent = true
              }
              this.switchCase(0)
            }
          })
        }).catch(() => { })
      },
      // 确认选择的字段
      confirmChoose() {
        this.$store.dispatch('confirm_choose_head')
        // todo 滚动条到最底部
      },
      // 切换方案
      switchCase(num) {
        this.isSwitch = true
        this.allCase.forEach((item, index) => {
          if (index === num) {
            item.isCurrent = true
          } else {
            item.isCurrent = false
          }
        })
        setTimeout(() => {
          this.isSwitch = false
          this.resetChildComponent()
          this.setCurrentCase(num)
          this.setCurrentOptions()
        }, 200)
      },
      // 手动重置子组件
      resetChildComponent() {
        const { fieldDropMenu } = this.$refs
        fieldDropMenu.keyword = ''
        fieldDropMenu.copyKeyword = ''
        fieldDropMenu.isSearch = false
        // 重置选择字段
        this.$store.dispatch('reset_temphead')
      },
      // 保存一个查询方案
      saveNewCase() {
        if (this.checkCaseValidate()) return
        this.$prompt('请输入方案名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^\S{1,20}$/,
          inputErrorMessage: '方案名称非空请限定在20个字以内',
        }).then(({ value }) => {
          const isDuplicateName = this.allCase.some(item => (item.scheme_name === value))
          if (!isDuplicateName) {
            const url = this.$api.employee.addOneCase
            const detail = {
              condition: [],
              head: {},
            }
            const tempObj = this.getCaseInfo(this.currentCase)
            detail.condition = tempObj.condition
            detail.head = tempObj.head
            this.isSave = true
            this.$axios.post(url, {
              name: value,
              module: 1,
              type: 2,
              detail: JSON.stringify(detail),
            }).then(() => {
              this.resetChildComponent()
              const num = this.allCase.length
              this.getAllCase(true, num)
              this.isSave = false
            }).catch((error) => {
              console.dir(error)
              this.isSave = false
            })
          } else {
            this.$message.error('方案名称重复, 请重新命名。')
          }
        }).catch((error) => {
          console.dir(error)
        })
      },
      getCaseInfo(targetCase) {
        const condition = []
        let head = {}
        targetCase.detail.condition.forEach((item) => {
          condition.push({
            field: item.field,
            label: item.label,
            value: item.value,
          })
        })
        const bool = Array.isArray(targetCase.detail.head)
        if (bool) {
          targetCase.detail.head.forEach((item) => {
            head[item.field] = item.name
          })
        } else {
          // eslint-disable-next-line prefer-destructuring
          head = targetCase.detail.head
        }
        return {
          condition,
          head,
        }
      },
      // 确认选择了某个方案
      confirmCase() {
        if (this.checkCaseValidate()) return
        const currentCase = this.allCase.filter(item => item.isCurrent)[0]
        const { id } = currentCase
        const originObj = this.getCaseInfo(this.currentCase)
        const currentObj = this.getCaseInfo(currentCase)
        const originObjStr = JSON.stringify(originObj)
        const currentObjStr = JSON.stringify(currentObj)

        if (md5(originObjStr) === md5(currentObjStr)) {
          sessionStorage.setItem('caseId', id)
          this.$router.push({ path: '/maintain' })
        } else {
          const url = this.$api.employee.addOneCase
          this.$axios.post(url, {
            name: '',
            module: 1,
            // 4为临时方案
            type: 4,
            detail: originObjStr,
          }).then((res) => {
            const { id: currentId } = res.data
            sessionStorage.setItem('caseId', currentId)
            this.$router.push({ path: '/maintain' })
          })
        }
      },
      // 检测当前数据是否合法
      checkCaseValidate() {
        let isValidate = false
        let num
        const { condition } = this.currentCase.detail
        if (condition.length > 0) {
          isValidate = condition.some((item, index) => {
            if (
              item.value === ''
              || item.label === ''
              || item.value.length === 0
              || (item.value.length > 0 && (String(item.value[0]).trim() === ''))
            ) {
              num = index
              return true
            }
            return false
          })
        } else {
          isValidate = false
        }
        if (isValidate) {
          this.hasError = true
          this.errorIndex = num
          this.$nextTick(() => {
            setTimeout(() => {
              this.hasError = false
            }, 1000 * 5)
          })
        } else {
          this.hasError = false
        }
        return isValidate
      },
      // 取消操作
      cancle() {
        window.history.go(-1)
      },
    },
  }
</script>

<style lang="scss">
  .page--case {
    .m-section .m-section--cell {
      margin-top: 0;
      margin-bottom: 0;
    }

    .m-section--row:not(:last-child) .m-section--cell {
      margin-bottom: 14px;
    }

    .m-section--cell-title {
      line-height: 34px;
    }

    .m-section--cell-content {
      position: relative;
    }

    .all-case {
      .m-section--cell-content {
        margin-bottom: -14px;
      }
    }

    .valid-error-message {
      position: absolute;
      top: 100%;
      padding-top: 4px;
      line-height: 16px;
      left: 0;
      font-size: 12px;
      color: #f75050;
    }

    .list {
      margin-bottom: -14px;

      .one--condition {
        margin-bottom: 14px;
        display: flex;
        outline-color: rgba(255, 255, 255, 1);
        max-width: 759px;

        @keyframes outlineColor {
          from {
            outline-color: rgba(255, 0, 0, 0);
          }

          to {
            outline-color: rgba(255, 0, 0, 1);
          }
        }

        &.error {
          outline-style: solid;
          outline-width: 1px;
          animation: outlineColor 1.2s linear 4 alternate;
        }
      }
    }

    .option {
      .m-section--cell-content {
        display: flex;
        align-items: center;
      }

      .option--center {
        border-radius: 5px;
        height: 40px;
        width: 90px;
        margin: 0 35px;

        .m-icon-next {
          margin-right: 0;
        }
      }
    }
  }
</style>
