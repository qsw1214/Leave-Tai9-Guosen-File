<template>
  <div class="details" v-if='details'>
    <!--企业-->
    <template v-if='local == 10000'>
      <div class="cell">
        <div class="cell__title">企业联系人</div>
        <div class="cell__content">{{ details.contact }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">联系人职位</div>
        <div class="cell__content">{{ details.position }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">联系人电话</div>
        <div class="cell__content">{{ details.phone }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">企业类型</div>
        <div class="cell__content">{{ details.ent_type }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">所属行业</div>
        <div class="cell__content">{{ details.trade }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">行业细分</div>
        <div class="cell__content">{{ details.trade_detail }}</div>
      </div>
      <div class="cell" v-tap='{ methods: forward }'>
        <div class="cell__title">投融资现状</div>
        <div class="cell__forward"></div>
      </div>
    </template>
    <!-- 企业合作机构 -->
    <template v-if='local == 10001'>
      <div class="cell">
        <div class="cell__title">企业联系人</div>
        <div class="cell__content">{{ details.contact }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">联系人职位</div>
        <div class="cell__content">{{ details.position }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">联系人电话</div>
        <div class="cell__content">{{ details.phone }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">渠道大类</div>
        <div class="cell__content">{{ details.channel }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">渠道细分</div>
        <div class="cell__content">{{ details.channel_detail }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">所在地区</div>
        <div class="cell__content">{{ details.region }}</div>
      </div>
      <div class="cell__column">
        <div class="cell__title">渠道简介</div>
        <div class="cell__content">{{ details.channel_intro }}</div>
      </div>
    </template>
    <!--私募-->
    <template v-if='local == 10002'>
      <div class="cell">
        <div class="cell__title">联系人</div>
        <div class="cell__content">{{ details.contact }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">	联系人职位</div>
        <div class="cell__content">{{ details.position }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">联系人电话</div>
        <div class="cell__content">{{ details.phone }}</div>
      </div>
      <div class="cell cell__top">
        <div class="cell__title wechat">微信联系人<br><span>已添加私募星工场</span></div>
        <div class="cell__content">{{ details.wechat }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">私募大类</div>
        <div class="cell__content">{{ details.p_type }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">私募小类</div>
        <div class="cell__content">{{ details.p_subtype }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">产品数量</div>
        <div class="cell__content">{{ details.amount }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">总规模</div>
        <div class="cell__content">{{ details.total }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">投顾资格</div>
        <div class="cell__content">{{ details.right ? '有' : '没有' }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">投研团队人数</div>
        <div class="cell__content">{{ details.people }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">有意愿参加</div>
        <div class="cell__content">
          <span v-if='details.join == 1' class="tag">泰九点金台</span>
          <span v-if='details.join == 2' class="tag">线上报告会</span>
          <template v-if='details.join == 3'>
            <span class="tag">泰九点金台</span>
            <span class="tag">线上报告会</span>
          </template>
        </div>
      </div>
      <div class="cell__column">
        <div class="cell__title">其他备注</div>
        <div class="cell__content">{{ details.remark }}</div>
      </div>
    </template>
    <!--私募机构-->
    <template v-if='local == 10003'>
      <div class="cell">
        <div class="cell__title">联系人</div>
        <div class="cell__content">{{ details.contact }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">联系人职位</div>
        <div class="cell__content">{{ details.position }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">联系人电话</div>
        <div class="cell__content">{{ details.phone }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">渠道大类</div>
        <div class="cell__content">{{ details.p_type }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">渠道细分</div>
        <div class="cell__content">{{ details.p_subtype }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">所在地区</div>
        <div class="cell__content">{{ details.region }}</div>
      </div>
      <div class="cell__column">
        <div class="cell__title">渠道简介</div>
        <div class="cell__content">{{ details.remark }}</div>
      </div>
    </template>
    <!--个人-->
    <template v-if='local == 10004'>
      <div class="cell">
        <div class="cell__title">联系人</div>
        <div class="cell__content">{{ details.contact }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">联系人职位</div>
        <div class="cell__content">{{ details.position }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">联系人电话</div>
        <div class="cell__content">{{ details.phone }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">渠道大类</div>
        <div class="cell__content">{{ details.p_type }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">渠道细分</div>
        <div class="cell__content">{{ details.p_subtype }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">所在地区</div>
        <div class="cell__content">{{ details.region }}</div>
      </div>
      <!--<div class="cell">
        <div class="cell__title">线索方资源说明</div>
        <div class="cell__content">{{ details.resource_descrition }}</div>
      </div>-->
      <div class="cell">
        <div class="cell__title">意向合作领域</div>
        <div class="cell__content">{{ details.remark }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">是否已经落地过合作</div>
        <div class="cell__content">{{ details.isCooperate == '1' ? '是' : '否' }}</div>
      </div>
      <template v-if="details.isCooperate == '1'">
        <div class="cell">
          <div class="cell__title">已举办活动主题</div>
          <div class="cell__content">{{ details.cooperate_content.theme }}</div>
        </div>
        <div class="cell">
          <div class="cell__title">合作形式</div>
          <div class="cell__content">{{ details.cooperate_content.mode }}</div>
        </div>
        <div class="cell">
          <div class="cell__title">落地日期</div>
          <div class="cell__content">{{ details.cooperate_content.time }}</div>
        </div>
        <div class="cell">
          <div class="cell__title">对方贡献资源</div>
          <div class="cell__content">{{ details.cooperate_content.source }}</div>
        </div>
        <div class="cell">
          <div class="cell__title">贡献客户数量</div>
          <div class="cell__content">{{ details.cooperate_content.count }}</div>
        </div>
      </template>
    </template>
    <div class="cell">
      <div class="cards">
        <h2>客户名片</h2>
        <images :imgList='details.business_card'></images>
      </div>
    </div>
  </div>
</template>
<script>
  import Images from 'components/Common/Images'
  import { mapGetters } from 'vuex'

  export default {
    name: 'Details',
    mounted () {
      // 如果缓存中无数据
      if (this.details == null) {
        // 大纲数据不存在
        if (this.overview == null) {
          let customerID = this.$route.query.customerID
          let uid = this.$route.query.uid
          console.log('FollowRecord Fetch Overview!')
          this.$store.dispatch('getOverviewById', { customerID, uid }).then(() => {
            this.fetchData()
          })
        } else {
          this.fetchData()
        }
      }
    },
    methods: {
      fetchData () {
        let local = this.overview.local.id
        let customerID = this.$route.query.customerID
        this.$store.dispatch('setLoadding')
        this.$store.dispatch('getDetails', {local, customerID})
      },
      forward () {
        // 跳转投融资页面
        this.$router.push({
          path: '/client/details/finance'
        })
      }
    },
    components: {
      Images
    },
    computed: mapGetters({
      overview: 'getOverview',
      details: 'getDetails',
      local: 'getClientModel'
    })
  }
</script>

<style lang='scss' scoped>
  @import '../../../style/mixin';
  @import '~bourbon/app/assets/stylesheets/bourbon';
  
  .details {
    width: 100%;

    .tag {
      @include font-dpr(12px);
      border: 1px #ccc solid;
      padding: px2rem(3) px2rem(10);
      margin-left: px2rem(15);
      border-radius: px2rem(3);
    }
  }
</style>
