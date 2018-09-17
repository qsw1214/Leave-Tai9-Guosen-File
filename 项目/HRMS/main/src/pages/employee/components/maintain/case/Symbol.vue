<template>
  <div class="symbol">
    <!--String 类型 1-->
    <template v-if="condition.data_type === '1'">
      <el-select
        placeholder="请选择"
        style="width: 150px;"
        v-model="label">
        <template v-for="item in options_string">
          <el-option
            v-if="condition.op_type === '1' || condition.op_type === '3'"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </template>
        <template v-for="item in options_string2">
          <el-option
            v-if="condition.op_type === '2' || condition.op_type === '4'"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </template>
      </el-select>
    </template>
    <!--Number 数字/日趋 2-->
    <template v-if="condition.data_type === '2' || condition.data_type === '3'">
      <el-select
        placeholder="请选择"
        style="width: 150px;"
        v-model="label">
        <el-option
          v-for="item in options_number"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </el-select>
    </template>
    <!--新增是显示-->
    <template v-if="condition.data_type === ''">
      <multiple-select
        multiple
        disabled
        placeholder="请选择"
        style="width: 150px;"
        v-model="label" />
    </template>
  </div>
</template>

<script>
  export default {
    name: 'Symbol',
    data() {
      return {
        options_string: [
          { value: '1', label: '等于' },
          { value: '2', label: '不等于' },
          { value: '3', label: '包含' },
          { value: '4', label: '不包含' },
        ],
        options_string2: [
          { value: '1', label: '等于' },
          { value: '2', label: '不等于' },
        ],
        options_number: [
          { value: '1', label: '等于' },
          { value: '2', label: '不等于' },
          { value: '5', label: '大于' },
          { value: '6', label: '不大于' },
          { value: '7', label: '小于' },
          { value: '8', label: '不小于' },
        ],
      }
    },
    computed: {
      label: {
        get() {
          return this.$store.getters.getConditionByIndex(this.$parent.index).label
        },
        set(value) {
          if (value !== this.label) {
            const { index } = this.$parent
            this.$store.dispatch('update_one_condition_field', {
              index,
              field: 'label',
              fieldValue: value,
            })
          }
        },
      },
      condition() {
        return this.$store.getters.getConditionByIndex(this.$parent.index)
      },
    },
  }
</script>


<style lang="scss" scoped>
  .symbol {
    display: block;
    float: left;
    min-width: 120px;
    margin-right: 20px;
    position: relative;
  }
</style>
