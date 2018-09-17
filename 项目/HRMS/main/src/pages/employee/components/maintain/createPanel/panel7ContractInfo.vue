<template>
  <div class="create-panel create-contract-info">
    <div class="panel-title">
      <div>合同信息</div>
    </div>

    <el-form
      label-position="left"
      label-width="140px"
      ref="formData"
      :model="formData"
      :rules="formDataRules">
      <m-section
        title="合同详细信息"
        is-form>
        <div class="m-section--form">
          <m-section-row>
            <el-form-item
              label="档案编号"
              prop="file_code">
              <el-input v-model="formData.file_code" />
            </el-form-item>
          </m-section-row>
        </div>
      </m-section>

      <m-section
        is-form
        v-for="(item, index) in formData.list"
        :key="item.id || item.itemKey"
        :title="index ? '' : '合同列表'">
        <div class="m-section--form">
          <el-button
            class="error delete"
            type="text"
            icon="el-icon-delete"
            @click="listDelete(index)">{{ formData.list.length === 1 ? '清空' : '删除' }}
          </el-button>

          <m-section-row>
            <m-section-cell
              title="合同序号"
              :content="index + 1" />
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="合同起始日期"
              :prop="`list.${index}.begin_date`"
              :rules="listItemValidDateRules('begin_date', index)">
              <el-date-picker
                type="date"
                placeholder="请选择"
                v-model="item.begin_date"
                @change="listItemValidDateValidated('begin_date', index)" />
            </el-form-item>

            <el-form-item
              label="合同终止日期"
              :prop="`list.${index}.end_date`"
              :show-message="item.term_type !== 2"
              :rules="item.term_type === 2 ? [] : listItemValidDateRules('end_date', index)">
              <el-date-picker
                type="date"
                placeholder="请选择"
                v-model="item.end_date"
                :disabled="item.term_type === 2"
                @change="listItemValidDateValidated('end_date', index)" />
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="用工形式"
              :prop="`list.${index}.employment_form`">
              <el-select
                placeholder="请选择"
                v-model="item.employment_form">
                <el-option
                  v-for="(i, k) in options.contract_employment_form"
                  :key="k"
                  :label="i"
                  :value="Number(k)" />
              </el-select>
            </el-form-item>

            <el-form-item
              label="合同主体单位"
              :prop="`list.${index}.subject_unit`"
              :rules="formDataRules.subject_unit">
              <m-legal-entity-select
                class="legal-entity-select"
                init-change
                :width="260"
                :legal-entity.sync="item.subject_unit"
                :valid-date="item.begin_date"
                @fetchCompleted="legalEntityOptionsSync($event, item.id || item.itemKey)" />
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="合同期限类型"
              :prop="`list.${index}.term_type`"
              :rules="formDataRules.term_type">
              <el-select
                placeholder="请选择"
                v-model="item.term_type"
                @change="item.term_type === 2 ? (item.end_date = '') : ''">
                <el-option
                  v-for="(i, k) in options.contract_term_type"
                  :key="k"
                  :label="i"
                  :value="Number(k)" />
              </el-select>
            </el-form-item>

            <el-form-item
              label="签订日期"
              :prop="`list.${index}.sign_date`"
              :rules="formDataRules.sign_date">
              <el-date-picker
                type="date"
                placeholder="请选择"
                v-model="item.sign_date" />
            </el-form-item>
          </m-section-row>

          <m-section-row
            v-if="!index">
            <el-form-item
              label="试用开始日期"
              :prop="`list.${index}.probation_begin_date`"
              :rules="formDataRules.probation_begin_date">
              <el-date-picker
                type="date"
                placeholder="请选择"
                v-model="item.probation_begin_date"
                @change="listItemProbationValidDateValidated('probation_end_date', true)" />
            </el-form-item>

            <el-form-item
              label="试用结束日期"
              :prop="`list.${index}.probation_end_date`"
              :rules="formDataRules.probation_end_date">
              <el-date-picker
                type="date"
                placeholder="请选择"
                v-model="item.probation_end_date"
                @change="listItemProbationValidDateValidated('probation_begin_date')" />
            </el-form-item>
          </m-section-row>

          <m-section-row
            v-if="!index">
            <el-form-item
              label="试用期限"
              :prop="`list.${index}.probation_term`"
              :rules="formDataRules.probation_term">
              <el-input v-model="item.probation_term" />
            </el-form-item>

            <el-form-item
              label="拟转正日期"
              v-if="!index"
              :prop="`list.${index}.plan_regular_date`">
              <el-date-picker
                type="date"
                placeholder="请选择"
                v-model="item.plan_regular_date" />
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="财务属性"
              :prop="`list.${index}.finance_attribute`">
              <m-legal-entity-select
                class="legal-entity-select"
                init-change
                v-if="!!legalEntityOptions[item.id || item.itemKey]"
                :width="260"
                :input-options="legalEntityOptions[item.id || item.itemKey] || []"
                :legal-entity.sync="item.finance_attribute"
                :valid-date="item.begin_date" />
            </el-form-item>
          </m-section-row>
        </div>
      </m-section>

      <el-button
        class="list-plus"
        type="text"
        icon="el-icon-plus"
        @click="listPlus">添加更多合同信息</el-button>
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
      // 合同经历不能交叉，需要进行输入验证
      const beginDateValidate = (rule, value, callback) => {
        const before = this.formData.list[rule.index - 1] || {}
        const after = this.formData.list[rule.index] || {}
        const afterAfter = this.formData.list[rule.index + 1] || {}
        const valueDate = new Date(this.getDate(value)).getTime()
        if (before.end_date && valueDate <= new Date(this.getDate(before.end_date)).getTime()) {
          this.begin_dateErr.add(rule.index)
          return callback(new Error('合同起始日期不能小于等于上一条合同终止日期'))
        } else if (
          after.end_date
          && valueDate >= new Date(this.getDate(after.end_date)).getTime()
        ) {
          this.begin_dateErr.add(rule.index)
          return callback(new Error('合同起始日期不能大于或等于合同终止日期'))
        } else if (
          before.begin_date &&
          valueDate <= new Date(this.getDate(before.begin_date)).getTime()
        ) {
          this.begin_dateErr.add(rule.index)
          return callback(new Error('合同起始日期不能小于等于上一条合同起始日期'))
        } else if (
          afterAfter.begin_date &&
          valueDate >= new Date(this.getDate(afterAfter.begin_date)).getTime()
        ) {
          this.begin_dateErr.add(rule.index)
          return callback(new Error('合同起始日期不能大于等于下一条合同起始日期'))
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
          return callback(new Error('合同终止日期不能小于或等于合同起始日期'))
        } else if (
          after.begin_date &&
          valueDate >= new Date(this.getDate(after.begin_date)).getTime()
        ) {
          this.end_dateErr.add(rule.index)
          return callback(new Error('合同终止日期不能大于等于下一条合同起始日期'))
        }
        this.end_dateErr.delete(rule.index)
        return callback()
      }

      // 试用期时间校验
      const probationBeginDateValidate = (rule, value, callback) => {
        const end = this.formData.list[0].probation_end_date
        const valueDate = new Date(this.getDate(value)).getTime()
        if (end && valueDate >= new Date(this.getDate(end)).getTime()) {
          this.probation_dateErr.add('probation_begin_date')
          return callback(new Error('试用开始日期不能大于或等于试用结束日期'))
        }
        this.probation_dateErr.delete('probation_begin_date')
        return callback()
      }

      const probationEndDateValidate = (rule, value, callback) => {
        const begin = this.formData.list[0].probation_begin_date
        const valueDate = new Date(this.getDate(value)).getTime()
        if (begin && valueDate <= new Date(this.getDate(begin)).getTime()) {
          this.probation_dateErr.add('probation_end_date')
          return callback(new Error('试用结束日期不能小于或等于试用开始日期'))
        }
        this.probation_dateErr.delete('probation_end_date')
        return callback()
      }

      return {
        begin_dateErr: new Set(),
        end_dateErr: new Set(),
        probation_dateErr: new Set(),
        options: {},
        legalEntityOptions: {},
        default: {
          file_code: '',
          list: [],
        },
        defaultListItem: {
          begin_date: '',
          end_date: '',
          employment_form: '',
          subject_unit: '',
          term_type: '',
          sign_date: '',
          finance_attribute: '',
        },
        defaultListItemFirst: {
          probation_begin_date: '',
          probation_end_date: '',
          probation_term: '',
          plan_regular_date: '',
        },
        formData: {},
        formDataRules: {
          file_code: [
            { required: true, message: '请输入档案编号', trigger: ['blur', 'change'] },
            { max: 10, message: '最长10个字符', trigger: ['blur', 'change'] },
          ],
          begin_date: [
            { required: true, type: 'date', message: '请选择合同起始日期', trigger: ['blur', 'change'] },
            { validator: beginDateValidate, trigger: ['blur', 'change'] },
          ],
          end_date: [
            { required: true, type: 'date', message: '请选择合同终止日期', trigger: ['blur', 'change'] },
            { validator: endDateValidate, trigger: ['blur', 'change'] },
          ],
          subject_unit: [{ required: true, message: '请选择合同主体单位', trigger: ['blur', 'change'] }],
          term_type: [{ required: true, type: 'number', message: '请选择合同期限类型', trigger: ['blur', 'change'] }],
          sign_date: [{ required: true, type: 'date', message: '请选择签订日期', trigger: ['blur', 'change'] }],
          probation_begin_date: [
            { required: true, type: 'date', message: '请选择试用开始日期', trigger: ['blur', 'change'] },
            { validator: probationBeginDateValidate, trigger: ['blur', 'change'] },
          ],
          probation_end_date: [
            { required: true, type: 'date', message: '请选择试用结束日期', trigger: ['blur', 'change'] },
            { validator: probationEndDateValidate, trigger: ['blur', 'change'] },
          ],
          probation_term: [
            { required: true, message: '请输入试用期限', trigger: ['blur', 'change'] },
            { max: 10, message: '最长10个字符', trigger: ['blur', 'change'] },
          ],
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
      legalEntityOptionsSync(arr, key) {
        this.$set(this.legalEntityOptions, key, arr)
      },
      getFormData() {
        // 表单已经存在就重置表单
        if (this.$refs.formData) this.$refs.formData.resetFields()
        // 初始化字段
        const contractInfo = Object.assign({}, this.detData.contract_info || {})
        if (contractInfo.list) {
          contractInfo.list.forEach((item) => {
            item.begin_date = new Date(item.begin_date)
            if (item.end_date) {
              item.end_date = new Date(item.end_date)
            }
            if (item.employment_form) {
              item.employment_form = Number(item.employment_form)
            }
            item.term_type = Number(item.term_type)
            if (item.term_type === 2) {
              item.end_date = ''
            }
            item.sign_date = new Date(item.sign_date)
            if (item.probation_begin_date) {
              item.probation_begin_date = new Date(item.probation_begin_date)
            }
            if (item.probation_end_date) {
              item.probation_end_date = new Date(item.probation_end_date)
            }
            if (item.plan_regular_date) {
              item.plan_regular_date = new Date(item.plan_regular_date)
            }
          })
        }
        // 获取值
        Object.keys(this.default).forEach((key) => {
          if (key === 'list') {
            this.$set(this.formData, key, contractInfo[key] || [])
          } else {
            this.$set(this.formData, key, contractInfo[key] || this.default[key])
          }
        })
        if (!this.formData.list.length) this.$nextTick(this.listPlus)
      },
      listPlus() {
        const item = Object.assign({}, this.defaultListItem, {
          itemKey: Date.now(),
        })
        if (!this.formData.list.length) {
          Object.assign(item, this.defaultListItemFirst)
        }
        this.formData.list.push(item)
      },
      async listDelete(index) {
        try {
          const tip = this.formData.list.length === 1 ? '清空' : '删除'
          await this.$confirm(`确认${tip}所选数据？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
        } catch (err) {
          console.log(err)
          return
        }

        if (index === 0 && this.formData.list.length !== 1) {
          const app = Object.assign({}, this.formData.list[1], this.defaultListItemFirst)
          this.$set(this.formData.list, 1, app)
        }
        const item = this.formData.list[index]
        delete this.legalEntityOptions[item.id || item.itemKey]
        this.formData.list.splice(index, 1)
        if (!this.formData.list.length) this.listPlus()
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
      listItemProbationValidDateValidated(type, flag) {
        if (this.probation_dateErr.has(type)) {
          this.$refs.formData.validateField(`list.0.${type}`)
        }
        let date = this.formData.list[0].probation_begin_date
        if (date && flag) {
          date = new Date(date.getTime())
          this.formData.list[0].plan_regular_date = date.setMonth(date.getMonth() + 6)
        }
      },

      getDate(date) {
        return !date ? '' : this.$utils.tools.formatDate(new Date(date), 'YYYY-MM-DD')
      },
      getValidate(cb) {
        return this.$refs.formData.validate(cb)
      },
      getData() {
        const data = Object.assign({}, this.formData)
        data.contract_info_list = JSON.parse(JSON.stringify(data.list))
        delete data.list
        data.contract_info_list.forEach((item, index) => {
          delete item.itemKey
          item.begin_date = this.getDate(item.begin_date)
          item.end_date = this.getDate(item.end_date) || ''
          item.sign_date = this.getDate(item.sign_date)
          if (item.probation_begin_date) {
            item.probation_begin_date = this.getDate(item.probation_begin_date)
          }
          if (item.probation_end_date) {
            item.probation_end_date = this.getDate(item.probation_end_date)
          }
          if (item.plan_regular_date) {
            item.plan_regular_date = this.getDate(item.plan_regular_date)
          }
          const listKeys = Object.keys(this.defaultListItem)
          // 不删除id字段
          listKeys.push('id')
          const listKeysAll = listKeys.concat(Object.keys(this.defaultListItemFirst))
          if (!index) {
            Object.keys(item).forEach((key) => {
              if (!listKeysAll.includes(key)) delete item[key]
            })
          } else {
            Object.keys(item).forEach((key) => {
              if (!listKeys.includes(key)) delete item[key]
            })
          }
        })
        data.contract_info_list = JSON.stringify(data.contract_info_list)
        return data
      },
    },
  }
</script>
