<template>
  <div class="sub">
    <!--公司业务-->
    <div class="business" v-if='path == "business"'>
      <div class="cell__column">
        <div class="cell__title">主营业务</div>
        <div class="cell__content">
          <p class="intro">{{ data.main_business }}</p>
        </div>
      </div>
    </div>
    <!-- 近三年财务报告 -->
    <div class="report" v-if='path == "report"'>
      <div class="cells" v-for='item in data'>
        <div class="cell">
          <div class="cell__title"><h2>{{ item.y }}</h2></div>
          <div class="cell__content">单位：万元</div>
        </div>
        <div class="cell">
          <div class="cell__title">总资产</div>
          <div class="cell__content">{{ item.t_asset }}</div>
        </div>
        <div class="cell">
          <div class="cell__title">净资产</div>
          <div class="cell__content">{{ item.asset }}</div>
        </div>
        <div class="cell">
          <div class="cell__title">营业收入</div>
          <div class="cell__content">{{ item.revenue }}</div>
        </div>
        <div class="cell">
          <div class="cell__title">净利润</div>
          <div class="cell__content">{{ item.profit }}</div>
        </div>
      </div>
    </div>
    <!--企业高管-->
    <div class="manager" v-if='path == "manager"'>
      <div class="cell">
        <div class="cell__title"><h2>企业高管</h2></div>
        <div class="cell__content">数据日期：{{ data.ts }}</div>
      </div>
      <div class="cell" v-for='item in data.info'>
        <div class="cell__title">{{ item.name }}</div>
        <div class="cell__content">{{ item.position }}</div>
      </div>
    </div>
    <!--股东结构-->
    <div class="shareholder" v-if='path == "shareholder"'>
      <div class="cell">
        <div class="cell__title"><h2>股东结构</h2></div>
        <div class="cell__content">数据日期：{{ data.ts }}</div>
      </div>
      <div class="cell cell__tiny" v-for='item in data.info'>
        <div class="person">
          <h2>{{ item.name }}</h2>
          <div class="desc">
            <div class="desc__left">出资额：{{ item.money }}万元</div>
            <div class="desc__right">出资比例：{{ item.ratio }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import JSBridge from 'helper/JSBridge'

  export default {
    name: 'BaseinfoSubPage',
    data () {
      let path = this.$route.params.id
      let data = null
      switch (path) {
        case 'manager':
          data = this.$store.state.client.baseinfo.manager_info
          break
        case 'shareholder':
          data = this.$store.state.client.baseinfo.shareholder_info
          break
        case 'report':
          data = this.$store.state.client.baseinfo.finance_state
          break
        case 'business':
          data = this.$store.state.client.baseinfo
          break
      }
      return {
        path,
        data
      }
    },
    mounted () {
      // 设置返回按钮操作模式
      JSBridge.native('setFlag', false)
      // 设置透明
      JSBridge.native('setTransparent', false)
      let path = this.path
      switch (path) {
        case 'manager':
          JSBridge.native('setHeadTitle', '企业高管')
          break
        case 'shareholder':
          JSBridge.native('setHeadTitle', '企业股东')
          break
        case 'report':
          JSBridge.native('setHeadTitle', '近三年财报')
          break
        case 'business':
          JSBridge.native('setHeadTitle', '主营业务')
          break
      }
      let data = {}
      data.isShow = '0'
      data.local = ''
      // 隐藏右侧dot
      JSBridge.native('showRightButton', JSON.stringify(data))
    }
  }
</script>

<style lang='scss' scoped>
  @import '../../../style/mixin';
  
  .report {
    width: 100%;

    .cells {
      margin: px2rem(12) 0px;
    }
  }


  .business {
    .intro {
      text-align: left;
      line-height: 1.5;
      padding-top: px2rem(10);
    }
  }
</style>