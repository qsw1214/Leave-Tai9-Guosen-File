<template>
  <div class="service--item">
    <h2 class="service--item--title">{{ items.title }}</h2>
    <div class="service--item--list">
      <div
        class="service--item-content color-primary-hover"
        v-for="(item, index) in items.children"
        :key="index"
        @click="linkTo(item)">
        <div class="bg-wrap">
          <div
            class="bg"
            :class="[item.module]" />
        </div>
        <div
          class="title"
          v-if="item.name">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  /**
   * <served-item /> 模块首页
   * @prop items {Array} 页面元素 [{ title, desc, link }]，required: true
   * @prop items.title {String} 页面标题，required: true
   * @prop items.children {Array} 页面元素
   * @prop items.children.name {String} 页面元素标题
   * @prop item.children.path {String} 页面元素跳转链接
   * @remark 改完这批代码就要离职了 接下来的兄弟你可惨了 重构纠结死你
   */
  export default {
    name: 'ServedItem',

    props: {
      // 页面元素列表
      items: {
        type: Object,
        required: true,
      },
    },

    methods: {
      linkTo(item) {
        const { type, url } = item
        if (type === 1024) window.open(url)
        else this.$router.push(`${item.path}/${item.code}`)
      },
    },
  }
</script>

<style lang="scss" scoped rel="stylesheet/scss">
  .service--item {
    &--title {
      font-weight: bold;
      font-size: 14px;
      color: #333;
      margin-top: 0;
      margin-bottom: 15px;
    }

    &--list {
      width: 780px;
      display: flex;
      flex-wrap: wrap;
    }

    &-content {
      cursor: pointer;
      width: 130px;
      height: 120px;
      position: relative;
      text-align: center;

      &:not(:hover) {
        color: #666;
      }

      .bg-wrap {
        height: 60px;
        padding: 0 20px;
        text-align: center;

        .bg {
          display: inline-block;
          height: 60px;
          width: 70px;
          background-size: cover;
          background-position: center;

          &.personal-cert {
            background-image: url("../../assets/images/personal-cert.png");
          }

          &.temp-card {
            background-image: url("../../assets/images/temp-card.png");
          }

          &.official-card {
            background-image: url("../../assets/images/official-card.png");
          }

          &.ao-express {
            background-image: url("../../assets/images/ao-express.png");
          }

          &.high-speed-market {
            background-image: url("../../assets/images/high-speed-market.png");
          }

          &.material-printing {
            background-image: url("../../assets/images/material-printing.png");
          }

          &.order-food {
            background-image: url("../../assets/images/order-food.png");
          }

          &.business-card {
            background-image: url("../../assets/images/business-card.png");
          }

          &.fixed-assets {
            background-image: url("../../assets/images/fixed-assets.png");
          }

          &.car {
            background-image: url("../../assets/images/car.png");
          }

          &.it {
            background-image: url("../../assets/images/it.png");
          }

          &.goods {
            background-image: url("../../assets/images/goods.png");
          }

          &.icon-flow-200023 {
            width: 60px;
          }

          &.member-card {
            background-image: url("../../assets/images/member-card.png");
          }

          &.device-manager {
            background-image: url("../../assets/images/device-manager.png");
          }
        }
      }

      .title {
        padding: 15px 8px 0;
        font-size: 14px;
        line-height: 1.2;
      }
    }
  }
</style>
