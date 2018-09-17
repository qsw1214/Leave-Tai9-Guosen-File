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

      <m-section-row>
        <m-section-cell
          title="流程说明">
          <el-alert
            title="适用情况"
            type="warning"
            show-icon
            description="1.忘记打卡；2.指纹脱皮导致当天无法打卡。"
            :closable="false" />
          <br>
          <el-alert
            title="注意事项"
            type="info"
            description="1.如因个人原因忘记打卡，请发起此流程，经部门负责人审批同意，按照中心考勤制度统一计为迟到。
                          2.如因公事外出造成未打卡情况，请提交因公外出流程，经部门负责人审批同意后可按正常出勤计算。
                          3.所有因公外出报备，须注明外出时间、地点、事由，时间必须与未打卡日期相吻合，方可接受，否则不予接受报备。"
            :closable="false"/>

        </m-section-cell>
      </m-section-row>

      <el-form
        class="m-section--form"
        label-width="140px"
        ref="form"
        :rules="rules"
        :model="form">

        <m-section-row>
          <el-form-item
            label="未打卡日期"
            required>
            <el-col style="width: 160px;">
              <el-form-item
                prop="kqwdkss_date">
                <el-date-picker
                  type="date"
                  style="width: 160px;"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  v-model="form.kqwdkss_date"
                  :picker-options="pickerOptions" />
              </el-form-item>
            </el-col>

            <el-col style="width: 90px;">
              <el-form-item
                prop="kqwdkss_date_time">
                <el-select
                  style="width: 90px; margin-left: 10px;"
                  v-model="form.kqwdkss_date_time">
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
            label="未打卡原因"
            prop="kqwdkss_reason">
            <el-select
              v-model="form.kqwdkss_reason">
              <el-option
                v-for="(item, key) in options.reason"
                :key="key"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
        </m-section-row>

        <m-section-row v-if="form.kqwdkss_reason == '64'">
          <el-form-item
            prop="kqwdkss_aids"
            label="照片上传">
            <m-upload
              class="autotest-upload"
              multiple
              ref="upload"
              :limit="upload.limit"
              :on-success="uploadHandler"
              :on-remove="uploadHandler"
              :accept="upload.accept"
              :file-list="upload.files"
              :action="upload.action" />
          </el-form-item>
        </m-section-row>
      </el-form>
    </m-section>

    <logsAndPath
      v-if="info.status == '94'"
      :data="logsAndPath" />

    <div class="page--pa-actions">
      <el-button
        type="primary"
        :loading="button.submit"
        @click="submit('submit')">提交</el-button>

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
    name: 'PunchCardCompaint',

    components: { Userinfo, logsAndPath },

    mixins: [mixin.pa, mixin.flow, mixin.router],

    data() {
      return {
        breadcrumb: this.$breadcrumb([{ name: '未打卡申诉' }], 'attendance'),
        form: {
          kqwdkss_date: '',
          kqwdkss_date_time: '',
          kqwdkss_reason: '',
          kqwdkss_aids: '',
        },
        rules: {
          kqwdkss_date: [
            { required: true, message: '请选择未打卡日期', trigger: ['blur', 'change'] },
          ],
          kqwdkss_date_time: [
            { required: true, message: '请选择上/下午', trigger: ['blur', 'change'] },
          ],
          kqwdkss_reason: [
            { required: true, message: '请选择未打卡原因', trigger: ['blur', 'change'] },
          ],
          kqwdkss_aids: [
            { required: true, message: '请上传照片', trigger: ['blur', 'change'] },
          ],
        },
        options: {
          reason: [
            { label: '忘记打卡', value: '32' },
            { label: '因指纹模糊未打卡', value: '64' },
          ],
          range: [
            { label: '上午', value: '1' },
            { label: '下午', value: '2' },
            { label: '全天', value: '3' },
          ],
        },
        isEdit: false,
        submitMessage: '提交完成，请留意流程审批状态',
        submitRedirectPath: '/attendance/application',
        range: '',
        upload: {
          accept: 'image',
          limit: 2,
        },
      }
    },

    computed: {
      pickerOptions() {
        const startTimestamp = this.range.start_timestamp * 1000
        const endTimestamp = this.range.end_timestamp * 1000

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
    },

    created() {
      this
        .init()
        .then(() => {
          const { id } = this.$route.params

          if (id) {
            this.isEdit = true
            this.getInfo()
              .then((res) => {
                this.info = res.data
                this.form = res.data.flow_form_data
                if (Number(this.info.status) === 94) this.getLogsAndPath()
              })
          }
        })
    },

    methods: {
      init() {
        return this
          .$axios
          .post(this.$api.services.attendance.getDaysOfRange)
          .then(({ data }) => {
            this.range = data.date_range_obj['200020']
          })
      },

      uploadHandler() {
        this.form.kqwdkss_aids = this.$refs.upload.getFiles('string')
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
