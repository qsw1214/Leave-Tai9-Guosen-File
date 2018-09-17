<template>
  <section class="product">
    <!--产品概况-->
    <div class="weui-panel">
      <div class="weui-media-box weui-media-box_text">
        <h4 class="weui-media-box__title">淡水泉成长一期证券投资集合资金信托计划</h4>
        <p class="weui-media-box__desc">成立日期：2014-02-12</p>
        <div class="overview">
          <div>
            <h5 class="overview--title">累计收益率</h5>
            <b class="overview--value">125.88%</b>
          </div>
          <div>
            <h5 class="overview--title">累计净值</h5>
            <b class="overview--value">1.99</b>
          </div>
        </div>
        <ul class="weui-media-box__info">
          <li class="weui-media-box__info__meta">股票型基金</li>
          <li class="weui-media-box__info__meta weui-media-box__info__meta_extra">基金经理：赵军</li>
        </ul>
      </div>
    </div>

    <!--公司业绩-->
    <div class="weui-panel">
      <div class="weui-panel__hd"><h3>基金业绩</h3></div>
      <div class="weui-panel__bd">
        <Tab></Tab>
        <div class="tab__panel">
          <Lines></Lines>
        </div>
      </div>
    </div>

    <!--更多基金-->
    <div class="weui-panel">
      <div class="weui-panel__hd"><h3>更多基金</h3></div>
      <div class="weui-panel__bd">
        <div class="item item--title even">
          <div class="name">基金名称</div>
          <div class="value">累计净值</div>
          <div class="rate">累计收益率</div>
        </div>
        <div
          class="item"
          v-for="(item, index) in 6"
          @click="forwardToDetails(index)"
          :class="{'even': index%2 != 0}">
          <div class="name">
            <span>私募机构{{item}}</span>
          </div>
          <div class="value">{{(Math.random()*2).toFixed(2)}}</div>
          <div class="rate">
            {{ parseInt(Math.random()*100) + '%' }}
          </div>
        </div>
        <div class="item more">
          <span>查看更多</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import Tab from './Tab'
  import PolyLine from './PolyLine'

  export default {
    name: 'DetailProduct',
    data () {
      return {
        test: 'product'
      }
    },
    methods: {
    },
    components: {
      Lines: PolyLine,
      Tab
    }
  }
</script>

<style lang="scss" scoped type="text/scss" rel="stylesheet/scss">
  .product {
    background: #fff;
    .weui-media-box_text {
      .weui-media-box__title {
        color: #2C82EF;
        font-size: 16px;
        margin-bottom: 0px;
      }

      .weui-media-box__desc {
        font-size: 12px;
      }

      .overview {
        margin-top: 0.4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;

        div {
          flex: 1;
          .overview--title {
            font-size: 13px;
            font-weight:normal;
            color: #666;
          }

          .overview--value {
            font-size: 24px;
            color: red;
            font-weight:400;
          }
        }
      }

      .weui-media-box__info {
        color: #666;
      }
    }

    .item {
      padding: 8px 15px;
      position: relative;
      display: flex;
      box-align: center;
      align-items: center;
      width: 100%;
      font-size: 12px;
      line-height: 1.6;
      background: #fff;

      &.item--title {
        padding: 15px;
        font-weight: bold;
      }

      .name {
        flex: 2;
      }

      .value {
        flex: 1;
      }

      .rate {
        flex: 1;
      }

      &.even {
        background: #f2f2f2;
      }
      
      &.more {
        color: #999;

        span {
          display: inline-block;
          flex: 1;
          text-align: center;
          text-decoration: underline;
        }
      }
    }
  }
</style>
