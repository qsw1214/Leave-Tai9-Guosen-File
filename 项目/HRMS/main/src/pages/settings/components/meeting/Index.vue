<template>
  <div class="page">

    <m-breadcrumb :items="breadcrumb" />

    <el-tabs
      type="border-card"
      v-model="tabName"
      @tab-click="tabClick">
      <el-tab-pane
        label="会议室管理"
        name="room">
        <room
          v-if="tabName === 'room'"
          ref="room" />
      </el-tab-pane>
      <el-tab-pane
        label="设备管理"
        name="equipment">
        <equipment
          v-if="tabName === 'equipment'"
          ref="equipment" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  /*
  * @description 会议管理
  * @route /meeting or /meeting/index
  */
  import Room from './Room'
  import Equipment from './Equipment'

  export default {
    components: {
      Room,
      Equipment,
    },
    data() {
      const { tab } = this.$route.params

      return {
        tabName: tab || 'room',
        breadcrumb: [
          { name: '数据管理' },
          { name: '会议管理' },
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
          path: `/meeting/index/${newValue.name}`,
        })
      },
    },
  }
</script>
