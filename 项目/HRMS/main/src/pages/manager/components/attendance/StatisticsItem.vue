<template>
  <section
    class="statisticsItem"
    :class="type">
    <div class="statisticsItem--title">
      <div class="statisticsItem--title__left">
        <i class="icon" />
        <p>{{ type == 'hardworking' ? `本${typeName}勤奋榜` : `本${typeName}迟到榜` }}</p>
      </div>
      <div class="statisticsItem--title__right">
        <m-cascader
          size="mini"
          placeholder="请选择组织机构"
          v-if="orgLevels.length"
          ref="cascader"
          :input-options="orgLevels"
          :organization.sync="organization"
          :width="200"
          @selectCompleted="switchOrg" />

        <el-button
          size="mini"
          style="font-size: 12px;"
          :loading="exportLoading"
          @click.native="exportExcel">导出
        </el-button>
      </div>
    </div>

    <div
      v-loading="loading"
      class="statisticsItem--body">
      <ul v-if="list.length > 0">
        <li
          v-for="(item, key) in list"
          :key="key">
          <div
            class="badge"
            :class="`badge${item.rank}`">
            {{ item.rank }}
          </div>

          <div
            class="member"
            :class="`member${item.rank}`">
            <div class="member--avator">
              <img
                width="38"
                height="38"
                :src="item.avatar_url">
            </div>
            <div class="member--info">
              <p class="name">{{ item.name }}</p>
              <p class="code">{{ item.emp_code }}</p>
            </div>
            <div class="member--index">
              <p class="index">{{
                type == 'hardworking' ? `${item.count}小时` : `${item.count}次`
              }}</p>
              <p class="desc">{{ type == 'hardworking' ? '平均工时' : '迟到次数' }}</p>
            </div>
          </div>
        </li>
      </ul>

      <p
        class="empty"
        v-else>暂无排行数据</p>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'StatisticsItem',

    props: {
      type: {
        type: String,
        default: '',
      },
    },

    data() {
      return {
        test: 'test',
        loading: true,
        exportLoading: false,
        orgLevels: [],
        organization: '',
        list: [],
      }
    },

    computed: {
      typeName() {
        const { type } = this.$parent

        return type === '1' ? '周' : '月'
      },
    },

    created() {
      this
        .getOrgLevels()
        .then(() => {
          this.fetch()
        })
    },

    methods: {
      getOrgLevels() {
        return this
          .$axios
          .post(this.$api.common.organizationLevelAuth)
          .then((res) => {
            const { data } = res
            this.orgLevels = [data]
            if (!this.organization) this.organization = data.id
          })
      },

      switchOrg() {
        this.$nextTick(() => {
          this.fetch()
        })
      },

      fetch() {
        this.loading = true
        const url1 = this.$api.manager.attendance.getWorkTimeRank
        const url2 = this.$api.manager.attendance.getDelayRank
        const url = (this.type === 'hardworking') ? url1 : url2
        const { type, month, week } = this.$parent
        let date = ''

        if (type === '1') {
          const sunday = new Date(week.getTime() - (1 * 24 * 60 * 60 * 1000))
          date = this.$utils.tools.formatDate(sunday)
        } else {
          const monthStr = this.$utils.tools.formatDate(month)
          const monthArr = monthStr.split('-')
          monthArr.splice(2, 1, '01')
          date = monthArr.join('-')
        }

        this
          .$axios
          .post(url, {
            type,
            date,
            org_id: this.organization,
          })
          .then(({ data }) => {
            this.list = data.list
          })
          .catch(() => {})
          .then(() => {
            this.loading = false
          })
      },

      exportExcel() {
        this.exportLoading = true
        const url1 = this.$api.manager.attendance.exportWorkTimeRank
        const url2 = this.$api.manager.attendance.exportDelayRank
        const url = (this.type === 'hardworking') ? url1 : url2
        const { type, month, week } = this.$parent
        let date = ''

        if (type === '1') {
          const sunday = new Date(week.getTime() - (1 * 24 * 60 * 60 * 1000))
          date = this.$utils.tools.formatDate(sunday)
        } else {
          const monthStr = this.$utils.tools.formatDate(month)
          const monthArr = monthStr.split('-')
          monthArr.splice(2, 1, '01')
          date = monthArr.join('-')
        }

        this
          .$axios
          .post(url, {
            type,
            date,
            org_id: this.organization,
          })
          .then(({ data }) => {
            this.$utils.tools.windowOpen(data.url)
          })
          .catch(() => {})
          .then(() => {
            this.exportLoading = false
          })
      },
    },
  }
</script>

<style lang="scss">
  .statisticsItem {
    width: 100%;
    background: #fff;
    border: 1px solid #e9e9e9;

    &--title {
      height: 42px;
      display: flex;
      border-bottom: 1px solid #e9e9e9;

      &__left {
        width: 35%;
        display: flex;
        align-items: center;
        padding-left: 10px;

        p {
          color: #000;
          font-size: 14px;
          margin: 0;
          line-height: 1.4;
        }

        .icon {
          width: 12px;
          height: 14px;
          background-repeat: no-repeat;
          background-size: 100%;
          margin-right: 5px;
        }
      }

      &__right {
        width: 65%;
        text-align: right;
        padding-right: 10px;
        padding-top: 6px;
        vertical-align: middle;
      }
    }

    &--body {
      height: 330px;
      width: 100%;
      overflow-y: scroll;

      ul {
        margin: 0;
        padding: 0;

        li {
          width: 100%;
          height: 66px;
          list-style: none;
          margin: 0;
          display: flex;
          align-items: center;

          .badge {
            width: 50px;
            height: 66px;
            line-height: 66px;
            color: #acb2b3;
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            background-position: center center;
            background-repeat: no-repeat;
          }

          .member {
            height: 66px;
            flex: 1;
            border-bottom: 1px solid #e9e9e9;
            display: flex;
            align-items: center;

            p {
              margin: 0;
            }

            &--avator {
              width: 38px;
              margin-right: 15px;

              img {
                border-radius: 50%;
              }
            }

            &--info {
              flex: 1;

              .name {
                font-size: 16px;
                color: #333;
                font-weight: bold;
              }

              .code {
                color: #999;
              }
            }

            &--index {
              width: 100px;
              padding-right: 15px;
              text-align: right;

              .index {
                color: #333;
                font-weight: bold;
              }

              .desc {
                color: #999;
              }
            }
          }
        }
      }

      .empty {
        color: #999;
        line-height: 100px;
        text-align: center;
      }
    }

    &.hardworking {
      .icon {
        background-image: url("../../assets/images/hardworking.png");
      }

      .badge1 {
        background-image: url("../../assets/images/hardworking_no1.png");
        text-indent: -99999px;
      }

      .badge2 {
        background-image: url("../../assets/images/hardworking_no2.png");
        text-indent: -99999px;
      }

      .badge3 {
        background-image: url("../../assets/images/hardworking_no3.png");
        text-indent: -99999px;
      }
    }

    &.later {
      .icon {
        background-image: url("../../assets/images/later.png");
      }

      .badge1 {
        background-image: url("../../assets/images/later_no1.png");
        text-indent: -99999px;
      }

      .badge2 {
        background-image: url("../../assets/images/later_no2.png");
        text-indent: -99999px;
      }

      .badge3 {
        background-image: url("../../assets/images/later_no3.png");
        text-indent: -99999px;
      }
    }

    .member1 {
      .index {
        color: #ff4d7a !important;
      }
    }

    .member2 {
      .index {
        color: #5090f7 !important;
      }
    }

    .member3 {
      .index {
        color: #ff8b5f !important;
      }
    }
  }
</style>
