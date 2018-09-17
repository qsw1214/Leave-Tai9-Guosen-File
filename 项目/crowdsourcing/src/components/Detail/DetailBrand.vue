<template>
  <section class="brand">
    <div class="weui-panel">
      <div class="weui-panel__hd"><h3>淡水泉（北京）投资管理有限公司</h3><router-link to="/list">List</router-link></div>
      <div class="weui-panel__bd">
        <div class="weui-media-box weui-media-box_text">
          <p class="weui-media-box__desc">品牌价值得分: <b>95分</b>，超过<b>90%</b>的机构</p>
          <p class="weui-media-box__desc">青果星级:<star-rating :inline="true" :star-size="16" :read-only="true" :show-rating="false" :rating="5"></star-rating></p>
          <p class="weui-media-box__desc">累积平均收益:150%</p>
        </div>
      </div>
    </div>
    <div class="weui-panel">
      <div class="weui-panel__hd"><h3>公司综合评估</h3></div>
      <div class="weui-panel__bd">
        <chart :options="radar"></chart>
      </div>
    </div>
    <div class="weui-panel">
      <div class="weui-panel__hd"><h3>全方位解读</h3></div>
      <div class="weui-panel__bd">
        <div class="weui-media-box">
          <template v-for="item in 6">
            <score-bar></score-bar>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import StarRating from 'vue-star-rating'
  import ScoreBar from './SocreBar'

  export default {
    name: 'DetailBrand',
//    data () {
//      let data = []
//      for (let i = 0; i <= 360; i++) {
//        let t = i / 180 * Math.PI
//        let r = Math.sin(2 * t) * Math.cos(2 * t)
//        data.push([r, i])
//      }
//      return {
//        polar: {
//          baseOption: {
//            title: {
//              text: '极坐标双数值轴'
//            },
//            legend: {
//              data: ['line']
//            },
//            polar: {
//              center: ['50%', '54%']
//            },
//            tooltip: {
//              trigger: 'axis',
//              axisPointer: {
//                type: 'cross'
//              }
//            },
//            angleAxis: {
//              type: 'value',
//              startAngle: 0
//            },
//            radiusAxis: {
//              min: 0
//            },
//            series: [
//              {
//                coordinateSystem: 'polar',
//                name: 'line',
//                type: 'line',
//                showSymbol: false,
//                data: data
//              }
//            ],
//            animationDuration: 2000
//          },
//          media: [
//            {
//              query: {
//                maxAspectRatio: 1,
//                maxWidth: 500
//              },
//              option: [
//                {
//                  radius: [20, '50%'],
//                  center: ['50%', '50%']
//                }
//              ]
//            }
//          ]
//        }
//      }
//    },
    data () {
      return {
        radar: {
          title: {
            show: false,
            text: '基础雷达图'
          },
          tooltip: {},
          legend: {
            show: false,
            data: ['预算分配（Allocated Budget）']
          },
          radar: {
            // 设置雷达图的形状为圆
            // shape: 'circle',
            indicator: [
              {name: '背景情况', max: 6500},
              {name: '交易能力', max: 16000},
              {name: '投研能力', max: 30000},
              {name: '投资业绩', max: 38000},
              {name: '产品规模', max: 52000},
              {name: '管理能力', max: 25000}
            ]
          },
          series: [{
            name: '公司综合实力',
            type: 'radar',
            data: [
              {
                value: [4300, 10000, 28000, 35000, 50000, 19000],
                name: '预算分配（Allocated Budget）',
                areaStyle: {
                  normal: {
                    color: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          }]
        }
      }
    },
    methods: {
      onReady (instance) {
        console.log(instance)
      },
      onClick (event, instance, echarts) {
        console.log(arguments)
      }
    },
    components: {
      StarRating,
      ScoreBar
    }
  }
</script>

<style lang="scss" scoped type="text/scss" rel="stylesheet/scss">
  .brand { 
    .weui-media-box__desc {
      line-height: 1.6;
      font-size: 14px;
    }
    .weui-panel__bd .echarts {
      width: 7.5rem;
      height: 5rem;
    }
  }
</style>
