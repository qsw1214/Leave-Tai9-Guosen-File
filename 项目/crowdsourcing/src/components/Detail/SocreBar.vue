<template>
  <section class="scorebar">
    <p>{{bar.name}}评估：<b>{{bar.score}}</b>分, 超过<b>{{bar.precent}}%</b>的基金</p>
    <div class="scorll">
      <div class="scorll__bg"></div>
      <div class="scorll__front" style="width: 20%;">
        <div class="scorll__front--bg" :class="{'loading' : loading}"></div>
      </div>
    </div>
    <p class="center">行业平均<b>{{bar.average}}</b>分</p>
  </section>
</template>

<script>
  export default {
    name: 'SocreBar',
    data () {
      return {
        bar: {
          name: '背景情况',
          score: 95,
          precent: 90,
          average: 60
        },
        loading: false
      }
    },
    created () {
      setTimeout(() => {
        this.loading = true
      }, 2000)
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped type="text/scss" rel="stylesheet/scss">
  .scorebar {
    padding: 10px 0px;
    font-size: 12px;
    color: #999;

    .center {
      text-align: center;
    }

    b {
      font-weight: bold;
      color: #2C82EF;
    }

    .scorll {
      position: relative;
      width: 100%;
      height: 0.4rem;

      &__bg, &__front{
        width: 100%;
        height: 100%;
        background: #eee;
        border-radius: 20px;
        position: absolute;
        left: 0px;
        top: 0px;
        z-index: 1;
      }

      &__front {
        background: transparent;
        z-index: 2;

        &--bg {
          position: absolute;
          height: 100%;
          width: 0%;
          left: 0px;
          top: 0px;
          border-radius: 20px;
          background: #2C82EF;

          &.loading {
            width: 100%;
            transition: all 2s ease;
          }
        }
      }
    }
  }
</style>
