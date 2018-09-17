<template>
  <div class="choose" :class="{'open': show}" v-if='topics && topics.length > 0'>
    <div  v-tap="{ methods : toggleOpen }"><h1><b class="icon"></b><span>筛选主题</span></h1></div>
    <div class="choosetopic" v-if='show'>
      <span 
        v-tap='{ methods: pickTopic, topic: topic }'
        :class='{ "pick": topic.choose }'
        v-for='topic in topics'>
        {{ topic.name }}</span>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'ChooseTopic',
    data () {
      return {
        isOpen: false
      }
    },
    methods: {
      toggleOpen () {
        this.toggle()
      },
      // params 此参数查看v-tap
      pickTopic (params) {
        this.$store.dispatch('pickTopic', params.topic)
        // todo... 给出一个组件事件
        // this.$emit('choice')
      },
      ...mapActions({
        // 映射 this.toggle() 为 this.$store.dispatch('toggle')
        toggle: 'toggle'
      })
    },
    computed: {
      ...mapGetters({
        // 映射 this.doneCount 为 store.getters.doneTodosCount
        show: 'getTopicState',
        topics: 'gettopicList'
      })
    }
  }
</script>

<style lang='scss' scoped>
  @import '../../../style/mixin';
  @import '~bourbon/app/assets/stylesheets/bourbon';
  .choose {
    box-sizing: border-box;
    width: 100%;
    padding: 0px px2rem(14) 0 px2rem(34);
    min-height: px2rem(48);
    background:#FAFAFA;

    h1 {
      height: px2rem(48);
      width: px2rem(90);
      line-height: px2rem(48);
      color: #6d4c02;
      
      b {
        display: inline-block;
        height: px2rem(18);
        width: px2rem(18);
        vertical-align: middle;
        position: relative;
        top: px2rem(-2);
        margin-right: px2rem(4);
        background-image: url(../../../assets/client_choose@2x.png);
        background-size: 100%;

        [data-dpr='3'] & {
          background-image: url(../../../assets/client_choose@3x.png);
        }
      }
    }

    .choosetopic {
      width: 100%;
      @include align-items(stretch);
      @include display(flex);
      @include justify-content(flex-start);
      flex-flow: row wrap;
      margin-top: px2rem(12);

      span {
        line-height: 1.75;
        padding: 0px px2rem(12);
        @include font-dpr(14px);
        border: 1px #ccc solid;
        color: #ccc;
        border-radius:px2rem(3);
        margin-right: px2rem(16);
        margin-bottom: px2rem(8);

        &.pick {
          border: 1px #ccc solid;
          background: #F7CA18;
          font-family: PingFangSC-Regular;
          color: #6D4C02;
          @include transition(all, .5s, ease);
        }
      }
    }

    &.open {
      padding-bottom: px2rem(16);
      
      h1 {
        position:relative;
        &::after {
          content: ' ';
          position: absolute;
          width: px2rem(90);
          height: px2rem(3);
          background: #E1E1E1;
          bottom: px2rem(2);
          left: 0px;
        }
      }
    }
  }
</style>