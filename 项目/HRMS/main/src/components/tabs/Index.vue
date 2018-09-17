<template>
  <section class="m-tabs">
    <el-tabs
      type="border-card"
      :value="$route.name"
      @tab-click="push">

      <template
        v-for="(item, index) in tabs">
        <el-tab-pane
          v-if="item.permission && $permission.valid(item.permission)"
          :key="index"
          :name="item.name">

          <template slot="label">
            <el-badge
              class="m-tabs__badge"
              v-if="badge[item.name] || item.badge"
              :value="badge[item.name] || item.badge"
              :max="99"
              :hidden="$route.name == item.name" />
            {{ item.label }}
          </template>

        </el-tab-pane>
      </template>

    </el-tabs>
  </section>
</template>

<script>
  /*
  * @prop tabs {Array} 当前tab列表
  *       tabs.label {String} tab名称
  *       tabs.name {String} 路由名称
  *       tabs.badge {Number} 徽章数目
  * @prop badge {Object} 显示 badge 的 tab, { "tab.name": "badge count" }
  * */
  export default {

    name: 'Tabs',
    props: {
      tabs: {
        type: Array,
        required: true,
        default: () => [],
      },

      badge: {
        type: Object,
        required: false,
        default() {
          return {}
        },
      },
    },

    methods: {
      push(component) {
        const { name } = component
        this.$router.push({ name })
      },
    },
  }
</script>

<style lang="scss" type="text/scss">
  .m-tabs {
    position: relative;

    .el-tabs--border-card {
      border-bottom: none;
    }

    .el-tabs__content {
      padding: 0 !important;
      border: none !important;
    }

    .el-tabs__item {
      position: relative;
    }

    &__badge {
      position: absolute !important;
      right: -8px;
      top: -6px;
      z-index: 99;
    }

    & + .m-tabs--panel {
      background: #fff;
      padding: 15px;
      border: 1px solid #e9e9e9;
      border-top: none;
    }
  }
</style>
