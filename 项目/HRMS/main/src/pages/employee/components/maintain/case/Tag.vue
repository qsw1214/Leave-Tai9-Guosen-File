<template>
  <div
    class="tag"
    :class="[index === 0 ? 'default' : '', current ? 'current import' : '']"
    @click="tabTag">
    <span>{{ item.scheme_name }}</span>
    <el-button
      type="text"
      class="error"
      icon="el-icon-circle-close"
      v-if="index !== 0"
      @click.stop="delTag(item)" />
  </div>
</template>

<script>
  export default {
    name: 'Tag',
    props: {
      item: {
        type: Object,
        default: () => ({}),
      },
      index: {
        type: Number,
        default: 0,
      },
      current: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {}
    },
    methods: {
      delTag(item) {
        this.$emit('delTag', { item, index: this.index })
      },
      tabTag() {
        this.$emit('tabTag', this.index)
      },
    },
  }
</script>


<style lang="scss" scoped>
  .tag {
    display: inline-block;
    min-width: 80px;
    line-height: 32px;
    margin-right: 14px;
    margin-bottom: 14px;
    color: #333;
    cursor: pointer;
    border: 1px solid #d7d7d7;
    text-align: center;
    padding: 0 10px;
    position: relative;

    &:hover {
      border-color: #5090f7;
      color: #5090f7;
    }

    &.default:not(:hover) {
      background: #ccc;
      border: 1px solid #ccc;
      color: #333;
    }

    &.current.import {
      background: #5090f7;
      border: 1px solid #5090f7;
      color: #fff;

      &:hover {
        background-color: #66b1ff;
        border-color: #66b1ff;
      }
    }

    .error {
      position: absolute;
      right: -9.5px;
      top: -18px;
    }
  }
</style>
