<template>
  <div class="page--index-item calendar">

    <div class="calendar--head">
      <span class="year">{{ today.year }}年</span>
      <span class="month">{{ today.month }}月</span>
      <span class="date">{{ today.date }}</span>
      <span class="week">星期{{ today.week }}</span>
    </div>

    <div
      v-loading="loading"
      class="calendar--body">
      <div class="cal">
        <div class="cal--head">
          <div
            class="cal--head-month"
            @click="togglePicker">{{ year }}年{{ month }}月</div>
          <span
            class="cal--head-prev"
            @click="renderDays('prev')"><i class="el-icon-arrow-left" /></span>
          <span
            class="cal--head-next"
            @click="renderDays('next')"><i class="el-icon-arrow-right" /></span>
        </div>

        <div class="cal--body">
          <days
            class="cal-table__current"
            ref="current"
            :events="events"
            :object="current" />
        </div>

        <transition name="el-fade-in-linear">
          <picker
            v-show="showPicker"
            @picker="picker" />
        </transition>

        <div class="cal--analysis">
          <div class="cal--analysis-item">{{ info.later_cnt }}次<span>迟到</span></div>
          <div class="cal--analysis-item">{{ info.early_cnt }}次<span>早退</span></div>
          <div class="cal--analysis-item">{{ info.qj_days / 2 }}天<span>请假</span></div>
          <div class="cal--analysis-item">{{ info.over_later_cnt }}次<span>超时迟到</span></div>
          <div class="cal--analysis-item">{{ info.over_early_cnt }}次<span>超时早退</span></div>
          <div class="cal--analysis-item">{{ info.not_sign }}次<span>未打卡申诉</span></div>
          <div class="cal--analysis-item">{{ info.business_out }}次<span>因公外出</span></div>
          <div class="cal--analysis-item">{{ info.travel_days / 2 }}天<span>出差</span></div>
          <div class="cal--analysis-item">{{ info.off_work_days / 2 }}天<span>旷工</span></div>
        </div>
        <div class="cal--annual-leave">
          <div class="title">年假余额</div>
          <div class="content"><strong>{{ info.balance_annual_leave_days / 2 }}</strong>天</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import moment from 'moment'
  import Days from './cal/Days'
  import Picker from './cal/Picker'

  moment.locale('zh-cn')
  const weekday = ['日', '一', '二', '三', '四', '五', '六']
  const numberHandler = num => (num > 9 ? num : `0${num}`)

  export default {
    name: 'Calendar',
    components: { Days, Picker },

    data() {
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1

      return {
        today: {
          year,
          month,
          date: date.getDate(),
          week: weekday[date.getDay()],
        },

        events: {},
        year,
        month,
        current: {
          year,
          month,
        },

        showPicker: false,
        info: {},
        loading: false,
      }
    },

    mounted() {
      this.current.days = this.getMonthDays()
      this.fetch()
    },

    methods: {
      fetch() {
        const month = numberHandler(this.month)

        this.loading = true
        this.$axios
          .get(this.$api.index.index.attendanceRecord, {
            params: { date: `${this.year}-${month}` },
          })
          .then(({ data }) => {
            const { list } = data
            this.info = data

            // 转为 this.events {Object} 格式
            if (list.length) {
              const events = {}
              list.forEach((item) => {
                let prop = item.date.split('-')
                prop = prop.map(it => parseInt(it, 10)).join('-')

                events[prop] = item
              })

              this.events = events
            }
          })
          .catch(() => {})
          .then(() => {
            this.loading = false
          })
      },

      getMonthDays(date) {
        const target = date || new Date()
        const daysArray = [[], [], [], [], [], []] // 6*7 的日历数组
        const currentWeekday = moment(target).date(1).weekday() // 获取当月1日为星期几
        const lastMonthDays = moment(target).subtract(1, 'month').daysInMonth() // 获取上月天数
        const currentMonthDays = moment(target).daysInMonth() // 获取当月天数
        const getDay = (day) => {
          if (day <= lastMonthDays) return day
          if (day <= lastMonthDays + currentMonthDays) return (day - lastMonthDays)
          return (day - (lastMonthDays + currentMonthDays))
        }

        for (let i = 0; i < 7; i += 1) {
          const virtualDay = (lastMonthDays - currentWeekday) + i
          for (let j = 0; j < 6; j += 1) {
            daysArray[j][i] = getDay(virtualDay + (j * 7))
          }
        }

        return daysArray
      },

      getPrev() {
        const { month, year } = this
        return {
          year: month === 1 ? (year - 1) : year,
          month: month === 1 ? 12 : (month - 1),
        }
      },

      getNext() {
        const { month, year } = this
        return {
          year: month === 12 ? (year + 1) : year,
          month: month === 12 ? 1 : (month + 1),
        }
      },

      renderDays(type) {
        let that = this
        if (type === 'prev') that = this.getPrev()
        else if (type === 'next') that = this.getNext()
        const { year, month } = that

        this.year = year
        this.month = month

        const m = numberHandler(month)
        Object.assign(this.current, {
          year,
          month,
          days: this.getMonthDays(`${year}-${m}-01`),
        })

        this.fetch()
      },

      togglePicker() {
        this.showPicker = !this.showPicker
      },

      picker({ year, month }) {
        this.year = year
        this.month = month
        this.renderDays()
        this.togglePicker()
      },
    },
  }
</script>

<style lang="scss">
  .page--index {
    .calendar {
      ul {
        list-style: none;
      }

      &--head {
        height: 180px;
        background: url(../../assets/images/calendar-bg.jpg) no-repeat 0 0;
        background-size: 100%;
        color: #fff;
        font-size: 16px;
        text-align: center;
        line-height: 1;
        position: relative;
        padding-top: 18px;

        .date {
          font-size: 80px;
          margin: 18px 0;
          display: block;
          line-height: 80px;
        }

        .week {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 12px;
        }
      }

      &--body {
        background-color: #fff;
        position: relative;
        padding-top: 1px;
        margin-top: -1px;
      }

      .cal {
        padding: 0 14px;
        cursor: default;
        position: relative;

        &--head {
          margin: 14px 0;
          color: #666;
          line-height: 1;
          position: relative;
          font-weight: 500;
          font-size: 16px;
          text-align: center;

          &-month {
            cursor: pointer;
            width: 70%;
            display: inline-block;

            &:hover {
              color: #5090f7;
            }
          }

          &-next,
          &-prev {
            cursor: pointer;
            position: absolute;
            top: 0;

            i {
              font-weight: 600;
            }

            &:hover,
            &:focus {
              i {
                color: #5090f7;
              }
            }
          }

          &-prev {
            left: 10px;
          }

          &-next {
            right: 10px;
          }
        }

        &--body {
          position: relative;

          /* height: 364px; */
          padding-bottom: 14px;
        }

        &--analysis {
          padding-top: 14px;
          border-top: 1px solid #e9e9e9;

          &-item {
            width: 33.33%;
            display: inline-block;
            margin: 0 -4px 14px 0;

            span {
              color: #999;
            }
          }
        }

        &--annual-leave {
          border-top: 1px solid #e9e9e9;
          padding-top: 14px;
          padding-bottom: 14px;
          display: flex;

          .title {
            line-height: 26px;
          }

          .content {
            flex: 1;
            text-align: right;
            color: #ff8b5f;
            line-height: 1;

            strong {
              font-size: 26px;
              margin-right: 4px;
            }
          }
        }
      }
    }
  }
</style>

