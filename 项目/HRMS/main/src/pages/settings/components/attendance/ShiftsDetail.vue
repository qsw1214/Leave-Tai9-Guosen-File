<template>
  <!-- 班次详情 -->
  <div
    v-loading.fullscreen.lock="preloading"
    class="page shifts--details">

    <m-breadcrumb :items="breadcrumb" />

    <!-- 顶部按钮 -->
    <div
      class="block-margin-bottom">
      <el-button
        type="primary"
        icon="el-icon-edit"
        @click="getTo('edit')">编辑
      </el-button>
      <el-button
        icon="el-icon-d-arrow-left"
        v-if="redirect"
        @click="getTo('back')">返回
      </el-button>
      <el-button
        icon="el-icon-caret-left"
        v-if="!redirect"
        :disabled="!toPrevId"
        @click="getTo('prev')">上一条
      </el-button>
      <el-button
        v-if="!redirect"
        :disabled="!toNextId"
        @click="getTo('next')">下一条<i class="el-icon-caret-right el-icon--right" />
      </el-button>
    </div>

    <m-section>
      <m-section-row>
        <m-section-cell
          title="班次编码"
          :content="detData.code" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="班次名称"
          :content="detData.name" />

        <m-section-cell
          title="是否默认班次"
          :content="detData.default_name" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="上班时间"
          :content="detData.on_time" />

        <m-section-cell
          title="下班时间"
          :content="detData.off_time" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="备注"
          :content="detData.remark" />
      </m-section-row>
    </m-section>

  </div>
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    data() {
      const { id } = this.$route.params

      return {
        preloading: false,
        redirect: this.$route.query.redirect,
        detData: {
          id: id || '',
          code: '由系统生成',
          name: '',
          default_name: '',
          on_time: '',
          off_time: '',
          remark: '',
        },
      }
    },
    computed: {
      dictionary() {
        return this.$utils.config.dictionary.settings
      },
      breadcrumb() {
        const defaultBC = [
          { name: '基础配置' },
          { name: '考勤管理', to: '/attendance/shifts' },
        ]

        if (!this.detData.name) return defaultBC

        defaultBC.push({ name: this.detData.name })
        return defaultBC
      },
      ...mapGetters({ ids: 'getShiftsIds' }),
      toNextId() {
        if (!this.detData.id || !this.ids) return ''
        const thisIndex = this.ids.findIndex(v => v === this.detData.id)
        if (thisIndex === this.ids.length - 1) return ''
        return this.ids[thisIndex + 1]
      },
      toPrevId() {
        if (!this.detData.id || !this.ids) return ''
        const thisIndex = this.ids.findIndex(v => v === this.detData.id)
        if (thisIndex === 0) return ''
        return this.ids[thisIndex - 1]
      },
    },
    created() {
      if (this.detData.id) this.getDetail()
    },
    methods: {
      // 获取详情
      async getDetail() {
        this.preloading = true
        await this.$axios({
          url: this.$api.settings.attendance.scheduleDetail,
          params: { id: this.detData.id },
        }).then((data) => {
          if (data.code === 0) {
            Object.keys(this.detData).forEach((key) => {
              this.detData[key] = data.data[key]
            })
          }
        }).catch(() => {})
        this.preloading = false
      },
      getTo(type) {
        // 其他形式的页面跳转
        switch (type) {
        case 'edit':
          this.$router.push(`/attendance/shifts/edit/${this.detData.id}`)
          break
        // 返回回传地址
        case 'back':
          window.location.href = this.redirect
          break
        default:
          // 上一条下一条
          this.$router.replace({
            name: this.$route.name,
            params: { id: type === 'prev' ? this.toPrevId : this.toNextId },
            query: Object.assign({}, this.$route.query),
          })
          this.detData.id = type === 'prev' ? this.toPrevId : this.toNextId
          this.getDetail()
          break
        }
      },
    },
  }
</script>
