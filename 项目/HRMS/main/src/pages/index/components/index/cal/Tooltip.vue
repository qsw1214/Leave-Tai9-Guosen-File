<template>
  <div
    class="tooltip"
    ref="tooltip">
    <div
      class="tooltip--arrow"
      ref="arrow" />
    <div class="tooltip--item">
      <span>上午：{{ item.on_time }}</span>
      <span>下午：{{ item.off_time }}</span>
    </div>
    <div
      class="tooltip--item"
      v-if="item.on_status_name || item.off_status_name">
      <span>类型：{{ item.on_status_name || '-' }}</span>
      <span>类型：{{ item.off_status_name || '-' }}</span>
    </div>
    <div
      class="tooltip--item"
      v-if="item.on_flow_status_name || item.off_flow_status_name">
      <span>流程状态：{{ item.on_flow_status_name || '-' }}</span>
      <span>流程状态：{{ item.off_flow_status_name || '-' }}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Tooltip',

    props: {
      content: {
        type: Object,
        default: () => ({}),
      },
    },

    computed: {
      item() {
        return Object.assign({}, {
          on_time: '',
          off_time: '',
          on_status_name: '',
          off_status_name: '',
          on_flow_status_name: '',
          off_flow_status_name: '',
        }, this.content)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .tooltip {
    position: absolute;
    left: 50%;
    top: -9999999px;
    background-color: rgba(46, 63, 87, 0.85);
    padding: 12px;
    border-radius: 4px;
    color: #fff;
    width: 330px;
    margin-left: -165px;
    opacity: 0;

    &--arrow {
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 8px 9px 0 9px;
      border-color: #2e3f57 transparent transparent transparent;
      opacity: 0.85;
      position: absolute;
      bottom: -8px;
      transition: all 0.2s ease;
    }

    &--item {
      display: flex;
      margin-bottom: 12px;

      &:last-child {
        margin-bottom: 0;
      }

      span {
        display: block;
        flex: 1;
        width: 50%;
        white-space: nowrap;
      }
    }
  }
</style>

