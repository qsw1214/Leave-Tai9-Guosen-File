<template>
  <div class="overview">
    <template v-if='overview'>
      <h1>{{ overview.name }}</h1>
      <p class='date'>最近更新：{{ overview.time }}</p>
      <div class="tags">
        <div class="tag--local">
          <h2>{{ overview.local.name }}</h2>
          <p>圈层</p>
        </div>
        <div class='tag--regin'>
          <h2>{{ overview.region }}</h2>
          <p>地区</p>
        </div>
      </div>
      <div class="other">
        <other-input></other-input>
      </div>
    </template>
  </div>
</template>

<script>
  import OtherInput from './OtherInput'
  import JSBridge from 'helper/JSBridge'

  export default {
    props: {
      overview: {
        type: Object
      }
    },
    name: 'Overview',
    mounted () {
      // 设置返回按钮操作模式
      JSBridge.native('setFlag', true)
      // 设置透明
      JSBridge.native('setTransparent', true)
      JSBridge.native('setHeadTitle', '')
      if (this.overview !== null) {
        this.shwoNativeRBtn()
      }
    },
    methods: {
      shwoNativeRBtn () {
        let data = {}
        // 查看的是自己的客户
        if (this.overview.is_oneself === 1) {
          data.isShow = '1'
          data.editType = 'editCustomer'
          data.local = this.overview.local.id
          data.needGoToBoardToDelete = this.overview.is_publish
          data.customerID = this.$route.query.customerID
        } else {
          data.editType = 'editCustomer'
          data.isShow = '0'
          data.local = ''
        }
        console.log('overview' + JSON.stringify(data))
        // 设置返回按钮操作模式
        JSBridge.native('showRightButton', JSON.stringify(data))
      }
    },
    updated () {
      this.shwoNativeRBtn()
    },
    components: {
      OtherInput
    }
  }
</script>

<style lang='scss' scoped>
  @import '../../style/mixin';
  @import '~bourbon/app/assets/stylesheets/bourbon';

  .overview {
    width: 100%;
    height: px2rem(242);
    box-sizing:border-box;
    background-image: url(../../assets/client_bg@2x.png);
    background-size: 100%;
    position: relative;
    z-index: 3;

    [data-dpr="3"] & {
      background-image: url(../../assets/client_bg@3x.png);
    }

    h1 {
      padding: px2rem(72) px2rem(20) 0 px2rem(20);
      @include font-dpr(20px);
      box-sizing:border-box;
      color: #fff;
      text-align: center;
      line-height: 1;
      text-overflow:ellipsis;
      white-space:nowrap;
      overflow:hidden;
    }

    p.date {
      @include font-dpr(14px);
      color: #F8F8F8;
      text-align: center;
      margin-top: px2rem(8);
    }

    .tags {
      margin: 0 auto;
      width: px2rem(260);
      margin-top: px2rem(16);
      font-size: 0px;

      %tag {
        width: 50%;
        color: #fff;
        display: inline-block;
        text-align: center;

        h2 {
          @include font-dpr(18px);
          font-weight: normal;
        }

        p {
          @include font-dpr(14px);
          margin-top: px2rem(10);
        }
      }
      
      .tag--local,.tag--regin {
        @extend %tag;
      }

      .tag--regin {
        position: relative;

        &::before {
          content: ' ';
          width: px2rem(3);
          height: px2rem(18);
          position: absolute;
          background-image: url(../../assets/client_divider@2x.png);
          background-size: 100%;
          top: px2rem(14);
          left: 0;

          [data-dpr="3"] & {
            background-image: url(../../assets/client_divider@3x.png);
          }
        }
      }
    }

    .other {
      position: absolute;
      bottom: 0px;
      width: 100%;
      height: px2rem(50);
      background: rgba(0,0,0,0.50);
      box-shadow: 0 0 px2rem(12) 0 rgba(0,0,0,0.12);
    }
  }
</style>