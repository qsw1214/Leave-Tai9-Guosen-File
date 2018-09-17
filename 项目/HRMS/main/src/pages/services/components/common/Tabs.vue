<template>
  <section class="pa__tabs">
    <el-tabs
      type="border-card"
      :value="activeTab"
      @tab-click="linkTo">
      <el-tab-pane
        label="流程发起"
        name="pa" />
      <el-tab-pane name="approving">
        <template slot="label">
          <el-badge
            class="tabs__badge"
            v-if="approvingNum"
            :value="approvingNum"
            :max="99"
            :hidden="hiddenApproving" />
          待我审批
        </template>
      </el-tab-pane>
      <el-tab-pane
        label="我已审批"
        name="approved" />
      <el-tab-pane name="application">
        <template slot="label">
          <el-badge
            class="tabs__badge"
            v-if="applicationNum"
            :value="applicationNum"
            :max="99"
            :hidden="hiddenApplication" />
          我发起的
        </template>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
  /*
  * @prop activeTab {String} 当前激活的模块 数据值
  * @value {'pa-流程发起'，'approving-待我审批'，'approved-我已审批'， 'application-我发起的'}
  * */
  export default {
    name: 'PATabs',
    props: {
      activeTab: {
        type: String,
        default: '',
      },
    },
    computed: {
      approvingNum() {
        return this.$store.state.services.approvingNumber
      },
      applicationNum() {
        return this.$store.state.services.applicationNumber
      },
      hiddenApproving() {
        if (this.activeTab === 'approving') {
          return true
        }
        return false
      },
      hiddenApplication() {
        if (this.activeTab === 'application') {
          return true
        }
        return false
      },
    },
    created() {
      this.$store.dispatch('fetch_unread_message')
    },
    methods: {
      linkTo(component) {
        const { name } = component
        this.$router.push(`/${name}`)
      },
    },
  }
</script>

<style lang="scss" type="text/scss">
  .pa__tabs {
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
      position: absolute !important;
      right: -8px;
      top: -6px;
      z-index: 99;
    }
  }
</style>
