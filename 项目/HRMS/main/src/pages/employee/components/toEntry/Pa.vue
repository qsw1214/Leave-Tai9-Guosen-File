<template>
  <section
    v-loading.fullscreen.lock="loading"
    class="page page--pa-noEntry">
    <m-breadcrumb :items="breadcrumb" />
    <m-section
      title="流程信息">

      <m-section-row>
        <m-section-cell
          title="流程编码"
          :content="info.code || '提交后由系统生成'" />
        <m-section-cell
          title="申请日期"
          :content="info.apply_date || '提交后由系统生成'" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="流程状态"
          :content="info.status_name || '草稿'" />
      </m-section-row>
    </m-section>

    <m-section
      title="申请表单"
      is-form>

      <el-form
        class="m-section--form"
        label-width="140px"
        ref="form"
        :rules="rules"
        :model="form">

        <m-section-row>
          <el-form-item
            label="姓名"
            prop="rsdrzgl_name">
            <el-input
              placeholder="请输入姓名"
              v-model="form.rsdrzgl_name" />
          </el-form-item>

          <el-form-item
            label="拟入职部门"
            prop="rsdrzgl_org">
            <m-cascader
              placeholder="请选择拟入职部门"
              glass
              :width="260"
              :organization.sync="form.rsdrzgl_org" />
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="拟任职职位"
            prop="rsdrzgl_job">
            <m-position-select
              :width="260"
              :positions.sync="form.rsdrzgl_job" />
          </el-form-item>

          <el-form-item
            label="拟入职日期"
            prop="rsdrzgl_nrz_date">
            <el-date-picker
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              v-model="form.rsdrzgl_nrz_date" />
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="是否通过从业考试"
            prop="rsdrzgl_is_pass_exam">
            <el-select
              placeholder="请选择"
              v-model="form.rsdrzgl_is_pass_exam">
              <el-option
                v-for="item in options.exam"
                :value="item.value"
                :key="item.value"
                :label="item.label" />
            </el-select>
          </el-form-item>

          <el-form-item
            label="证件类型"
            prop="rsdrzgl_credential_type">
            <el-select
              placeholder="请选择"
              v-model="form.rsdrzgl_credential_type">
              <el-option
                v-for="(item, index) in options.cert"
                :value="index"
                :key="index"
                :label="item" />
            </el-select>
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="证件号码"
            prop="rsdrzgl_credential_num">
            <el-input
              placeholder="请输入证件号码"
              v-model="form.rsdrzgl_credential_num" />
          </el-form-item>

          <el-form-item
            label="操作类型">
            <span>入职</span>
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="操作原因"
            prop="rsdrzgl_reason">
            <el-select
              placeholder="请选择"
              v-model="form.rsdrzgl_reason">
              <el-option
                v-for="(item, index) in options.reason"
                :value="index"
                :key="index"
                :label="item" />
            </el-select>
          </el-form-item>

          <el-form-item
            label="员工状态"
            prop="rsdrzgl_user_status">
            <el-select
              placeholder="请选择"
              v-model="form.rsdrzgl_user_status">
              <el-option
                v-for="(item, index) in options.status"
                :value="index"
                :key="index"
                :label="item" />
            </el-select>
          </el-form-item>
        </m-section-row>
      </el-form>
    </m-section>

    <logs-and-path
      v-if="info.status === 94"
      :data="logsAndPath" />

    <div class="page--pa-actions">
      <el-button
        type="primary"
        :loading="button.submit"
        @click="preSubmit">提交</el-button>

      <el-button
        type="info"
        :loading="button.stash"
        @click="submit('stash')">暂存</el-button>

      <el-button
        type="info"
        @click="cancel">取消</el-button>
    </div>
  </section>
</template>

