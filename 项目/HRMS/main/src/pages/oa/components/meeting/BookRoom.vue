<template>
  <div
    v-loading.fullscreen.lock="preloading"
    class="page meeting-book-room">

    <m-breadcrumb :items="breadcrumb" />

    <!-- 内容部分 -->
    <m-section
      is-form>
      <el-form
        class="wrap m-section--form"
        label-position="right"
        label-width="140px"
        ref="detData"
        :model="detData"
        :rules="detDataRules">

        <m-section-row
          v-if="!bookId">
          <m-section-cell
            title="会议室区域"
            :content="detData.b_district !== ''
              ? roomList[detData.b_district].district_name
            : ''" />

          <m-section-cell
            title="会议室名称"
            :content="roomList2.find(_ => _.id === detData.conferenceroom_id)
              ? roomList2.find(_ => _.id === detData.conferenceroom_id).name
            : ''" />
        </m-section-row>

        <m-section-row
          v-else>
          <el-form-item
            label="会议室区域"
            prop="b_district">
            <el-select
              v-model="detData.b_district"
              @change="districtChange()">
              <el-option
                v-for="(item, index) in roomList"
                :value="index"
                :key="item.district"
                :label="item.district_name" />
            </el-select>
          </el-form-item>

          <el-form-item
            label="会议室名称"
            prop="conferenceroom_id">
            <el-select
              v-model="detData.conferenceroom_id"
              @change="roomChange">
              <el-option
                v-for="item in roomList2"
                :value="item.id"
                :key="item.id"
                :label="item.name" />
            </el-select>
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <m-section-cell
            title="可容纳人数"
            :content="`${roomDetail.capacity || 0}人`" />

          <m-section-cell
            title="配套设备"
            :content="`${roomDetail.equipments || '暂无'}`" />
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="开始日期"
            prop="begin_date">
            <el-date-picker
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择开始日期"
              v-model="detData.begin_date"
              :picker-options="dateOptions"
              @change="validAllTime('begin_date')" />
          </el-form-item>

          <el-form-item
            label="开始时间"
            prop="begin_time">
            <el-time-select
              format="HH:mm"
              value-format="HH:mm"
              placeholder="选择开始时间"
              v-model="detData.begin_time"
              :picker-options="{
                start: '08:00',
                end: '19:30',
                step: '00:30',
              }"
              :editable="false"
              @change="validAllTime('begin_time')" />
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="结束日期"
            prop="end_date">
            <el-date-picker
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择结束日期"
              v-model="detData.end_date"
              :picker-options="dateOptions"
              @change="validAllTime('end_date')" />
          </el-form-item>

          <el-form-item
            label="结束时间"
            prop="end_time">
            <el-time-select
              format="HH:mm"
              value-format="HH:mm"
              placeholder="选择结束时间"
              v-model="detData.end_time"
              :picker-options="{
                start: '08:30',
                end: '20:00',
                step: '00:30',
              }"
              :editable="false"
              @change="validAllTime('end_time')" />
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="会议参与人"
            prop="user_ids">
            <m-employee-select
              multiple
              init-change
              :width="260"
              :employees.sync="detData.user_ids" />
          </el-form-item>
        </m-section-row>

        <el-form-item
          label="会议主题"
          prop="theme">
          <el-input
            type="textarea"
            autosize
            v-model="detData.theme"
            :rows="1" />
        </el-form-item>

        <el-form-item
          label="会议内容"
          prop="content">
          <el-input
            type="textarea"
            v-model="detData.content"
            :autosize="{ minRows: 4 }"
            :rows="4" />
        </el-form-item>

        <m-section-row>
          <el-form-item
            class="files"
            label="附件上传">
            <m-upload
              autotest="attachment-upload"
              multiple
              ref="upload"
              :file-list="detData.aids"
              :accept="uploadType"
              :action="$api.oa.meeting.atta" />
          </el-form-item>
        </m-section-row>

      </el-form>
    </m-section>

    <!-- 提交返回 -->
    <div>
      <el-button
        type="primary"
        :loading="loading"
        @click="update(2)">提交</el-button>
      <el-button
        type="info"
        :loading="loading"
        @click="update(1)">暂存</el-button>
      <el-button
        type="info"
        @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      const id = this.$route.params.id || ''
      const { meetingRoomId, date, time } = this.$route.query

      // 开始日期校验
      const begin_dateValid = (rule, value, callback) => {
        if (!value) {
          this.timeErrList.add('begin_date')
          return callback(new Error('请选择开始日期'))
        }
        if (new Date(value).getTime() < (Date.now() - 86400000)) {
          this.timeErrList.add('begin_date')
          return callback(new Error('开始日期不能早于今天'))
        }
        if (
          this.detData.end_date
          && new Date(value).getTime() > new Date(this.detData.end_date).getTime()
        ) {
          this.timeErrList.add('begin_date')
          return callback(new Error('开始日期不能晚于结束日期'))
        }
        this.timeErrList.delete('begin_date')
        return callback()
      }

      // 开始时间校验
      const begin_timeValid = (rule, value, callback) => {
        if (!value) {
          this.timeErrList.add('begin_time')
          return callback(new Error('请选择开始时间'))
        }
        if (
          !this.detData.end_date
          || !this.detData.end_time
          || !this.detData.begin_date
        ) {
          this.timeErrList.delete('begin_time')
          return callback()
        }
        const begin = new Date(`${this.detData.begin_date} ${value}`).getTime()
        const end = new Date(`${this.detData.end_date} ${this.detData.end_time}`).getTime()
        if (begin > end) {
          this.timeErrList.add('begin_time')
          return callback(new Error('开始时间不能晚于结束时间'))
        }
        this.timeErrList.delete('begin_time')
        return callback()
      }

      // 结束日期校验
      const end_dateValid = (rule, value, callback) => {
        if (!value) {
          this.timeErrList.add('end_date')
          return callback(new Error('请选择结束日期'))
        }
        if (new Date(value).getTime() < (Date.now() - 86400000)) {
          this.timeErrList.add('end_date')
          return callback(new Error('结束日期不能早于今天'))
        }
        if (
          this.detData.begin_date
          && new Date(value).getTime() < new Date(this.detData.begin_date).getTime()
        ) {
          this.timeErrList.add('end_date')
          return callback(new Error('结束日期不能早于开始日期'))
        }
        this.timeErrList.delete('end_date')
        return callback()
      }

      // 结束时间校验
      const end_timeValid = (rule, value, callback) => {
        if (!value) {
          this.timeErrList.add('end_time')
          return callback(new Error('请选择开始时间'))
        }
        if (
          !this.detData.begin_date
          || !this.detData.begin_time
          || !this.detData.end_date
        ) {
          this.timeErrList.delete('end_time')
          return callback()
        }
        const begin = new Date(`${this.detData.begin_date} ${this.detData.begin_time}`).getTime()
        const end = new Date(`${this.detData.end_date} ${value}`).getTime()
        if (begin > end) {
          this.timeErrList.add('end_time')
          return callback(new Error('结束时间不能早于开始时间'))
        }
        this.timeErrList.delete('end_time')
        return callback()
      }

      return {
        bookId: id,
        breadcrumb: [
          { name: '企业OA' },
          { name: '会议管理', to: '/meeting' },
          { name: id ? '' : '新建会议' },
        ],
        loading: false,
        preloading: false,
        canRedirect: false,
        uid: JSON.parse(sessionStorage.getItem('USER_INFO')).id,
        detDataUid: '',
        detDataTempBegin_time: '',
        roomList: [],
        roomList2: [],
        roomDetail: {},
        dateOptions: {
          disabledDate(t) {
            return t.getTime() < (Date.now() - 8.64e7)
          },
        },
        timeErrList: new Set(),
        // 附件上传
        uploadType: 'image,pdf,word,excel,zip',
        detData: {
          b_district: '',
          conferenceroom_id: meetingRoomId || '',
          begin_date: date,
          begin_time: time,
          end_date: date,
          end_time: '',
          user_ids: '',
          theme: '',
          content: '',
          aids: [],
          status: '',
        },
        detDataRules: {
          b_district: [
            { required: true, message: '请选择会议室区域', trigger: ['blur', 'change'] },
          ],
          conferenceroom_id: [
            { required: true, message: '请选择会议室', trigger: ['blur', 'change'] },
          ],
          begin_date: [
            { required: true, message: '请选择开始日期', trigger: ['blur', 'change'] },
            { validator: begin_dateValid, trigger: ['blur', 'change'] },
          ],
          begin_time: [
            { required: true, message: '请选择开始时间', trigger: ['blur', 'change'] },
            { validator: begin_timeValid, trigger: ['blur', 'change'] },
          ],
          end_date: [
            { required: true, message: '请选择结束日期', trigger: ['blur', 'change'] },
            { validator: end_dateValid, trigger: ['blur', 'change'] },
          ],
          end_time: [
            { required: true, message: '请选择结束时间', trigger: ['blur', 'change'] },
            { validator: end_timeValid, trigger: ['blur', 'change'] },
          ],
          user_ids: [
            { required: true, message: '请选择会议参与人', trigger: ['blur', 'change'] },
          ],
          theme: [
            { required: true, message: '请填写会议主题', trigger: ['blur', 'change'] },
          ],
          content: [
            { required: true, message: '请填写会议内容', trigger: ['blur', 'change'] },
          ],
        },
      }
    },
    created() {
      if (this.bookId) this.getData()
      if (!this.bookId) {
        this.breadcrumb[2].to = '/meeting/check'
        this.breadcrumb.push({ name: '预定' })
        this.getConfigData()
      }
    },
    beforeRouteLeave(to, from, next) {
      if (this.canRedirect) {
        return next()
      }

      return setTimeout(() => {
        this
          .$confirm('系统可能不会保存您所做的更改，确认离开？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            closeOnHashChange: false,
          })
          .then(() => next())
          .catch(() => next(false))
      }, 0)
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

          // 用于记录接口数据判断是否非法提交
          this.detDataUid = data.uid
          this.detDataTempBegin_time = data.begin_time

          // 数据处理
          data.user_ids = data.user_ids.map(_ => _.id).join(',')
          data.equipments = data.equipments.map(_ => _.name).join('，')
          data.begin_date = data.begin_time.split(' ')[0]
          data.end_date = data.end_time.split(' ')[0]
          data.begin_time = data.begin_time.substring(11, 16)
          data.end_time = data.end_time.substring(11, 16)

          this.breadcrumb[2].name = data.theme
          Object.keys(this.detData).forEach((key) => {
            this.detData[key] = data[key]
          })
          this.getConfigData()
        } catch (err) {
          console.log(err)
        }

        this.preloading = false
      },
      // 获取区域会议室数据
      getConfigData() {
        this.preloading = true
        this.$axios({
          url: this.$api.oa.meeting.roomList,
        })
          .then((data) => {
            if (data.code === 0) {
              this.roomList = data.data.list
              const id = this.detData.conferenceroom_id
              if (id) {
                const districtIndex = this.roomList
                  .findIndex(roomDistrict => roomDistrict.list
                    .findIndex(room => room.id === id) >= 0)

                if (districtIndex >= 0) {
                  this.detData.b_district = districtIndex
                  this.districtChange(true)
                } else {
                  this.detData.conferenceroom_id = ''
                }
              }
            }
          })
          .catch(() => {})
          .then(() => {
            this.preloading = false
          })
      },
      // district change
      districtChange(type) {
        this.roomList2 = this.roomList[this.detData.b_district].list
        if (!type) this.detData.conferenceroom_id = ''
        this.roomChange()
      },
      // room change
      roomChange() {
        if (!this.detData.conferenceroom_id) {
          this.roomDetail = {}
          return
        }
        this.preloading = true
        this.$axios({
          url: this.$api.oa.meeting.roomDetail,
          params: { id: this.detData.conferenceroom_id },
        })
          .then((data) => {
            if (data.code === 0) {
              data.data.equipments = data.data.equipments
                .map(_ => _.name).join('，')
              this.roomDetail = data.data
            }
          })
          .catch(() => {})
          .then(() => {
            this.preloading = false
          })
      },
      // valid all
      validAllTime(type) {
        this.timeErrList.forEach((key) => {
          if (key === type) return
          this.$refs.detData.validateField(key)
        })
      },
      // update
      async update(status) {
        // 校验是否发起人
        if (
          this.bookId &&
          this.uid !== this.detDataUid
        ) {
          return this.$message.error('您无权修改，请联系会议发起人！')
        }

        // 校验是否已提交并已开始
        if (
          this.status === 2 &&
          this.bookId &&
          new Date(this.detDataTempBegin_time).getTime() < Date.now()
        ) {
          return this.$message.error('会议已经开始或已结束，无法修改！')
        }

        // 是否文件在上传
        if (this.$refs.upload.processing) {
          return this.$message.warning('请在附件上传完成后保存')
        }

        // 表单校验
        try {
          await this.$refs.detData.validate()
        } catch (err) {
          console.log(err)
          return false
        }

        // 提交确认
        try {
          if (status === 2) {
            await this.$confirm('是否确认提交？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            })
          }
        } catch (err) {
          console.log(err)
          return false
        }

        // 提交数据
        if (this.loading) return false
        this.loading = true

        const formData = Object.assign({}, this.detData)
        formData.begin_time = `${formData.begin_date} ${formData.begin_time}`
        formData.end_time = `${formData.end_date} ${formData.end_time}`
        formData.aids = this.$refs.upload.getFiles('string')
        delete formData.b_district
        delete formData.begin_date
        delete formData.end_date
        if (this.bookId) formData.id = this.bookId
        formData.status = status

        try {
          const { add, edit } = this.$api.oa.meeting
          const url = this.bookId ? edit : add
          const { code, msg, data } = await this.$axios
            .post(url, formData)

          if (code) await Promise.reject(msg)
          this.canRedirect = true
          if (status === 1) {
            this.$router.push('/meeting')
          } else {
            this.$router.push(`/meeting/book-detail/${data.id}`)
          }
        } catch (err) {
          console.log(err)
        }

        this.loading = false
        return true
      },
      // cancel
      cancel() {
        window.history.go(-1)
      },
    },
  }
</script>

<style lang="scss">
.meeting-book-room {
  .m-employee-select {
    width: calc(100% + 400px);
  }

  .m-employee-select > div {
    width: calc(100% + 30px) !important;
  }
}
</style>
