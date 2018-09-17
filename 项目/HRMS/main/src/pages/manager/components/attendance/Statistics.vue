<template>
  <section class="statistics">
    <div class="statistics--title">
      <h3>统计周期</h3>
      <el-select
        style="width: 120px; margin-right: 15px;"
        placeholder="请选择"
        v-model="type"
        @change="changeDate">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </el-select>

      <template v-if="type === '1'">
        <el-date-picker
          type="week"
          style="width: 160px; margin-right: 15px;"
          format="yyyy 第 WW 周"
          placeholder="选择周"
          v-model="week"
          :clearable="false"
          :picker-options="pickerOptions"
          @change="changeDate" />
        <span class="tips">{{ weekRangStr }}</span>
      </template>

      <template v-if="type === '2'">
        <el-date-picker
          type="month"
          style="width: 160px;"
          format="yyyy 年 MM 月"
          placeholder="选择月"
          v-model="month"
          :picker-options="pickerOptions2"
          :clearable="false"
          @change="changeDate" />
      </template>
    </div>

    <div class="statistics--body">
      <div class="statistics--body__left">
        <StatisticsItem
          type="hardworking"
          ref="statistics1" />
      </div>

      <div class="statistics--body__right">
        <StatisticsItem
          type="later"
          ref="statistics2" />
      </div>
    </div>

    <p class="statistics--tips">*1.勤奋榜仅含正常班次员工（8：30~17：30）；2.因公外出、出差按标准工时计；3.请假、异常考勤剔除勤奋榜。</p>
  </section>
</template>

<script>
  import StatisticsItem from './StatisticsItem'

  export default {
    name: 'Statistics',

    components: {
      StatisticsItem,
    },

    data() {
      const lastMonday = this.getLastWeekMonday()
      const saturday = new Date(lastMonday.getTime() + (5 * 24 * 60 * 60 * 1000))
      const lastMonthDay = this.getLastMonthDay()

      return {
        type: '1',
        week: lastMonday,
        month: lastMonthDay,
        options: [
          { label: '按周统计', value: '1' },
          { label: '按月统计', value: '2' },
        ],
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > saturday.getTime()
          },
        },
        pickerOptions2: {
          disabledDate(time) {
            return time.getTime() > lastMonthDay.getTime()
          },
        },
      }
    },

    computed: {
      weekRangStr() {
        const date = this.week
        const sunday = new Date(date.getTime() - (1 * 24 * 60 * 60 * 1000))
        const saturday = new Date(date.getTime() + (5 * 24 * 60 * 60 * 1000))
        const sundayStr = this.$utils.tools.formatDate(sunday)
        const saturdayStr = this.$utils.tools.formatDate(saturday)

        return `${sundayStr} ~ ${saturdayStr}`
      },
    },

    methods: {
      getLastWeekMonday() {
        const date = new Date()
        const week = date.getDay() + 6
        const monday = new Date(date.getTime() - (week * 24 * 60 * 60 * 1000))

        return monday
      },

      getLastMonthDay() {
        const date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth()

        if (month < 0) {
          month = 11
          year -= 1
        }

        return new Date(year, month, 0)
      },

      changeDate() {
        this.$nextTick(() => {
          this.$refs.statistics1.fetch()
          this.$refs.statistics2.fetch()
        })
      },
    },
  }
</script>

<style lang="scss">
  .statistics {
    width: 100%;

    &--title {
      display: flex;
      align-items: center;

      &::before {
        content: ' ';
        height: 18px;
        width: 4px;
        background: #5090f7;
        margin-right: 5px;
      }

      h3 {
        font-size: 18px;
        color: #000;
        margin-right: 15px;
      }

      .tips {
        color: #999;
        font-weight: bold;
      }
    }

    &--body {
      display: flex;

      &__left {
        width: 50%;
        margin-right: 20px;
      }

      &__right {
        width: 50%;
      }
    }

    &--tips {
      color: #999;
      margin-top: 8px;
    }
  }
</style>
