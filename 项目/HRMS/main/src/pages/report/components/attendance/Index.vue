<template>
  <div class="page page-attendance">
    <m-breadcrumb :items="breadcrumb" />
    <el-tabs
      type="border-card"
      v-model="tabName"
      @tab-click="tabClick">
      <el-tab-pane
        label="考勤明细表"
        name="details"
        v-if="$permission.valid('1080001')">
        <index-details v-if="tabName === 'details'" />
      </el-tab-pane>
      <el-tab-pane
        label="考勤汇总表"
        name="summary"
        v-if="$permission.valid('1080002')">
        <index-summary v-if="tabName === 'summary'" />
      </el-tab-pane>
      <el-tab-pane
        label="算薪专用考勤表"
        name="salary"
        v-if="$permission.valid('1080003')">
        <index-salary v-if="tabName === 'salary'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  /**
   * @description 企业OA - 图书借阅
   * @router /books/list/:tab?   tab值: all 图书清单，borrow 我借阅的，share 我要分享
   */
  import IndexDetails from './IndexDetails'
  import IndexSummary from './IndexSummary'
  import IndexSalary from './IndexSalary'

  export default {
    name: 'Attendance',
    components: {
      IndexDetails,
      IndexSummary,
      IndexSalary,
    },
    data() {
      const { tab } = this.$route.params
      let defaultTab = 'details'
      if (this.$permission.valid('1080001')) {
        defaultTab = 'details'
      } else if (this.$permission.valid('1080002')) {
        defaultTab = 'summary'
      } else if (this.$permission.valid('1080003')) {
        defaultTab = 'salary'
      }
      return {
        breadcrumb: [
          { name: '报表中心' },
          { name: '考勤管理' },
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
            path: `/attendance/${newValue.name}`,
          })
        }
      },
    },
  }
  </script>

  <style lang="scss" type="text/scss">
  .page-attendance {
    .form-condtion {
      width: 650px;

      .desc {
        color: #999;
        margin-bottom: 16px;
      }
    }

    .table-condtion {
      margin-top: 20px;
    }
  }
</style>
