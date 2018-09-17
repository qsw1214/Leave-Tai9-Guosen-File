<template>
  <div class="app" id="app">
    <!--<transition :name="transitionName">
      <router-view class="app--view"></router-view>
    </transition>-->
    <router-view class="app--view"></router-view>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data () {
      return {
        transitionName: 'slide-left'
      }
    },
    // watch $route 决定使用哪种过渡方式
    watch: {
      '$route' (to, from) {
        const toDepth = to.path.split('/').length
        const fromDepth = from.path.split('/').length
        this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
      }
    }
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