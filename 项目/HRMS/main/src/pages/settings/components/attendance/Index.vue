<template>
  <div class="page">

    <m-breadcrumb :items="breadcrumb" />

    <el-tabs
      type="border-card"
      v-model="tabName"
      @tab-click="tabClick">
      <el-tab-pane
        label="考勤数据修正"
        name="correction">
        <correction
          v-if="tabName === 'correction' && !$route.query.history"
          ref="correction" />
        <Correction-history
          v-if="tabName === 'correction' && $route.query.history"
          ref="correction-history" />
      </el-tab-pane>
      <el-tab-pane
        label="员工考勤设置"
        name="setting">
        <setting
          v-if="tabName === 'setting'"
          ref="setting" />
      </el-tab-pane>
      <el-tab-pane
        label="考勤班次设置"
        name="shifts">
        <shifts
          v-if="tabName === 'shifts'"
          ref="shifts" />
      </el-tab-pane>
      <el-tab-pane
        label="异常考勤规则"
        name="rules">
        <rules
          v-if="tabName === 'rules' && !$route.query.edit"
          ref="rules" />
        <rules-edit
          v-if="tabName === 'rules' && $route.query.edit"
          ref="rules-edit"
          @canRedirect="rulesEditCanRedirect = true" />
      </el-tab-pane>
      <el-tab-pane
        label="节假日/周末设置"
        name="holidays">
        <holidays
          v-if="tabName === 'holidays' && !$route.query.weekend"
          ref="holidays" />
        <weekend
          v-if="tabName === 'holidays' && $route.query.weekend"
          ref="weekend" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  /*
  * @description 考勤管理
  * @route /attendance
  */
  import Correction from './Correction'
  import CorrectionHistory from './CorrectionHistory'
  import Setting from './Setting'
  import Shifts from './Shifts'
  import Rules from './Rules'
  import RulesEdit from './RulesEdit'
  import Holidays from './Holidays'
  import Weekend from './Weekend'

  export default {
    components: {
      Correction,
      CorrectionHistory,
      Setting,
      Shifts,
      Rules,
      RulesEdit,
      Holidays,
      Weekend,
    },
    data() {
      const { tab } = this.$route.params

      return {
        tabName: tab || 'correction',
        breadcrumb: [
          { name: '基础配置' },
          { name: '考勤管理' },
        ],

        rulesEditCanRedirect: false,
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
      if (this.tabName !== 'rules' || !this.$route.query.edit) return next()
      if (this.rulesEditCanRedirect) {
        return next()
      }

      return setTimeout(() => {
        this
          .$confirm('系统可能不会保存您所做的更改，确认离开？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            closeOnHashChange: false,
          })
          .then(() => next())
          .catch(() => next(false))
      }, 0)
    },
    beforeRouteLeave(to, from, next) {
      if (this.tabName !== 'rules' || !this.$route.query.edit) return next()
      if (this.rulesEditCanRedirect) {
        return next()
      }

      return setTimeout(() => {
        this
          .$confirm('系统可能不会保存您所做的更改，确认离开？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            closeOnHashChange: false,
          })
          .then(() => next())
          .catch(() => next(false))
      }, 0)
    },
    methods: {
      tabClick(newValue) {
        this.$router.replace({
          path: `/attendance/${newValue.name}`,
        })
      },
    },
  }
</script>
