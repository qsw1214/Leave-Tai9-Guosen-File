<template>
  <div class="details_follow" v-if='detail'>
    <!--跟进记录-->
    <div class="record">
      <!--{{  count }}-->
      <!--跟进记录-->
      <div class="item">
        <div class="item--head">
          <div class="title"><h2>{{ isRecord ? '跟进过程' : '业务需求' }}</h2></div>
          <p 
            v-tap='{methods: jumpToNative, release: detail.is_release}'
            :class="{ 
              'unpublish': detail.is_release == '0', 
              'publish': detail.is_release == '1',
              'hasexpire': detail.is_release == '2',
              'hasback': detail.is_release == '3' }" 
            v-if='!isRecord'>{{ detail.is_release | releaseStatus}}</p>
        </div>
        <div class="item--body">
          <p class="stime" v-if='!isRecord'><span class="date">{{ detail.begin_time.day }}</span> <span class="mins"><small></small>{{ detail.begin_time.time }}</span><span class="to">至</span></p>
          <p class="etime" v-if='!isRecord'><span class="date">{{ detail.end_time.day }}</span> <span class="mins"><small></small>{{ detail.end_time.time }}</span></p>
          <p class="etime" v-if='isRecord'><span class="date">{{ detail.real_time.day }}</span> <span class="mins"><small></small>{{ detail.real_time.time }}</span></p>
          <p class="tags">
            <span v-for='topic in detail.theme'>#{{ topic }}#</span>
          </p>
          <p class="method" v-if='isRecord'>{{ detail.mode }} <span v-if='detail.status != "0"'>/ {{ detail.status }}</span></p>
          <p class='demand_landing' v-if='isRecord && detail.local == "10004"'>{{detail.demand_landing == '0' ? "未发布落地需求" : "已发布落地需求"}}</p>
        </div>
      </div>
      <!--具体需求-->
      <div class="item">
        <div class="item--head">
          <div class="title"><h2>{{ isRecord ? '详细记录': '具体需求' }}</h2></div>
        </div>
        <div class="item--body">
          <div class="info" v-html='detail.detail_record'></div>
          <!--相关使用的格式 勿删
          <div class="info">
            <div class="needs">
              <span class="needs--title">一级科目:</span>
              <span class="needs--content">1111111111111111111111111111111112222222222222222222222222222222我是文字信息很长很馋的文字信息11111111111111111111111111111111112222222222222222222222222222222</span>
            </div>
            <p class='needs--text'>1111111111111111111111111111111112222222222222222222222222222222我是文字信息很长很馋的文字信息11111111111111111111111111111111112222222222222222222222222222222</p>
          </div>
          -->
          <images :imgList='detail.pictures'></images>
        </div>
      </div>
      
      <!--如果有附件-->
      <div class="item" v-if='false'>
        <div class="item--head">
          <div class="title"><h2 class='assets'>附件<small></small></h2></div>
        </div>
        <div class="item--body">
          <p class="text">1. 淡水泉3好号说明书</p>
          <p class="text">2. 淡水泉4好号说明书</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  /**
   * 此页面分为[需求]和[跟进记录]两种
   * 每一种没分5中圈层对应存在的情况就有2*5种
  */
  import Images from 'components/Common/Images'
  import JSBridge from 'helper/JSBridge'

  export default {
    name: 'RecordDetails',
    data () {
      return {
        origalColor: '',
        detail: null,
        isRecord: null,
        count: 0
      }
    },
    mounted () {
      // 设置返回按钮操作模式
      JSBridge.native('setFlag', false)
      // 设置透明
      JSBridge.native('setTransparent', false)
      let bodyDom = document.querySelector('body')
      let origalColor = bodyDom.style.backgroundColor
      this.origalColor = origalColor
      // 设置背景色
      bodyDom.style.backgroundColor = '#fff'
      this.fetchDetails()
      // 注入window方法给客户端编辑完成后使用
      window.recordDetails = this
    },
    components: {
      Images
    },
    methods: {
      fetchDetails () {
        // this.count++
        let id = this.$route.query.id
        this.$http.post('/record/detail', {id: id}).then((response) => {
          let res = response.body
          if (res.code === 0) {
            this.isRecord = res.data.type === '2' ? 1 : 0
            this.detail = res.data
            this.showNativeRBtn(res)
          }
        })
      },
      showNativeRBtn (res) {
        let type = res.data.type
        let data = {}
        let overview = this.$store.state.client.overview
        console.log('(业务需求)发布的状态：' + res.data.is_release)
        console.log('当前是否为本人' + overview.is_oneself)
        // 是否为本人
        if (overview.is_oneself === 1) {
          if (type === '2') {
            // 2为跟进记录
            data.editType = 'editFollow'
            data.isShow = '1'
            data.local = overview.local.id
            data.businessID = this.$route.query.id
            data.customerID = this.$store.state.client.customerID
            data.needGoToBoardToDelete = res.data.is_release === '1' ? 1 : 0
          } else if (type === '1') {
            // 1为需求
            data.editType = 'editNeed'
            // 当前需求处于未发布或者已经发布状态
            if (res.data.is_release === '0' || res.data.is_release === '1') {
              data.isShow = '1'
              data.local = overview.local.id
              data.businessID = this.$route.query.id
              data.customerID = this.$store.state.client.customerID
              data.needGoToBoardToDelete = res.data.is_release === '1' ? 1 : 0
            } else {
              data.isShow = '0'
              data.local = ''
              data.businessID = this.$route.query.id
            }
          }
        } else {
          data.isShow = '0'
          data.local = ''
          data.businessID = this.$route.query.id
        }
        console.log('recordDetails:' + JSON.stringify(data))
        // 设置返回按钮操作模式
        JSBridge.native('showRightButton', JSON.stringify(data))
      },
      // 删除这条记录然后回调
      goBack () {
        // 偷懒直接清除数据让它重新加载
        this.$store.dispatch('clearClient')
        this.$router.go(-1)
      },
      // 相关操作完成 直接刷新清空数据以便右侧按钮刷新
      someActionComplete () {
        this.count++
        this.fetchDetails()
      },
      // 跳转到原生
      jumpToNative (params) {
        let isRelease = this.detail.is_release
        let overview = this.$store.state.client.overview
        if (overview.is_oneself === 1) {
          // 已发布
          if (isRelease === '1') {
            console.log('goToBoard')
            JSBridge.native('goToBoard')
          } else if (isRelease === '0') {
            console.log('publishNeed')
            JSBridge.native('publishNeed')
          }
        }
      }
    },
    beforeRouteLeave (to, from, next) {
      // 有操作过页面 count的添加在actionComplete
      if (this.count > 0) {
        console.log('因为有相关的操作需要清空缓存的数据')
        this.$store.dispatch('clearClient')
      }
      next()
    },
    watch: {
      isRecord (newValue) {
        if (newValue) {
          JSBridge.native('setHeadTitle', '跟进记录')
        } else {
          JSBridge.native('setHeadTitle', '业务需求')
        }
      }
    },
    filters: {
      releaseStatus (value) {
        let releaseStatus = {'0': '未发布', '1': '已发布', '2': '已过期', '3': '已撤回'}
        return releaseStatus[value]
      }
    },
    beforeDestroy () {
      document.querySelector('body').style.backgroundColor = this.origalColor
    }
  }
