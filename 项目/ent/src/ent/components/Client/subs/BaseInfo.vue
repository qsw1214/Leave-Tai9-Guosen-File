<template>
  <div class="baseinfo" v-if='baseinfo'> 
    <!--工商信息(企业或者企业机构)-->
    <template v-if='local == 10000 || local == 10001 || local == 10004'>
      <div class="cell" v-tap="{methods: forward, path: 'business'}">
        <div class="cell__title">主营业务</div>
        <div class="cell__forward"></div>
      </div>
      <div class="cell">
        <div class="cell__title">证券编号</div>
        <div class="cell__content">{{ baseinfo.stock_code }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">上市板块</div>
        <div class="cell__content">{{ baseinfo.market_plate }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">地区</div>
        <div class="cell__content">{{ baseinfo.city_code }}</div>
      </div>
      <div class="cell" v-tap="{methods: forward, path:'shareholder'}">
        <div class="cell__title">企业股东</div>
        <div class="cell__forward"></div>
      </div>
      <div class="cell"  v-tap="{methods: forward, path:'manager'}">
        <div class="cell__title">企业高管</div>
        <div class="cell__forward"></div>
      </div>
      <div class="cell" v-tap="{methods: forward, path:'report'}">
        <div class="cell__title">近三年财报</div>
        <div class="cell__forward"></div>
      </div>
    </template>
    <!-- 基协信息(私募客户) -->
    <template v-if='local == 10002'>
      <div class="cell">
        <div class="cell__title">法定代表人/执行事务合伙人</div>
        <div class="cell__content">{{ baseinfo.artificial_person_name }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">基金主要类别</div>
        <div class="cell__content">{{ baseinfo.primary_invest_type }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">注册地</div>
        <div class="cell__content">{{ baseinfo.register_province }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">登记编号</div>
        <div class="cell__content">{{ baseinfo.register_no }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">成立时间</div>
        <div class="cell__content">{{ baseinfo.establish_date }}</div>
      </div>
      <div class="cell">
        <div class="cell__title">登记时间</div>
        <div class="cell__content">{{ baseinfo.register_date }}</div>
      </div>
    </template>
  </div>
</template>
<script>
  /**
   * 此页面存在种类可能包括‘工商信息’/'基协信息'
   */
  import { mapGetters } from 'vuex'

  export default {
    name: 'BaseInfo',
    mounted () {
      // 如果缓存中无数据
      if (this.baseinfo == null) {
        // 大纲数据不存在
        if (this.overview == null) {
          let customerID = this.$route.query.customerID
          let uid = this.$route.query.uid
          console.log('Baseinfo Fetch Overview!')
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
        this.$store.dispatch('setLoadding')
        let basicsId = this.$store.state.client.overview.basics_id
        let local = this.$store.state.client.overview.local.id
        this.$store.dispatch('fetchBaseinfo', { basicsId, local })
      },
      forward (params) {
        this.$router.push(
          {
            name: 'BaseinfoSub',
            params: {
              id: params.path
            }
          }
        )
      }
    },
    computed: mapGetters({
      baseinfo: 'getBaseinfo',
      local: 'getClientModel'
    })
  }
</script>

<style lang='scss' scoped>
  @import '../../../style/mixin';
  
  .baseinfo {
    width: 100%;
    min-height: 200px; 
  }
</style>