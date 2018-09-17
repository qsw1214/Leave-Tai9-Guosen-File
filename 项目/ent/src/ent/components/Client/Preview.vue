<template>
  <div class="preview" v-if='overview'>
    <p><small></small><span>已选择展示客户货渠道信息</span></p>
    <h2>{{ overview.name }}</h2>
  </div>
</template>
<script>
  import JSBridge from 'helper/JSBridge'

  export default {
    props: {
      overview: {
        type: Object,
        default: {}
      }
    },
    name: 'Preview',
    mounted () {
      // 设置返回按钮操作模式
      JSBridge.native('setFlag', true)
      JSBridge.native('setHeadTitle', '圈层客户信息')
      JSBridge.native('setTransparent', false)
      if (this.overview !== null) {
        this.shwoNativeRBtn()
      }
    },
    methods: {
      shwoNativeRBtn () {
        let data = {}
        data.isShow = '0'
        data.local = ''
        // console.log('overview'+JSON.stringify(data))
        // 设置返回按钮操作模式
        JSBridge.native('showRightButton', JSON.stringify(data))
      }
    },
    updated () {
      this.shwoNativeRBtn()
    },
    activated () {
      this.shwoNativeRBtn()
    }
  }
</script>
<style lang='scss' scoped>
  @import '../../style/mixin';
  @import '~bourbon/app/assets/stylesheets/bourbon';

  .preview {
    height: px2rem(75);
    width: 100%;
    background: #fff;
    padding: px2rem(16);
    box-sizing: border-box;
    position: relative;
    z-index: 3;
    box-shadow: 0 0 10px 0 rgba(0,0,0,0.10);
    
    p {
      line-height: 1.2;
      font-size: 0;
      small {
        display: inline-block;
        vertical-align: middle;
        width: px2rem(18);
        height: px2rem(18);
        margin-right: px2rem(8);
        background-size: 100%;
        background-image: url(../../assets/client_icon_tip@2x.png);
        [data-dpr="3"] & {
          background-image: url(../../assets/client_icon_tip@3x.png);
        }
      }
      span {
        @include font-dpr(14px);
        vertical-align: middle;
        color: #808080;
      }
    }

    h2 {
      margin-left: px2rem(26);
      margin-top: px2rem(10);
      @include font-dpr(16px);
      text-overflow: ellipse;
      overflow:hidden;
      white-space:nowrap;
      color: #555555;
    }
  }
</style>