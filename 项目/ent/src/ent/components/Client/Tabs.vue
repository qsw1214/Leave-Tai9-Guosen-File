<template>
  <div class="tabs">
    <ul>
      <template v-for='(tab,index) in tabs'>
        <router-link :to="{ path: tab.path, query: query}" class="tab" tag="li" replace>
          <div class="tab--content">
            <p>{{ tab.name }}</p>
          </div>
        </router-link>
      </template>
    </ul>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'Tabs',
    data () {
      let query = this.$route.query
      return {
        query
      }
    },
    computed: mapGetters({
      tabs: 'getTabs'
    })
  }
</script>
<style lang='scss' scoped>
  @import '../../style/mixin';
  @import '~bourbon/app/assets/stylesheets/bourbon';

  .tabs {
    background:#fff;
    box-shadow: 0 0 10px 0 rgba(0,0,0,0.10);
    width: 100%;
    height: px2rem(56);
    position: relative;
    z-index: 2;
    
    ul {
      @include display(flex);
      flex-flow: row nowrap;
      -webkit-flex-flow: row nowrap;
      justify-content: space-between;
      -webkit-justify-content: space-between;
      align-items: stretch;
      -webkit-align-items: stretch;

      li.tab {
        height: px2rem(56);
        flex: auto;
        -webkit-flex: auto;
        text-align: center;
        position: relative;

        .tab--content {
          display: inline-block;
          width: px2rem(125);
          height: px2rem(56);
          position: relative;

          p {
            @include font-dpr(16px);
            line-height: px2rem(56);
            color: #999;
          }
        }

        &:not(:last-child):after {
          display: block;
          position: absolute;
          content: ' ';
          width: px2rem(2);
          height: px2rem(18);
          background-image: url(../../assets/client_dark_divider@2x.png);
          background-size: 100%;
          top: px2rem(20);
          right: px2rem(-2);

          [data-dpr="3"] & {
            background-image: url(../../assets/client_dark_divider@3x.png);
          }
        }
      }

      li.router-link-active {
        .tab--content {
          p {
            color: #22A7F0;
          }

          &::after {
            display: block;
            position: absolute;
            content: ' ';
            width: px2rem(125);
            height: px2rem(3);
            background: #22A7F0;
            left: 0px;
            bottom: 0px;
          }
        }
      }
    }
  }
</style>