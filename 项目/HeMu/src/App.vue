<template>
  <div id="app">
    <router-view class="app--view"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang='scss' scoped>
  %abs {
    position:absolute;
    width: 100%;
    top:0;
    right:0;
    bottom:0;
    left:0;
  }

  .app {
    @extend %abs;
    &--view {
      @extend %abs;
    }
  }
</style>
