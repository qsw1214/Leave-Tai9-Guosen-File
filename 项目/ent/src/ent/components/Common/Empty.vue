<template>
  <div class="empty">
    <span>暂无数据</span>
  </div>
</template>
<script>
  export default {
    name: 'Empty'
  }
</script>
<style lang='scss' scoped>
  @import '../../style/mixin';
  @import '~bourbon/app/assets/stylesheets/bourbon';

  .empty {
    width: 65%;
    line-height:1;
    @include font-dpr(14px);
    margin: 0 auto;
    text-align: center;
    height: px2rem(14);
    position: relative;

    &::after {
      content: ' ';
      height: 1px;
      width: 100%;
      position: absolute;
      top: 50%;
      left: 0;
      z-index: -1;
      background: #E1E1E1;
    }

    span {
      color: #999;
      background: #f8f8f8;
      padding-left: px2rem(10);
      padding-right: px2rem(10);
    }
  }
</style>