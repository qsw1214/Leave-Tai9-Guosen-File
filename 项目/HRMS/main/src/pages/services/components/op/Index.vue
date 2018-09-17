<template>
  <div class="page page-organize-personnel">
    <m-breadcrumb :items="breadcrumb" />
    <el-tabs
      type="border-card"
      v-model="tabName"
      @tab-click="tabClick">
      <el-tab-pane
        label="调动申请"
        name="transfer">
        <transfer v-if="tabName === 'transfer'" />
      </el-tab-pane>
      <el-tab-pane
        label="离职申请"
        name="leave">
        <leave v-if="tabName === 'leave'" />
      </el-tab-pane>
      <el-tab-pane
        label="转正申请"
        name="become-regular">
        <become-regular v-if="tabName === 'become-regular'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  /**
   * @description 组织人事首页
   * @router /op/:tab?   tab值: transfer 调动申请，leave 离职，formal 转正
   */
  import Transfer from './IndexTransfer'
  import Leave from './IndexLeave'
  import becomeRegular from './IndexBecomeRegular'

  export default {
    components: {
      Transfer,
      Leave,
      becomeRegular,
    },
    data() {
      const { tab } = this.$route.params
      return {
        breadcrumb: [
          { name: '员工自助' },
          { name: '组织人事' },
        ],
        tabName: tab || 'transfer',
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
        if (newValue.name !== this.$route.params.tab) {
          this.$router.replace({
            path: `/op/${newValue.name}`,
          })
        }
      },
    },
  }
</script>
