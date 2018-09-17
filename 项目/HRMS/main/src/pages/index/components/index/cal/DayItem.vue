<template>
  <div
    class="col"
    :class="{
      disabled: data.disabled,
      'is-today': data.isToday,
      'is-weekend': data.isWeekend,
      'is-holiday': display.status === 'is-holiday',
      'is-error': display.status === 'is-error',
    }"
    @mouseenter="toggleTooltip"
    @mouseleave="toggleTooltip">
    <span class="day">{{ data.day }}</span>
    <span
      class="event"
      v-if="event">{{ display.name }}</span>
  </div>
</template>

<script>
  export default {
    name: 'CalendarDayItem',
    props: {
      data: {
        type: Object,
        required: true,
      },
      event: {
        type: Object,
        default: () => null,
      },
    },

    computed: {
      display() {
        if (!this.event) return { status: '', name: '' }

        const {
          holiday_type,
          holiday_name,
          pc_status_name,
        } = this.event

        if (holiday_type === 1) {
          return { status: 'is-holiday', name: holiday_name }
        }

        if (pc_status_name === '异常') {
          return { status: 'is-error', name: pc_status_name }
        }

        return { status: '', name: pc_status_name }
      },
    },

    methods: {
      toggleTooltip(e) {
        const { event } = this
        if (event && event.holiday_type === 0) {
          const { offsetLeft, offsetTop } = e.target

          this.$emit('toggleTooltip', {
            data: event,
            position: {
              left: offsetLeft,
              top: offsetTop,
            },
          })
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .cal-table--days {
    text-align: center;

    .day {
      display: inline-block;
      margin-bottom: 1px;
      height: 26px;
      width: 26px;
      line-height: 24px;
      border: 1px solid transparent;
      border-radius: 50%;
    }

    .event {
      display: block;
      font-size: 12px;
      transform: scale(0.82);
      word-wrap: break-word;
      line-height: 1.1;
    }

    .is-weekend {
      color: #999;
    }

    .disabled {
      color: #ccc;
    }

    .is-today .day {
      background-color: #5090f7;
      color: #fff;
    }

    .is-holiday {
      color: #999;
    }

    .is-error {
      .event {
        color: #ff6464;
      }
    }
  }
</style>

