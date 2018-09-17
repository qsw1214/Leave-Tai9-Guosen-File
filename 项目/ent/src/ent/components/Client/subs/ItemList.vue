<template>
  <div class="list">
    <ul v-if='list !== null && list.length > 0'>
      <template v-for='item in list'>
        <li v-tap='{methods: showDetails, id: item.id}'>
          <div class="item">
            <div class="item--head">
              <div class="left">
                <span>{{ item.time }}</span>
                <template v-if='item.status'>
                  <span 
                        v-if='item.mode'
                        :class='{"icon__tel": item.mode.id == "10147", "icon__talk": item.mode.id == "10148", "icon__other": item.mode.id == "10149"}'
                        class="icon"></span>
                  <span>{{ item.status.name }}</span>
                </template>
              </div>
              <div class="right">
                <span class="special">{{ item.type }}</span>
              </div>
              </p>
            </div>
            <div class="item--body">
              <div class="topic" v-if='item.theme && (item.theme.length>0)'>
                <p><span v-for='topic in item.theme'>#{{ topic }}#</span></p>
                </div>
              <div class="content" v-if='item.detail_record'>
                <p><small v-if='item.pictures > 0'></small>{{ item.detail_record }}</p>
              </div>
            </div>
          </div>
        </li>
      </template>
    </ul>
    <Empty v-if='list !== null && list.length == 0'></Empty>
  </div>
</template>

<script>
  import Empty from 'components/Common/Empty'
  import { mapGetters } from 'vuex'

  export default {
    name: 'ItemList',
    methods: {
      showDetails (params) {
        this.$router.push({
          path: '/client/followrecord/details',
          query: {
            id: params.id
          }
        })
      }
    },
    components: {
      Empty
    },
    computed: {
      ...mapGetters({
        list: 'getFilterList'
      })
    }
  }
</script>

<style lang='scss' scoped>
  @import '../../../style/mixin';
  @import '~bourbon/app/assets/stylesheets/bourbon';
  
  .list {
    width: 100%;

    ul {
      width: 100%;
      background: #fff;
      border: 1px solid #E1E1E1;

      li {
        box-sizing: border-box;
        display: block;
        width: 100%;
        padding-left: px2rem(45);
        position: relative;
        
        &::before {
          content: ' ';
          height: 100%;
          width: 1px;
          background-color: #E5E9EA;
          left: px2rem(18);
          top: 0px;
          position: absolute;
        }

        &::after {
          content: ' ';
          height: px2rem(8);
          width: px2rem(8);
          left: px2rem(14);
          top: 50%;
          background-image: url(../../../assets/dot@2x.png);
          margin-top: px2rem(2);
          position: absolute;
          background-size: 100%;

          [data-dpr="3"] & {
            background-image: url(../../../assets/dot@3x.png);
          }
        }

        .item {
          border-bottom: 1px solid #E1E1E1;
          box-sizing: border-box;
          padding-right: px2rem(16);
          padding-top: px2rem(18);
          padding-bottom: px2rem(18);

          &--head {
            @include display(flex);
            vertical-align: middle;
            @include font-dpr(12px);
            line-height: px2rem(18);
            color: #999;

            .left {
              @include flex(1);
              .icon {
                display: inline-block;
                vertical-align: middle;
                position: relative;
                top: px2rem(-2);
                width: px2rem(16);
                height: px2rem(16);
                margin: 0 px2rem(8);
                position: relative;
                background-size: 100%;

                &.icon__tel {
                  background-image: url(../../../assets/client_icon_tel@2x.png);
                  [data-dpr="3"] & {
                    background-image: url(../../../assets/client_icon_tel@3x.png);
                  }
                }

                &.icon__talk {
                  background-image: url(../../../assets/client_icon_talk@2x.png);
                  [data-dpr="3"] & {
                    background-image: url(../../../assets/client_icon_talk@3x.png);
                  }
                }

                &.icon__other {
                  background-image: url(../../../assets/client_icon_other@2x.png);
                  [data-dpr="3"] & {
                    background-image: url(../../../assets/client_icon_other@3x.png);
                  }
                }
                }
            }
            .right {
              width: px2rem(120);
              text-align: right;
            }
          }

          &--body {
            clear: both;

            .topic {
              display: inline-block;
              padding-top: px2rem(12);

              p {
                width: px2rem(314);
                height: px2rem(18);
                @include font-dpr(14px);
                color: #FDC02F;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space:nowrap;

                span {
                  margin-right: px2rem(15);

                  &:last-child {
                    margin-right: 0px;
                  }
                }
              }
            }

            .content {
              padding-top: px2rem(12);
              p {
                @include font-dpr(14px);
                width: px2rem(314);
                color: #666;
                line-height: 1.4;
                word-break:break-all;
                word-wrap:break-word;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
                overflow: hidden;

                small {
                  display: inline-block;
                  width: px2rem(18);
                  height: px2rem(16);
                  position: relative;
                  top: px2rem(2);
                  margin-right: px2rem(2);
                  background-image: url(../../../assets/client_icon_image@2x.png);
                  background-size: 100%;

                  [data-dpr="3"] & {
                    background-image: url(../../../assets/client_icon_image@3x.png);
                  }
                }
              }
              
            }
          }
        }

        &:last-child {
          .item {
            border-bottom: none;
          }
        }
      }
    }

    .empty {
      margin-top: px2rem(30);
    }
  }
</style>