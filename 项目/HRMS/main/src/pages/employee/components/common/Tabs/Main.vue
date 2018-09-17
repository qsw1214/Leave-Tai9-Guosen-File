<template>
  <section class="tabs">
    <el-tabs
      type="border-card"
      :value="$route.name"
      @tab-click="linkTo">
      <template
        v-for="(item, index) in tabs">
        <el-tab-pane
          v-if="$permission.valid(item.permission)"
          :key="index"
          :name="item.name">
          <span slot="label">
            <el-badge
              class="tabs__badge"
              v-if="item.badgeNumber > 0"
              :value="item.badgeNumber"
              :max="99"
              :hidden="$route.name == item.name" />
            {{ item.label }}
          </span>
        </el-tab-pane>
      </template>
    </el-tabs>
  </section>
</template>

<script>
  /*
  * @prop tabs {Array} 当前tab列表
  * @prop tabs.label {String} tab名称
  * @prop tabs.name {String} 路由名称
  * @prop tabs.badgeNumber {Number/String} 徽章数目
  * */
  export default {

    name: 'Tabs',
    props: {
      tabs: {
        type: Array,
        required: false,
        default: () => [],
      },
    },

    methods: {
      linkTo(component) {
        const { name } = component
        this.$router.push({ name })
      },
    },
  }
</script>

<style lang="scss" type="text/scss">
  .tabs {
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

    .tabs__badge {
      position: absolute;
      right: -8px;
      top: -6px;
      z-index: 99;
    }
  }
</style>
