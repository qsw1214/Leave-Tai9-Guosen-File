<template>
  <div class="page page-feedback-list">
    <m-breadcrumb :items="breadcrumb" />
    <el-tabs
      type="border-card"
      v-model="tabName"
      @tab-click="tabClick">
      <el-tab-pane
        v-for="(item, index) in tabs"
        :key="'el-tab-pane_' + index"
        :label="item.label"
        :name="item.name">
        <component :is="item.component" />
      </el-tab-pane>
      <!-- <el-tab-pane
        label="处理列表"
        name="process">
        <process v-if="tabName === 'process'" />
      </el-tab-pane>
      <el-tab-pane
        label="我的建议"
        name="self">
        <self v-if="tabName === 'self'" />
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
  /**
   * @description 建议反馈
   * @router /feedback/list/:tab? tab值: process 处理列表，
   */
  import Process from './IndexProcess'
  import Self from './IndexSelf'

  export default {
    components: {
      Process,
      Self,
    },
    data() {
      return {
        breadcrumb: [
          { name: '主页', to: '/index' },
          { name: '建议反馈' },
        ],
        tabName: '',
        tabs: [],
      }
    },
    beforeRouteUpdate(to, from, next) {
      if (to.params.tab) {
        this.tabName = to.params.tab
      }
      next()
    },
    created() {
      if (this.$permission.valid('1000002')) {
        this.tabs.push({
          label: '处理列表',
          name: 'process',
          component: 'process',
        })
      }
      if (this.$permission.valid('1000001,1000002')) {
        this.tabs.push({
          label: '我的建议',
          name: 'self',
          component: 'self',
        })
      }
      const { tab } = this.$route.params
      if (tab) {
        this.tabName = tab
      } else {
        this.tabName = this.tabs[0].name
      }
    },
    methods: {
      tabClick(newValue) {
        this.$router.replace({
          path: `/feedback/list/${newValue.name}`,
        })
      },
    },
  }
</script>
