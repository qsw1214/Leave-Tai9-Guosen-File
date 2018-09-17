<template>
  <section
    v-loading.lock="loading"
    class="page page--pa-personal__cert">
    <m-breadcrumb :items="breadcrumb" />

    <userinfo :data="userinfo" />

    <m-section
      is-form
      title="申请表单">

      <m-section-row>
        <m-section-cell
          title="流程编码"
          :content="flowcode" />
        <m-section-cell
          title="申请日期"
          :content="date" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="流程状态"
          :content="status" />
      </m-section-row>

      <el-form
        class="m-section--form"
        label-width="140px"
        ref="form"
        :rules="rules"
        :model="form">

        <el-form-item
          prop="rszm_type"
          label="证明类型">
          <el-select
            placeholder="请选择"
            v-model="form.rszm_type">
            <el-option
              v-for="(option, index) in options"
              :label="option.label"
              :value="option.value"
              :key="index" />
          </el-select>
          <span
            class="tips"
            v-if="type !== '4' && type !== ''">
            注意事项：请根据模板如实填写，审批通过后，请到后海办公区人力行政部杜宇处领取。</span>
        </el-form-item>
        <!-- 收入证明 -->
        <template v-if="type === '1'">
          <m-section-row>
            <el-form-item
              prop="rszm_money"
              label="月工资收入"
              :rules="rules.rszm_money">
              <el-input
                type="number"
                placeholder="请输入月工资收入"
                :min="1"
                v-model.number="form.rszm_money">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item
              prop="rszm_userful"
              label="申请用途"
              :rules="rules.rszm_userful">
              <el-input
                placeholder="请输入申请用途"
                resize="none"
                v-model="form.rszm_userful" />
            </el-form-item>
          </m-section-row>
          <el-form-item
            placeholder="请输入使用单位名称"
            label="使用单位名称"
            :prop="form.rszm_work_unit">
            <el-row>
              <el-col :span="24">
                <el-input
                  style="width: 100%;"
                  resize="none"
                  v-model="form.rszm_work_unit" />
              </el-col>
            </el-row>
          </el-form-item>
        </template>
        <!-- 实习证明 -->
        <template v-if="type === '2'">
          <el-form-item
            prop="rszm_userful"
            placeholder="请输入申请用途"
            label="申请用途"
            :rules="rules.rszm_userful">
            <el-input
              resize="none"
              v-model="form.rszm_userful" />
          </el-form-item>
        </template>
        <!-- 实习证明-->
        <template v-if="type === '4'">
          <m-section-row>
            <m-section-cell
              content="<p style='margin-top: 0;'>1.以下模板根据实际需求，两者二选一；</p>
                  <p>2.公司模板：填写字段信息，审批通过后于周五下午至后海办公区人力行政部杜宇处领取；</p>
                  <p>3.自定义模板：请上传自定义模板文档或扫描件。</p>"
              title="注意事项" />
          </m-section-row>
          <m-section-row>
            <el-form-item
              label="模板选择">
              <el-radio-group v-model="form.rszm_internship_template">
                <el-radio
                  label="1"
                  style="font-weight: normal;">公司模板</el-radio>
                <el-radio
                  label="2"
                  style="font-weight: normal;">自定义模板</el-radio>
              </el-radio-group>
            </el-form-item>
          </m-section-row>
          <template v-if="form.rszm_internship_template !== '2'">
            <m-section-row >
              <el-form-item
                prop="rszm_name"
                label="申请人"
                :rules="rules.rszm_name">
                <el-input
                  resize="none"
                  placeholder="请输入申请人"
                  v-model="form.rszm_name" />
              </el-form-item>
              <el-form-item
                prop="rszm_credential_num"
                placeholder="请输入身份证"
                label="身份证"
                :rules="rules.rszm_credential_num">
                <el-input
                  resize="none"
                  v-model="form.rszm_credential_num" />
              </el-form-item>
            </m-section-row>

            <m-section-row>
              <el-form-item
                prop="rszm_school_name"
                label="学校名称"
                :rules="rules.rszm_school_name">
                <el-input
                  resize="none"
                  placeholder="请输入学校名称"
                  v-model="form.rszm_school_name" />
              </el-form-item>
              <el-form-item
                prop="rszm_org_name"
                placeholder="请输入实习部门"
                label="实习部门"
                :rules="rules.rszm_org_name">
                <el-input
                  resize="none"
                  v-model="form.rszm_org_name" />
              </el-form-item>
            </m-section-row>

            <m-section-row>
              <el-form-item
                prop="rszm_begin_date"
                label="实习开始日期"
                :rules="rules.rszm_begin_date">
                <el-date-picker
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择起始日期"
                  v-model="form.rszm_begin_date" />
              </el-form-item>
              <el-form-item
                prop="rszm_end_date"
                placeholder="请输入实习部门"
                label="实习结束日期"
                :rules="rules.rszm_end_date">
                <el-date-picker
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择结束日期"
                  v-model="form.rszm_end_date" />
              </el-form-item>
            </m-section-row>
          </template>

          <el-form-item
            label="模板上传"
            prop="rszm_aids"
            v-if="form.rszm_internship_template === '2'"
            :rules="rules.rszm_aids">
            <m-upload
              multiple
              ref="upload"
              :on-success="uploadHandler"
              :on-remove="uploadHandler"
              :accept="upload.accept"
              :file-list="upload.files"
              :action="upload.action" />
          </el-form-item>

        </template>
      </el-form>
    </m-section>

    <transition
      name="el-zoom-in-top"
      v-if="show">
      <Cert
        is-edit
        :data="userinfo"
        :form="form" />
    </transition>

    <logsAndPath
      v-if="info.status == '94'"
      :data="logsAndPath" />

    <application-button />
  </section>
