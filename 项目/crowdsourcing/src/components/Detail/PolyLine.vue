<template>
  <section class="polyline">
    <p>近2年来淡水泉累计平均收益率：<b>189%</b></p>
    <p>近2年沪深300平均收益率：<b>9.89%</b></p>
    <chart :options="polyline" ref="polyline"></chart>
  </section>
</template>

<script>
  var data = [['2000-06-05', 16], ['2000-06-06', 129], ['2000-06-07', 35], ['2000-06-08', 86], ['2000-06-09', 73]]
  var data2 = [['2000-06-05', 160], ['2000-06-06', 23], ['2000-06-07', 35], ['2000-06-08', 186], ['2000-06-09', 63]]
  var dateList = data.map(function (item) {
    return item[0]
  })
  var valueList = data.map(function (item) {
    return item[1]
  })
  var valueList2 = data2.map(function (item) {
    return item[1]
  })
  export default {
    name: 'PolyLine',
    data () {
      return {
        polyline: {
          legend: {
            data: ['本产品', '上证'],
            bottom: 0
          },
          title: [{
            show: false,
            left: 'center',
            text: 'Gradient along the y axis'
          }],
          tooltip: {
            trigger: 'axis'
          },
          xAxis: [{
            data: dateList,
            axisTick: {show: false},
            axisLine: {show: false},
            axisLabel: {
              textStyle: {
                color: '#ccc'
              }
            }
          }],
          yAxis: [{
            position: 'right',
            splitLine: {show: true},
            axisTick: {show: false},
            axisLine: {show: false},
            axisLabel: {
              show: true,
              textStyle: {
                color: '#ccc'
              }
            }
          }],
          grid: [{
            top: '10px'
          }],
          series: [{
            name: '本产品',
            type: 'line',
            data: valueList
          }, {
            name: '上证',
            type: 'line',
            data: valueList2
          }]
        }
      }
    },
    created () {
//      console.log(this.$refs.polyline)
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped type="text/scss" rel="stylesheet/scss">
  .polyline {
    margin-top: 0.1rem;
    p {
      color: #333;
      font-size: 12px;
      line-height:1.6;
      padding-left: 0.5rem;

      b {
        color: red;
        font-weight:bold;
      }
    }
    .echarts {
      width: 7.5rem;
      height: 5rem;
    }
  }
</style>
