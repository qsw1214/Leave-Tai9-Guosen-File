<template>
  <div class="page meeting-check-room">

    <m-breadcrumb :items="breadcrumb" />

    <m-section>
      <div class="block-margin-bottom">
        <el-date-picker
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期"
          v-model="query.date"
          @change="search" />

        <el-select
          placeholder="请选择"
          v-model="query.district"
          @change="search">
          <el-option
            label="全部"
            :value="0" />
          <el-option
            :value="256"
            :label="dictionary.officeSpace[256].label" />
          <el-option
            :value="128"
            :label="dictionary.officeSpace[128].label" />
          <el-option
            v-for="(district, index) in dictionary.officeSpace"
            v-if="district.value !== 128 && district.value !== 256"
            :autotest="'edit-roomDistrict-' + index"
            :key="district.value"
            :value="district.value"
            :label="district.label" />
        </el-select>

        <el-input
          class="search"
          placeholder="输入会议室名称进行搜索"
          v-model="keyword"
          @keyup.enter.native="search">
          <el-button
            icon="el-icon-search"
            slot="append"
            @click="search" />
        </el-input>
      </div>

      <m-table
        is-full-table
        ref="mtable"
        :loading="loading"
        :data="showData"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="changePageIndex"
        @size-change="changePageSize">
        <template slot-scope="props">
          <el-table
            border
            stripe
            empty-text="该区域下暂无会议室，请联系管理员添加"
            :max-height="props.maxHeight - 20 - 16"
            :data="props.data"
            :cell-class-name="getCellClassName"
            @cell-dblclick="book">

            <el-table-column
              label="会议室"
              class-name="autotest-name"
              align="center">
              <template slot-scope="scope">
                <el-tooltip placement="right">
                  <div slot="content">
                    可容纳人数：{{ scope.row.capacity }}人<br>
                    会议室区域：{{ scope.row.district }}<br>
                    配套设备：{{ scope.row.equipments.map(_ => _.name).join('，') }}
                  </div>
                  <el-button
                    type="text"
                    @click="viewMeeting(scope.row.id)">{{ scope.row.name }}</el-button>
                </el-tooltip>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              v-for="t in 12"
              :key="t"
              :label="`${t > 2 ? t + 7 : '0' + (t + 7)}:00`">
              <el-table-column
                width="35"
                :class-name="`autotest-${t > 2 ? t + 7 : '0' + (t + 7)}:00`">
                <template slot-scope="scope">
                  <el-tooltip
                    placement="right"
                    v-if="scope.row.list[t + 7]">
                    <div slot="content">
                      开始时间：{{ query.date }} {{ scope.row.list[t + 7][0] }}<br>
                      结束时间：{{ query.date }} {{ scope.row.list[t + 7][1] }}
                    </div>
                    <div/>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                width="35"
                :class-name="`autotest-${t > 2 ? t + 7 : '0' + (t + 7)}:30`">
                <template slot-scope="scope">
                  <el-tooltip
                    placement="right"
                    v-if="scope.row.list[t + 7.5]">
                    <div slot="content">
                      开始时间：{{ query.date }} {{ scope.row.list[t + 7.5][0] }}<br>
                      结束时间：{{ query.date }} {{ scope.row.list[t + 7.5][1] }}
                    </div>
                    <div/>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table-column>

          </el-table>

          <div slot="bottom">
            <div class="table-tip">
              <div class="tip-star"><span>*</span>双击空白处可预定会议室</div>
              <div class="tip-box"><span/>已订</div>
            </div>
          </div>
        </template>
      </m-table>
    </m-section>

    <check-room-meeting
      ref="meeting" />
  </div>
</template>

