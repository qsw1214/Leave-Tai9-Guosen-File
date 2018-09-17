<template>
  <div class="otherinput" v-tap="{ methods: switchInput }">
    <p>
      <span class="fl">录入人：{{ overview.user_name }}</span>
      <span class='fr' v-if='overview.num > 0'>还有{{ overview.num }}录入人 <small></small></span>
    </p>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'otherInput',
    methods: {
      switchInput () {
        if (this.overview.num > 0) {
          this.$router.push({
            path: '/client/followrecord/picker'
          })
        }
      }
    },
    computed: mapGetters({
      overview: 'getOverview'
    })
  }
</script>

<style lang='scss' scoped>
  @import '../../style/mixin';
  .otherinput {
    height: px2rem(50);
    line-height: px2rem(50);
    color: #c2c2c2;
    padding-right: px2rem(15);
    padding-left: px2rem(32);

    p {
      height: px2rem(50);
      line-height: px2rem(50);
      @include font-dpr(15px);

      small {
        display: inline-block;
        vertical-align: middle;
        width: px2rem(20);
        height: px2rem(20);
        background-image: url(../../assets/client_arrow@2x.png);
        background-size: 100% 100%;
        background-color: dodgerblue;
        border-radius: 50%;
        box-shadow: px2rem(2) px2rem(5) px2rem(15) rgba(13,65,94,1);
        margin-left: px2rem(15);

        [data-dpr="3"] & {
          background-image: url(../../assets/client_arrow@3x.png);
        }
      }
    }
  }
</style>