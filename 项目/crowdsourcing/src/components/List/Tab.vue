<template>
  <section class="weui-tab">
    <div class="weui-navbar">
      <div class="weui-navbar__item weui-bar__item_on">
        综合排行
      </div>
      <div class="weui-navbar__item">
        五星机构
      </div>
      <div class="weui-navbar__item">
        四星机构
      </div>
      <div class="weui-navbar__item">
        我的收藏
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    name: '',
    data () {
      return {
        test: ''
      }
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped type="text/scss" rel="stylesheet/scss">
  .weui-tab {
    .weui-navbar {
      position: static;

      .weui-bar__item_on {}
    }
  }
</style>
