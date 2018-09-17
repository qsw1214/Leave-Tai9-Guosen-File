<template>
  <section
    v-loading.fullscreen.lock="loading"
    class="page page--pa-group__report">

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
          <p>1. 公司或部门组织的团建活动；</p>
          <p>2. 公司或部门会议、部门电话营销、业务培训等；</p>
          <p>3. 其他(因工作需要组织的集体活动)；</p>
          <p>注：如果发起人同时为出差人之一，请在参加人员中勾选自己。</p>
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
            label="申请归属"
            prop="kqplbb_line">
            <el-select
              placeholder="请选择"
              v-model="form.kqplbb_line">
              <el-option
                v-for="(item, key) in options.belong"
                :key="key"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item
            label="申请类型"
            prop="kqplbb_type">
            <el-select
              placeholder="请选择"
              v-model="form.kqplbb_type">
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
                prop="kqplbb_start_date">
                <el-date-picker
                  type="date"
                  style="width: 160px;"
                  placeholder="选择开始日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  v-model="form.kqplbb_start_date"
                  :picker-options="pickerOptions"
                  @change="changeStartDate" />
              </el-form-item>
            </el-col>

            <el-col style="width: 90px;">
              <el-form-item
                prop="kqplbb_start_date_time">
                <el-select
                  style="width: 90px; margin-left: 10px;"
                  v-model="form.kqplbb_start_date_time"
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
                prop="kqplbb_end_date">
                <el-date-picker
                  type="date"
                  style="width: 160px;"
                  placeholder="选择结束日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  v-model="form.kqplbb_end_date"
                  :picker-options="pickerOptions"
                  @change="changeTime" />
              </el-form-item>
            </el-col>

            <el-col style="width: 90px;">
              <el-form-item
                prop="kqplbb_end_date_time">
                <el-select
                  style="width: 90px; margin-left: 10px;"
                  v-model="form.kqplbb_end_date_time"
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
            label="外出天数">
            <span>{{ calcDays }}天</span>
          </el-form-item>

          <el-form-item
            label="预算类型"
            prop="kqplbb_fee_type">
            <el-select
              placeholder="请选择"
              v-model="form.kqplbb_fee_type">
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
            prop="kqplbb_fee">
            <el-input
              type="number"
              placeholder="预算为整数，无预算填0"
              ref="money"
              :min="1"
              v-model.number="form.kqplbb_fee"
              @input="onInputMoney">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>

          <el-form-item
            label="区域范围"
            prop="kqplbb_district_type">
            <el-select
              placeholder="请选择"
              v-model="form.kqplbb_district_type">
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
            prop="kqplbb_traffic_type">
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
            label="目的地"
            prop="kqplbb_target_place">
            <el-input
              type="textarea"
              :rows="1"
              :placeholder="`请输入目的地`"
              v-model="form.kqplbb_target_place" />
          </el-form-item>
        </m-section-row>


        <el-form-item
          label="外出目的"
          prop="kqplbb_target">
          <el-input
            type="textarea"
            placeholder="请输入外出目的"
            :rows="1"
            v-model="form.kqplbb_target" />
        </el-form-item>

        <el-form-item
          label="参加人员"
          prop="kqplbb_entourage_uids">
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
        const startDate = this.form.kqplbb_start_date
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
        const endDate = this.form.kqplbb_end_date
        const startDate = this.form.kqplbb_start_date

        if (endDate === startDate) {
          const start = this.form.kqplbb_start_date_time

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
        breadcrumb: this.$breadcrumb([{ name: '批量报备' }], 'attendance'),
        form: {
          kqplbb_line: '',
          kqkqplbb_type: '',
          kqplbb_start_date: '',
          kqplbb_start_date_time: '',
          kqplbb_end_date: '',
          kqplbb_end_date_time: '',
          kqplbb_fee_type: '',
          kqplbb_fee: '',
          kqplbb_district_type: '',
          kqplbb_traffic_type: '',
          kqplbb_target_place: '',
          kqplbb_target: '',
          kqplbb_entourage_uids: '',
        },
        rules: {
          kqplbb_line: [
            { required: true, message: '请选择申请归属', trigger: ['blur', 'change'] },
          ],
          kqplbb_type: [
            { required: true, message: '请选择申请类型', trigger: ['blur', 'change'] },
          ],
          kqplbb_start_date: [
            { required: true, message: '请选择开始日期', trigger: ['blur', 'change'] },
          ],
          kqplbb_start_date_time: [
            { required: true, message: '请选择上/下午', trigger: ['blur', 'change'] },
          ],
          kqplbb_end_date: [
            { required: true, message: '请选择结束日期', trigger: ['blur', 'change'] },
            { validator: validateEndDate, trigger: ['blur', 'change'] },
          ],
          kqplbb_end_date_time: [
            { required: true, message: '请选择上/下午', trigger: ['blur', 'change'] },
            { validator: validateEndDateTime, trigger: ['blur', 'change'] },
          ],
          kqplbb_fee_type: [
            { required: true, message: '请选择预算类型', trigger: ['blur', 'change'] },
          ],
          kqplbb_fee: [
            { required: true, message: '请填写预算金额', trigger: ['blur', 'change'] },
            { validator: fee, trigger: ['blur', 'change'] },
          ],
          kqplbb_traffic_type: [
            { required: true, message: '请选择交通方式', trigger: ['blur', 'change'] },
            { validator: trafficType, trigger: ['blur', 'change'] },
          ],
          kqplbb_district_type: [
            { required: true, message: '请选择区域范围', trigger: ['blur', 'change'] },
          ],
          kqplbb_target_place: [
            { required: true, message: '请填写目的地', trigger: ['blur', 'change'] },
          ],
          kqplbb_target: [
            { required: true, message: '请填写外出目的', trigger: ['blur', 'change'] },
          ],
          kqplbb_entourage_uids: [
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
                this.choosedEmployee = res.data.flow_form_data.kqplbb_entourage_users
                this.traffice = res.data.flow_form_data
                  .kqplbb_traffic_type_names
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
            this.form.kqplbb_fee = v
          })
        }
      },

      changeTraffic(arr) {
        const getSum = (total, num) => (Number(total) + Number(num))
        this.form.kqplbb_traffic_type = arr.reduce(getSum, 0)
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
        this.form.kqplbb_entourage_uids = users.map(item => item.id).join(',')
        this.$refs.form.validateField('kqplbb_entourage_uids')
      },

      changeTime() {
        const start_date = this.form.kqplbb_start_date
        const start_date_time = this.form.kqplbb_start_date_time
        const end_date = this.form.kqplbb_end_date
        const end_date_time = this.form.kqplbb_end_date_time

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
        const endDate = this.form.kqplbb_end_date
        const startDate = this.form.kqplbb_start_date

        if (endDate && startDate) {
          const start = new Date(startDate).getTime()
          const end = new Date(endDate).getTime()

          if (end < start) this.form.kqplbb_end_date = ''
        }

        this.changeTime()
      },

      changeStartDateTime() {
        const endDate = this.form.kqplbb_end_date
        const startDate = this.form.kqplbb_start_date

        if (endDate === startDate) this.form.kqplbb_end_date_time = ''
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
