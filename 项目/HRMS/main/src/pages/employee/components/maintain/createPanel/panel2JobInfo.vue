<template>
  <div class="create-panel create-job-info">
    <div class="panel-title">
      <div>任职信息</div>
    </div>

    <el-form
      label-position="left"
      label-width="140px"
      ref="formData"
      :model="formData"
      :rules="formDataRules">
      <m-section
        title="基本任职信息"
        is-form>
        <div class="m-section--form">
          <m-section-row>
            <el-form-item
              label="用友人员编码"
              prop="yonyou_code">
              <el-input v-model="formData.yonyou_code" />
            </el-form-item>

            <el-form-item
              label="进入集团日期"
              prop="enter_group_date">
              <el-date-picker
                type="date"
                placeholder="请选择"
                v-model="formData.enter_group_date" />
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="到职日期"
              prop="enter_date">
              <el-date-picker
                type="date"
                placeholder="请选择"
                v-model="formData.enter_date" />
            </el-form-item>

            <el-form-item
              label="工作所在地"
              prop="work_address">
              <el-select
                placeholder="请选择"
                v-model="formData.work_address">
                <el-option
                  v-for="(i, k) in options.job_work_address"
                  :key="k"
                  :label="i"
                  :value="Number(k)" />
              </el-select>
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="人员类别"
              prop="renyuan_type">
              <el-select
                placeholder="请选择"
                v-model="formData.renyuan_type">
                <el-option
                  v-for="(i, k) in options.job_renyuan_type"
                  :key="k"
                  :label="i"
                  :value="Number(k)" />
              </el-select>
            </el-form-item>
            <el-form-item
              label="最新到职日期">
              <el-input
                disabled
                :value="job_valid_date" />
            </el-form-item>
          </m-section-row>
        </div>
      </m-section>

      <m-section
        is-form
        v-for="(item, index) in formData.list"
        v-if="!!item.id"
        :key="item.id || item.itemKey"
        :title="index ? '' : '任职经历'">
        <div class="m-section--form">
          <el-button
            class="error delete"
            type="text"
            icon="el-icon-delete"
            @click="listDelete(index)">删除</el-button>

          <m-section-row>
            <m-section-cell
              title="序号"
              :content="String(index + 1)" />
          </m-section-row>

          <m-section-row>
            <m-section-cell
              title="生效日期"
              :content="item.valid_date" />

            <m-section-cell
              title="操作类型"
              :content="item.type_name" />
          </m-section-row>

          <m-section-row>
            <m-section-cell
              title="操作原因"
              :content="item.reason_name" />
          </m-section-row>

          <m-section-row
            v-if="item.type === 2">
            <m-section-cell
              title="离职原因"
              :content="item.quit_reason_name" />

            <m-section-cell
              title="离职去向"
              :content="item.quit_goto_name" />
          </m-section-row>

          <m-section-row
            v-if="item.type === 2">
            <m-section-cell
              title="去向具体说明"
              :content="item.quit_goto_explain" />
          </m-section-row>

          <m-section-row
            v-if="item.type === 2">
            <m-section-cell
              title="离职面谈记录"
              :content="item.quit_chat_record.replace(/\n/g, '<br>')" />
          </m-section-row>

          <m-section-row
            v-if="item.type === 2">
            <m-section-cell
              title="备注"
              :content="item.remark" />
          </m-section-row>

          <m-section-row>
            <m-section-cell
              title="部门"
              :content="item.org_name" />

            <m-section-cell
              title="职位"
              :content="item.job_name" />
          </m-section-row>

          <m-section-row>
            <m-section-cell
              title="职等"
              :content="item.job_level" />

            <m-section-cell
              title="职务类别"
              :content="item.duty_type_name" />
          </m-section-row>

          <m-section-row>
            <m-section-cell
              title="员工状态"
              :content="item.status_name" />
          </m-section-row>
        </div>
      </m-section>

      <m-section
        is-form
        v-for="(item, index) in formData.list"
        v-if="!item.id"
        :key="item.id || item.itemKey"
        :title="index ? '' : '任职经历'">
        <div class="m-section--form">
          <el-button
            class="error delete"
            type="text"
            icon="el-icon-delete"
            v-if="formData.list.length !== 1"
            @click="listDelete(index)">删除</el-button>

          <m-section-row>
            <m-section-cell
              title="序号"
              :content="String(index + 1)" />
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="生效日期"
              :prop="`list.${index}.valid_date`"
              :rules="listItemValidDateRules(index, 'valid_date')">
              <el-date-picker
                type="date"
                placeholder="请选择"
                v-model="item.valid_date"
                @change="listItemValidDateValidated(index)" />
            </el-form-item>

            <el-form-item
              label="操作类型"
              :prop="`list.${index}.type`"
              :rules="formDataRules.type">
              <el-select
                placeholder="请选择"
                v-model="item.type"
                @change="listItemTypeChange(item, index)">
                <el-option
                  v-for="(i, k) in options.job_type"
                  :key="k"
                  :label="i"
                  :value="Number(k)" />
              </el-select>
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="操作原因"
              :prop="`list.${index}.reason`"
              :rules="formDataRules.reason">
              <el-select
                placeholder="请选择"
                v-model="item.reason">
                <el-option
                  v-for="(i, k) in options.job_reason[item.type]"
                  :key="k"
                  :label="i"
                  :value="Number(k)" />
              </el-select>
            </el-form-item>
          </m-section-row>

          <m-section-row
            v-if="item.type == 2">
            <el-form-item
              label="离职原因"
              :prop="`list.${index}.quit_reason`"
              :rules="formDataRules.quit_reason">
              <el-select
                placeholder="请选择"
                v-model="item.quit_reason">
                <el-option
                  v-for="(i, k) in options.quit_reason"
                  :key="k"
                  :label="i"
                  :value="Number(k)" />
              </el-select>
            </el-form-item>

            <el-form-item
              label="离职去向"
              :prop="`list.${index}.quit_goto`"
              :rules="formDataRules.quit_goto">
              <el-select
                placeholder="请选择"
                v-model="item.quit_goto">
                <el-option
                  v-for="(i, k) in options.quit_goto"
                  :key="k"
                  :label="i"
                  :value="Number(k)" />
              </el-select>
            </el-form-item>
          </m-section-row>

          <el-form-item
            label="去向具体说明"
            v-if="item.type == 2"
            :prop="`list.${index}.quit_goto_explain`"
            :rules="formDataRules.quit_goto_explain">
            <el-input
              type="textarea"
              v-model="item.quit_goto_explain"
              :autosize="{ minRows: 4 }" />
          </el-form-item>

          <el-form-item
            label="离职面谈记录"
            v-if="item.type == 2"
            :prop="`list.${index}.quit_chat_record`"
            :rules="formDataRules.quit_chat_record">
            <el-input
              type="textarea"
              v-model="item.quit_chat_record"
              :autosize="{ minRows: 4 }" />
          </el-form-item>

          <el-form-item
            label="备注"
            v-if="item.type == 2"
            :prop="`list.${index}.remark`"
            :rules="formDataRules.remark">
            <el-input
              type="textarea"
              v-model="item.remark"
              :autosize="{ minRows: 4 }" />
          </el-form-item>

          <m-section-row>
            <el-form-item
              label="部门"
              :prop="`list.${index}.org_id`"
              :rules="listItemValidDateRules(index, 'org_id')">
              <m-cascader
                class="org-select"
                placeholder="请选择"
                change-on-select
                glass
                filterable
                clearable
                init-change
                :organization.sync="item.org_id"
                :valid-date="item.valid_date || new Date()"
                :show-all-levels="false"
                :width="260"
                @change="listItemOrgChange($event, index)" />
            </el-form-item>

            <el-form-item
              label="职位"
              :prop="`list.${index}.job_id`"
              :rules="formDataRules.job_id">
              <m-position-select
                class="job-select"
                title="请选择职位"
                init-change
                :width="260"
                :positions.sync="item.job_id"
                :input-options="jobOptions"
                @fetchCompleted="jobOptionsSync"
                @change="listItemJobChange($event, index)" />
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="职等">
              <el-input
                placeholder="由职位指定"
                disabled
                :value="item.job_level" />
            </el-form-item>

            <el-form-item
              label="职务类别">
              <el-input
                placeholder="由职位指定"
                disabled
                :value="item.duty_type_name" />
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="员工状态"
              :prop="`list.${index}.status`"
              :rules="formDataRules.status">
              <el-select
                placeholder="请选择"
                v-model="item.status">
                <el-option
                  v-for="(i, k) in options.job_status"
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
        v-if="showListPlus"
        @click="listPlus">添加更多任职经历</el-button>
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
      // 国信任职经历不能交叉，需要做生效日期输入校验
      const validate = (rule, value, callback) => {
        const before = this.formData.list[rule.index - 1]
        const after = this.formData.list[rule.index + 1]
        const valueDate = new Date(value).getTime()
        const now = Date.now()
        const orgValueDate = this.formData.list[rule.index].org_valid_date
        const firstMaxIndex = this.formData.list.findIndex((item) => {
          if (item.valid_date) {
            const validDate = new Date(item.valid_date).getTime()
            return now <= validDate
          }
          return false
        })
        if (before && valueDate <= new Date(before.valid_date).getTime()) {
          this.valid_dateErr.add(rule.index)
          return callback(new Error('生效日期不能小于或等于上一条'))
        } else if (after && valueDate >= new Date(after.valid_date).getTime()) {
          this.valid_dateErr.add(rule.index)
          return callback(new Error('生效日期不能大于或等于下一条'))
        } else if (valueDate >= now && rule.index !== this.formData.list.length - 1) {
          this.valid_dateErr.add(rule.index)
          return callback(new Error('未生效记录必须为最后一条记录'))
        } else if (valueDate >= now && firstMaxIndex !== rule.index) {
          this.valid_dateErr.add(rule.index)
          return callback(new Error('不可存在多条未生效记录'))
        } else if (
          orgValueDate && Math.round(valueDate / 8.64e7) * 8.64e7 < new Date(orgValueDate).getTime()
        ) {
          this.valid_dateErr.add(rule.index)
          return callback(new Error('生效日期不能小于所选部门生效日期'))
        }
        this.valid_dateErr.delete(rule.index)
        return callback()
      }

      // 国信任职经历生效日期不能小于部门生效日期
      const orgvalidate = (rule, value, callback) => {
        let orgValueDate = this.formData.list[rule.index].org_valid_date
        orgValueDate = new Date(orgValueDate).getTime()
        const valueDate = this.formData.list[rule.index].valid_date
        if (
          valueDate
          && orgValueDate > Math.round(new Date(valueDate).getTime() / 8.64e7) * 8.64e7
        ) {
          this.org_valid_dateErr.add(rule.index)
          return callback(new Error('部门生效日期不能大于本经历生效日期'))
        }
        this.org_valid_dateErr.delete(rule.index)
        return callback()
      }

      return {
        options: { job_reason: [] },
        jobOptions: [],
        valid_dateErr: new Set(),
        org_valid_dateErr: new Set(),
        default: {
          yonyou_code: '',
          enter_group_date: '',
          enter_date: '',
          work_address: 1,
          renyuan_type: 1,
          list: [],
        },
        defaultListItem: {
          valid_date: '',
          type: '',
          reason: '',
          org_id: '',
          org_valid_date: '',
          job_id: '',
          job_level: '',
          duty_type_name: '',
          status: '',
        },
        defaultListItemApp: {
          quit_reason: '',
          quit_goto: '',
          quit_goto_explain: '',
          quit_chat_record: '',
          remark: '',
        },
        formData: {},
        formDataRules: {
          yonyou_code: [{ max: 20, message: '最长20个字符', trigger: ['blur', 'change'] }],
          enter_group_date: [{ required: true, type: 'date', message: '请选择进入集团日期', trigger: ['blur', 'change'] }],
          enter_date: [{ required: true, type: 'date', message: '请选择到职日期', trigger: ['blur', 'change'] }],
          work_address: [{ required: true, type: 'number', message: '请选择工作所在地', trigger: ['blur', 'change'] }],
          renyuan_type: [{ required: true, type: 'number', message: '请选择人员类别', trigger: ['blur', 'change'] }],

          valid_date: [
            { required: true, type: 'date', message: '请选择生效日期', trigger: ['blur', 'change'] },
            { validator: validate, trigger: ['blur', 'change'] },
          ],
          type: [{ required: true, type: 'number', message: '请选择操作类型', trigger: ['blur', 'change'] }],
          reason: [{ required: true, type: 'number', message: '请选择操作原因', trigger: ['blur', 'change'] }],

          quit_reason: [{
            required: true, type: 'number', message: '请选择离职原因', trigger: ['blur', 'change'],
          }],
          quit_goto: [{
            required: true, type: 'number', message: '请选择离职去向', trigger: ['blur', 'change'],
          }],
          quit_goto_explain: [
            { required: true, message: '请输入去向具体说明', trigger: ['blur', 'change'] },
          ],
          quit_chat_record: [{ max: 100, message: '最长100个字符', trigger: ['blur', 'change'] }],
          remark: [{ max: 20, message: '最长20个字符', trigger: ['blur', 'change'] }],

          org_id: [
            { required: true, message: '请选择部门', trigger: ['blur', 'change'] },
            { validator: orgvalidate, trigger: ['blur', 'change'] },
          ],
          job_id: [{ required: true, message: '请选择职位', trigger: ['blur', 'change'] }],
          status: [{ required: true, type: 'number', message: '请选择员工状态', trigger: ['blur', 'change'] }],
        },
      }
    },
    computed: {
      dictionary() {
        return this.$utils.config.dictionary.employee
      },
      job_valid_date() {
        let max = ''
        this.formData.list.forEach((item) => {
          if (item.valid_date &&
            (item.type === 1 || item.type === 4) &&
            (!max || new Date(max).getTime() < new Date(item.valid_date).getTime())
          ) {
            max = this.getDate(item.valid_date)
          }
        })
        return max
      },
      showListPlus() {
        const now = Date.now()
        return !this.formData.list.some((item) => {
          if (item.valid_date) {
            return now <= new Date(item.valid_date).getTime()
          }
          return false
        })
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
        if (JSON.stringify(this.options) !== '{"job_reason":[]}') return
        // store 注册
        const config = this.dictionary.employee
        this.$store.registerModule('EMPLOYEE_OPTIONS', config)
        // store 拉取
        this.$store.dispatch('EMPLOYEE_OPTIONS/get')
          .then((options) => {
            this.options = options
          })
      },
      jobOptionsSync(options) {
        this.jobOptions = options
      },
      getFormData() {
        // 表单已经存在就重置表单
        if (this.$refs.formData) this.$refs.formData.resetFields()
        // 初始化字段，无需处理listItem因为不需要编辑仅可删除
        const jobInfo = Object.assign({}, this.detData.job_info || {})
        jobInfo.list = JSON.parse(JSON.stringify(jobInfo.list || []))
        if (jobInfo.enter_group_date) {
          jobInfo.enter_group_date = new Date(jobInfo.enter_group_date)
        }
        if (jobInfo.enter_date) {
          jobInfo.enter_date = new Date(jobInfo.enter_date)
        }
        if (jobInfo.work_address) {
          jobInfo.work_address = Number(jobInfo.work_address)
        }
        if (jobInfo.renyuan_type) {
          jobInfo.renyuan_type = Number(jobInfo.renyuan_type)
        }
        // 获取值
        Object.keys(this.default).forEach((key) => {
          if (key === 'list') {
            this.$set(this.formData, key, jobInfo[key] || [])
          } else {
            this.$set(this.formData, key, jobInfo[key] || this.default[key])
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
        if (!this.formData.list.length) this.listPlus()
      },
      listItemValidDateRules(index, type) {
        const push = { index }
        const newRules = []
        newRules.push(Object.assign({}, this.formDataRules[type][0]))
        newRules.push(Object.assign({}, this.formDataRules[type][1], push))
        return newRules
      },
      listItemValidDateValidated(index) {
        this.valid_dateErr.forEach((item) => {
          if (item === index) return
          this.$refs.formData.validateField(`list.${item}.valid_date`)
        })
        // 校验本条的部门生效时间
        if (this.org_valid_dateErr.has(index)) {
          this.$refs.formData.validateField(`list.${index}.org_id`)
        }
      },
      listItemTypeChange(item, index) {
        item.reason = ''
        if (item.type === 2) {
          const newItem = Object.assign({}, item, this.defaultListItemApp)
          this.formData.list.splice(index, 1, newItem)
        } else {
          delete item.quit_reason
          delete item.quit_goto
          delete item.quit_goto_explain
          delete item.quit_chat_record
          delete item.remark
        }
      },
      listItemOrgChange(org, index) {
        if (org.length) {
          this.formData.list[index].org_valid_date = org[org.length - 1].valid_date
        } else {
          this.formData.list[index].org_valid_date = ''
        }
        // 校验本条的生效时间
        if (this.valid_dateErr.has(index)) {
          this.$refs.formData.validateField(`list.${index}.valid_date`)
        }
      },
      listItemJobChange(job, index) {
        if (job.length) {
          this.formData.list[index].job_level = job[0].level
          this.formData.list[index].duty_type_name = job[0].duty_type_name
        } else {
          this.formData.list[index].job_level = ''
          this.formData.list[index].duty_type_name = ''
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
        data.job_info_list = JSON.parse(JSON.stringify(data.list))
        delete data.list
        data.job_info_list.forEach((item) => {
          item.valid_date = this.getDate(item.valid_date)
          delete item.job_level
          delete item.duty_type_name
          delete item.itemKey
          delete item.org_valid_date
          const listKeys = Object.keys(this.defaultListItem)
          const listKeysApp = Object.keys(this.defaultListItemApp)
          const listKeysAll = listKeys.concat(listKeysApp)
          // 不删除id字段
          listKeysAll.push('id')
          Object.keys(item).forEach((key) => {
            if (item.type === 2 && !listKeysAll.includes(key)) delete item[key]
            if (item.type !== 2 && !listKeys.includes(key)) delete item[key]
          })
        })
        data.job_info_list = JSON.stringify(data.job_info_list)
        data.enter_group_date = this.getDate(data.enter_group_date)
        data.enter_date = this.getDate(data.enter_date)
        data.job_valid_date = this.getDate(this.job_valid_date)
        return data
      },
    },
  }
</script>
