<template>
  <div id="app">
    <transition name="fade"
                mode="out-in">
      <router-view class="page"></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss" scoped type="text/scss" rel="stylesheet/scss">
  @import '../node_modules/weui/dist/style/weui.min.css';
  #app {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: #eee;

    .page {
      min-height: 100vh;
      min-width: 100vw;
    }
    .fade-enter-active,
    .fade-leave-active {
      transition: all .2s ease;
    }

    .fade-enter,
    .fade-leave-active {
      opacity: 0;
    }
  }
</style>
