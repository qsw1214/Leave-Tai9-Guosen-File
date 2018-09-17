<template>
  <div class="person">
    <div class="person--head">
      <h1>{{ overview.name }}</h1>
      <p>选择录入人</p>
    </div>
    <div class="person--body">
      <Loader />
      <ul>
        <li 
          v-for="item in list"
          v-tap='{methods: pick, item: item}'
          :class="{'active': (item.current == 1)}">
          <div class="left">
            <h2>{{ item.user_name }}</h2>
            <p>{{ item.dep_name }}<span>{{ item.user_code }}</span></p>
          </div>
          <div class="right">
            <span>选择</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Loader from 'components/Common/Loader'
  import JSBridge from 'helper/JSBridge'

  export default{
    name: 'InputPerson',
    data () {
      return {
        list: []
      }
    },
    mounted () {
      // 设置返回按钮操作模式
      JSBridge.native('setFlag', false)
      // 设置title
      JSBridge.native('setHeadTitle', '请选择录入人')
      // 设置透明
      JSBridge.native('setTransparent', false)
      JSBridge.native('showOutRight', false)
      let data = {}
      data.isShow = '0'
      data.local = ''
      // 隐藏右侧dot
      JSBridge.native('showRightButton', JSON.stringify(data))
      this.$store.dispatch('setLoadding')
      this.$http.post('/customer/getCustomerList', {basics_id: this.overview.basics_id, uid: this.overview.user_id, local: this.overview.local.id}).then((response) => {
        let res = response.body
        if (res.code === 0) {
          this.$store.dispatch('hideLoader')
          this.list = res.data.user_list
        }
      })
    },
    methods: {
      pick (params) {
        if (params.item.current === 1) {
          return false
        }
        this.$store.dispatch('clearClient')
        this.$router.push({
          path: '/client/followrecord',
          query: {
            customerID: params.item.customerID,
            uid: params.item.user_id
          }
        })
      }
    },
    computed: mapGetters({
      overview: 'getOverview'
    }),
    components: {
      Loader
    }
  }
</script>

<style lang='scss' scoped>
  @import '../../style/mixin';
  @import '~bourbon/app/assets/stylesheets/bourbon';

  .person {
    box-sizing: border;
    
    &--head {
      box-sizing: border-box;
      height: px2rem(56);
      padding: px2rem(10) px2rem(16) 0 px2rem(16);
      background: #FFFFFF;
      box-shadow: 0 0 12px 0 rgba(0,0,0,0.12);
      position: relative;
      z-index: 2;

      h1 {
        line-height: 1;
        @include font-dpr(16px);
        margin-bottom: px2rem(10);
        color: #666;
      }

      p {
        @include font-dpr(14px);
        color: #999;
      }
    }

    &--body {
      ul {
        li {
          height: px2rem(70);
          box-sizing: border-box;
          padding: 0 px2rem(16);
          @include display(flex);
          @include align-items(center);

          .left {
            @include flex(1);

            h2 {
              line-height: 1;
              color: #2a2a2a;
              @include font-dpr(16px);
              margin-bottom: px2rem(10);
            }

            p {
              line-height: 1;
              @include font-dpr(13px);
              color:#999;

              span {
                margin-left: px2rem(24);
              }
            }
          }

          .right {
            width: px2rem(60);
            height: px2rem(20);
            line-height: px2rem(20);
            text-align: center;
            border: 1px solid #22A7F0;
            border-radius: px2rem(30);
            box-sizing: border-box;

            span {
              @include font-dpr(12px);
              color: #22A7F0;
            }
          }
          
          &:nth-child(even) {
            background: #fff;
          }

          &.active {
            .right {
              border: 1px solid #999;

              span {
                color: #999;
              }
            }
          }
        }
        
      }
    }
  }
</style>

