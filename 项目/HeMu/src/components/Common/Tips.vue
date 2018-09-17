<template>
  <div v-if='props_show'>
    <div :class='{"weui-mask_transparent": !mask, "weui-mask": mask}'></div>
    <div class="weui-toast" v-if='type == "success"'>
        <i class="weui-icon-success-no-circle weui-icon_toast"></i>
        <p class="weui-toast__content">{{ text }}</p>
    </div>
    <div class="weui-toast" v-if='type == "loading"'>
        <i class="weui-loading weui-icon_toast"></i>
        <p class="weui-toast__content">{{ text }}</p>
    </div>
  </div>
</template>
<script>
  // show 显示隐藏 time 消失时间 type显示类型 text显示文本
  export default {
    props: {
      show: {
        type: Boolean,
        default: false
      },
      time: {
        type: Number,
        default: 2000
      },
      type: {
        type: String,
        default: 'success'
      },
      mask: {
        type: Boolean,
        default: false
      },
      text: String
    },
    data () {
      return {
        props_show: false
      }
    },
    watch: {
      show (val) {
        this.props_show = val
      },
      props_show (val) {
        if (val) {
          console.log('开启定时器')
          clearTimeout(this.timeout)
          console.log(this.time)
          this.timeout = setTimeout(() => {
            console.log('comein')
            this.props_show = false
            this.$emit('on-hide')
          }, this.time)
        }
      }
    }
  }
</script>
<style lang='scss' scoped>
  @import '~bourbon/app/assets/stylesheets/bourbon';
  @import '../../style/mixin';

  .weui-toast {
      position: fixed;
      z-index: 5000;
      width: px2rem(122);
      min-height: px2rem(122);
      top: px2rem(180);
      left: 50%;
      margin-left: px2rem(-60);
      background: rgba(40, 40, 40, 0.75);
      text-align: center;
      border-radius: px2rem(5);
      color: #FFFFFF;
  }
  .weui-icon_toast {
      margin: px2rem(20) 0 0;
      display: block;
      &.weui-icon-success-no-circle{
        &:before {
            color: #FFFFFF;
            @include fontSize(55px)
        }
      }
      &.weui-loading{
        margin: px2rem(30) 0 0;
        width: px2rem(40);
        height: px2rem(40);
        vertical-align: baseline;
      }
  }

  .weui-toast__content {
    margin: 0 0 px2rem(15);
    @include fontSize(16px);
    line-height: 1.6;
  }
</style>