<template>
  <div class="fieldvalue">
    <!--新增空-->
    <template v-if="condition.op_type === ''">
      <el-input
        style="min-width: 260px;"
        placeholder="请输入内容"
        disabled />
    </template>
    <!--下拉选择框-->
    <template v-if="condition.op_type === '2'">
      <multiple-select
        style="min-width: 260px;"
        multiple
        placeholder="请选择"
        ref="multipleInput"
        v-model="multipleValue">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </multiple-select>
    </template>
    <!--文本框-->
    <template v-if="condition.op_type === '1'">
      <el-input
        style="min-width: 260px;"
        placeholder="请输入内容"
        v-model="inputValue" />
    </template>
    <!--日期-->
    <template v-if="condition.op_type === '3'">
      <el-date-picker
        type="date"
        style="min-width: 260px;"
        placeholder="选择日期"
        v-model="dateValue"
        :clearable="false"
        :editable="false" />
    </template>
    <!--放大镜-->
    <template v-if="condition.op_type === '4'">
      <el-select
        style="min-width: 260px;"
        filterable
        remote
        placeholder="请输入关键搜索"
        v-model="remoteValue"
        :remote-method="remoteMethod"
        :loading="loading">
        <el-option
          v-for="item in remoteOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </el-select>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'FieldValue',
    data() {
      return {
        loading: false,
        remoteOptions: [],
        timer: null,
        once: true,
      }
    },
    computed: {
      condition() {
        return this.$store.getters.getConditionByIndex(this.$parent.index)
      },
      options() {
        const options = this.$store.getters.getConditionByIndex(this.$parent.index).option
        const ops = []
        Object.keys(options).forEach((index) => {
          const temp = {}
          temp.value = index
          temp.label = options[index]
          ops.push(temp)
        })
        return ops
      },
      // 下拉框
      multipleValue: {
        get() {
          return this.$store.getters.getConditionByIndex(this.$parent.index).value
        },
        set(value) {
          const { index } = this.$parent
          this.$store.dispatch('update_one_condition_field', { index, field: 'value', fieldValue: value })
        },
      },
      // 输入框
      inputValue: {
        get() {
          return this.$store.getters.getConditionByIndex(this.$parent.index).value[0]
        },
        set(value) {
          const { index } = this.$parent
          this.$store.dispatch('update_one_condition_field', { index, field: 'value', fieldValue: [value] })
        },
      },
      // 放大镜
      remoteValue: {
        get() {
          const condition = this.$store.getters.getConditionByIndex(this.$parent.index)
          return condition.value[0]
        },
        set(value) {
          const { index } = this.$parent
          this.$store.dispatch('update_one_condition_field', { index, field: 'value', fieldValue: [value] })
        },
      },
      remoteUrl() {
        return this.$store.getters.getConditionByIndex(this.$parent.index).option[0]
      },
      // 日期
      dateValue: {
        get() {
          return this.$store.getters.getConditionByIndex(this.$parent.index).value[0]
        },
        set(value) {
          if (value) {
            const { index } = this.$parent
            const date = new Date(value)
            const dateStr = this.$utils.tools.formatDate(date)
            this.$store.dispatch('update_one_condition_field', { index, field: 'value', fieldValue: [dateStr] })
          }
        },
      },
    },
    mounted() {
      if (this.condition.op_type === '4') {
        this.remoteMethod(this.remoteValue)
      }
    },
    methods: {
      remoteMethod(query) {
        /* eslint no-lonely-if:0 */
        if (this.once) {
          if (this.condition.defaultOption) {
            this.remoteOptions = this.condition.defaultOption
              .map(item => ({ label: item.name, value: item.id }))
          }
          this.once = false
        } else {
          if (query !== '') {
            const url = `${this.remoteUrl}${query}`
            this.loading = true
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
              this.$axios.get(url, {
                showProgressBar: false,
              }).then((res) => {
                const { list } = res.data
                this.loading = false
                this.remoteOptions = list.map(item => ({ label: item.name, value: item.id }))
              })
            }, 300)
          } else {
            this.remoteOptions = []
          }
        }
      },
    },
  }
</script>


<style lang="scss">
  .fieldvalue {
    display: block;
    float: left;
    min-width: 120px;
    margin-right: 15px;
    position: relative;

    .el-select__tags-text {
      max-width: 187px;
      overflow: hidden;
      display: inline-block;
      vertical-align: top;
      text-overflow: ellipsis;
    }
  }
</style>
