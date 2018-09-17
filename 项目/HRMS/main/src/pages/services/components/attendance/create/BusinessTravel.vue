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
          <p>1. 适用于因公务需要离开办公地点一个工作日以上且发生费用的行为。</p>
          <p>如果发起人同时为出差人之一，请在参加人员菜单中勾选自己。</p>
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
            label="差旅归属"
            prop="kqcc_line">
            <el-select
              placeholder="请选择"
              v-model="form.kqcc_line">
              <el-option
                v-for="(item, key) in options.belong"
                :key="key"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item
            label="差旅类型"
            prop="kqcc_type">
            <el-select
              placeholder="请选择"
              v-model="form.kqcc_type">
              <el-option
                v-for="(item, key) in options.types"
                :key="key"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="开始时间"
            required>
            <el-col style="width: 160px;">
              <el-form-item
                prop="kqcc_start_date">
                <el-date-picker
                  type="date"
                  style="width: 160px;"
                  placeholder="选择开始日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  v-model="form.kqcc_start_date"
                  :picker-options="pickerOptions"
                  @change="changeStartDate" />
              </el-form-item>
            </el-col>

            <el-col style="width: 90px;">
              <el-form-item
                prop="kqcc_start_date_time">
                <el-select
                  style="width: 90px; margin-left: 10px;"
                  v-model="form.kqcc_start_date_time"
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
                prop="kqcc_end_date">
                <el-date-picker
                  type="date"
                  style="width: 160px;"
                  placeholder="选择结束日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  v-model="form.kqcc_end_date"
                  :picker-options="pickerOptions"
                  @change="changeTime" />
              </el-form-item>
            </el-col>

            <el-col style="width: 90px;">
              <el-form-item
                prop="kqcc_end_date_time">
                <el-select
                  style="width: 90px; margin-left: 10px;"
                  v-model="form.kqcc_end_date_time"
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
            label="出差天数">
            <span>{{ calcDays }}天</span>
          </el-form-item>

          <el-form-item
            label="预算类型"
            prop="kqcc_fee_type">
            <el-select
              placeholder="请选择"
              v-model="form.kqcc_fee_type">
              <el-option
                v-for="(item, key) in options.budgetTypes"
                :key="key"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="预算金额"
            prop="kqcc_fee">
            <el-input
              type="number"
              placeholder="预算为整数，无预算填0"
              ref="money"
              :min="1"
              v-model.number="form.kqcc_fee"
              @input="onInputMoney">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>

          <el-form-item
            label="区域范围"
            prop="kqcc_district_type">
            <el-select
              placeholder="请选择"
              v-model="form.kqcc_district_type">
              <el-option
                v-for="(item, key) in options.areaRange"
                :key="key"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="交通方式"
            prop="kqcc_traffic_type">
            <el-select
              multiple
              size="medium"
              placeholder="请选择"
              v-model="traffice"
              @change="changeTraffic">
              <el-option
                v-for="(item, key) in options.traffic"
                :key="key"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item
            label="客户名称"
            prop="kqcc_customer_name">
            <el-input
              placeholder="请输入客户名称"
              v-model="form.kqcc_customer_name" />
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="联系人姓名"
            prop="kqcc_contact_name">
            <el-input
              placeholder="请填写联系人姓名"
              v-model="form.kqcc_contact_name" />
          </el-form-item>

          <el-form-item
            label="联系人电话"
            prop="kqcc_contact_mobile">
            <el-input
              placeholder="请输入联系人电话"
              v-model="form.kqcc_contact_mobile" />
          </el-form-item>
        </m-section-row>


        <el-form-item
          label="目的地"
          prop="kqcc_target_place">
          <el-input
            type="textarea"
            :rows="1"
            :placeholder="`请输入目的地`"
            v-model="form.kqcc_target_place" />
        </el-form-item>

        <el-form-item
          label="差旅目的"
          prop="kqcc_target">
          <el-input
            type="textarea"
            placeholder="请输入差旅目的"
            :rows="1"
            v-model="form.kqcc_target" />
        </el-form-item>

        <el-form-item
          label="参加人员"
          prop="kqcc_entourage_uids">
          <m-async-employee-selected-with-dialog
            :employee="choosedEmployee"
            @confirm="confirmPerson" />
        </el-form-item>

        <el-form-item
          label="人员性别构成">
          <span>{{ combineWith }}</span>
        </el-form-item>
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
    name: 'BusinessTravel',

    components: { Userinfo, logsAndPath },

    mixins: [mixin.pa, mixin.flow, mixin.router],

    data() {
      const validateEndDate = (rule, value, callback) => {
        const startDate = this.form.kqcc_start_date
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
        const endDate = this.form.kqcc_end_date
        const startDate = this.form.kqcc_start_date

        if (endDate === startDate) {
          const start = this.form.kqcc_start_date_time

          if (Number(value) < Number(start)) {
            callback(new Error('请选择下午'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }

      const trafficType = (rule, value, callback) => {
        const bool = Boolean(value)

        if (!bool) {
          callback(new Error('请选择交通方式'))
        } else {
          callback()
        }
      }

      const fee = (rule, value, callback) => {
        const reg = /^(([1-9][0-9]*)|0|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/

        if (!reg.test(value)) {
          callback(new Error('预算金额必须大于等于0'))
        } else {
          callback()
        }
      }

      return {
        breadcrumb: this.$breadcrumb([{ name: '出差' }], 'attendance'),
        form: {
          kqcc_line: '',
          kqkqcc_type: '',
          kqcc_start_date: '',
          kqcc_start_date_time: '',
          kqcc_end_date: '',
          kqcc_end_date_time: '',
          kqcc_fee_type: '',
          kqcc_fee: '',
          kqcc_district_type: '',
          kqcc_traffic_type: '',
          kqcc_customer_name: '',
          kqcc_contact_name: '',
          kqcc_contact_mobile: '',
          kqcc_target_place: '',
          kqcc_target: '',
          kqcc_entourage_uids: '',
        },
        rules: {
          kqcc_line: [
            { required: true, message: '请选择差旅归属', trigger: ['blur', 'change'] },
          ],
          kqcc_type: [
            { required: true, message: '请选择差旅类型', trigger: ['blur', 'change'] },
          ],
          kqcc_start_date: [
            { required: true, message: '请选择开始日期', trigger: ['blur', 'change'] },
          ],
          kqcc_start_date_time: [
            { required: true, message: '请选择上/下午', trigger: ['blur', 'change'] },
          ],
          kqcc_end_date: [
            { required: true, message: '请选择结束日期', trigger: ['blur', 'change'] },
            { validator: validateEndDate, trigger: ['blur', 'change'] },
          ],
          kqcc_end_date_time: [
            { required: true, message: '请选择上/下午', trigger: ['blur', 'change'] },
            { validator: validateEndDateTime, trigger: ['blur', 'change'] },
          ],
          kqcc_fee_type: [
            { required: true, message: '请选择预算类型', trigger: ['blur', 'change'] },
          ],
          kqcc_fee: [
            { required: true, message: '请填写预算金额', trigger: ['blur', 'change'] },
            { validator: fee, trigger: ['blur', 'change'] },
          ],
          kqcc_traffic_type: [
            { required: true, message: '请选择交通方式', trigger: ['blur', 'change'] },
            { validator: trafficType, trigger: ['blur', 'change'] },
          ],
          kqcc_district_type: [
            { required: true, message: '请选择区域范围', trigger: ['blur', 'change'] },
          ],
          kqcc_customer_name: [
            { required: true, message: '请填写客户名称', trigger: ['blur', 'change'] },
          ],
          kqcc_contact_name: [
            { required: true, message: '请填写联系人姓名', trigger: ['blur', 'change'] },
          ],
          kqcc_contact_mobile: [
            { required: true, message: '请填写联系人电话', trigger: ['blur', 'change'] },
          ],
          kqcc_target_place: [
            { required: true, message: '请填写目的地', trigger: ['blur', 'change'] },
          ],
          kqcc_target: [
            { required: true, message: '请填写差旅目的', trigger: ['blur', 'change'] },
          ],
          kqcc_entourage_uids: [
            { required: true, message: '请选择参加人员', trigger: ['blur', 'change'] },
          ],
        },
        traffice: [],
        options: {
          types: [
            { label: '参加公司或中心会议', value: '1' },
            { label: '参加外部会议', value: '2' },
            { label: '中心集体参观交流活动', value: '4' },
            { label: '调研上市公司或企业', value: '8' },
            { label: '业务拓展或拜访', value: '16' },
          ],
          belong: [
            { label: '财富线', value: '2' },
            { label: '机构线', value: '4' },
            { label: '非业务条线', value: '1' },
          ],
          range: [
            { label: '上午', value: '1' },
            { label: '下午', value: '2' },
          ],
          traffic: [
            { label: '飞机', value: '1' },
            { label: '火车', value: '2' },
            { label: '轮船', value: '4' },
            { label: '巴士', value: '8' },
            { label: '自驾', value: '16' },
            { label: '其他', value: '1024' },
          ],
          areaRange: [
            { label: '市内', value: '1' },
            { label: '市外省内', value: '2' },
            { label: '省外', value: '4' },
          ],
          budgetTypes: [
            { label: '无费用开支', value: '1' },
            { label: '部门预算', value: '2' },
            { label: '团队预算', value: '4' },
            { label: '个人预算', value: '8' },
            { label: '中心公共费用', value: '16' },
            { label: '业务线留存预算', value: '32' },
          ],
        },
        isEdit: false,
        range: '',
        calcDays: 0,
        submitMessage: '提交完成，请留意流程审批状态',
        choosedEmployee: [],
        submitRedirectPath: '/attendance/application',
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

      combineWith() {
        const employee = this.choosedEmployee || []
        const boys = employee.filter(item => item.sex === 1)
        const girls = employee.filter(item => item.sex === 2)
        const boyNum = boys.length
        const girlNum = girls.length

        if (girlNum && boyNum) {
          return `${boyNum}男${girlNum}女`
        } else if (boyNum) {
          return `${boyNum}男`
        } else if (girlNum) {
          return `${girlNum}女`
        }

        return '--'
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
                this.choosedEmployee = res.data.flow_form_data.kqcc_entourage_users
                this.traffice = res.data.flow_form_data
                  .kqcc_traffic_type_names
                  .map(item => String(item.key))
                this.changeTime()

                if (Number(this.info.status) === 94) this.getLogsAndPath()
              })
          }
        })
    },

    methods: {
      onInputMoney(value) {
        const reg = /^\d+?$/
        let v = parseFloat(value)

        // eslint-disable-next-line no-restricted-globals
        if (isNaN(v)) return

        if (!reg.test(v)) {
          v = parseInt(v, 10)

          this.$nextTick(() => {
            this.form.kqcc_fee = v
          })
        }
      },
      changeTraffic(arr) {
        const getSum = (total, num) => (Number(total) + Number(num))
        this.form.kqcc_traffic_type = arr.reduce(getSum, 0)
      },

      preSubmit() {
        this.changeTraffic(this.traffice)
        this.submit('submit')
      },

      uploadHandler() {
        this.form.c_aids = this.$refs.upload.getFiles('string')
      },

      init() {
        return this
          .$axios
          .post(this.$api.services.attendance.getDaysOfRange)
          .then(({ data }) => {
            this.range = data.date_range_obj['200021']
          })
      },

      confirmPerson(users) {
        this.choosedEmployee = [].concat(users)
        this.form.kqcc_entourage_uids = users.map(item => item.id).join(',')
        this.$refs.form.validateField('kqcc_entourage_uids')
      },

      changeTime() {
        const start_date = this.form.kqcc_start_date
        const start_date_time = this.form.kqcc_start_date_time
        const end_date = this.form.kqcc_end_date
        const end_date_time = this.form.kqcc_end_date_time

        if (start_date && start_date_time && end_date && end_date_time) {
          this
            .$axios
            .post(this.$api.services.attendance.getRestDayNum, {
              start_date,
              start_date_time,
              end_date,
              end_date_time,
              type: 1024,
            })
            .then(({ data }) => {
              this.calcDays = data.day_num / 2
            })
        } else {
          this.calcDays = 0
        }
      },

      changeStartDate() {
        const endDate = this.form.kqcc_end_date
        const startDate = this.form.kqcc_start_date

        if (endDate && startDate) {
          const start = new Date(startDate).getTime()
          const end = new Date(endDate).getTime()

          if (end < start) this.form.kqcc_end_date = ''
        }

        this.changeTime()
      },

      changeStartDateTime() {
        const endDate = this.form.kqcc_end_date
        const startDate = this.form.kqcc_start_date

        if (endDate === startDate) this.form.kqcc_end_date_time = ''
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
