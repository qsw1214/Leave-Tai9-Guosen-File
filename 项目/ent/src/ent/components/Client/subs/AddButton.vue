<template>
  <div class="add" @click='forward' v-if='overview && (overview.is_oneself == 1)'>
    <p>添加<br>记录</p>
  </div>
</template>

<script>
  import JSBridge from 'helper/JSBridge'
  export default {
    props: {
      overview: {
        type: Object
      }
    },
    name: 'AddButton',
    methods: {
      forward () {
        let customerID = this.$route.query.customerID
        let local = this.$store.state.client.overview.local.id
        let data = {}
        data.customerID = customerID
        data.local = local
        JSBridge.native('addRecord', JSON.stringify(data))
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import '../../../style/mixin';
  
  .add {
    position: fixed;
    opacity: 1;
    height: px2rem(60);
    width: px2rem(60);
    right: px2rem(16);
    bottom: px2rem(40);
    color: #000;
    font-weight: bold;
    border-radius: 50%;
    background-image: linear-gradient(135deg, #22A7F0 0%, #3A75C2 100%);
    box-shadow: 0 px2rem(16) px2rem(26) 0 rgba(24,135,203,0.52);

    p {
      height: px2rem(60);
      width: px2rem(60);
      display: table-cell;
      vertical-align: middle;
      color:#fff;
      font-weight: 400;
      @include font-dpr(14px);
      line-height: 1.4;
      text-align: center;
    }
  }
</style>