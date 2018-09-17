<template>
  <div class="finance" v-if='details'>
    <div class="cells" v-for='item in details.investment_and_financing'>
      <div class="cell">
        <div class="cell__title">一级科目</div>
        <div class="cell__content">{{ item.sub1 }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">二级科目</div>
        <div class="cell__content">{{ item.sub2 }}</div>
      </div>
      <div class="cell__column">
        <div class="cell__title">现状详情</div>
        <div class="cell__content">
          <p class='remarks'>{{ item.sub_val }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import JSBridge from 'helper/JSBridge'

  export default {
    name: 'PageFinance',
    mounted () {
      // 设置返回按钮操作模式
      JSBridge.native('setFlag', false)
      // 设置透明
      JSBridge.native('setTransparent', false)
      JSBridge.native('setHeadTitle', '投融资现状')
      let data = {}
      data.isShow = '0'
      data.local = ''
      // 隐藏右侧dot
      JSBridge.native('showRightButton', JSON.stringify(data))
    },
    computed: mapGetters({
      details: 'getDetails'
    })
  }
</script>
<style lang='scss' scoped>
  @import '../../../style/mixin';
  @import '~bourbon/app/assets/stylesheets/bourbon';
  .finance {
    width: 100%;

    .cells {
      margin-bottom: px2rem(12);
    }

    .remarks {
      padding-top: px2rem(12);
      @include font-dpr(14px);
      line-height: 1.57;
      text-align: justify;
    }
  }
</style>