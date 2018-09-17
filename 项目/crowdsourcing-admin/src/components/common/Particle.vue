<template>
  <div class="canvas__particle">
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
  // 圆 圆心xy坐标，半径，每帧移动xy的距离
  function Circle (x, y, r, moveX, moveY) {
    this.x = x
    this.y = y
    this.r = r
    this.moveX = moveX
    this.moveY = moveY
  }

  // 线条：开始xy坐标，结束xy坐标，线条透明度
  function Line (x, y, _x, _y, o) {
    this.beginX = x
    this.beginY = y
    this.closeX = _x
    this.closeY = _y
    this.o = o
  }
  var drawTimer = null
  export default {
    name: 'Particle',
    data () {
      return {
        // 屏幕上显示的圆
        POINT: 35,
        circleArr: [],
        context: null,
        WIDTH: 0,
        HEIGHT: 0,
        showRange: 400,
        maxCircle: 20,
        minCircle: 2,
        speed: 80
      }
    },
    mounted () {
      this.WIDTH = window.innerWidth
      this.HEIGHT = window.innerHeight
      var canvas = document.getElementById('canvas')
      canvas.width = this.WIDTH
      canvas.height = this.HEIGHT
      var context = canvas.getContext('2d')
      this.context = context
      // 笔触颜色
      context.strokeStyle = 'rgba(0,0,0,0.02)'
      context.strokeWidth = 1
      // 定义填充内容
      context.fillStyle = 'rgba(0,0,0,0.05)'

      this.init()
    },
    methods: {
      // 初始化
      init () {
        this.circleArr = []
        for (let i = 0; i < this.POINT; i++) {
          let x = this.randomNum(this.WIDTH)
          let y = this.randomNum(this.HEIGHT)
          let r = this.randomNum(this.maxCircle, this.minCircle)
          let moveX = this.randomNum(40, -40) / this.speed
          let moveY = this.randomNum(10, -10) / this.speed
          this.circleArr.push(new Circle(x, y, r, moveX, moveY))
        }
        drawTimer = setInterval(() => {
          for (var i = 0; i < this.POINT; i++) {
            var cir = this.circleArr[i]
            cir.x += cir.moveX
            cir.y += cir.moveY
            if (cir.x > this.WIDTH) cir.x = 0
            else if (cir.x < 0) cir.x = this.WIDTH
            if (cir.y > this.HEIGHT) cir.y = 0
            else if (cir.y < 0) cir.y = this.HEIGHT
          }
          this.draw()
        }, 16)
      },
      // 逐帧绘制
      draw () {
        let circle = this.circleArr
        this.context.clearRect(0, 0, this.WIDTH, this.HEIGHT)
        circle.forEach(item => {
          this.drawCircle(item.x, item.y, item.r)
        })
        let point = this.POINT
        for (var i = 0; i < point; i++) {
          for (var j = 0; j < point; j++) {
            if (i != j) {
              const lineLength = Math.sqrt((Math.pow((circle[j].x - circle[i].x), 2)) + (Math.pow((circle[j].y - circle[i].y), 2)))
              // 300 范围内的线根据距离显示透明度
              let o = lineLength < this.showRange ? ((1 / lineLength) * 5) : 0
              var lineOpacity = o > 0.03 ? 0.03 : o
              // 抛弃那些距离很远的点
              if (lineOpacity > 0) {
                this.drawLine(circle[i].x, circle[i].y, circle[j].x, circle[j].y, lineOpacity)
              }
            }
          }
        }
      },
      // 画线
      drawLine (x, y, _x, _y, o) {
        let cxt = this.context
        let line = new Line(x, y, _x, _y, o)
        cxt.beginPath()
        cxt.strokeStyle = 'rgba(0,0,0,' + o + ')'
        cxt.moveTo(line.beginX, line.beginY)
        cxt.lineTo(line.closeX, line.closeY)
        cxt.closePath()
        cxt.stroke()

        return line
      },
      // 画圆
      drawCircle (x, y, r, moveX, moveY) {
        let cxt = this.context
        let circle = new Circle(x, y, r, moveX, moveY)
        cxt.beginPath()
        // x坐标 y坐标 r半径 sAngle起始角 eAngle结束角
        cxt.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI)
        cxt.closePath()
        cxt.fill()

        return circle
      },
      // 生成max和min之间的随机数
      randomNum (max, _min) {
        let min = arguments[1] || 0
        return Math.floor(Math.random() * (max - min + 1) + min)
      }
    },
    beforeDestroy () {
      clearInterval(drawTimer)
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .canvas__particle {
    position: fixed;
    height: 100%;
    width: 100%;
    z-index: -1;
    top:0;
    left:0;
  }
</style>
