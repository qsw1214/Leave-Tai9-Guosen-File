<template>
  <div class="create-panel create-resume-info">
    <div class="panel-title">
      <div>履历信息</div>
    </div>

    <el-form
      label-position="left"
      label-width="140px"
      ref="formData"
      :model="formData"
      :rules="formDataRules">
      <m-section
        title="基本履历信息"
        is-form>
        <div class="m-section--form">
          <m-section-row>
            <el-form-item
              label="参加工作日期"
              prop="begin_work_date">
              <el-date-picker
                type="date"
                placeholder="请选择"
                v-model="formData.begin_work_date" />
            </el-form-item>

            <el-form-item
              label="工龄">
              <el-input
                disabled
                :value="work_age">
                <template slot="append">年</template>
              </el-input>
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="证券从业起始日期"
              prop="begin_broker_date">
              <el-date-picker
                type="date"
                placeholder="请选择"
                v-model="formData.begin_broker_date" />
            </el-form-item>

            <el-form-item
              label="证券从业年限"
              required
              prop="broker_work_year">
              <el-input
                placeholder="不满N年，按N-1年"
                v-model="formData.broker_work_year">
                <template slot="append">年</template>
              </el-input>
            </el-form-item>
          </m-section-row>
        </div>
      </m-section>

      <m-section
        is-form
        v-for="(item, index) in formData.list"
        :key="item.id || item.itemKey"
        :title="index ? '' : '工作经历'">
        <div class="m-section--form">
          <el-button
            class="error delete"
            type="text"
            icon="el-icon-delete"
            @click="listDelete(index)">删除</el-button>

          <m-section-row>
            <m-section-cell
              title="序号"
              :content="index + 1" />
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="履历开始日期"
              :prop="`list.${index}.begin_date`"
              :rules="listItemValidDateRules('begin_date', index)">
              <el-date-picker
                type="date"
                placeholder="请选择"
                v-model="item.begin_date"
                @change="listItemValidDateValidated('begin_date', index)" />
            </el-form-item>

            <el-form-item
              label="履历终止日期"
              :prop="`list.${index}.end_date`"
              :rules="listItemValidDateRules('end_date', index)">
              <el-date-picker
                type="date"
                placeholder="请选择"
                v-model="item.end_date"
                @change="listItemValidDateValidated('end_date', index)" />
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="工作单位"
              :prop="`list.${index}.work_unit`"
              :rules="formDataRules.work_unit">
              <el-input v-model="item.work_unit" />
            </el-form-item>

            <el-form-item
              label="所在部门"
              :prop="`list.${index}.org_name`"
              :rules="formDataRules.org_name">
              <el-input v-model="item.org_name" />
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="所任职位"
              :prop="`list.${index}.job_name`"
              :rules="formDataRules.job_name">
              <el-input v-model="item.job_name" />
            </el-form-item>

            <el-form-item
              label="证明人"
              :prop="`list.${index}.reference`"
              :rules="formDataRules.reference">
              <el-input v-model="item.reference" />
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="证明人电话"
              :prop="`list.${index}.reference_phone`"
              :rules="formDataRules.reference_phone">
              <el-input v-model="item.reference_phone" />
            </el-form-item>
          </m-section-row>

          <el-form-item
            label="离职原因"
            :prop="`list.${index}.quit_reason`"
            :rules="formDataRules.quit_reason">
            <el-input
              type="textarea"
              autosize
              v-model="item.quit_reason" />
          </el-form-item>
        </div>
      </m-section>

      <el-button
        class="list-plus"
        type="text"
        icon="el-icon-plus"
        @click="listPlus">添加更多工作经历</el-button>
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
      // 工作经历不能交叉，需要进行输入验证
      const beginDateValidate = (rule, value, callback) => {
        const before = this.formData.list[rule.index - 1] || {}
        const after = this.formData.list[rule.index] || {}
        const valueDate = new Date(this.getDate(value)).getTime()
        if (before.end_date && valueDate <= new Date(this.getDate(before.end_date)).getTime()) {
          this.begin_dateErr.add(rule.index)
          return callback(new Error('开始日期不能小于或等于上一条终止日期'))
        } else if (
          after.end_date
          && valueDate >= new Date(this.getDate(after.end_date)).getTime()
        ) {
          this.begin_dateErr.add(rule.index)
          return callback(new Error('开始日期不能大于或等于终止日期'))
        }
        this.begin_dateErr.delete(rule.index)
        return callback()
      }

      const endDateValidate = (rule, value, callback) => {
        const before = this.formData.list[rule.index] || {}
        const after = this.formData.list[rule.index + 1] || {}
        const valueDate = new Date(this.getDate(value)).getTime()
        if (before.begin_date && valueDate <= new Date(this.getDate(before.begin_date)).getTime()) {
          this.end_dateErr.add(rule.index)
          return callback(new Error('终止日期不能小于或等于开始日期'))
        } else if (
          after.begin_date &&
          valueDate >= new Date(this.getDate(after.begin_date)).getTime()
        ) {
          this.end_dateErr.add(rule.index)
          return callback(new Error('终止日期不能大于或等于下一条开始日期'))
        }
        this.end_dateErr.delete(rule.index)
        return callback()
      }

      // 数字校验器
      const brokerWorkYear = (rule, value, callback) => {
        if (!value && value !== 0) {
          return callback(new Error('请输入证券从业年限'))
        } else if (!Number.isFinite(value * 1)) {
          return callback(new Error('请仅输入数字'))
        } else if (value < 0 || value % 1 !== 0 || value.toString().includes('.')) {
          return callback(new Error('请输入正整数'))
        } else if (value.toString().length > 10) {
          return callback(new Error('最长10个字符'))
        }
        return callback()
      }

      return {
        begin_dateErr: new Set(),
        end_dateErr: new Set(),
        default: {
          begin_work_date: '',
          begin_broker_date: '',
          broker_work_year: '',
          list: [],
        },
        defaultListItem: {
          begin_date: '',
          end_date: '',
          work_unit: '',
          org_name: '',
          job_name: '',
          reference: '',
          reference_phone: '',
          quit_reason: '',
        },
        formData: {},
        formDataRules: {
          begin_work_date: [{
            required: true, type: 'date', message: '请选择参加工作日期', trigger: ['blur', 'change'],
          }],
          begin_broker_date: [{
            required: true, type: 'date', message: '请选择证券从业起始日期', trigger: ['blur', 'change'],
          }],
          broker_work_year: [{ validator: brokerWorkYear, trigger: ['blur', 'change'] }],
          begin_date: [
            { required: true, type: 'date', message: '请选择履历开始日期', trigger: ['blur', 'change'] },
            { validator: beginDateValidate, trigger: ['blur', 'change'] },
          ],
          end_date: [
            { required: true, type: 'date', message: '请选择履历终止日期', trigger: ['blur', 'change'] },
            { validator: endDateValidate, trigger: ['blur', 'change'] },
          ],
          work_unit: [
            { required: true, message: '请输入工作单位', trigger: ['blur', 'change'] },
            { max: 30, message: '最长30个字符', trigger: ['blur', 'change'] },
          ],
          org_name: [
            { required: true, message: '请输入所在部门', trigger: ['blur', 'change'] },
            { max: 20, message: '最长20个字符', trigger: ['blur', 'change'] },
          ],
          job_name: [
            { required: true, message: '请输入所任职位', trigger: ['blur', 'change'] },
            { max: 20, message: '最长20个字符', trigger: ['blur', 'change'] },
          ],
          reference: [
            { required: true, message: '请输入证明人', trigger: ['blur', 'change'] },
            { max: 20, message: '最长20个字符', trigger: ['blur', 'change'] },
          ],
          reference_phone: [
            { required: true, message: '请输入证明人电话', trigger: ['blur', 'change'] },
            { max: 20, message: '最长20个字符', trigger: ['blur', 'change'] },
          ],
          quit_reason: [
            { required: true, message: '请输入离职原因', trigger: ['blur', 'change'] },
            { max: 30, message: '最长30个字符', trigger: ['blur', 'change'] },
          ],
        },
      }
    },
    computed: {
      dictionary() {
        return this.$utils.config.dictionary.employee
      },
      work_age() {
        const workAge = new Date(this.formData.begin_work_date)
        const birsYear = workAge.getFullYear()
        if (Number.isNaN(birsYear)) {
          return 0
        }
        const thisYear = new Date().getFullYear()
        workAge.setFullYear(thisYear)
        let fix = thisYear - birsYear
        if (workAge.getTime() > Date.now()) fix -= 1
        // return fix < 0 ? 0 : fix
        return fix
      },
    },
    watch: {
      detData() {
        this.getFormData()
      },
    },
    created() {
      this.getFormData()
    },
    methods: {
      getFormData() {
        // 表单已经存在就重置表单
        if (this.$refs.formData) this.$refs.formData.resetFields()
        // 初始化字段
        const resumeInfo = Object.assign({}, this.detData.resume_info || {})
        resumeInfo.list = JSON.parse(JSON.stringify(resumeInfo.list || []))
        if (resumeInfo.begin_work_date) {
          resumeInfo.begin_work_date = new Date(resumeInfo.begin_work_date)
        }
        if (resumeInfo.begin_broker_date) {
          resumeInfo.begin_broker_date = new Date(resumeInfo.begin_broker_date)
        }
        if (resumeInfo.list) {
          resumeInfo.list.forEach((item) => {
            item.begin_date = new Date(item.begin_date)
            item.end_date = new Date(item.end_date)
          })
        }
        // 获取值
        Object.keys(this.default).forEach((key) => {
          if (key === 'list') {
            this.$set(this.formData, key, resumeInfo[key] || [])
          } else {
            this.$set(this.formData, key, resumeInfo[key] || this.default[key])
          }
        })
      },
      listPlus() {
        const item = Object.assign({}, this.defaultListItem, {
          itemKey: Date.now(),
        })
        this.formData.list.push(item)
      },
      async listDelete(index) {
        try {
          await this.$confirm('确认删除所选数据？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
        } catch (err) {
          console.log(err)
          return
        }

        this.formData.list.splice(index, 1)
      },
      listItemValidDateRules(type, index) {
        const push = { index }
        const newRules = []
        newRules.push(Object.assign({}, this.formDataRules[type][0]))
        newRules.push(Object.assign({}, this.formDataRules[type][1], push))
        return newRules
      },
      listItemValidDateValidated(type, index) {
        this.begin_dateErr.forEach((item) => {
          if (type === 'begin_date' && item === index) return
          this.$refs.formData.validateField(`list.${item}.begin_date`)
        })
        this.end_dateErr.forEach((item) => {
          if (type === 'end_date' && item === index) return
          this.$refs.formData.validateField(`list.${item}.end_date`)
        })
      },

      getDate(date) {
        return !date ? '' : this.$utils.tools.formatDate(new Date(date), 'YYYY-MM-DD')
      },
      getValidate(cb) {
        return this.$refs.formData.validate(cb)
      },
      getData() {
        const data = Object.assign({}, this.formData)
        data.resume_info_list = JSON.parse(JSON.stringify(data.list))
        delete data.list
        data.resume_info_list.forEach((item) => {
          item.begin_date = this.getDate(item.begin_date)
          item.end_date = this.getDate(item.end_date)
          delete item.itemKey
          const listKeys = Object.keys(this.defaultListItem)
          // 不删除id字段
          listKeys.push('id')
          Object.keys(item).forEach((key) => {
            if (!listKeys.includes(key)) delete item[key]
          })
        })
        data.resume_info_list = JSON.stringify(data.resume_info_list)
        data.begin_work_date = this.getDate(data.begin_work_date)
        data.begin_broker_date = this.getDate(data.begin_broker_date)
        return data
      },
    },
  }
</script>
