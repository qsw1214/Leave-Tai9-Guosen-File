<template>
  <div class="cal-table">
    <div class="cal-table--weekdays">
      <span
        class="weekday"
        v-for="(weekday, index) in weekdays"
        :key="index">{{ weekday }}</span>
    </div>

    <div class="cal-table--days">
      <div
        class="row"
        v-for="(row, index) in days"
        :key="index">
        <template
          v-for="(col, colIndex) in row">
          <day-item
            :data="col"
            :event="events[`${col.year}-${col.month}-${col.day}`]"
            :key="colIndex"
            @toggleTooltip="toggleTooltip" />
        </template>
      </div>

      <tooltip
        ref="tooltip"
        :content="tooltipEvent" />
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import DayItem from './DayItem'
  import Tooltip from './Tooltip'

  moment.locale('zh-cn')
  export default {
    name: 'CalendarDays',
    components: { DayItem, Tooltip },
    props: {
      object: {
        type: Object,
        required: true,
      },
      events: {
        type: Object,
        default() {
          return {}
        },
      },
      isTooltip: {
        type: Boolean,
        default: false,
      },
    },

    data() {
      return {
        weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        showTooltip: false,
        // 单个日期事件
        tooltipEvent: {},
      }
    },

    computed: {
      days() {
        const { year, month } = this.object
        const monthString = month > 9 ? month : `0${month}`
        const target = new Date(`${year}-${monthString}-01`)
        const daysArray = [[], [], [], [], [], []] // 6*7 的日历数组
        const currentWeekday = moment(target).date(1).weekday() // 获取当月1日为星期几
        const lastMonthDays = moment(target).subtract(1, 'month').daysInMonth() // 获取上月天数
        const currentMonthDays = moment(target).daysInMonth() // 获取当月天数
        const getDay = (day) => {
          const diff = day - lastMonthDays
          let y = year
          if (diff <= 0 && month === 1) y = year - 1
          else if (diff >= lastMonthDays && month === 12) y = year + 1

          let m = month
          if (diff <= 0 && month === 1) m = 12
          else if (diff <= 0) m -= 1
          else if (diff > currentMonthDays && month === 12) m = 1
          else if (diff > currentMonthDays) m += 1

          const res = {
            disabled: diff <= 0 || diff > currentMonthDays,
            year: y,
            month: m,
          }

          if (day <= lastMonthDays) res.day = day
          else if (day <= lastMonthDays + currentMonthDays) res.day = day - lastMonthDays
          else res.day = day - (lastMonthDays + currentMonthDays)

          const today = new Date()
          res.isToday = today.getFullYear() === y &&
            today.getMonth() + 1 === m &&
            today.getDate() === res.day

          return res
        }

        for (let i = 0; i < 7; i += 1) {
          const virtualDay = (lastMonthDays - currentWeekday) + i
          for (let j = 0; j < 6; j += 1) {
            daysArray[j][i] = {
              ...getDay(virtualDay + (j * 7)),
              isWeekend: i === 0 || i === 6,
            }
          }
        }

        return daysArray
      },
    },

    methods: {
      toggleTooltip({ data, position }) {
        const { $el, $refs } = this.$refs.tooltip
        const flag = !this.showTooltip
        this.tooltipEvent = data
        this.showTooltip = flag

        setTimeout(() => {
          if (flag) {
            let { left, top } = position

            top -= $el.offsetHeight + 11
            left += 10
            $el.style.cssText = `opacity: 1; top: ${top}px`
            $refs.arrow.style.cssText = `left: ${left}px`
          } else {
            $el.style.cssText = ''
          }
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .cal-table {
    background-color: #fff;
    transition: all 0.3s ease;

    &--weekdays {
      display: flex;
      text-align: center;
      color: #999;
      margin: 14px 0 12px;

      .weekday {
        flex: 1;
        line-height: 1;
      }
    }

    &--days {
      .row {
        display: flex;
      }

      .col {
        flex: 1;
        width: 14.2857143%;
        text-align: center;
        height: 54px;
        display: block;
        line-height: 1;

        &:hover {
          .day {
            border-color: #5090f7;
          }
        }
      }
    }
  }
</style>

