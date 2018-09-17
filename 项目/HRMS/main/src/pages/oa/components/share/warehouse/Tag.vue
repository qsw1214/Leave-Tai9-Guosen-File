<template>
  <div
    class="tag"
    :title="item.name"
    :class="customerClass">
    <span>{{ item.name }}</span>
    <el-button
      type="text"
      class="error"
      icon="el-icon-circle-close"
      @click.stop="remove(item)" />
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
      customerClass: {
        type: String,
        default: '',
      },
    },

    methods: {
      remove(item) {
        this.$emit('remove', item)
      },
    },
  }
</script>


<style lang="scss" scoped>
  .tag {
    color: #333;
    width: 100px;
    height: 32px;
    padding: 0 10px;
    border-radius: 5px;
    text-align: center;
    position: relative;
    display: inline-block;
    margin: 0 14px 14px 0;
    border: 1px solid #d7d7d7;

    &.big {
      border: 1px solid #d7d7d7;
      border-radius: 0;
      height: 34px;
      width: auto;

      span {
        width: auto;
      }
    }

    span {
      width: 80px;
      line-height: 30px;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .error {
      position: absolute;
      right: -9.5px;
      top: -18px;
    }
  }
</style>
