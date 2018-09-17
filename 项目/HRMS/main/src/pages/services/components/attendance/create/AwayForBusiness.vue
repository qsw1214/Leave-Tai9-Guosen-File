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
            label="外出类型"
            prop="kqygwc_type">
            <el-select
              placeholder="请选择外出类型"
              v-model="form.kqygwc_type"
              @change="changeType">
              <el-option
                v-for="(item, key) in options.types"
                :key="key"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
        </m-section-row>

        <template v-if="form.kqygwc_type">
          <m-section-row>
            <el-form-item
              label="开始时间"
              required>
              <el-col style="width: 160px;">
                <el-form-item
                  prop="kqygwc_start_date">
                  <el-date-picker
                    type="date"
                    style="width: 160px;"
                    placeholder="选择日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                    v-model="form.kqygwc_start_date"
                    @change="changeStartTime" />
                </el-form-item>
              </el-col>

              <el-col style="width: 90px;">
                <el-form-item
                  prop="kqygwc_start_date_time">
                  <el-select
                    style="width: 90px; margin-left: 10px;"
                    v-model="form.kqygwc_start_date_time"
                    @change="changeStartTimeRange">
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
                  prop="kqygwc_end_date">
                  <el-date-picker
                    type="date"
                    style="width: 160px;"
                    placeholder="选择结束日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                    v-model="form.kqygwc_end_date"
                    @change="changeTime" />
                </el-form-item>
              </el-col>

              <el-col style="width: 90px;">
                <el-form-item
                  prop="kqygwc_end_date_time">
                  <el-select
                    style="width: 90px; margin-left: 10px;"
                    v-model="form.kqygwc_end_date_time"
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

          <template
            v-if="form.kqygwc_type == '1' ||
            form.kqygwc_type == '2' || form.kqygwc_type == '4'">
            <m-section-row>
              <el-form-item
                label="客户姓名"
                prop="kqygwc_customer_name">
                <el-input
                  placeholder="请输入客户姓名"
                  v-model="form.kqygwc_customer_name" />
              </el-form-item>

              <el-form-item
                label="客户电话"
                prop="kqygwc_customer_mobile">
                <el-input
                  placeholder="请输入客户电话"
                  v-model="form.kqygwc_customer_mobile" />
              </el-form-item>
            </m-section-row>

            <m-section-row v-if="form.kqygwc_type != '2'">
              <el-form-item
                label="客户代码"
                prop="kqygwc_customer_code"
                v-if="form.kqygwc_type != '2'">
                <el-input
                  placeholder="资金账号或股东代码"
                  v-model="form.kqygwc_customer_code" />
              </el-form-item>

              <el-form-item
                label="业务类型"
                prop="kqygwc_business_type"
                v-if="form.kqygwc_type == '4'">
                <el-input
                  placeholder="请填写业务类型"
                  v-model="form.kqygwc_business_type" />
              </el-form-item>
            </m-section-row>
          </template>

          <template
            v-if="form.kqygwc_type == '8' ||
            form.kqygwc_type == '16' || form.kqygwc_type == '32'">
            <m-section-row class="test">
              <el-form-item
                label="企业名称"
                prop="kqygwc_enterprise_name"
                v-if="form.kqygwc_type == '32'">
                <el-input
                  placeholder="请输入企业名称"
                  v-model="form.kqygwc_enterprise_name" />
              </el-form-item>

              <el-form-item
                label="公司名称"
                prop="kqygwc_company_name"
                v-else>
                <el-input
                  placeholder="请输入公司名称"
                  v-model="form.kqygwc_company_name" />
              </el-form-item>

              <el-form-item
                label="联系人姓名"
                prop="kqygwc_contact_name">
                <el-input
                  placeholder="请输入联系人姓名"
                  v-model="form.kqygwc_contact_name" />
              </el-form-item>
            </m-section-row>

            <m-section-row>
              <el-form-item
                label="联系人电话"
                prop="kqygwc_contact_mobile">
                <el-input
                  placeholder="请输入联系人电话"
                  v-model="form.kqygwc_contact_mobile" />
              </el-form-item>

              <el-form-item
                label="联系人职位"
                prop="kqygwc_contact_job"
                v-if="form.kqygwc_type != '8'">
                <el-input
                  placeholder="请填写联系人职位"
                  v-model="form.kqygwc_contact_job" />
              </el-form-item>
            </m-section-row>
          </template>

          <el-form-item
            label="拜访地点"
            prop="kqygwc_meeting_place"
            v-if="form.kqygwc_type !='4' && form.kqygwc_type != '8'">
            <el-input
              type="textarea"
              placeholder="请输入拜访地点"
              :rows="1"
              v-model="form.kqygwc_meeting_place" />
          </el-form-item>

          <el-form-item
            label="办理地点"
            prop="kqygwc_handling_place"
            v-if="form.kqygwc_type =='4' || form.kqygwc_type == '8'">
            <el-input
              type="textarea"
              placeholder="请输入办理地点"
              :rows="1"
              v-model="form.kqygwc_handling_place" />
          </el-form-item>

          <el-form-item
            label="详细事由"
            prop="kqygwc_detail_reason"
            v-if="form.kqygwc_type != '4' && form.kqygwc_type != '8'">
            <el-input
              type="textarea"
              placeholder="请输入详细事由"
              :rows="1"
              v-model="form.kqygwc_detail_reason" />
          </el-form-item>

          <el-form-item
            label="陪同人员"
            prop="kqygwc_entourage_uids">
            <m-async-employee-selected-with-dialog
              :employee="choosedEmployee"
              @confirm="confirmPerson" />
          </el-form-item>
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
    name: 'AwayForBusiness',

    components: { Userinfo, logsAndPath },

    mixins: [mixin.pa, mixin.flow, mixin.router],

    data() {
      const validateEndDate = (rule, value, callback) => {
        const startDate = this.form.kqygwc_start_date
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
        const endDate = this.form.kqygwc_end_date
        const startDate = this.form.kqygwc_start_date

        if (endDate === startDate) {
          const start = this.form.kqygwc_start_date_time

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
        breadcrumb: this.$breadcrumb([{ name: '因公外出' }], 'attendance'),
        form: {
          kqygwc_type: '',
          kqygwc_start_date: '',
          kqygwc_start_date_time: '',
          kqygwc_end_date: '',
          kqygwc_end_date_time: '',
          kqygwc_customer_name: '',
          kqygwc_customer_code: '',
          kqygwc_customer_mobile: '',
          kqygwc_business_type: '',
          kqygwc_company_name: '',
          kqygwc_entourage_uids: '',
          kqygwc_meeting_place: '',
          kqygwc_handling_place: '',
          kqygwc_detail_reason: '',
          kqygwc_enterprise_name: '',
          kqygwc_contact_name: '',
          kqygwc_contact_mobile: '',
          kqygwc_contact_job: '',
        },
        rules: {
          kqygwc_type: [
            { required: true, message: '请选择外出类型', trigger: ['blur', 'change'] },
          ],
          kqygwc_start_date: [
            { required: true, message: '请选择开始日期', trigger: ['blur', 'change'] },
          ],
          kqygwc_start_date_time: [
            { required: true, message: '请选择上/下午', trigger: ['blur', 'change'] },
          ],
          kqygwc_end_date: [
            { required: true, message: '请选择结束日期', trigger: ['blur', 'change'] },
            { validator: validateEndDate, trigger: ['blur', 'change'] },
          ],
          kqygwc_end_date_time: [
            { required: true, message: '请选择上/下午', trigger: ['blur', 'change'] },
            { validator: validateEndDateTime, trigger: ['blur', 'change'] },
          ],
          ygwc_reason: [
            { required: true, message: '请填写请假原因', trigger: 'blur' },
          ],
          kqygwc_customer_name: [
            { required: true, message: '请填写客户姓名', trigger: 'blur' },
          ],
          kqygwc_customer_code: [
            { required: true, message: '请填写资金账号或股东代码', trigger: 'blur' },
          ],
          kqygwc_customer_mobile: [
            { required: true, message: '请填写客户电话', trigger: 'blur' },
          ],
          kqygwc_business_type: [
            { required: true, message: '请填写业务类型', trigger: 'blur' },
          ],
          kqygwc_company_name: [
            { required: true, message: '请输入公司名称', trigger: 'blur' },
          ],
          kqygwc_enterprise_name: [
            { required: true, message: '请输入企业名称', trigger: 'blur' },
          ],
          kqygwc_contact_name: [
            { required: true, message: '请输入联系人姓名', trigger: 'blur' },
          ],
          kqygwc_contact_mobile: [
            { required: true, message: '请输入联系人电话', trigger: 'blur' },
          ],
          kqygwc_contact_job: [
            { required: true, message: '请输入联系人职位', trigger: 'blur' },
          ],
          kqygwc_detail_reason: [
            { required: true, message: '请填写详情事由', trigger: 'blur' },
          ],
          kqygwc_meeting_place: [
            { required: true, message: '请填写拜访地点', trigger: 'blur' },
          ],
          kqygwc_handling_place: [
            { required: true, message: '请填写办理地点', trigger: 'blur' },
          ],
        },
        options: {
          types: [
            { label: '拜访名下客户', value: '1' },
            { label: '拜访潜在客户', value: '2' },
            { label: '陪客户办理业务', value: '4' },
            { label: '市内上市公司调研', value: '8' },
            { label: '渠道拜访', value: '16' },
            { label: '企业客户拜访', value: '32' },
            { label: '其他', value: '1024' },
          ],
          range: [
            { label: '上午', value: '1' },
            { label: '下午', value: '2' },
          ],
        },
        isEdit: false,
        submitMessage: '提交完成，请留意流程审批状态',
        submitRedirectPath: '/attendance/application',
        choosedEmployee: [],
        range: '',
        calcDays: 0,
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
            this
              .getInfo()
              .then((res) => {
                this.info = res.data
                this.form = res.data.flow_form_data
                this.choosedEmployee = res.data.flow_form_data.kqygwc_entourage_users
                this.changeTime()

                if (Number(this.info.status) === 94) this.getLogsAndPath()
              })
          } else {
            const today = this.$utils.tools.formatDate(new Date())
            this.form.kqygwc_start_date = today
            this.form.kqygwc_start_date_time = '1'
            this.form.kqygwc_end_date = today
            this.form.kqygwc_end_date_time = '2'
            this.changeTime()
          }
        })
    },

    methods: {
      init() {
        return this
          .$axios
          .post(this.$api.services.attendance.getDaysOfRange)
          .then(({ data }) => {
            this.range = data.date_range_obj['200019']
          })
      },

      uploadHandler() {
        this.form.ygwc_aids = this.$refs.upload.getFiles('string')
      },

      confirmPerson(users) {
        this.choosedEmployee = [].concat(users)
        this.form.kqygwc_entourage_uids = users.map(item => item.id).join(',')
        this.$refs.form.validateField('kqygwc_entourage_uids')
      },

      changeStartTime() {
        const endDate = this.form.kqygwc_end_date
        const startDate = this.form.kqygwc_start_date

        if (endDate && startDate) {
          const start = new Date(startDate).getTime()
          const end = new Date(endDate).getTime()

          if (end < start) this.form.kqygwc_end_date = ''
          else this.changeTime()
        }
      },

      changeStartTimeRange() {
        const endDate = this.form.kqygwc_end_date
        const startDate = this.form.kqygwc_start_date

        if (endDate === startDate) this.form.kqygwc_end_date = ''
        else this.changeTime()
      },

      changeTime() {
        const start_date = this.form.kqygwc_start_date
        const start_date_time = this.form.kqygwc_start_date_time
        const end_date = this.form.kqygwc_end_date
        const end_date_time = this.form.kqygwc_end_date_time

        if (start_date && start_date_time && end_date && end_date_time) {
          this
            .$axios
            .post(this.$api.services.attendance.getRestDayNum, {
              start_date,
              start_date_time,
              end_date,
              end_date_time,
              type: 512,
            })
            .then(({ data }) => {
              this.calcDays = data.day_num / 2
            })
        } else {
          this.calcDays = 0
        }
      },

      preSubmit() {
        if (this.calcDays > 1) {
          this.$message.error('外出时间不得超过一个工作日，请重新选择!')
          return
        }

        this.submit('submit')
      },

      changeType() {
        this.$refs.form.clearValidate()
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
