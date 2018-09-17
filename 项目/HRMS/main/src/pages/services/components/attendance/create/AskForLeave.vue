<template>
  <section
    v-loading.fullscreen.lock="loading"
    class="page page--pa-temp__card">

    <m-breadcrumb :items="breadcrumb" />

    <userinfo />

    <m-section
      title="申请表单"
      is-form>

      <m-section-row>
        <m-section-cell
          title="流程编码"
          :content="info.code || '由系统自动生成'" />

        <m-section-cell
          title="申请日期"
          :content="info.apply_date || '由系统自动生成'" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="流程状态"
          :content="info.status_name || '草稿'" />
      </m-section-row>

      <el-form
        class="m-section--form"
        label-width="140px"
        ref="form"
        :rules="rules"
        :model="form">

        <m-section-row>
          <el-form-item
            label="请假类型"
            prop="kqqj_type">
            <el-select
              placeholder="请选择请假类型"
              v-model="form.kqqj_type"
              @change="changeType">
              <el-option
                v-for="(item, key) in options.types"
                :key="key"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item
            label="已休天数">
            <span>{{ takeRestedDays }}</span>
          </el-form-item>
        </m-section-row>

        <template v-if="form.kqqj_type">

          <m-section-row v-if="form.kqqj_type == '4096'">
            <el-form-item
              label="上年度剩余天数">
              <span>{{ days.kqqj_nj_last_day_num / 2 }}天</span>
            </el-form-item>

            <el-form-item
              label="本年度剩余天数">
              <span>{{ days.kqqj_nj_this_day_num / 2 }}天</span>
            </el-form-item>
          </m-section-row>

          <m-section-row
            v-if="form.kqqj_type == '4096'">
            <el-form-item
              label="年假余额">
              <span>{{ days.kqqj_nj_count_day_num / 2 }}天</span>
            </el-form-item>
          </m-section-row>

          <m-section-row v-if="(form.kqqj_type != '32768') && (form.kqqj_type != '524288')">
            <el-form-item
              style="width: 100%;"
              label="流程说明">
              <p>{{ tips }}</p>
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="开始时间"
              required>
              <el-col style="width: 160px;">
                <el-form-item
                  prop="kqqj_start_date">
                  <el-date-picker
                    type="date"
                    style="width: 160px;"
                    placeholder="选择日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    v-model="form.kqqj_start_date"
                    :picker-options="pickerOptions"
                    @change="changeStartDate" />
                </el-form-item>
              </el-col>

              <el-col style="width: 90px;">
                <el-form-item
                  prop="kqqj_start_date_time">
                  <el-select
                    style="width: 90px; margin-left: 10px;"
                    v-model="form.kqqj_start_date_time"
                    @change="changeStartDateTime">
                    <el-option
                      v-for="(item, key) in options.range"
                      :key="key"
                      :label="item.label"
                      :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-form-item>

            <el-form-item
              label="结束时间"
              required>
              <el-col style="width: 160px;">
                <el-form-item
                  prop="kqqj_end_date">
                  <el-date-picker
                    type="date"
                    style="width: 160px;"
                    placeholder="选择结束日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    v-model="form.kqqj_end_date"
                    :picker-options="pickerOptions"
                    @change="changeTime" />
                </el-form-item>
              </el-col>

              <el-col style="width: 90px;">
                <el-form-item
                  prop="kqqj_end_date_time">
                  <el-select
                    style="width: 90px; margin-left: 10px;"
                    v-model="form.kqqj_end_date_time"
                    @change="changeTime">
                    <el-option
                      v-for="(item, key) in options.range"
                      :key="key"
                      :label="item.label"
                      :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="请假天数">
              <span>{{ calcDays }}天</span>
            </el-form-item>
          </m-section-row>

          <el-form-item
            label="请假原因"
            prop="kqqj_reason">
            <el-input
              type="textarea"
              placeholder="请输入请假原因"
              :rows="2"
              v-model="form.kqqj_reason" />
          </el-form-item>

          <m-section-row
            v-if="form.kqqj_type != '4096'
              && form.kqqj_type != '2048'
              && form.kqqj_type != '524288'
            && form.kqqj_type != '32768'">
            <el-form-item
              prop="kqqj_aids"
              label="附件上传"
              :rules="adisRules">
              <m-upload
                class="autotest-upload"
                multiple
                ref="upload"
                :on-success="uploadHandler"
                :on-remove="uploadHandler"
                :accept="upload.accept"
                :file-list="upload.files"
                :action="upload.action" />
            </el-form-item>
          </m-section-row>

        </template>
      </el-form>
    </m-section>

    <logsAndPath
      v-if="info.status == '94'"
      :data="logsAndPath" />

    <div class="page--pa-actions">
      <el-button
        type="primary"
        :loading="button.submit"
        @click="preSubmit">提交</el-button>

      <el-button
        type="info"
        @click="cancel">取消</el-button>
    </div>
  </section>
