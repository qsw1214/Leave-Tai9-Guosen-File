<template>
  <section
    v-loading="loading"
    class="board">
    <div class="board--title">
      <div class="board--title__left">
        <p>每日看板</p>
        <h3>{{ data.date }}</h3>
        <!-- <el-date-picker
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束如期"
          v-model="dates"
          :picker-options="pickerOptions" /> -->
      </div>
      <div class="board--title__right">
        <span>*打卡机每日 10:40 时同步当日上班打卡记录。</span>
      </div>
    </div>

    <div class="board--body">
      <div class="board--body__left">
        <Dashboard :precent="precent" />

        <div class="desc">
          <p class="desc--num"><b>{{ data.sign_count }}</b>/{{ data.should_sign_count }}</p>
          <p class="desc--text">打卡人数</p>
        </div>
      </div>

      <div class="board--body__center">
        <div @click="detail('qj')">
          <h3>{{ data.qj_count }}</h3>
          <p>请假</p>
        </div>

        <div @click="detail('unsign')">
          <h3>{{ data.unsign_count }}</h3>
          <p>未打卡</p>
        </div>

        <div @click="detail('later')">
          <h3>{{ data.later_count }}</h3>
          <p>迟到</p>
        </div>

        <div @click="detail('over_later')">
          <h3>{{ data.over_later_count }}</h3>
          <p>超时迟到</p>
        </div>

        <div @click="detail('business_out')">
          <h3>{{ data.business_out_count }}</h3>
          <p>因公外出</p>
        </div>

        <div @click="detail('travel')">
          <h3>{{ data.travel_count }}</h3>
          <p>出差</p>
        </div>

        <div @click="detail('not_sign')">
          <h3>{{ data.not_sign_count }}</h3>
          <p>未打卡申诉</p>
        </div>
      </div>

      <div class="board--body__right">
        <el-button
          style="font-size: 14px;"
          @click.native="detail('sign', data.sign_count, data.sign_list)">打卡明细
        </el-button>
      </div>
    </div>

    <m-tags-dialog
      :tags="temp"
      :title="title"
      :table-head="tableHead"
      :show-tags-dialog="show"
      :table-column="tableColumn"
      @close="close" />
  </section>
</template>

