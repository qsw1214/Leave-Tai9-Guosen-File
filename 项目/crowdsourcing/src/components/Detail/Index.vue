<template>
  <section class="detail">
    <section class="weui-tab">
      <div class="weui-navbar">
        <template v-for="item in menu.children">
          <router-link :to="item.path" class="weui-navbar__item" tag="div">{{ item.name }}</router-link>
        </template>
      </div>
    </section>
    <router-view></router-view>
  </section>
</template>

<script>
  export default {
    name: 'Detail',
    data () {
      return {
        menu: ''
      }
    },
    created () {
      this.menu = this.$router.options.routes.filter(item => {
        return item.path === '/detail'
      })[0]
    },
    methods: {
    }
  }
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  .detail {
    .weui-navbar {
      position: static;
    }

    .router-link-exact-active {
      background-color: #eee;
    }

    .weui-panel__hd {
      h3 {
        color: #2C82EF;
      }
    }
  }
</style>
