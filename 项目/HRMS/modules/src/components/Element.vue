<template>
  <div class="element">

    <div class="buttons">
      <el-button>默认按钮</el-button>
      <el-button type="primary">主要按钮</el-button>
      <el-button
        plain
        disabled>禁止按钮</el-button>
      <el-button
        type="primary"
        disabled>禁止按钮</el-button>
    </div>

    <div class="checkbox">
      <el-checkbox>备选项</el-checkbox>
      <el-checkbox v-model="checkbox.checked">备选项</el-checkbox>
    </div>

    <div class="el-date-picker">
      <el-input
        placeholder="请输入内容"
        style="width:140px;"
        disabled
        v-model="input.value" />

      <el-input
        placeholder="请输入内容"
        style="width:140px;"
        v-model="input.value" />

      <el-date-picker
        type="date"
        placeholder="选择日期"
        v-model="datepicker.value" />

      <el-input
        placeholder="请输入内容"
        style="width:360px;">
        <el-button
          icon="el-icon-search"
          slot="append" />
      </el-input>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'Element',

    data() {
      return {
        datepicker: {
          value: '',
        },
        input: {
          value: '',
        },
        checkbox: {
          checked: true,
        },
      }
    },

    mounted() {
    },
  }
</script>

<style lang="scss" scoped>
  .element {
    margin: 20px;

    > div {
      margin-top: 30px;
    }
  }
</style>
