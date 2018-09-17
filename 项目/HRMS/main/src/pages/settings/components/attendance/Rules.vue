<template>
  <!-- 异常考勤规则 -->
  <div
    v-loading="loading"
    class="attendance-rules">

    <div>
      <el-button
        icon="el-icon-edit"
        type="primary"
        @click="$router.push({ query: { edit: 1 } })">编辑
      </el-button>

      <div
        class="empty-block"
        v-if="!data.length" />
    </div>

    <m-section
      class="inside-section">
      <!-- 迟到 -->
      <template v-for="rule in data">

        <m-section-row
          v-if="rule.rule_type !== 5"
          :key="rule.id">
          <m-section-cell
            title="异常类型"
            :content="ruleType[rule.rule_type]" />
          <m-section-cell
            title="当月免责次数"
            :content="`${rule.exempt_times} 次`" />
        </m-section-row>
        <m-section-row
          v-if="rule.rule_type !== 5"
          :key="rule.id + 'min'">
          <m-section-cell
            :title="rule.time_type === 1 ? '上班时间之后' : '下班时间之前'"
            :content="`${rule.min_second} 分钟 到 ${rule.max_second} 分钟`" />
        </m-section-row>

        <!-- 旷工 -->
        <m-section-row
          v-if="rule.rule_type === 5 && rule.time_type === 1"
          :key="rule.id">
          <m-section-cell
            title="异常类型"
            content="旷工" />
          <m-section-cell
            title="当月免责次数"
            :content="`${rule.exempt_times} 次`" />
        </m-section-row>

        <m-section-row
          v-if="rule.rule_type === 5 && rule.time_type === 1"
          :key="rule.id + '1'">
          <m-section-cell
            title="上班时间之后"
            :content="`${rule.max_second} 分钟则计为上午旷工`" />
        </m-section-row>

        <m-section-row
          v-if="rule.rule_type === 5 && rule.time_type === 2"
          :key="rule.id + '1'">
          <m-section-cell
            title="下班时间之前"
            :content="`${rule.max_second} 分钟则计为下午旷工`" />
        </m-section-row>

      </template>
    </m-section>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        loading: false,
        data: [],
        ruleType: {
          1: '迟到',
          2: '超时迟到',
          3: '早退',
          4: '超时早退',
          5: '旷工',
        },
      }
    },
    created() {
      this.getData()
    },
    methods: {
      // 获取数据
      async getData() {
        this.loading = true
        await this.$axios({
          url: this.$api.settings.attendance.ruleDet,
        }).then(({ code, data }) => {
          if (code === 0) {
            this.data = data.list
          }
        }).catch(() => {})
        this.loading = false
      },
    },
  }
</script>

<style lang="scss">
.attendance-rules {
  .inside-section {
    border: 0;
    margin-top: 0;
    margin-bottom: -15px;
    margin-right: -15px;
    margin-left: -15px;
  }

  .empty-block {
    padding-bottom: 14px;
  }
}
</style>
