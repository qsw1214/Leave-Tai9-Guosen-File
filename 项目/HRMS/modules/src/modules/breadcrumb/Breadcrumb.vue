<template>
  <el-breadcrumb
    class="m-breadcrumb"
    separator=">"
    v-if="items && items.length">

    <template v-for="(item, index) in items">
      <el-breadcrumb-item
        :class="{ 'is-link': item.to }"
        :key="item.name"
        @click.native="to(item, index)">{{ item.name }}
      </el-breadcrumb-item>
    </template>

  </el-breadcrumb>
</template>

<script>
  export default {
    name: 'MBreadcrumb',
    props: {
      /**
       * @param name {String}, required, 面包屑名称
       * @param to {String}, option, 面包屑链接
       * @param type {String}, option, 面包屑链接跳转模式，默认 router 跳转模式
       * ******* type === link 为 location.href 跳转
       * @param replace {Boolean}, option, 是否替换当前 history
       */

      items: {
        type: Array,
        required: true,
      },
    },

    methods: {
      to(item, index) {
        const { replace, type, to } = item
        const { location, history } = window

        if (!to) return false

        // 非链接模式，用 router 跳转
        if (type !== 'link') {
          if (replace) this.$router.replace(to)
          else this.$router.push(to)

          return false
        }

        // 链接模式
        if (replace) location.replace(to)
        else if (index === this.items.length - 2) history.go(-1)
        else location.href = to

        return true
      },
    },
  }
</script>