</template>

<script>
  import mixin from '~services/mixin'
  import logsAndPath from '@/components/logsAndPath'
  import Userinfo from '~services/components/common/Userinfo'

  export default {
    name: 'AskForLeave',

    components: { Userinfo, logsAndPath },

    mixins: [mixin.pa, mixin.flow, mixin.router],

    data() {
      const validateStartDate = (rule, value, callback) => {
        const endDate = this.form.kqqj_end_date
        if (endDate && value) {
          const start = new Date(value).getTime()
          const end = new Date(endDate).getTime()

          if (start > end) {
            callback(new Error('开始时间不能晚于结束时间'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }

      const validateEndDate = (rule, value, callback) => {
        const startDate = this.form.kqqj_start_date
        if (startDate && value) {
          const start = new Date(startDate).getTime()
          const end = new Date(value).getTime()

          if (end < start) {
            callback(new Error('结束时间不能早于开始时间'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }

      const validateEndDateTime = (rule, value, callback) => {
        const endDate = this.form.kqqj_end_date
        const startDate = this.form.kqqj_start_date

        if (endDate === startDate) {
          const start = this.form.kqqj_start_date_time

          if (Number(value) < Number(start)) {
            callback(new Error('请选择下午'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }


      return {
        breadcrumb: this.$breadcrumb([{ name: '请假' }], 'attendance'),
        form: {
          kqqj_type: '',
          kqqj_aids: '',
          kqqj_reason: '',
          kqqj_end_date: '',
          kqqj_start_date: '',
          kqqj_end_date_time: '',
          kqqj_start_date_time: '',
        },
        rules: {
          kqqj_type: [
            { required: true, message: '请选择请假类型', trigger: ['blur', 'change'] },
          ],
          kqqj_start_date: [
            { required: true, message: '请选择开始日期', trigger: ['blur', 'change'] },
            { validator: validateStartDate, trigger: 'blur' },
          ],
          kqqj_start_date_time: [
            { required: true, message: '请选择上/下午', trigger: ['blur', 'change'] },
          ],
          kqqj_end_date: [
            { required: true, message: '请选择结束日期', trigger: ['blur', 'change'] },
            { validator: validateEndDate, trigger: 'blur' },
          ],
          kqqj_end_date_time: [
            { required: true, message: '请选择上/下午', trigger: ['blur', 'change'] },
            { validator: validateEndDateTime, trigger: 'change' },
          ],
          kqqj_reason: [
            { required: true, message: '请填写请假原因', trigger: 'blur' },
          ],
        },
        options: {
          types: [
            { label: '事假', value: '2048' },
            { label: '年假', value: '4096' },
            { label: '病假', value: '8192' },
            { label: '婚假', value: '16384' },
            { label: '产检假', value: '32768' },
            { label: '陪产假', value: '65536' },
            { label: '产假', value: '131072' },
            { label: '流产假', value: '262144' },
            { label: '丧假', value: '524288' },
          ],
          range: [
            { label: '上午', value: '1' },
            { label: '下午', value: '2' },
          ],
        },
        days: '',
        range: '',
        calcDays: 0,
        isEdit: false,
        submitMessage: '提交完成，请留意流程审批状态',
        submitRedirectPath: '/attendance/application',
        upload: {
          accept: null,
        },
      }
    },

    computed: {
      tips() {
        const type = this.form.kqqj_type

        if (type) {
          const tips = {
            2048: '若全月休假，请先在WOA提请工单，审批通过后再在此发起申请。',
            4096: '每年1月1号统计上年度剩余年假，3月31号清零上年度剩余年假。',
            8192: '请假天数大于等于2天时，请上传病历和病假单（深圳区级以上医院开具）扫描件或照片；若全月休假，请先在WOA提请工单，审批通过后再在此发起申请。',
            16384: '提交时请上传结婚证扫描件或照片。',
            32768: '不显示',
            65536: '请上传结婚证、准生证扫描件或照片，销假时提供小孩出生证明',
            131072: '请上传结婚证、准生证扫描件或照片，产后销假时提供小孩出生证明、独生子女证（如有休此假）、难产证明（如有休此假）等。',
            262144: '请上传结婚证、准生证和流产证明扫描件或照片。',
            524288: '不显示',
          }

          return tips[type]
        }

        return ''
      },

      takeRestedDays() {
        const type = this.form.kqqj_type

        if (this.days.kqqj_rested_day_num_obj && type) {
          const days = this.days.kqqj_rested_day_num_obj[type] / 2
          return `${days}天`
        }

        return '--'
      },

      pickerOptions() {
        const type = this.form.kqqj_type
        const startTimestamp = this.range[type].start_timestamp * 1000
        const endTimestamp = this.range[type].end_timestamp * 1000

        return {
          disabledDate(time) {
            const timestamp = time.getTime()

            if (timestamp >= startTimestamp && timestamp <= endTimestamp) {
              return false
            }

            return true
          },
        }
      },

      adisRules() {
        let required = false
        const type = this.form.kqqj_type
        const days = this.calcDays

        switch (String(type)) {
        case '2048':
        case '4096':
        case '524288':
        case '32768':
          required = false
          break
        case '8192':
          if (days >= 2) required = true
          break
        case '16384':
        case '65536':
        case '131072':
        case '262144':
          required = true
          break
        default:
        }

        return { required, message: '请上传附件', trigger: 'blur' }
      },
    },

    created() {
      this
        .init()
        .then(() => {
          const { id } = this.$route.params

          if (id) {
            this.isEdit = true
            this
              .getInfo()
              .then((res) => {
                this.info = res.data
                this.form = res.data.flow_form_data
                this.changeTime()

                if (Number(this.info.status) === 94) this.getLogsAndPath()
              })
          }
        })
    },

    methods: {
      uploadHandler() {
        this.form.kqqj_aids = this.$refs.upload.getFiles('string')
      },

      init() {
        return Promise
          .all([this.getDaysOfLeave(), this.getDaysOfRange()])
          .then(([days, range]) => {
            this.days = days.data
            this.range = range.data.date_range_obj['200018']
          })
      },

      getDaysOfLeave() {
        return this.$axios.post(this.$api.services.attendance.getDaysOfLeave)
      },

      getDaysOfRange() {
        return this.$axios.post(this.$api.services.attendance.getDaysOfRange)
      },

      changeTime() {
        const start_date = this.form.kqqj_start_date
        const start_date_time = this.form.kqqj_start_date_time
        const end_date = this.form.kqqj_end_date
        const end_date_time = this.form.kqqj_end_date_time

        if (start_date && start_date_time && end_date && end_date_time) {
          this
            .$axios
            .post(this.$api.services.attendance.getRestDayNum, {
              start_date,
              start_date_time,
              end_date,
              end_date_time,
              type: this.form.kqqj_type,
            })
            .then(({ data }) => {
              this.calcDays = data.day_num / 2
            })
        } else {
          this.calcDays = 0
        }
      },

      preSubmit() {
        if (
          this.form.kqqj_type === '4096'
          && Number(this.days.kqqj_nj_count_day_num) === 0
        ) {
          this.$message.error('年假余额不足，无法申请年假。')
          return
        }

        if (
          this.form.kqqj_type === '16384'
          && Number(this.calcDays) > 5
        ) {
          this.$message.error('婚假请假天数不得超过5天')
          return
        }

        this.submit('submit')
      },

      changeType() {
        this.form.kqqj_start_date = ''
        this.form.kqqj_start_date_time = ''
        this.form.kqqj_end_date = ''
        this.form.kqqj_end_date_time = ''
      },

      changeStartDate() {
        const endDate = this.form.kqqj_end_date
        const startDate = this.form.kqqj_start_date

        if (endDate && startDate) {
          const start = new Date(startDate).getTime()
          const end = new Date(endDate).getTime()

          if (end < start) this.form.kqqj_end_date = ''
        }

        this.changeTime()
      },

      changeStartDateTime() {
        const endDate = this.form.kqqj_end_date
        const startDate = this.form.kqqj_start_date

        if (endDate === startDate) this.form.kqqj_end_date_time = ''
        this.changeTime()
      },
    },
  }
</script>

<style lang="scss" scoped>
  .m-section--form {
    .el-col {
      .el-form-item {
        width: auto;
        margin: 0;
      }
    }
  }
</style>
