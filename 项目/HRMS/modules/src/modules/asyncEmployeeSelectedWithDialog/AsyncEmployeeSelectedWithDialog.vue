<template>
  <div
    class="m-rsync-employee-select"
    :title="labels">
    <el-input
      :value="labels"
      :placeholder="placeholder"
      :style="{ width: width + 'px' }"
      @focus="focus">
      <i
        class="el-icon-search"
        slot="append"
        @click="focus" />
    </el-input>

    <el-form-item>
      <el-dialog
        title="请选择员工"
        lock-scroll
        append-to-body
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :show-close="false"
        :close-on-press-escape="false">

        <div class="dialog--content">
          <m-async-employee-select
            :multiple="multiple"
            :employee="employeeChoosed"
            @selected="selectEmployee" />
        </div>

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
   * @description 公司异步员工选择器，必须放置在form表单内
   * @prop width {Number} select宽度
   * @prop inputOptions {Array} 选项数据 如果传入则不会主动去 fetch 数据
   * @event change {Function} 选择时触发
   * @event fetchCompleted {Function} 数据获取完成触发，只在非传入inputOptions情况下触发
   * @event selectCompleted {Function} 选择了数据并收起菜单时触发
   * @example <m-rsync-employee-selected-dialog :employees="employees" />
   */
  export default {
    name: 'MAsyncEmployeeSelectedWithDialog',

    props: {
      width: {
        type: Number,
        default: 260,
      },
      multiple: {
        type: Boolean,
        default: true,
      },
      placeholder: {
        type: String,
        default: '请选择',
      },
      employee: {
        type: Array,
        default: () => ([]),
      },
    },

    data() {
      return {
        dialogVisible: false,
        employeeChoosed: [].concat(this.employee),
      }
    },

    computed: {
      labels() {
        const arr = this.employeeChoosed
          .map(item => `${item.name}(${item.emp_code})`)
        return arr.length > 0 ? arr.join(',') : ''
      },
    },

    watch: {
      employee(newValue) {
        this.employeeChoosed = [].concat(newValue)
      },

      dialogVisible(newValue) {
        if (newValue) this.employeeChoosed = [].concat(this.employee)
      },
    },

    methods: {
      selectEmployee(employee) {
        this.employeeChoosed = employee
      },

      confirm() {
        this.dialogVisible = false
        this.$emit('confirm', this.employeeChoosed)
      },

      cancel() {
        this.dialogVisible = false
        // 复原数据
        this.employeeChoosed = [].concat(this.employee)
      },

      focus() {
        this.dialogVisible = true
      },
    },
  }
</script>

<style lang="scss" scoped>
  .m-rsync-employee-select {
    .el-form-item {
      margin: 0 !important;
    }

    .el-dialog {
      margin-bottom: 20px;
    }

    .dialog--content {
      margin-top: -30px;
      min-height: 400px;
      padding-bottom: 20px;
    }

    .m-dialog-select__btn {
      padding-top: 20px;
    }
  }
</style>