</template>

<script>
  import mixin from '~services/mixin'
  import logsAndPath from '@/components/logsAndPath'
  import Userinfo from '../common/Userinfo'
  import Cert from '../common/Cert'
  import ApplicationButton from '../common/ApplicationButton'

  export default {
    name: 'PAPersonalCert',
    components: {
      Userinfo,
      Cert,
      logsAndPath,
      ApplicationButton,
    },
    mixins: [mixin.pa, mixin.flow, mixin.router],
    data() {
      const compareDate = (startDate, endDate) => {
        let start = startDate.replace(/-/g, '')
        let end = endDate.replace(/-/g, '')
        start = Number(start) || 0
        end = Number(end) || 0
        return (start - end) > 0
      }

      const inputMoney = (rule, value, callback) => {
        const reg = /^\d+(\.\d{1,2})?$/
        if (!reg.test(value)) {
          this.$nextTick(() => {
            this.form.rszm_money = value.toFixed(2)
          })
        } else {
          callback()
        }
      }

      const beginDate = (rule, value, callback) => {
        if (this.form.rszm_end_date && value) {
          const bool = compareDate(value, this.form.rszm_end_date)
          if (bool) {
            callback(new Error('起始日期不能大于结束日期'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }

      const endDate = (rule, value, callback) => {
        if (this.form.rszm_begin_date && value) {
          const bool = compareDate(this.form.rszm_begin_date, value)
          if (bool) {
            callback(new Error('结束日期不能小于起始日期'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }

      const idCardValidate = (rule, value, callback) => {
        const reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
        if (!reg.test(value)) {
          callback(new Error('身份证信息输入有误，请核对'))
        } else {
          callback()
        }
      }

      return {
        form: {
          rszm_aids: '',
          rszm_type: '',
          rszm_name: '',
          rszm_money: '',
          rszm_userful: '',
          rszm_org_name: '',
          rszm_end_date: '',
          rszm_work_unit: '',
          rszm_begin_date: '',
          rszm_school_name: '',
          rszm_credential_num: '',
          rszm_internship_template: '1',
        },
        breadcrumb: this.$breadcrumb([
          { name: '人事证明' },
        ]),
        options: [
          { label: '收入证明', value: '1' },
          { label: '在职证明', value: '2' },
          { label: '实习证明', value: '4' },
        ],
        rules: {
          rszm_aids: [
            { required: true, message: '请上传附件', trigger: 'blur' },
          ],
          rszm_type: [
            { required: true, message: '请选择证明类型', trigger: 'blur' },
          ],
          rszm_money: [
            { required: true, message: '请输入月工资', trigger: 'blur' },
            {
              message: '预算金额必须大于0',
              pattern: /^([0-9]*[1-9][0-9]*(.[0-9]+)?|[0]+.[0-9]*[1-9][0-9]*)$/,
            },
            { validator: inputMoney, trigger: 'blur' },
          ],
          rszm_userful: [
            { required: true, message: '请输入内容', trigger: 'blur' },
          ],
          rszm_internship_template: [
            { required: true, message: '请输入内容', trigger: 'blur' },
          ],
          rszm_school_name: [
            { required: true, message: '请输入内容', trigger: 'blur' },
          ],
          rszm_name: [
            { required: true, message: '请输入内容', trigger: 'blur' },
          ],
          rszm_org_name: [
            { required: true, message: '请输入内容', trigger: 'blur' },
          ],
          rszm_begin_date: [
            { required: true, message: '请输入内容', trigger: 'blur' },
            { validator: beginDate, trigger: 'blur' },
          ],
          rszm_end_date: [
            { required: true, message: '请输入内容', trigger: 'blur' },
            { validator: endDate, trigger: 'blur' },
          ],
          rszm_credential_num: [
            { required: true, message: '请输入内容', trigger: 'blur' },
            { validator: idCardValidate, trigger: 'blur' },
          ],
        },
        userinfo: {},
        isEdit: false,
        upload: {
          accept: null,
        },
      }
    },
    computed: {
      show() {
        const type = this.form.rszm_type
        if (type) {
          if ((type === '1' || type === '2')
            || (type === '4' && this.form.rszm_internship_template === '1')) {
              return true
            }
        }
        return false
      },
      type() {
        return this.form.rszm_type || ''
      },
      flowcode() {
        return this.isEdit ? this.info.code : '由系统自动生成'
      },
      date() {
        return this.isEdit ? (this.info.apply_date || '由系统自动生成') : '由系统自动生成'
      },
      status() {
        return this.isEdit ? this.info.status_name : '草稿'
      },
    },
    watch: {
      /* eslint func-names: 0 */
      'form.rszm_type': function () {
        this.$refs.form.clearValidate()
      },
    },
    created() {
      this.init()
      const { id } = this.$route.params
      if (id) {
        this.isEdit = true
        this.getInfo(id)
          .then((res) => {
            this.info = res.data
            const form = Object.assign({}, this.info.flow_form_data)
            form.rszm_money = (Number(form.rszm_money) / 100).toFixed(2)
            this.form = form
            if (Number(this.info.status) === 94) {
              this.getLogsAndPath()
            }
          })
      }
    },
    methods: {
      init() {
        this.$axios.post(this.$api.services.pa.init).then((res) => {
          this.userinfo = res.data
        })
      },

      uploadHandler() {
        this.form.rszm_aids = this.$refs.upload.getFiles('string')
      },

      paramsHandler(type) {
        const params = {}

        const url = this.isEdit
          ? this.$api.services.pa.edit
          : this.$api.services.pa.add

        const form = Object.assign({}, this.form)
        form.rszm_money = Number(form.rszm_money).toFixed(2) * 100
        params.flow_form_data = JSON.stringify(form)

        if (this.isEdit) params.id = this.info.id
        else params.flow_config_code = this.$route.params.code

        if (type === 'stash') {
          params.status = 0
          this.button.stash = true
        } else {
          this.button.submit = true
          params.status = 30
        }

        return { url, params }
      },
    },
  }
</script>

<style lang="scss" scoped rel="stylesheet/scss">
  .page--pa-personal__cert {
    .tips {
      display: block;
      top: 0;
      width: 520px;
      font-size: 12px;
      color: #999;
      position: relative;
      line-height: 2;
    }
  }
</style>
