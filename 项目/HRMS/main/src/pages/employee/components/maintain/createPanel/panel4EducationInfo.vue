<template>
  <div class="create-panel create-education-info">
    <div class="panel-title">
      <div>学历信息</div>
    </div>

    <el-form
      label-position="left"
      label-width="140px"
      ref="formData"
      :model="formData"
      :rules="formDataRules">
      <m-section
        is-form
        v-for="(item, index) in formData.list"
        :key="item.id || item.itemKey"
        :title="index ? '' : '学习经历'">
        <div class="m-section--form">
          <el-button
            class="error delete"
            type="text"
            icon="el-icon-delete"
            @click="listDelete(index)">{{ formData.list.length === 1 ? '清空' : '删除' }}
          </el-button>

          <m-section-row>
            <m-section-cell
              title="序号"
              :content="index + 1" />
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="入学日期"
              :prop="`list.${index}.begin_date`"
              :rules="listItemRules('begin_date', index)">
              <el-date-picker
                type="date"
                placeholder="请选择"
                v-model="item.begin_date"
                @change="listItemDateValidated('end_date', index)" />
            </el-form-item>

            <el-form-item
              label="毕业日期"
              :prop="`list.${index}.end_date`"
              :rules="listItemRules('end_date', index)">
              <el-date-picker
                type="date"
                placeholder="请选择"
                v-model="item.end_date"
                @change="listItemDateValidated('begin_date', index)" />
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="学校"
              :prop="`list.${index}.school_name`"
              :rules="formDataRules.school_name">
              <el-input v-model="item.school_name" />
            </el-form-item>

            <el-form-item
              label="是否海外留学经历"
              :rules="formDataRules.is_study_abroad"
              :prop="`list.${index}.is_study_abroad`">
              <el-select
                placeholder="请选择"
                v-model="item.is_study_abroad">
                <el-option
                  label="是"
                  :value="1" />
                <el-option
                  label="否"
                  :value="0" />
              </el-select>
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="专业"
              :prop="`list.${index}.major`"
              :rules="formDataRules.major">
              <el-input v-model="item.major" />
            </el-form-item>

            <el-form-item
              label="学历"
              :prop="`list.${index}.education`"
              :rules="formDataRules.education">
              <el-select
                placeholder="请选择"
                v-model="item.education">
                <el-option
                  v-for="(i, k) in options.education_education"
                  :key="k"
                  :label="i"
                  :value="Number(k)" />
              </el-select>
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="是否最高学历"
              :prop="`list.${index}.is_top_education`"
              :rules="listItemRules('is_top_education', index)">
              <el-select
                placeholder="请选择"
                v-model="item.is_top_education"
                @change="listItemIsTopValidated('is_top_education', index)">
                <el-option
                  label="是"
                  :value="1" />
                <el-option
                  label="否"
                  :value="0" />
              </el-select>
            </el-form-item>

            <el-form-item
              label="学位"
              :prop="`list.${index}.degree`"
              :rules="formDataRules.degree">
              <el-select
                placeholder="请选择"
                v-model="item.degree">
                <el-option
                  v-for="(i, k) in options.education_degree"
                  :key="k"
                  :label="i"
                  :value="Number(k)" />
              </el-select>
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="是否最高学位"
              :prop="`list.${index}.is_top_degree`"
              :rules="listItemRules('is_top_degree', index)">
              <el-select
                placeholder="请选择"
                v-model="item.is_top_degree"
                @change="listItemIsTopValidated('is_top_degree', index)">
                <el-option
                  label="是"
                  :value="1" />
                <el-option
                  label="否"
                  :value="0" />
              </el-select>
            </el-form-item>

            <el-form-item
              label="学习方式"
              :prop="`list.${index}.learning_style`"
              :rules="formDataRules.learning_style">
              <el-select
                placeholder="请选择"
                v-model="item.learning_style">
                <el-option
                  v-for="(i, k) in options.education_learning_style"
                  :key="k"
                  :label="i"
                  :value="Number(k)" />
              </el-select>
            </el-form-item>
          </m-section-row>
        </div>
      </m-section>

      <el-button
        class="list-plus"
        type="text"
        icon="el-icon-plus"
        @click="listPlus">添加更多学习经历</el-button>
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
      // 数据格式要求校验
      const beginDateValidate = (rule, value, callback) => {
        const after = this.formData.list[rule.index]
        const valueDate = new Date(this.getDate(value)).getTime()
        if (
          after && after.end_date &&
          valueDate >= new Date(this.getDate(after.end_date)).getTime()
        ) {
          this.begin_dateErr.add(rule.index)
          return callback(new Error('入学日期不能大于或等于毕业日期'))
        }
        this.begin_dateErr.delete(rule.index)
        return callback()
      }

      const endDateValidate = (rule, value, callback) => {
        const before = this.formData.list[rule.index]
        const valueDate = new Date(this.getDate(value)).getTime()
        if (
          before && before.begin_date &&
          valueDate <= new Date(this.getDate(before.begin_date)).getTime()
        ) {
          this.end_dateErr.add(rule.index)
          return callback(new Error('毕业日期不能小于或等于入学日期'))
        }
        this.end_dateErr.delete(rule.index)
        return callback()
      }

      const isTopEducationValidate = (rule, value, callback) => {
        let max = 0
        this.formData.list.forEach((item) => {
          if (item.is_top_education === 1) max += 1
        })
        if (max > 1) {
          this.is_top_educationErr.add(rule.index)
          callback(new Error('不能同时存在多个最高学历'))
        } else {
          this.is_top_educationErr.delete(rule.index)
          callback()
        }
      }

      const isTopDegreeValidate = (rule, value, callback) => {
        let max = 0
        this.formData.list.forEach((item) => {
          if (item.is_top_degree === 1) max += 1
        })
        if (max > 1) {
          this.is_top_degreeErr.add(rule.index)
          callback(new Error('不能同时存在多个最高学位'))
        } else {
          this.is_top_degreeErr.delete(rule.index)
          callback()
        }
      }

      return {
        is_top_educationErr: new Set(),
        is_top_degreeErr: new Set(),
        begin_dateErr: new Set(),
        end_dateErr: new Set(),
        options: {},
        default: {
          list: [],
        },
        defaultListItem: {
          begin_date: '',
          end_date: '',
          school_name: '',
          is_study_abroad: '',
          major: '',
          education: '',
          is_top_education: '',
          degree: '',
          is_top_degree: '',
          learning_style: '',
        },
        formData: {},
        formDataRules: {
          begin_date: [
            { required: true, type: 'date', message: '请选择入学日期', trigger: ['blur', 'change'] },
            { validator: beginDateValidate, trigger: ['blur', 'change'] },
          ],
          end_date: [
            { required: true, type: 'date', message: '请选择毕业日期', trigger: ['blur', 'change'] },
            { validator: endDateValidate, trigger: ['blur', 'change'] },
          ],
          school_name: [
            { required: true, message: '请输入学校名称', trigger: ['blur', 'change'] },
            { max: 20, message: '最长20个字符', trigger: ['blur', 'change'] },
          ],
          is_study_abroad: [{
            required: true, type: 'number', message: '请选择是否海外留学经历', trigger: ['blur', 'change'],
          }],
          major: [
            { required: true, message: '请输入专业名称', trigger: ['blur', 'change'] },
            { max: 30, message: '最长30个字符', trigger: ['blur', 'change'] },
          ],
          education: [{ required: true, type: 'number', message: '请选择学历', trigger: ['blur', 'change'] }],
          is_top_education: [
            { required: true, type: 'number', message: '请选择是否最高学历', trigger: ['blur', 'change'] },
            { validator: isTopEducationValidate, trigger: ['blur', 'change'] },
          ],
          degree: [{ required: true, type: 'number', message: '请选择学位', trigger: ['blur', 'change'] }],
          is_top_degree: [
            { required: true, type: 'number', message: '请选择是否最高学位', trigger: ['blur', 'change'] },
            { validator: isTopDegreeValidate, trigger: ['blur', 'change'] },
          ],
          learning_style: [{ required: true, type: 'number', message: '请选择学习方式', trigger: ['blur', 'change'] }],
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
        const educationInfo = Object.assign({}, this.detData.education_info || {})
        educationInfo.list = JSON.parse(JSON.stringify(educationInfo.list || []))
        if (educationInfo.list) {
          educationInfo.list.forEach((item) => {
            item.begin_date = new Date(item.begin_date)
            item.end_date = new Date(item.end_date)
            if (item.is_study_abroad) item.is_study_abroad = Number(item.is_study_abroad)
            item.education = Number(item.education)
            item.is_top_education = Number(item.is_top_education)
            item.degree = Number(item.degree)
            item.is_top_degree = Number(item.is_top_degree)
            item.learning_style = Number(item.learning_style)
          })
        }
        // 获取值
        Object.keys(this.default).forEach((key) => {
          if (key === 'list') {
            this.$set(this.formData, key, educationInfo[key] || [])
          } else {
            this.$set(this.formData, key, educationInfo[key] || this.default[key])
          }
        })
        if (!this.formData.list.length) this.$nextTick(this.listPlus)
      },
      listPlus() {
        const item = Object.assign({}, this.defaultListItem, {
          itemKey: Date.now(),
        })
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

        this.formData.list.splice(index, 1)
        if (!this.formData.list.length) this.listPlus()
      },
      listItemRules(type, index) {
        const push = { index }
        const newRules = []
        newRules.push(Object.assign({}, this.formDataRules[type][0]))
        newRules.push(Object.assign({}, this.formDataRules[type][1], push))
        return newRules
      },
      listItemIsTopValidated(type, index) {
        this[`${type}Err`].forEach((item) => {
          if (item === index) return
          this.$refs.formData.validateField(`list.${item}.${type}`)
        })
      },
      listItemDateValidated(type, index) {
        this[`${type}Err`].forEach((item) => {
          if (item === index) this.$refs.formData.validateField(`list.${item}.${type}`)
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
        data.education_info_list = JSON.parse(JSON.stringify(data.list))
        delete data.list
        data.education_info_list.forEach((item) => {
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
        data.education_info_list = JSON.stringify(data.education_info_list)
        return data
      },
    },
  }
</script>
