<template>
  <div class="page page-feedback-list">
    <m-breadcrumb :items="breadcrumb" />
    <el-tabs
      type="border-card"
      v-model="tabName"
      @tab-click="tabClick">
      <el-tab-pane
        label="图书清单"
        name="all"
        v-if="$permission.valid('1070003')">
        <all v-if="tabName === 'all'" />
      </el-tab-pane>
      <el-tab-pane
        label="我借阅的"
        name="borrow"
        v-if="$permission.valid('1070003')">
        <borrow v-if="tabName === 'borrow'" />
      </el-tab-pane>
      <el-tab-pane
        label="我要分享"
        name="share"
        v-if="$permission.valid('1070004')">
        <share v-if="tabName === 'share'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  /**
   * @description 企业OA - 图书借阅
   * @router /books/list/:tab?   tab值: all 图书清单，borrow 我借阅的，share 我要分享
   */

  import All from './IndexAll'
  import Borrow from './IndexBorrow'
  import Share from './IndexShare'

  export default {
    components: {
      All,
      Borrow,
      Share,
    },
    data() {
      const { tab } = this.$route.params
      let defaultTab = 'all'
      if (!this.$permission.valid('1070003')) {
        defaultTab = ''
      }
      if (this.$permission.valid('1070004') && !defaultTab) {
        defaultTab = 'share'
      }
      return {
        breadcrumb: [
          { name: '企业OA' },
          { name: '图书借阅' },
        ],
        tabName: tab || defaultTab,
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
            path: `/books/list/${newValue.name}`,
          })
        }
      },
    },
  }
</script>

<style lang="scss" type="text/scss">
.page-feedback-list {
  .dialog-borrow-desc {
    width: 400px;
    min-width: 400px;
  }
}
</style>
