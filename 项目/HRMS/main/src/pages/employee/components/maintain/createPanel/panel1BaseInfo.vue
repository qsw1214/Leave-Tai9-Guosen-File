<template>
  <div class="create-panel create-base-info">
    <div class="panel-title">
      <div>个人信息</div>
    </div>

    <m-section
      title="头像上传">
      <m-img-cropper
        fixed
        tip="支持jpg／png格式，蓝底照片，200x200像素以上"
        :img-src="upLoadavatar_url
          ? (upLoadavatar_url + '&token=' + requestHeader.token)
        : avatar_url"
        @outputData="upLoadavatar">
        <div class="avatar-pic-wrap">
          <img
            class="avatar-default"
            src="../../../assets/avatar.png"
            v-if="!avatar_url && !upLoadavatar_url">
          <img
            class="avatar-user"
            v-if="!!avatar_url && !upLoadavatar_url"
            :src="avatar_url + '?token=' + requestHeader.token">
          <img
            class="avatar-user"
            v-if="!!upLoadavatar_url"
            :src="upLoadavatar_url + '&token=' + requestHeader.token">

          <el-button>
            {{ !avatar_url && !upLoadavatar_url
              ? '点击上传'
            : (upLoadavatar_url ? '重新剪裁' : '再次剪裁') }}
          </el-button>
        </div>
      </m-img-cropper>
    </m-section>

    <el-form
      label-position="left"
      label-width="140px"
      ref="formData"
      :model="formData"
      :rules="formDataRules">
      <m-section
        is-form
        title="基本信息">
        <div class="m-section--form">
          <m-section-row>
            <el-form-item
              label="员工编码">
              {{ formData.code }}
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="员工ID"
              prop="emp_code">
              <el-input v-model="formData.emp_code" />
            </el-form-item>

            <el-form-item
              label="姓名"
              prop="name">
              <el-input v-model="formData.name" />
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="姓名拼音"
              prop="name_pinyin">
              <el-input
                placeholder="例：zhangsan"
                v-model="formData.name_pinyin" />
            </el-form-item>

            <el-form-item
              label="曾用名"
              prop="name_used">
              <el-input
                placeholder="无则留空"
                v-model="formData.name_used" />
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="经纪号"
              prop="broker_code">
              <el-input v-model="formData.broker_code" />
            </el-form-item>

            <el-form-item
              label="性别"
              prop="sex">
              <el-select
                placeholder="请选择"
                v-model="formData.sex">
                <el-option
                  v-for="(i, k) in options.sex"
                  :key="k"
                  :label="i"
                  :value="Number(k)" />
              </el-select>
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="出生日期"
              prop="birthday">
              <el-date-picker
                type="date"
                placeholder="请选择"
                v-model="formData.birthday"
                :picker-options="ageOptions" />
            </el-form-item>

            <el-form-item
              label="年龄">
              <el-input
                disabled
                :value="age">
                <template slot="append">岁</template>
              </el-input>
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="个人身份"
              prop="identity">
              <el-select
                placeholder="请选择"
                v-model="formData.identity">
                <el-option
                  v-for="(i, k) in options.identity"
                  :key="k"
                  :label="i"
                  :value="Number(k)" />
              </el-select>
            </el-form-item>

            <el-form-item
              label="民族"
              prop="nation">
              <el-select
                placeholder="请选择"
                filterable
                v-model="formData.nation">
                <el-option
                  v-for="item in options.nation"
                  :key="item"
                  :label="item"
                  :value="item" />
              </el-select>
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="健康状况"
              prop="health_status">
              <el-select
                placeholder="请选择"
                v-model="formData.health_status">
                <el-option
                  v-for="(i, k) in options.health_status"
                  :key="k"
                  :label="i"
                  :value="Number(k)" />
              </el-select>
            </el-form-item>

            <el-form-item
              label="国籍"
              prop="nationality">
              <el-select
                placeholder="请选择"
                filterable
                v-model="formData.nationality">
                <el-option
                  v-for="item in options.nationality"
                  :key="item"
                  :label="item"
                  :value="item" />
              </el-select>
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="籍贯"
              prop="hometown">
              <m-district-select
                placeholder="请选择"
                change-on-select
                filterable
                clearable
                :district.sync="formData.hometown"
                :width="260" />
            </el-form-item>

            <el-form-item
              label="出生地"
              prop="homeplace">
              <m-district-select
                placeholder="请选择"
                change-on-select
                filterable
                clearable
                :district.sync="formData.homeplace"
                :width="260" />
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="户口性质"
              prop="hukou_nature">
              <el-select
                placeholder="请选择"
                v-model="formData.hukou_nature">
                <el-option
                  v-for="(i, k) in options.hukou_nature"
                  :key="k"
                  :label="i"
                  :value="Number(k)" />
              </el-select>
            </el-form-item>

            <el-form-item
              label="户口所在地"
              prop="hukou_district">
              <m-district-select
                placeholder="请选择"
                change-on-select
                filterable
                clearable
                :district.sync="formData.hukou_district"
                :width="260" />
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="星座"
              prop="constellation">
              <el-select
                placeholder="请选择"
                v-model="formData.constellation">
                <el-option
                  v-for="item in options.constellation"
                  :key="item"
                  :label="item"
                  :value="item" />
              </el-select>
            </el-form-item>

            <el-form-item
              label="血型"
              prop="blood_type">
              <el-select
                placeholder="请选择"
                v-model="formData.blood_type">
                <el-option
                  v-for="item in options.blood_type"
                  :key="item"
                  :label="item"
                  :value="item" />
              </el-select>
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="招聘渠道"
              prop="recruit_channel">
              <el-select
                placeholder="请选择"
                v-model="formData.recruit_channel">
                <el-option
                  v-for="(i, k) in options.recruit_channel"
                  :key="k"
                  :label="i"
                  :value="Number(k)" />
              </el-select>
            </el-form-item>

            <el-form-item
              label="招聘渠道具体说明"
              prop="recruit_channel_remark">
              <el-input
                v-model="formData.recruit_channel_remark"
                :placeholder="
                  formData.recruit_channel
                    ? dictionary.recruit_channel_remark[formData.recruit_channel]
                    : '请选择招聘渠道'
                " />
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="薪资类别"
              prop="salary_type">
              <el-select
                placeholder="请选择"
                v-model="formData.salary_type">
                <el-option
                  v-for="(i, k) in options.salary_type"
                  :key="k"
                  :label="i"
                  :value="Number(k)" />
              </el-select>
            </el-form-item>

            <el-form-item
              label="政治面貌"
              prop="political_status">
              <el-select
                placeholder="请选择"
                v-model="formData.political_status">
                <el-option
                  v-for="(i, k) in options.political_status"
                  :key="k"
                  :label="i"
                  :value="Number(k)" />
              </el-select>
            </el-form-item>
          </m-section-row>

          <m-section-row
            v-if="
              formData.political_status
                && formData.political_status !== 4
            ">
            <el-form-item
              label="入党（团）日期"
              prop="entry_party_date"
              :rules="formDataRules.entry_party_date">
              <el-date-picker
                type="date"
                placeholder="请选择"
                v-model="formData.entry_party_date" />
            </el-form-item>
          </m-section-row>
        </div>
      </m-section>

      <m-section
        is-form
        title="证件信息">
        <div class="m-section--form">
          <m-section-row>
            <el-form-item
              label="证件类型"
              prop="credential_type">
              <el-select
                placeholder="请选择"
                v-model="formData.credential_type">
                <el-option
                  v-for="(i, k) in options.credential_type"
                  :key="k"
                  :label="i"
                  :value="Number(k)" />
              </el-select>
            </el-form-item>

            <el-form-item
              label="证件号码"
              prop="credential_num">
              <el-input v-model="formData.credential_num" />
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="社保电脑号"
              prop="sb_num">
              <el-input v-model="formData.sb_num" />
            </el-form-item>

            <el-form-item
              label="公积金账号"
              prop="gjj_num">
              <el-input v-model="formData.gjj_num" />
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="护照号"
              prop="passport_num">
              <el-input
                placeholder="例：G89065413"
                v-model="formData.passport_num" />
            </el-form-item>
            <el-form-item

              label="护照有效期">
              <el-date-picker
                type="date"
                placeholder="请选择"
                v-model="formData.passport_valided_date" />
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="证件保管人">
              <el-radio-group
                v-model="formData.credential_keeper">
                <el-radio
                  v-for="(i, k) in options.credential_keeper"
                  :key="k"
                  :label="Number(k)">
                  {{ i }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </m-section-row>
        </div>
      </m-section>

      <m-section
        is-form
        title="通讯信息">
        <div class="m-section--form">
          <m-section-row>
            <el-form-item
              label="手机号码"
              prop="mobile">
              <el-input v-model="formData.mobile" />
            </el-form-item>

            <el-form-item
              label="短号"
              prop="mobile_short">
              <el-input
                v-model="formData.mobile_short" />
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="个人邮箱"
              prop="email">
              <el-input v-model="formData.email" />
            </el-form-item>

            <el-form-item
              label="内网邮箱"
              prop="email_inside">
              <el-input v-model="formData.email_inside" />
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="外网邮箱"
              prop="email_outside">
              <el-input v-model="formData.email_outside" />
            </el-form-item>

            <el-form-item
              label="微信"
              prop="weixin_num">
              <el-input v-model="formData.weixin_num" />
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="办公电话"
              prop="office_phone">
              <el-input v-model="formData.office_phone" />
            </el-form-item>

            <el-form-item
              label="家庭地址"
              prop="family_address">
              <el-input v-model="formData.family_address" />
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="家庭电话"
              prop="family_phone">
              <el-input v-model="formData.family_phone" />
            </el-form-item>

            <el-form-item
              label="紧急联系人"
              prop="urgent_person_name">
              <el-input v-model="formData.urgent_person_name" />
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="紧急联系人电话"
              prop="urgent_person_phone">
              <el-input v-model="formData.urgent_person_phone" />
            </el-form-item>
          </m-section-row>
        </div>
      </m-section>

      <m-section
        is-form
        title="银行信息">
        <div class="m-section--form">
          <m-section-row>
            <el-form-item
              label="工行卡号"
              prop="gh_bank_num">
              <el-input v-model="formData.gh_bank_num" />
            </el-form-item>

            <el-form-item
              label="建行卡号"
              prop="jh_bank_num">
              <el-input v-model="formData.jh_bank_num" />
            </el-form-item>
          </m-section-row>
        </div>
      </m-section>
    </el-form>
  </div>
</template>

<script>
  export default {
    props: {
      detData: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      const nameValid = (rule, value, callback) => {
        const test = /[//]/im
        if (test.test(value)) {
          return callback('姓名中不能包含非法字符')
        }
        return callback()
      }

      return {
        options: {},
        default: {
          avatar_id: '',

          code: '由系统生成',
          emp_code: '',
          name: '',
          name_pinyin: '',
          name_used: '',
          broker_code: '',
          sex: '',
          birthday: '',
          identity: '',
          nation: '汉族',
          health_status: '',
          nationality: '中华人民共和国',
          hometown: '',
          homeplace: '',
          hukou_nature: '',
          hukou_district: '',
          constellation: '',
          blood_type: '',
          recruit_channel: '',
          recruit_channel_remark: '',
          salary_type: '',
          political_status: '',
          entry_party_date: '',

          credential_type: '',
          credential_num: '',
          sb_num: '',
          gjj_num: '',
          passport_num: '',
          passport_valided_date: '',
          credential_keeper: '',

          mobile: '',
          mobile_short: '',
          email: '',
          email_inside: '',
          email_outside: '',
          weixin_num: '',
          office_phone: '',
          family_address: '',
          family_phone: '',
          urgent_person_name: '',
          urgent_person_phone: '',

          gh_bank_num: '',
          jh_bank_num: '',
        },
        formData: {},
        formDataRules: {
          emp_code: [
            { required: true, message: '请输入员工ID', trigger: ['blur', 'change'] },
            { max: 10, message: '最长10个字符', trigger: ['blur', 'change'] },
          ],
          name: [
            { required: true, message: '请输入员工姓名', trigger: ['blur', 'change'] },
            { validator: nameValid, trigger: ['blur', 'change'] },
            { max: 20, message: '最长20个字符', trigger: ['blur', 'change'] },
          ],
          name_pinyin: [
            { required: true, message: '请输入员工姓名拼音', trigger: ['blur', 'change'] },
            { max: 20, message: '最长20个字符', trigger: ['blur', 'change'] },
          ],
          name_used: [{ max: 20, message: '最长20个字符', trigger: ['blur', 'change'] }],
          broker_code: [{ max: 20, message: '最长20个字符', trigger: ['blur', 'change'] }],
          sex: [{
            required: true, type: 'number', message: '请选择性别', trigger: ['blur', 'change'],
          }],
          birthday: [{
            required: true, type: 'date', message: '请选择出生日期', trigger: ['blur', 'change'],
          }],
          identity: [{
            required: true, type: 'number', message: '请选择个人身份', trigger: ['blur', 'change'],
          }],
          nation: [{
            required: true, message: '请选择民族', trigger: ['blur', 'change'],
          }],
          health_status: [{
            required: true, type: 'number', message: '请选择健康状况', trigger: ['blur', 'change'],
          }],
          nationality: [{
            required: true, message: '请选择国籍', trigger: ['blur', 'change'],
          }],
          hometown: [{
            required: true, type: 'number', message: '请选择籍贯', trigger: ['blur', 'change'],
          }],
          homeplace: [{
            required: true, type: 'number', message: '请选择出生地', trigger: ['blur', 'change'],
          }],
          hukou_nature: [{
            required: true, type: 'number', message: '请选择户口性质', trigger: ['blur', 'change'],
          }],
          hukou_district: [{
            required: true, type: 'number', message: '请选择户口所在地', trigger: ['blur', 'change'],
          }],
          constellation: [{
            required: true, message: '请选择星座', trigger: ['blur', 'change'],
          }],
          blood_type: [{
            required: true, message: '请选择血型', trigger: ['blur', 'change'],
          }],
          recruit_channel: [{
            required: true, type: 'number', message: '请选择招聘渠道', trigger: ['blur', 'change'],
          }],
          recruit_channel_remark: [
            { required: true, message: '请输入招聘渠道具体说明', trigger: ['blur', 'change'] },
            { max: 20, message: '最长20个字符', trigger: ['blur', 'change'] },
          ],
          salary_type: [{
            required: true, type: 'number', message: '请选择薪资类别', trigger: ['blur', 'change'],
          }],
          political_status: [{
            required: true, type: 'number', message: '请选择政治面貌', trigger: ['blur', 'change'],
          }],
          entry_party_date: [{
            required: true, type: 'date', message: '请选择入党（团）日期', trigger: ['blur', 'change'],
          }],
          credential_type: [{
            required: true, type: 'number', message: '请选择证件类型', trigger: ['blur', 'change'],
          }],
          credential_num: [
            { required: true, message: '请输入证件号码', trigger: ['blur', 'change'] },
            { max: 30, message: '最长30个字符', trigger: ['blur', 'change'] },
          ],
          sb_num: [{ max: 20, message: '最长20个字符', trigger: ['blur', 'change'] }],
          gjj_num: [{ max: 20, message: '最长20个字符', trigger: ['blur', 'change'] }],
          passport_num: [{ max: 30, message: '最长30个字符', trigger: ['blur', 'change'] }],
          mobile: [
            { required: true, message: '请输入手机号码', trigger: ['blur', 'change'] },
            { max: 20, message: '最长20个字符', trigger: ['blur', 'change'] },
          ],
          mobile_short: [{ max: 10, message: '最长10个字符', trigger: ['blur', 'change'] }],
          email: [{ max: 100, message: '最长100个字符', trigger: ['blur', 'change'] }],
          email_inside: [{ max: 100, message: '最长100个字符', trigger: ['blur', 'change'] }],
          email_outside: [{ max: 100, message: '最长100个字符', trigger: ['blur', 'change'] }],
          weixin_num: [{ max: 20, message: '最长20个字符', trigger: ['blur', 'change'] }],
          office_phone: [{ max: 20, message: '最长20个字符', trigger: ['blur', 'change'] }],
          family_address: [
            { required: true, message: '请输入家庭住址', trigger: ['blur', 'change'] },
            { max: 50, message: '最长50个字符', trigger: ['blur', 'change'] },
          ],
          family_phone: [
            { required: true, message: '请输入家庭电话', trigger: ['blur', 'change'] },
            { max: 20, message: '最长20个字符', trigger: ['blur', 'change'] },
          ],
          urgent_person_name: [
            { required: true, message: '请输入紧急联系人', trigger: ['blur', 'change'] },
            { max: 20, message: '最长20个字符', trigger: ['blur', 'change'] },
          ],
          urgent_person_phone: [
            { required: true, message: '请输入紧急联系人电话', trigger: ['blur', 'change'] },
            { max: 20, message: '最长20个字符', trigger: ['blur', 'change'] },
          ],
          gh_bank_num: [{ max: 30, message: '最长30个字符', trigger: ['blur', 'change'] }],
          jh_bank_num: [{ max: 30, message: '最长30个字符', trigger: ['blur', 'change'] }],
        },
        upLoadavatar_url: '',
        avatar_url: '',
        ageOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e7
          },
        },
      }
    },
    computed: {
      dictionary() {
        return this.$utils.config.dictionary.employee
      },
      requestHeader() {
        return this.$utils.config.headers
      },
      age() {
        const birthday = new Date(this.formData.birthday)
        const birsYear = birthday.getFullYear()
        if (Number.isNaN(birsYear)) {
          return 0
        }
        const thisYear = new Date().getFullYear()
        birthday.setFullYear(thisYear)
        let fix = thisYear - birsYear
        if (birthday.getTime() > Date.now()) fix -= 1
        return fix < 0 ? 0 : fix
      },
    },
    watch: {
      detData() {
        this.getFormData()
      },
    },
    created() {
      this.getOptions()
      this.getFormData()
    },
    methods: {
      getOptions() {
        // store 取值
        this.options = this.$store.getters['EMPLOYEE_OPTIONS/get'] || {}
        if (JSON.stringify(this.options) !== '{}') return
        // store 注册
        const config = this.dictionary.employee
        this.$store.registerModule('EMPLOYEE_OPTIONS', config)
        // store 拉取
        this.$store.dispatch('EMPLOYEE_OPTIONS/get')
          .then((options) => {
            this.options = options
          })
      },
      getFormData() {
        // 表单已经存在就重置表单
        if (this.$refs.formData) this.$refs.formData.resetFields()
        // 初始化字段
        if (!this.detData.base_info) this.detData.base_info = {}
        const baseInfo = { ...this.detData.base_info }
        if (baseInfo.birthday) {
          baseInfo.birthday = new Date(baseInfo.birthday)
        }
        if (baseInfo.entry_party_date) {
          baseInfo.entry_party_date = new Date(baseInfo.entry_party_date)
        }
        if (baseInfo.passport_valided_date) {
          baseInfo.passport_valided_date = new Date(baseInfo.passport_valided_date)
        }
        if (baseInfo.hometown) {
          baseInfo.hometown = Number(baseInfo.hometown)
        }
        if (baseInfo.homeplace) {
          baseInfo.homeplace = Number(baseInfo.homeplace)
        }
        if (baseInfo.hukou_district) {
          baseInfo.hukou_district = Number(baseInfo.hukou_district)
        }
        // 获取值
        Object.keys(this.default).forEach((key) => {
          this.$set(this.formData, key, baseInfo[key] || this.default[key])
        })
        this.avatar_url = this.detData.avatar_url
      },

      upLoadavatar(data) {
        this.upLoadavatar_url = data.url
        this.formData.avatar_id = data.id
      },

      getDate(date) {
        // YYYY-MM-DD
        return !date ? '' : this.$utils.tools.formatDate(new Date(date), 'YYYY-MM-DD')
      },
      getValidate(cb) {
        return this.$refs.formData.validate(cb)
      },
      getData() {
        const data = Object.assign({}, this.formData)
        data.birthday = this.getDate(data.birthday)
        if (data.political_status && data.political_status !== 4) {
          data.entry_party_date = this.getDate(data.entry_party_date)
        } else {
          data.entry_party_date = ''
        }
        if (data.passport_valided_date) {
          data.passport_valided_date = this.getDate(data.passport_valided_date)
        }
        delete data.code
        return data
      },
    },
  }
</script>

<style lang="scss">
  .create-base-info {
    .avatar-wrap {
      margin-bottom: 30px;
    }

    .avatar-pic-wrap {
      margin: 18px 20px 22px 20px;
      width: 100px;
    }

    .avatar-default,
    .avatar-user {
      display: block;
      height: 100px;
      width: 100px;
      border-radius: 50%;
      margin-bottom: 15px;
    }
  }
</style>