<script>
  import CheckRoomMeeting from './CheckRoomMeeting'

  export default {
    components: { CheckRoomMeeting },
    data() {
      const { page, size, keyword, date, district } = this.$route.query

      return {
        breadcrumb: [
          { name: '企业OA' },
          { name: '会议管理', to: '/meeting' },
          { name: '新建会议' },
        ],
        loading: false,
        b_district: [],
        query: {
          date: date || this.$utils.tools.formatDate(new Date(), 'YYYY-MM-DD'),
          district: Number(district) || 0,
        },
        cachedQuery: {},
        data: [],
        showData: [],
        selectedItems: [],
        keyword: keyword || '',
        cachedKeyword: keyword || '',
        currentPage: parseInt((page || 1), 10),
        pageSize: parseInt((size || 20), 10),
        total: 0,
        showTagsDialog: false,
        tempTags: [],
      }
    },
    computed: {
      dictionary() {
        return this.$utils.config.dictionary.settings
      },
    },
    created() {
      this.getData()
    },
    methods: {
      // 处理会议预定状态
      duetData(dataList) {
        return dataList.map((meetingRoom) => {
          meetingRoom.backUpList = meetingRoom.list
          meetingRoom.list = meetingRoom.list.map((meetingBook, listIndex) => {
            const meetingBookDuet = [
              new Date(meetingBook[0]).getTime() < new Date(`${this.query.date} 08:00`).getTime()
                ? '08:00' : meetingBook[0].substring(11, 16),
              new Date(meetingBook[1]).getTime() > new Date(`${this.query.date} 20:00`).getTime()
                ? '20:00' : meetingBook[1].substring(11, 16),
            ].map(_ => _.split(':').map(__ => Number(__)))

            if (meetingBookDuet[0][1] >= 30 && meetingBookDuet[0][1] <= 60) {
              meetingBookDuet[0] = meetingBookDuet[0][0] + 0.5
            } else {
              meetingBookDuet[0] = meetingBookDuet[0][0]
            }
            if (meetingBookDuet[1][1] === 0) {
              meetingBookDuet[1] = meetingBookDuet[1][0] - 0.5
            } else if (meetingBookDuet[1][1] <= 30) {
              meetingBookDuet[1] = meetingBookDuet[1][0]
            } else {
              meetingBookDuet[1] = meetingBookDuet[1][0] + 0.5
            }

            const gap = (meetingBookDuet[1] - meetingBookDuet[0])
            const meetingBookTimeList = {}
            for (let i = 0; i <= gap; i += 0.5) {
              meetingBookTimeList[meetingBookDuet[0] + i]
                = meetingRoom.backUpList[listIndex]
            }
            return meetingBookTimeList
          })
          meetingRoom.list = Object.assign({}, ...meetingRoom.list)
          return meetingRoom
        })
      },
      // 获取列表数据
      async getData() {
        this.loading = true
        await this.$axios({
          url: this.$api.oa.meeting.roomMeetingList,
          params: {
            per_page: this.pageSize,
            page: this.currentPage,
            ...this.query,
            keywords: this.$utils.tools
              .splitKeyword(this.keyword).join(','),
          },
        }).then(({ code, data }) => {
          this.loading = false
          if (code === 0) {
            this.data = this.duetData(data.list)
            this.total = data.count || 0
            this.showData = this.data
          }
        }).catch(() => {})
        this.loading = false
      },
      // 列表过滤搜索
      search() {
        const { query } = this.$route

        this.$router.replace({
          query: Object.assign({}, query, {
            page: 1,
            ...this.query,
            keyword: this.keyword.trim(),
          }),
        })

        this.cachedKeyword = this.keyword.trim()
        this.cachedQuery = { ...this.query }
        this.currentPage = 1
        this.getData()
      },
      // 翻页
      changePageIndex(value) {
        this.currentPage = value
        this.getData()
      },
      // 更改每页显示条数
      changePageSize(value) {
        this.pageSize = value
        this.currentPage = 1
        this.getData()
      },
      // 点击修改
      viewMeeting(id) {
        this.$refs.meeting.open(id)
      },
      // getCellClassName
      getCellClassName(data) {
        const { columnIndex, row } = data
        if (columnIndex === 0) return 'title-book'
        if (row.list[String((columnIndex / 2) + 7.5)]) {
          return 'has-book'
        }
        return 'no-book'
      },
      // book
      book(row, column, cell) {
        if (!cell.classList.contains('no-book')) return
        let time = (cell.cellIndex / 2) + 7.5
        if (time % 1 === 0) {
          time = time > 9 ? time : `0${time}`
          time = `${time}:00`
        } else {
          time = parseInt(time, 10)
          time = time > 9 ? time : `0${time}`
          time = `${time}:30`
        }
        const query = {
          meetingRoomId: row.id,
          date: this.query.date,
          time,
        }
        this.$router.push({
          path: '/meeting/book',
          query,
        })
      },
    },
  }
</script>

<style lang="scss">
.meeting-check-room {
  .block-margin-bottom > div {
    vertical-align: top;
  }

  .block-margin-bottom > div:not(:last-child) {
    margin-right: 10px;
    width: 220px;
  }

  .block-margin-bottom,
  .m-table {
    margin: 15px;
  }

  .title-book {
    cursor: pointer;
  }

  .no-book {
    cursor: pointer;

    &:hover {
      background-color: #73a6f9 !important;
    }
  }

  .has-book {
    background-color: #5090f7 !important;
  }

  .el-tooltip {
    min-height: 18px;
  }

  thead.is-group > tr:nth-child(2) {
    display: none;
  }

  .table-tip {
    display: flex;
    margin: 8px 0 14px;
    justify-content: space-between;
    font-size: 14px;
    line-height: 1;

    .tip-star {
      color: #999;

      span {
        vertical-align: top;
        display: inline-block;
        color: #f75050;
        margin-right: 5px;
      }
    }

    .tip-box span {
      background-color: #5090f7;
      vertical-align: top;
      display: inline-block;
      margin-right: 8px;
      height: 14px;
      width: 14px;
    }
  }
}
</style>