<script>
  import mixins from '~employee/mixins'
  import LogsAndPath from '@/components/logsAndPath'

  export default {
    name: 'ToEntryPa',

    components: {
      LogsAndPath,
    },

    mixins: [mixins.pa, mixins.flow, mixins.routerHook],

    data() {
      const { id } = this.$route.params

      return {
        breadcrumb: [
          { name: '员工管理' },
          { name: '待入职管理', to: '/to-entry' },
          { name: '流程发起' },
        ],
        redirectPath: '/to-entry/application',
        form: {
          rsdrzgl_name: '', // M姓名
          rsdrzgl_org: '', // M拟入职部门ID
          rsdrzgl_job: '', // M拟任职职位ID
          rsdrzgl_nrz_date: '', // M拟入职日期(YYYY-MM-DD)
          rsdrzgl_is_pass_exam: '', // M是否通过从业考试（1-是,0-否）
          rsdrzgl_credential_type: '', // M证件类型
          rsdrzgl_credential_num: '', // M证件号码
          rsdrzgl_reason: '1', // M操作原因
          rsdrzgl_user_status: '1', // M员工状态
        },
        rules: {
          rsdrzgl_name: [
            { required: true, message: '请填写姓名', trigger: 'blur' },
          ],
          rsdrzgl_nrz_date: [
            { required: true, message: '请选择拟入职日期', trigger: 'blur' },
          ],
          rsdrzgl_reason: [
            { required: true, message: '请选择操作原因', trigger: 'blur' },
          ],
          rsdrzgl_job: [
            { required: true, message: '请选择拟任职职位', trigger: 'blur' },
          ],
          rsdrzgl_credential_type: [
            { required: true, message: '请选择证件类型', trigger: 'blur' },
          ],
          rsdrzgl_credential_num: [
            { required: true, message: '请输入证件号码', trigger: 'blur' },
          ],
          rsdrzgl_org: [
            { required: true, message: '请选择拟入职部门', trigger: 'blur' },
          ],
          rsdrzgl_is_pass_exam: [
            { required: true, message: '请选择是否通过从业考试', trigger: 'blur' },
          ],
          rsdrzgl_user_status: [
            { required: true, message: '请选择员工状态', trigger: 'blur' },
          ],
        },
        id,
        submitMessage: '提交完成，请留意流程审批状态。',
        options: {
          exam: [
            { label: '是', value: '1' },
            { label: '否', value: '0' },
          ],
          reason: {},
          status: {},
          cert: {},
        },
      }
    },
    watch: {
      /* eslint func-names:0 */
      'form.rsdrzgl_reason': function (val) {
        const { rsdrzgl_credential_type, rsdrzgl_credential_num } = this.form
        if (val === '4' && rsdrzgl_credential_type && rsdrzgl_credential_num) {
          this.fetchUserBeforeStatus(rsdrzgl_credential_type, rsdrzgl_credential_num)
        }
      },
    },

    created() {
      this
        .getInit()
        .then((res) => {
          this.initOptions(res)

          if (this.id) {
            this
              .getInfo()
              .then((info) => {
                this.form = info.data.flow_form_data

                if (Number(this.info.status) === 94) {
                  this.getLogsAndPath()
                }
              })
          }
        })
    },

    methods: {
      initOptions(res) {
        const { rsdrzgl_credential_type,
                rsdrzgl_reason,
                rsdrzgl_user_status } = res.data
        this.options.cert = rsdrzgl_credential_type
        this.options.reason = rsdrzgl_reason
        this.options.status = rsdrzgl_user_status
      },

      preSubmit() {
        if (this.form.rsdrzgl_is_pass_exam === '0') {
          const message = '该员工未通过从业考试，是否确定提交？'
          this.submit('submit', message)
        } else {
          this.submit('submit')
        }
      },

      fetchUserBeforeStatus(type, num) {
        this.$axios
          .post(this.$api.employee.toEntry.getUserBeforeStatus, {
            credential_type: type,
            credential_num: num,
          })
          .then(({ data }) => {
            const { info } = data
            if (info.last_status) {
              this.form.rsdrzgl_user_status = String(info.last_status)
            }
          })
      },
    },
  }
</script>

<style lang="scss">
  .m-employee-select {
    .el-form-item {
      height: 0;
      margin: 0;
    }
  }
</style>