</script>

<style lang='scss'>
  @import '../../style/mixin';
  @import '~bourbon/app/assets/stylesheets/bourbon';

  .details_follow {
    padding: px2rem(24)  px2rem(33) 0 px2rem(33);
    background: #fff;

    .record {
      padding-bottom: px2rem(40);
    }

    .item {
      clear: both;
      &--head {
        @include display(flex);
        @include align-items(flex-start);

        .title {
          @include flex(1);
          /*兼容ios8*/
          -webkit-box-flex: 1;

          h2 {
            height: px2rem(30);
            display: inline-block;
            @include font-dpr(16px);
            color: #555;
            line-height: 1;
            position: relative;

            &::after {
              content: ' ';
              position: absolute;
              height: px2rem(3);
              background: #ccc;
              bottom: 0px;
              left: 0px;
              right: px2rem(-5);
            }
          }

          .assets {
            small {

            }
          }
        }

        %pu {
          width: px2rem(93);
          height: px2rem(22);
          line-height: px2rem(22);
          text-align: center;
          @include font-dpr(12px);
          border-radius: px2rem(26);
          color: #6D4C02;
        }

        .publish {
          @extend %pu;
          color: #6D4C02;
          background: #F7CA18;
        }

        .unpublish {
          @extend %pu;
          background: #dedede;
        }

        .hasexpire, .hasback {
          @extend %pu;
          color: #fff;
          background: #dedede;
        }
      }

      &--body {
        margin-top: px2rem(8);
        @include font-dpr(14px);
        line-height: 1.67;
        color: #808080;

        .date {
          margin-right: px2rem(14);
        }

        .to {
          margin-left: px2rem(10);
        }

        .mins {
          small {
            display: inline-block;
            vertical-align: text-bottom;
            margin-right: px2rem(5);
            position: relative;
            top: px2rem(-1);
            width: px2rem(14);
            height: px2rem(14);
            background-image: url(../../assets/client_icon_clock@2x.png);
            background-size: 100%;
          }
        }

        .tags {
          span {
            color: #FDC02F;
            margin-right: px2rem(12);            
          }
        }
        
        .text {
          line-height: 1.5;
        }

        .info {
        }

        .needs {
          overflow: hidden;
          @include display(flex);

          &--title {
            display: inline-block;
            margin-right: px2rem(5);
            /*width: px2rem(75);*/
          }

          &--content {
            @include flex(1);
            word-break:break-all;
            word-wrap:break-word;
          }

          &--text {
            text-align: justify;
            word-break:break-all;
            word-wrap:break-word;
          }
        }
      }

      &:not(:first-child) {
        margin-top: px2rem(30);
      }
    }
  }
</style>