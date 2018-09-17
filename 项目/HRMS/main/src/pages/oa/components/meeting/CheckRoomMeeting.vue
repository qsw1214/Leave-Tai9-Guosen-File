<template>
  <div class="check-room-meeting">
    <el-dialog
      autotest="check-room-meeting"
      custom-class="check-room-meeting__dialog"
      title="会议室预定信息"
      lock-scroll
      :visible.sync="show"
      :modal-append-to-body="false"
      :close-on-click-modal="false">

      <div
        v-loading="loading">
        <div
          class="base_info">
          <div class="title">{{ base_info.district }} - {{ base_info.name }}</div>
          <div>{{ base_info.capacity }}人 | {{ base_info.equipments }}</div>
        </div>

        <div
          class="meeting_list"
          v-for="(meeting, index) in meeting_list"
          :key="index">
          <m-section-row>
            <m-section-cell
              title="会议时间："
              :content="`${
                meeting.begin_time.substring(0, 16)
              } 至 ${
                meeting.end_time.substring(0, 16)
              }`" />
          </m-section-row>
          <m-section-row>
            <m-section-cell
              title="预定人："
              :content="meeting.user_name" />
            <m-section-cell
              title="手机号码："
              :content="meeting.mobile" />
          </m-section-row>
          <m-section-row>
            <m-section-cell
              title="会议主题："
              :content="meeting.theme" />
          </m-section-row>
        </div>
        <div
          class="no_meeting"
          v-if="!meeting_list.length">
          暂无预定信息
        </div>

        <div
          class="check-room-meeting__btn">
          <el-button
            type="info"
            @click="close">返回
          </el-button>
          <el-button
            type="primary"
            @click="book">预定
          </el-button>
        </div>
      </div>

    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'CheckRoomMeeting',
    data() {
      return {
        show: false,
        loading: false,
        id: '',

        base_info: {},
        meeting_list: [],
      }
    },
    created() {},
    methods: {
      // 打开方法
      async open(id) {
        this.show = true
        this.loading = true
        this.id = id
        // 获取详情信息
        try {
          const url = this.$api.oa.meeting.roomMeetingListDetail
          const { code, msg, data } = await this.$axios
            .post(url, { conferenceroom_id: id })
          if (code) await Promise.reject(msg)

          data.base_info.equipments =
            data.base_info.equipments.map(_ => _.name).join('，')
          this.base_info = data.base_info
          this.meeting_list = data.meeting_list
        } catch (err) {
          console.log(err)
        }
        this.loading = false
      },

      // 关闭表单
      close() {
        this.show = false
        this.base_info = {}
        this.meeting_list = []
        this.$emit('end')
      },

      // book
      book() {
        const query = { meetingRoomId: this.id }
        this.$router.push({
          path: '/meeting/book',
          query,
        })
      },
    },
  }
</script>

<style lang="scss">
  .check-room-meeting {
    &__dialog {
      min-width: 650px !important;
      width: 650px !important;
    }

    .el-dialog__body {
      padding: 0;
    }

    .base_info {
      padding: 20px;
      word-break: break-all;
    }

    .title {
      line-height: 36px;
      font-weight: bold;
    }

    .meeting_list {
      border-top: 1px solid #dadada;
    }

    .no_meeting {
      border-top: 1px solid #dadada;
      padding: 20px;
      text-align: center;
    }

    &__btn {
      border-top: 1px solid #dadada;
      padding: 20px;
    }
  }
</style>
