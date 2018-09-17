<template>
  <div class="page">

    <m-breadcrumb :items="breadcrumb" />

    <el-tabs
      type="border-card"
      v-model="tabName"
      @tab-click="tabClick">
      <el-tab-pane
        label="流程监控"
        name="monitor">
        <monitor
          v-if="tabName === 'monitor'"
          ref="monitor" />
      </el-tab-pane>
      <el-tab-pane
        label="流程设置"
        name="settings">
        <settings
          v-if="tabName === 'settings'"
          ref="settings" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  /*
  * @description 流程管理
  * @route /process or /process/index
  */
  import Settings from './IndexSettings'
  import Monitor from './IndexMonitor'

  export default {
    components: {
      Settings,
      Monitor,
    },
    data() {
      const { tab } = this.$route.params

      return {
        tabName: tab || 'monitor',
        breadcrumb: [
          { name: '基础配置' },
          { name: '流程管理', to: '/process/index' },
        ],
      }
    },
    created() {
      if (this.$route.params.tab) {
        this.tabName = this.$route.params.tab
      }
    },
    beforeRouteUpdate(to, from, next) {
      if (to.params.tab) {
        this.tabName = to.params.tab
      }
      next()
    },
    methods: {
      tabClick(newValue) {
        this.$router.replace({
          path: `/process/index/${newValue.name}`,
        })
      },
    },
  }
</script>
