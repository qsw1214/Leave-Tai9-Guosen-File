<template>
  <div class="cal--picker">
    <div
      class="cal--picker-year"
      v-show="!year">
      <div class="title">选择年份：</div>
      <span
        class="item"
        v-for="year in years"
        :key="year"
        @click="pick({ year })">{{ year }}</span>
    </div>
    <div
      class="cal--picker-month"
      v-show="year">
      <div class="title">选择月份：</div>
      <span
        class="item"
        v-for="month in months"
        :key="month"
        @click="pick({ month })">{{ month }}月</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Picker',

    data() {
      const year = new Date().getFullYear()
      const years = []
      const beginYear = 1999
      for (let i = 0; i <= year - beginYear; i += 1) {
        years.push(beginYear + i)
      }

      const months = []
      for (let i = 0; i < 12; i += 1) {
        months.push(i + 1)
      }

      return {
        years,
        months,
        year: null,
      }
    },

    methods: {
      pick({ year, month }) {
        if (year) {
          this.year = year
          return false
        }

        this.$emit('picker', {
          year: this.year,
          month,
        })

        setTimeout(() => {
          this.year = null
        }, 300)

        return true
      },
    },
  }
</script>

<style lang="scss" scoped>
  .cal--picker {
    background-color: #fff;
    z-index: 5;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0 14px;
    font-size: 16px;

    .title {
      border-bottom: 1px solid #e9e9e9;
      padding: 14px 0;
      margin-bottom: 14px;
    }

    .item {
      display: inline-block;
      vertical-align: top;
      text-align: center;
      width: 25%;
      margin: 14px 0;
      position: relative;
      transition: all 0.2s linear;
      cursor: pointer;

      &::before {
        content: "";
        position: absolute;
        left: 50%;
        top: 0;
        bottom: 0;
        border-radius: 15px;
        z-index: -1;
        transition: all 0.15s linear;
        width: 0;
      }

      &:hover,
      &:focus {
        color: #fff;

        &::before {
          background-color: rgba(80, 144, 247, 0.7);
          width: 70%;
          margin-left: -35%;
        }
      }
    }
  }
</style>

