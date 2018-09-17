<template>
  <el-col
    class="m-section--cell"
    :span="span || (24 / length)">
    <div
      class="m-section--cell-title"
      v-if="title"
      :class="{ required: required ? 'required' : '' }">{{ title }}</div>

    <div
      class="m-section--cell-content"
      v-if="prop">{{ scope[prop] }}</div>

    <div
      class="m-section--cell-content"
      v-else-if="typeof content !== 'undefined'"
      v-html="content" />

    <div
      class="m-section--cell-content"
      v-else><slot /></div>
  </el-col>
</template>

<script>
  export default {
    name: 'MSectionCell',
    props: {
      /* eslint-disable vue/require-default-prop */
      title: String,
      content: [String, Number],
      prop: String,
      required: Boolean,
      span: Number, // col 占位
      /* eslint-enable vue/require-default-prop */
    },

    computed: {
      scope() {
        return this.$parent.$parent.$parent.data
      },

      length() {
        return this.$parent.$parent.length
      },
    },
  }
</script>
