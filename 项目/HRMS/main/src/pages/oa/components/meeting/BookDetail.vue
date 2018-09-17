<template>
  <div
    v-loading.fullscreen.lock="preloading"
    class="page meeting-book-room">

    <m-breadcrumb :items="breadcrumb" />

    <!-- 内容部分 -->
    <m-section>
      <m-section-row>
        <m-section-cell
          title="会议室区域"
          :content="detData.district" />

        <m-section-cell
          title="会议室名称"
          :content="detData.name" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="可容纳人数"
          :content="detData.capacity" />

        <m-section-cell
          title="配套设备"
          :content="detData.equipments" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="开始时间"
          :content="detData.begin_time" />

        <m-section-cell
          title="结束时间"
          :content="detData.end_time" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="会议参与人"
          :content="detData.user_ids" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="会议主题"
          :content="detData.theme" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="会议内容"
          :content="detData.content" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="附件列表">
          <m-attachment :data="detData.aids" />
        </m-section-cell>
      </m-section-row>
    </m-section>
  </div>
</template>

<script>
  export default {
    data() {
      const id = this.$route.params.id || ''
      return {
        bookId: id,
        breadcrumb: [
          { name: '企业OA' },
          { name: '会议管理', to: '/meeting' },
          { name: '' },
        ],
        preloading: false,
        detData: {},
      }
    },
    created() {
      this.getData()
    },
    methods: {
      // 获取详情数据
      async getData() {
        this.preloading = true
        try {
          const url = this.$api.oa.meeting.detail
          const { code, msg, data } = await this.$axios
            .post(url, { id: this.bookId })

          if (code) await Promise.reject(msg)
          data.user_ids = data.user_ids.map(_ => `${_.name}(${_.emp_code})`).join('，')
          data.equipments = data.equipments.map(_ => _.name).join('，')
          data.begin_time = data.begin_time.substring(0, 16)
          data.end_time = data.end_time.substring(0, 16)

          this.breadcrumb[2].name = data.theme
          this.detData = Object.assign({}, data)
        } catch (err) {
          console.log(err)
        }

        this.preloading = false
      },
    },
  }
</script>