<script>
  import Dashboard from './Dashboard'

  export default {
    name: 'Board',

    components: {
      Dashboard,
    },

    data() {
      return {
        test: 'test',
        loading: false,
        data: {},
        tableHead: ['员工ID', '员工姓名'],
        tableColumn: ['code', 'name'],
        temp: [],
        show: false,
        title: '',
        precent: 0,
        dates: [],
        pickerOptions: {
          shortcuts: [
            {
              text: '本周',
              onClick(picker) {
                const now = new Date()
                const start = new Date()
                let end = new Date()
                start.setTime(now.getTime() - (3600 * 1000 * 24 * (now.getDay() - 1)))
                end.setTime(now.getTime() + (3600 * 1000 * 24 * (7 - now.getDay())))
                if (end > now) {
                  end = now
                }
                picker.$emit('pick', [start, end])
              },
            },
            {
              text: '本月',
              onClick(picker) {
                const now = new Date()
                const start = new Date(now.getFullYear(), now.getMonth(), 1)
                let end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
                if (end > now) {
                  end = now
                }
                picker.$emit('pick', [start, end])
              },
            },
          ],
        },
      }
    },

    created() {
      this.fetch()
    },

    methods: {
      detail(name) {
        const count = `${name}_count`
        const listName = `${name}_list`
        const num = this.data[count]
        const list = this.data[listName]
        const commonTableHead = ['姓名', '员工ID', '所属组织', '职位名称']
        const commonTableColumn = ['name', 'code', 'org_name', 'job_name']

        const tableHead1 = commonTableHead
        const tableHead2 = commonTableHead.concat(['请假类型', '时长'])
        const tableHead3 = commonTableHead.concat(['时长'])
        const tableHead4 = commonTableHead.concat(['打卡时间'])
        const tableHead5 = commonTableHead.concat(['时长', '类型'])

        const tableColumn1 = commonTableColumn
        const tableColumn2 = commonTableColumn.concat(['status_name', 'time_type_name'])
        const tableColumn3 = commonTableColumn.concat(['time_type_name'])
        const tableColumn4 = commonTableColumn.concat(['on_time'])
        const tableColumn5 = commonTableColumn.concat(['time_type_name', 'status_name'])

        if (Number(num) > -12) {
          this.show = true
          this.temp = [].concat(list)

          switch (name) {
          case 'qj':
            this.title = '请假人员'
            this.tableHead = tableHead2
            this.tableColumn = tableColumn2
            break
          case 'unsign':
            this.tableHead = tableHead1
            this.tableColumn = tableColumn1
            this.title = '未打卡人员'
            break
          case 'over_later':
            this.tableHead = tableHead1
            this.tableColumn = tableColumn1
            this.title = '超时迟到人员'
            break
          case 'later':
            this.tableHead = tableHead1
            this.tableColumn = tableColumn1
            this.title = '迟到人员'
            break
          case 'business_out':
            this.title = '因公外出人员'
            this.tableHead = tableHead3
            this.tableColumn = tableColumn3
            break
          case 'travel':
            this.title = '出差人员'
            this.tableHead = tableHead3
            this.tableColumn = tableColumn3
            break
          case 'not_sign':
            this.title = '未打卡申诉人员'
            this.tableHead = tableHead5
            this.tableColumn = tableColumn5
            break
          case 'sign':
            this.title = '打卡明细'
            this.tableHead = tableHead4
            this.tableColumn = tableColumn4
            break
          default:
          }

          this.temp.forEach((item) => {
            item.code = item.emp_code
          })
        }
      },

      close() {
        this.show = false
      },

      fetch() {
        this.loading = true

        this
          .$axios
          .post(this.$api.manager.attendance.getTodayInfo)
          .then(({ data }) => {
            this.data = data
            if (this.dates.length === 0) {
              this.dates = [new Date(this.data.date), new Date(this.data.date)]
            }
            if (Number(data.should_sign_count) === 0) this.precent = 1
            else this.precent = Number((data.sign_count / data.should_sign_count).toFixed(4))
          })
          .catch(() => { })
          .then(() => {
            this.loading = false
          })
      },
    },
  }
</script>

<style lang="scss">
  .board {
    width: 100%;
    background: #fff;
    border: 1px solid #e9e9e9;

    &--title {
      padding: 15px;
      display: flex;
      border-bottom: 1px solid #e9e9e9;

      &__left {
        width: 50%;

        p {
          color: #999;
          font-size: 14px;
          margin: 0 0 8px 0;
          line-height: 1.4;
        }

        h3 {
          font-size: 18px;
          color: #333;
          margin: 0;
          line-height: 1.2;
        }

        .el-date-editor {
          .el-range-separator,
          .el-input__icon {
            line-height: 26px;
            width: auto;
          }
        }
      }

      &__right {
        width: 50%;
        color: #999;
        font-size: 14px;
        line-height: 38px;
        text-align: right;
      }
    }

    &--body {
      height: 180px;
      display: flex;
      align-items: center;

      &__left {
        width: 140px;
        height: 140px;
        margin-left: 60px;
        margin-right: 34px;
        position: relative;

        .desc {
          position: absolute;
          top: 0;
          left: 0;
          width: 140px;
          height: 140px;
          text-align: center;
          font-size: 14px;

          b {
            font-size: 30px;
          }

          &--num {
            margin-top: 40px;
            margin-bottom: 0;
            line-height: 1.2;
          }

          &--text {
            margin: 0;
            color: #999;
          }
        }
      }

      &__center {
        width: 602px;
        height: 120px;
        display: flex;
        border: 1px solid #e9e9e9;
        border-radius: 8px;

        div {
          width: 84px;
          height: 120px;
          cursor: pointer;

          h3 {
            font-size: 30px;
            color: #5090f7;
            line-height: 1.2;
            margin-top: 23px;
            margin-bottom: 10px;
            text-align: center;
          }

          p {
            font-size: 14px;
            color: #333;
            line-height: 1.2;
            text-align: center;
          }
        }
      }

      &__right {
        flex: 1;
        margin-left: 30px;
      }
    }
  }
</style>
