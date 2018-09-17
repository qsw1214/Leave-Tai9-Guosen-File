<template>
  <el-select
    class="multiple-select"
    ref="multipleSelect"
    v-bind="$props"
    @input="$emit('input', $event)"
    @change="$emit('change', $event)"
    @visible-change="$emit('visible-change', $event)"
    @remove-tag="$emit('remove-tag', $event)"
    @clear="$emit('clear', $event)"
    @blur="$emit('blur', $event)"
    @focus="$emit('focus', $event)">
    <slot />
  </el-select>
</template>

<script>
  /**
   * @description 多选select的二次封装，用于解决高度自定义问题
   */

  import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event'

  export default {
    name: 'MultipleSelect',
    props: {
      /* eslint-disable vue/require-default-prop */
      name: String,
      id: String,
      // eslint-disable-next-line vue/require-prop-types
      value: {
        required: true,
      },
      size: String,
      disabled: Boolean,
      clearable: Boolean,
      filterable: Boolean,
      allowCreate: Boolean,
      loading: Boolean,
      popperClass: String,
      remote: Boolean,
      loadingText: String,
      noMatchText: String,
      noDataText: String,
      remoteMethod: Function,
      filterMethod: Function,
      multiple: Boolean,
      multipleLimit: Number,
      placeholder: String,
      defaultFirstOption: Boolean,
      reserveKeyword: Boolean,
      valueKey: String,
      collapseTags: Boolean,
      /* eslint-enable vue/require-default-prop */
    },
    data() {
      return {
        height: 34,
      }
    },
    computed: {
      tags() {
        return this.$refs.multipleSelect.$el.firstChild
      },
      elInner() {
        return this.$refs.multipleSelect.$el.querySelector('.el-input__inner')
      },
    },
    mounted() {
      if (!this.multiple) return
      this.handlerResize()
      addResizeListener(this.tags, this.handlerResize)
    },
    beforeDestroy() {
      if (!this.multiple) return
      removeResizeListener(this.tags, this.handlerResize)
    },
    methods: {
      handlerResize() {
        this.fixMultipleInputHeight()
      },
      fixMultipleInputHeight() {
        const height = this.tags.clientHeight
        this.elInner.style.maxHeight = `${Math.max(height, 30) + (this.height - 30)}px`
      },
    },
  }
</script>
