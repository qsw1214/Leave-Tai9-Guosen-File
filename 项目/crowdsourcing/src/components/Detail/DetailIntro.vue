<template>
  <section class="intro">
    <!--公司简介-->
    <div class="weui-panel">
      <div class="weui-panel__hd"><h3>公司简介</h3></div>
      <div class="weui-panel__bd">
        <div class="weui-media-box weui-media-box_text">
          <p class="weui-media-box__desc">公司名称: 私募机构资产管理有限公司</p>
          <p class="weui-media-box__desc">成立时间: 2017-02-10</p>
          <p class="weui-media-box__desc">核心人物: 张三、李四</p>
          <p class="weui-media-box__desc">注册资本: 1000万</p>
          <p class="weui-media-box__desc">旗下基金数: 100只</p>
          <p class="weui-media-box__desc">备案号: P100023023</p>
          <p class="weui-media-box__desc">所在地区: 深圳</p>
        </div>
      </div>
    </div>
    <!--公司业绩-->
    <div class="weui-panel">
      <div class="weui-panel__hd"><h3>公司业绩</h3></div>
      <div class="weui-panel__bd">
        <Tab></Tab>
        <div class="tab__panel">
          <Lines></Lines>
        </div>
      </div>
    </div>
    <!--团队核心成员-->
    <div class="weui-panel">
      <div class="weui-panel__hd"><h3>团队核心成员</h3></div>
      <div class="weui-panel__bd">
        <div class="weui-media-box weui-media-box_appmsg">
          <div class="weui-media-box__hd">
            <img class="weui-media-box__thumb avater__cicle" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAAeFBMVEUAwAD///+U5ZTc9twOww7G8MYwzDCH4YcfyR9x23Hw+/DY9dhm2WZG0kbT9NP0/PTL8sux7LFe115T1VM+zz7i+OIXxhes6qxr2mvA8MCe6J6M4oz6/frr+us5zjn2/fa67rqB4IF13XWn6ad83nxa1loqyirn+eccHxx4AAAC/klEQVRo3u2W2ZKiQBBF8wpCNSCyLwri7v//4bRIFVXoTBBB+DAReV5sG6lTXDITiGEYhmEYhmEYhmEYhmEY5v9i5fsZGRx9PyGDne8f6K9cfd+mKXe1yNG/0CcqYE86AkBMBh66f20deBc7wA/1WFiTwvSEpBMA2JJOBsSLxe/4QEEaJRrASP8EVF8Q74GbmevKg0saa0B8QbwBdjRyADYxIhqxAZ++IKYtciPXLQVG+imw+oo4Bu56rjEJ4GYsvPmKOAB+xlz7L5aevqUXuePWVhvWJ4eWiwUQ67mK51qPj4dFDMlRLBZTqF3SDvmr4BwtkECu5gHWPkmDfQh02WLxXuvbvC8ku8F57GsI5e0CmUwLz1kq3kD17R1In5816rGvQ5VMk5FEtIiWislTffuDpl/k/PzscdQsv8r9qWq4LRWX6tQYtTxvI3XyrwdyQxChXioOngH3dLgOFjk0all56XRi/wDFQrGQU3Os5t0wJu1GNtNKHdPqYaGYQuRDfbfDf26AGLYSyGS3ZAK4S8XuoAlxGSdYMKwqZKM9XJMtyqXi7HX/CiAZS6d8bSVUz5J36mEMFDTlAFQzxOT1dzLRljjB6+++ejFqka+mXIe6F59mw22OuOw1F4T6lg/9VjL1rLDoI9Xzl1MSYDNHnPQnt3D1EE7PrXjye/3pVpr1Z45hMUdcACc5NVQI0bOdS1WA0wuz73e7/5TNqBPhQXPEFGJNV2zNqWI7QKBd2Gn6AiBko02zuAOXeWIXjV0jNqdKegaE/kJQ6Bfs4aju04lMLkA2T5wBSYPKDGF3RKhFYEa6A1L1LG2yacmsaZ6YPOSAMKNsO+N5dNTfkc5Aqe26uxHpx7ZirvgCwJpWq/lmX1hA7LyabQ34tt5RiJKXSwQ+0KU0V5xg+hZrd4Bn1n4EID+WkQdgLfRNtvil9SPfwy+WQ7PFBWQz6dGWZBLkeJFXZGCfLUjCgGgqXo5TuSu3cugdcTv/HjqnBTEMwzAMwzAMwzAMwzAMw/zf/AFbXiOA6frlMAAAAABJRU5ErkJggg==" alt="">
          </div>
          <div class="weui-media-box__bd">
            <p class="weui-media-box__title">杨磊Test</p>
            <p class="weui-media-box__desc">累计平均收益率：123.99%</p>
            <p class="weui-media-box__desc">今年平均收益率：93.99%</p>
          </div>
        </div>
        <div class="descrption">
          南开大学数学学士、金融学硕士，历任中信证券资产管理部分析师、嘉实基金管理公司基金丰和基金经理、研究总监、机构投资总监、总裁助理。赵军先生精通国内资本市场投资运作，并拥有管理全国社保基金、企业年金、保险机构和银行资金的丰富经验。赵军先生在12年的证券投资管理工作中，历经牛熊市场转换，在公募及阳光私募的过往业绩均排在同业同期的前百分之二十。
        </div>
      </div>
    </div>
    <!--投资理念-->
    <div class="weui-panel">
      <div class="weui-panel__hd"><h3>投资理念</h3></div>
      <div class="weui-panel__bd">
        <div class="descrption">
          淡水泉信奉“逆向投资”，认为股票市场中情绪聚集的地方不容易找到好的投资标的，公司团队更喜欢在被市场“忽略”和“冷落”的地方去“淘金”，越是不被看好的投资，公司越是加强对其基本面的研究，以期先于市场发现投资机会。 同样是分享企业未来的成长，淡水泉始终恪守两个准则： 1、可被证明的过往经营能力； 2、合理的估值水平。
        </div>
      </div>
    </div>
  </section>

</template>

<script>
  import Tab from './Tab'
  import PolyLine from './PolyLine'
  
  export default {
    name: 'DetailIntro',
    data () {
      return {
        test: 'intro'
      }
    },
    methods: {
      tab () {
        this.tabIndex = 1
      }
    },
    components: {
      Lines: PolyLine,
      Tab
    }
  }
</script>

<style lang="scss" scoped type="text/scss" rel="stylesheet/scss">
  .intro {
    .weui-media-box__desc {
      line-height: 1.6;
      font-size: 14px;
    }

    .weui-media-box_appmsg {
      .weui-media-box__hd {
        margin-right: 0.2rem;
      }

      .weui-media-box__title, .weui-media-box__desc {
        font-size: 12px;
      }

      .avater__cicle {
        border-radius: 50%;
      }
    }

    .descrption {
      padding: 0px 15px;
      font-size: 12px;
      text-indent: 2em;
    }
  }
</style>
