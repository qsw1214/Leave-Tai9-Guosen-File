<template>
  <div class="loader" v-if='isLoadding'>
    <div class="loader--icon animation__rotate"></div>
    <span class="loader--text">正在加载</span>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'Loader',
    computed: mapGetters({
      isLoadding: 'getLoaderStatus'
    })
  }
</script>
<style lang='scss' scoped>
  @import '../../style/mixin';
  @import '~bourbon/app/assets/stylesheets/bourbon';

  .loader {
    width: 65%;
    margin: px2rem(20) auto;
    text-align: center;
    line-height: 2;

    &--icon {
      display: inline-block;
      vertical-align:middle;
      width: px2rem(14);
      height: px2rem(14);
      background-image: url(../../assets/ui_loadding.png);
      background-size: 100%;
    }

    &--text {
      vertical-align:middle;
      @include font-dpr(14px);
      color: #333;
    }
  }
</style>