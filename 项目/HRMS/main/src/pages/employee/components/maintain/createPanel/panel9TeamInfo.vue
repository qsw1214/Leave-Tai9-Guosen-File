<template>
  <div class="create-panel create-team-info">
    <div class="panel-title">
      <div>团队信息</div>
    </div>

    <m-section
      title="团队信息"
      is-form>
      <el-form
        class="m-section--form"
        label-position="left"
        label-width="140px"
        ref="formData"
        :model="formData"
        :rules="formDataRules">
        <m-section-row>
          <m-section-cell
            title="员工ID"
            :content="formData.emp_code" />

          <m-section-cell
            title="经纪号"
            :content="formData.broker_code" />
        </m-section-row>

        <m-section-row>
          <m-section-cell
            title="员工姓名"
            :content="formData.name" />

          <m-section-cell
            title="所属部门"
            :content="formData.org_name" />
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="角色标签"
            prop="role_tag"
            :rules="formDataRules.max20">
            <el-input v-model="formData.role_tag" />
          </el-form-item>

          <el-form-item
            label="团队名称"
            prop="team_id">
            <m-team-select
              class="team-select"
              init-change
              :width="260"
              :valid-date="new Date()"
              :team.sync="formData.team_id" />
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="团队系数"
            prop="team_ratio">
            <el-select
              placeholder="请选择"
              v-model="formData.team_ratio">
              <el-option
                v-for="(i, k) in options.team_ratio"
                :key="k"
                :label="i"
                :value="Number(k)" />
            </el-select>
          </el-form-item>

          <el-form-item
            label="业务方向"
            prop="business_direction">
            <el-select
              placeholder="请选择"
              v-model="formData.business_direction">
              <el-option
                v-for="(i, k) in options.team_business_direction"
                :key="k"
                :label="i"
                :value="Number(k)" />
            </el-select>
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="属性"
            prop="team_attribute">
            <el-select
              placeholder="请选择"
              v-model="formData.team_attribute">
              <el-option
                v-for="(i, k) in options.team_attribute"
                :key="k"
                :label="i"
                :value="Number(k)" />
            </el-select>
          </el-form-item>

          <el-form-item
            label="职能"
            prop="function">
            <el-select
              placeholder="请选择"
              v-model="formData.function">
              <el-option
                v-for="(i, k) in options.team_function"
                :key="k"
                :label="i"
                :value="Number(k)" />
            </el-select>
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="有效人力系数"
            prop="people_ratio">
            <el-select
              placeholder="请选择"
              v-model="formData.people_ratio"
              @change="peopleRatioChange">
              <el-option
                v-for="(i, k) in options.team_people_ratio"
                :key="k"
                :label="i"
                :value="Number(k)" />
            </el-select>
          </el-form-item>

          <el-form-item
            label="非有效人力备注"
            prop="people_remark"
            :required="formData.people_ratio == 2">
            <el-select
              placeholder="请选择"
              v-model="formData.people_remark"
              :disabled="formData.people_ratio != 2">
              <el-option
                v-for="(i, k) in options.team_people_remark"
                :key="k"
                :label="i"
                :value="Number(k)" />
            </el-select>
          </el-form-item>
        </m-section-row>
      </el-form>
    </m-section>
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
      const peopleRemarkValidate = (rule, value, callback) => {
        if (this.formData.people_ratio === 2 && !value) {
          callback(new Error('请选择非有效人力备注'))
        }
        callback()
      }

      return {
        options: {},
        default: {
          emp_code: '',
          broker_code: '',
          name: '',
          org_name: '',
          role_tag: '',
          team_id: '',
          team_ratio: '',
          business_direction: '',
          team_attribute: '',
          function: '',
          people_ratio: '',
          people_remark: '',
        },
        formData: {},
        formDataRules: {
          people_remark: [{ validator: peopleRemarkValidate, trigger: ['blur', 'change'] }],
          max20: [{ max: 20, message: '最长20个字符', trigger: ['blur', 'change'] }],
        },
      }
    },
    computed: {
      dictionary() {
        return this.$utils.config.dictionary.employee
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
        this.options = this.$store.getters['EMPLOYEE_OPTIONS/get'] || this.options
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
        const teamInfo = Object.assign({}, this.detData.team_info || {})
        if (teamInfo.team_ratio) {
          teamInfo.team_ratio = Number(teamInfo.team_ratio)
        }
        if (teamInfo.business_direction) {
          teamInfo.business_direction = Number(teamInfo.business_direction)
        }
        if (teamInfo.team_attribute) {
          teamInfo.team_attribute = Number(teamInfo.team_attribute)
        }
        if (teamInfo.function) {
          teamInfo.function = Number(teamInfo.function)
        }
        if (teamInfo.people_ratio) {
          teamInfo.people_ratio = Number(teamInfo.people_ratio)
        }
        if (teamInfo.people_remark) {
          teamInfo.people_remark = Number(teamInfo.people_remark)
        }
        // 获取值
        Object.keys(this.default).forEach((key) => {
          this.$set(this.formData, key, teamInfo[key] || this.default[key])
        })
      },
      peopleRatioChange(value) {
        if (value !== 2) this.formData.people_remark = ''
      },
      getEmployeeCharge(emp) {
        if (emp.length) {
          this.team_leader_name = emp[emp.length - 1].name
          this.team_leader_broker_code = emp[emp.length - 1].broker_code
        } else {
          this.team_leader_name = ''
          this.team_leader_broker_code = ''
        }
      },

      getValidate(cb) {
        return this.$refs.formData.validate(cb)
      },
      getData() {
        const data = Object.assign({}, this.formData)
        delete data.emp_code
        delete data.broker_code
        delete data.name
        delete data.org_name
        return data
      },
    },
  }
</script>
