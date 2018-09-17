<template>
  <section class="panel weui-tab__panel">
    <div class="item item--title">
      <div class="range">排名</div>
      <div class="name">机构名称</div>
      <div class="score">综合得分</div>
      <div class="star">青果星级</div>
      <div class="arrow"></div>
    </div>
    <div class="item--list">
      <!--上拉刷新需要的话手动打开-->
      <!--:on-refresh="refresh"-->
      <scroller
        style="top:32px"
        ref="scroller"
        :snapping="true"
        :on-infinite="infinite">
        <div
          class="item"
          v-for="(item, index) in items"
          @click="forwardToDetails(index)"
          :class="{'even': index%2 == 0}">
          <div class="range"><span>{{(index+1)>9 ? index+1 : ('0'+(index+1))}}</span></div>
          <div class="name">
            <span>私募机构{{item}}</span>
          </div>
          <div class="score">{{ parseInt(Math.random()*100) }}</div>
          <div class="star">
            <star-rating :inline="true" :star-size="16" :read-only="true" :show-rating="false" :rating="2"></star-rating>
          </div>
          <div class="arrow has"></div>
        </div>
      </scroller>
    </div>
  </section>
</template>

<script>
  import StarRating from 'vue-star-rating'

  export default {
    name: 'TabPanel',
    data () {
      return {
        test: '',
        items: []
      }
    },
    mounted () {
//      this.getListByTab()
    },
    methods: {
      // 获取对应类型的列表
      getListByTab (cb) {
        this.$http.post('/admin/FundCompanyScore/GetThinkShortNameList', {type: 1}).then(res => {
          setTimeout(() => {
            for (var i = 1; i <= 10; i++) {
              this.items.push(i + ' - walking.')
            }
            // 当页面数据全部拉完的时候
            // this.$refs.scroller.finishInfinite(true)
            cb && cb()
          }, 2000)
        })
      },
      forwardToDetails () {
        this.$router.push({
          path: '/detail/brand'
        })
      },
      // 下拉加载
      infinite (done) {
        console.log('infinite')
        this.getListByTab(done)
      }
    },
    components: {
      StarRating
    }
  }
</script>

<style lang="scss" scoped type="text/scss" rel="stylesheet/scss">
  .panel {
    position: relative;
    .item {
      padding: 10px 0px;
      position: relative;
      display: flex;
      box-align: center;
      align-items: center;
      width: 100%;
      font-size: 14px;
      line-height: 1.6;
      background: #fff;

      &.item--title {
        padding: 8px 0px;
        line-height: 1.2;
        background: #fff;
      }

      &.even {
        background: #f2f2f2;
      }
    }
    .item--list {
      height: calc(100vh - 40px);
      width: 100%;
      background: #efeff4;
    }
    .center {
      text-align: center;
    }
    .name, .star {
      flex: 1;
    }
    .score {
      width: 1.4rem;
    }
    .range {
      padding-left: 10px;
      width: 1rem;
      span {
        width: 24px;
        height: 24px;
        line-height: 2;
        font-weight: bold;
        font-size: 12px;
        text-align: center;
        display: inline-block;
        border-radius: 50%;
        background: #487fcd;
        color: #fff;
      }
    }
    .name, .star {
      flex: 2;
    }
    .name {
      span {
        display: -webkit-box;
        line-height: 1;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .arrow {
      width: 0.6rem;
      position: relative;
      &.has {
        &::after {
          content: " ";
          display: inline-block;
          height: 6px;
          width: 6px;
          border-width: 2px 2px 0 0;
          border-color: #C8C8CD;
          border-style: solid;
          transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
          top: -2px;
          position: absolute;
          top: 50%;
          margin-top: -4px;
          left: 2px;
        }
      }
    }
  }
</style>
