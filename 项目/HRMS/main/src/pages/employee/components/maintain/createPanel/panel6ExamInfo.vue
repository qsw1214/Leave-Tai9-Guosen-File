<template>
  <div class="create-panel create-exam-info">
    <div class="panel-title">
      <div>资格信息</div>
    </div>

    <el-form
      label-position="left"
      label-width="140px"
      ref="formData"
      :model="formData"
      :rules="formDataRules">
      <m-section
        is-form
        v-for="(item, index) in formData.finc_list"
        :title="index? '' : '金融类考试信息'"
        :key="item.id || item.itemKey">
        <div class="m-section--form">
          <el-button
            class="error delete"
            type="text"
            icon="el-icon-delete"
            @click="listDelete('finc_list', index)">{{
              formData.finc_list.length === 1 ? '清空' : '删除'
            }}
          </el-button>

          <m-section-row>
            <m-section-cell
              title="序号"
              :content="index + 1" />
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="金融资格考试类型"
              :prop="`finc_list.${index}.type`">
              <el-select
                placeholder="请选择"
                v-model="item.type"
                @change="finc_listSelect(index)">
                <el-option
                  v-for="(i, k) in options.exam_finc_type"
                  :key="k"
                  :label="i"
                  :value="Number(k)" />
              </el-select>
            </el-form-item>

            <el-form-item
              label="备注"
              v-if="!!item.type"
              :prop="`finc_list.${index}.remark`"
              :rules="formDataRules.max20">
              <el-input v-model="item.remark" />
            </el-form-item>
          </m-section-row>
        </div>

        <div
          class="panel-table"
          v-if="!!item.type && item.type !== 1024"
          :key="item.id || item.itemKey">
          <div class="tr">
            <div class="table-th th">通过科目</div>
            <div class="table-th th"><span class="required">* </span>考试成绩</div>
            <div class="table-th th">通过时间</div>
            <div class="table-th th-no-border" />
          </div>
          <div
            class="tr"
            v-for="(subItem, subIndex) in item.list"
            :key="subItem.itemKey || subIndex">
            <div class="table-td td">
              {{ subItem.subject }}
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`finc_list.${index}.list.${subIndex}.achievement`"
                :rules="formDataRules.finc_listachievement">
                <el-input v-model="subItem.achievement" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`finc_list.${index}.list.${subIndex}.pass_date`">
                <el-date-picker
                  type="date"
                  placeholder="请选择"
                  v-model="subItem.pass_date" />
              </el-form-item>
            </div>
            <div class="table-td td-no-border">
              <div>
                <el-button
                  class="error"
                  type="text"
                  icon="el-icon-circle-close"
                  v-if="item.list.length > 1"
                  @click="finc_listItemDelete(index, subIndex)" />
              </div>
            </div>
          </div>
        </div>

        <div
          class="panel-table test-table"
          v-if="!!item.type && item.type === 1024"
          :key="item.id || item.itemKey">
          <div class="tr">
            <div class="table-th th"><span class="required">* </span>通过科目</div>
            <div class="table-th th"><span class="required">* </span>考试成绩</div>
            <div class="table-th th">通过时间</div>
            <div class="table-th th-no-border" />
          </div>
          <div
            class="tr"
            v-for="(subItem, subIndex) in item.list"
            :key="subItem.itemKey || subIndex">
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`finc_list.${index}.list.${subIndex}.subject`"
                :rules="formDataRules.finc_listsubject">
                <el-input v-model="subItem.subject" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`finc_list.${index}.list.${subIndex}.achievement`"
                :rules="formDataRules.finc_listachievement">
                <el-input v-model="subItem.achievement" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`finc_list.${index}.list.${subIndex}.pass_date`">
                <el-date-picker
                  type="date"
                  placeholder="请选择"
                  v-model="subItem.pass_date" />
              </el-form-item>
            </div>
            <div class="table-td td-no-border">
              <div>
                <el-button
                  type="text"
                  icon="el-icon-circle-plus"
                  @click="finc_listItemPlus(index, subIndex)" />
                <el-button
                  class="error"
                  type="text"
                  icon="el-icon-circle-close"
                  v-if="item.list.length > 1"
                  @click="finc_listItemDelete(index, subIndex)" />
              </div>
            </div>
          </div>
        </div>
      </m-section>

      <el-button
        class="list-plus"
        type="text"
        icon="el-icon-plus"
        @click="listPlus('finc_list')">添加更多金融类考试信息</el-button>

      <m-section
        title="券商资格信息">
        <div class="panel-table">
          <div class="tr">
            <div class="table-th th">取得券商执业资格类型</div>
            <div class="table-th th">券商资格类证书编号</div>
            <div class="table-th th">取得资格时间</div>
            <div class="table-th th">备注</div>
            <div class="table-th th-no-border" />
          </div>
          <div
            class="tr"
            v-for="(item, index) in formData.broker_list"
            :key="item.id || item.itemKey">
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`broker_list.${index}.type`"
                :rules="listItemRules('broker_list', index)">
                <el-select
                  placeholder="请选择"
                  v-model="item.type">
                  <el-option
                    v-for="(i, k) in options.exam_broker_type"
                    :key="k"
                    :label="i"
                    :value="Number(k)" />
                </el-select>
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`broker_list.${index}.code`"
                :rules="listItemRules('broker_list', index, formDataRules.max20)">
                <el-input v-model="item.code" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`broker_list.${index}.pass_date`"
                :rules="listItemRules('broker_list', index)">
                <el-date-picker
                  type="date"
                  placeholder="请选择"
                  v-model="item.pass_date" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`broker_list.${index}.remark`"
                :rules="formDataRules.max20">
                <el-input v-model="item.remark" />
              </el-form-item>
            </div>
            <div class="table-td td-no-border">
              <div>
                <el-button
                  type="text"
                  icon="el-icon-circle-plus"
                  @click="listPlus('broker_list', index)" />
                <el-button
                  class="error"
                  type="text"
                  icon="el-icon-circle-close"
                  v-if="formData.broker_list.length > 1"
                  @click="listDelete('broker_list', index)" />
              </div>
            </div>
          </div>
        </div>
      </m-section>

      <m-section
        title="其他专业资格信息">
        <div class="panel-table">
          <div class="tr">
            <div class="table-th th">其他专业类资格名称</div>
            <div class="table-th th">取得其他专业资格时间</div>
            <div class="table-th th">备注</div>
            <div class="table-th th-no-border" />
          </div>
          <div
            class="tr"
            v-for="(item, index) in formData.other_list"
            :key="item.id || item.itemKey">
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`other_list.${index}.name`"
                :rules="listItemRules('other_list', index, formDataRules.max20)">
                <el-input v-model="item.name" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`other_list.${index}.pass_date`"
                :rules="listItemRules('other_list', index)">
                <el-date-picker
                  type="date"
                  placeholder="请选择"
                  v-model="item.pass_date" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`other_list.${index}.remark`"
                :rules="formDataRules.max20">
                <el-input v-model="item.remark" />
              </el-form-item>
            </div>
            <div class="table-td td-no-border">
              <div>
                <el-button
                  type="text"
                  icon="el-icon-circle-plus"
                  @click="listPlus('other_list', index)" />
                <el-button
                  class="error"
                  type="text"
                  icon="el-icon-circle-close"
                  v-if="formData.other_list.length > 1"
                  @click="listDelete('other_list', index)" />
              </div>
            </div>
          </div>
        </div>
      </m-section>

      <m-section
        title="语言水平证书">
        <div class="panel-table">
          <div class="tr">
            <div class="table-th th">语言</div>
            <div class="table-th th">等级</div>
            <div class="table-th th-no-border" />
          </div>
          <div
            class="tr"
            v-for="(item, index) in formData.lang_list"
            :key="item.id || item.itemKey">
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`lang_list.${index}.language`"
                :rules="listItemRules('lang_list', index, formDataRules.max10)">
                <el-input v-model="item.language" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`lang_list.${index}.level`"
                :rules="listItemRules('lang_list', index, formDataRules.max10)">
                <el-input v-model="item.level" />
              </el-form-item>
            </div>
            <div class="table-td td-no-border">
              <div>
                <el-button
                  type="text"
                  icon="el-icon-circle-plus"
                  @click="listPlus('lang_list', index)" />
                <el-button
                  class="error"
                  type="text"
                  icon="el-icon-circle-close"
                  v-if="formData.lang_list.length > 1"
                  @click="listDelete('lang_list', index)" />
              </div>
            </div>
          </div>
        </div>
      </m-section>

      <m-section
        title="计算机水平证书">
        <div class="panel-table">
          <div class="tr">
            <div class="table-th th">计算机水平</div>
            <div class="table-th th">证书名称</div>
            <div class="table-th th-no-border" />
          </div>
          <div
            class="tr"
            v-for="(item, index) in formData.computer_list"
            :key="item.id || item.itemKey">
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`computer_list.${index}.level`"
                :rules="listItemRules('computer_list', index, formDataRules.max10)">
                <el-input v-model="item.level" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`computer_list.${index}.name`"
                :rules="listItemRules('computer_list', index, formDataRules.max20)">
                <el-input v-model="item.name" />
              </el-form-item>
            </div>
            <div class="table-td td-no-border">
              <div>
                <el-button
                  type="text"
                  icon="el-icon-circle-plus"
                  @click="listPlus('computer_list', index)" />
                <el-button
                  class="error"
                  type="text"
                  icon="el-icon-circle-close"
                  v-if="formData.computer_list.length > 1"
                  @click="listDelete('computer_list', index)" />
              </div>
            </div>
          </div>
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
      // 表单校验对象不为空字段必填
      const valueRequiredValidate = (rule, value, callback) => {
        const valueObject = this.formData[rule.listType][rule.index]
        const isAllEmpty = Object.keys(valueObject).some((key) => {
          if (key === 'id' || key === 'itemKey') return false
          return !!valueObject[key]
        })
        if (isAllEmpty && !value) {
          return callback(new Error('请补全信息'))
        }
        return callback()
      }

      return {
        options: {},
        default: {
          finc_list: [],
          broker_list: [],
          other_list: [],
          lang_list: [],
          computer_list: [],
        },
        defaultListItemfinc_list: {
          type: '',
          remark: '',
          list: [],
        },
        defaultListItemfinc_listListItem: {
          subject: '',
          achievement: '',
          pass_date: '',
        },
        defaultListItembroker_list: {
          type: '',
          code: '',
          pass_date: '',
          remark: '',
        },
        defaultListItemother_list: {
          name: '',
          pass_date: '',
          remark: '',
        },
        defaultListItemlang_list: {
          language: '',
          level: '',
        },
        defaultListItemcomputer_list: {
          level: '',
          name: '',
        },
        formData: {},
        formDataRules: {
          finc_listachievement: [
            { required: true, message: '请输入考试成绩', trigger: ['blur', 'change'] },
            { max: 20, message: '最长20个字符', trigger: ['blur', 'change'] },
          ],
          finc_listsubject: [
            { required: true, message: '请输入通过科目', trigger: ['blur', 'change'] },
            { max: 30, message: '最长30个字符', trigger: ['blur', 'change'] },
          ],
          valueRequired: [{ validator: valueRequiredValidate, trigger: ['blur', 'change'] }],
          max20: [{ max: 20, message: '最长20个字符', trigger: ['blur', 'change'] }],
          max10: [{ max: 10, message: '最长10个字符', trigger: ['blur', 'change'] }],
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
        const examInfo = Object.assign({}, this.detData.exam_info || {})
        examInfo.finc_list = JSON.parse(JSON.stringify(examInfo.finc_list || []))
        examInfo.broker_list = JSON.parse(JSON.stringify(examInfo.broker_list || []))
        examInfo.other_list = JSON.parse(JSON.stringify(examInfo.other_list || []))
        examInfo.lang_list = JSON.parse(JSON.stringify(examInfo.lang_list || []))
        examInfo.computer_list = JSON.parse(JSON.stringify(examInfo.computer_list || []))
        if (examInfo.finc_list) {
          examInfo.finc_list.forEach((item) => {
            if (item.type !== '') item.type = Number(item.type)
            item.achievement = String(item.achievement)
            item.list.forEach((subItem) => {
              if (subItem.pass_date) subItem.pass_date = new Date(subItem.pass_date)
            })
          })
        }
        if (examInfo.broker_list) {
          examInfo.broker_list.forEach((item) => {
            if (item.pass_date) item.pass_date = new Date(item.pass_date)
            if (item.type) item.type = Number(item.type)
          })
        }
        if (examInfo.other_list) {
          examInfo.other_list.forEach((item) => {
            if (item.pass_date) item.pass_date = new Date(item.pass_date)
          })
        }
        // 获取值
        Object.keys(this.default).forEach((key) => {
          if (key === 'list') {
            this.$set(this.formData, key, examInfo[key] || [])
          } else {
            this.$set(this.formData, key, examInfo[key] || this.default[key])
          }
        })
        if (!this.formData.finc_list.length) this.$nextTick(this.listPlus('finc_list'))
        if (!this.formData.broker_list.length) this.$nextTick(this.listPlus('broker_list'))
        if (!this.formData.other_list.length) this.$nextTick(this.listPlus('other_list'))
        if (!this.formData.lang_list.length) this.$nextTick(this.listPlus('lang_list'))
        if (!this.formData.computer_list.length) this.$nextTick(this.listPlus('computer_list'))
      },
      listPlus(type, index) {
        const item = Object.assign({}, this[`defaultListItem${type}`], {
          itemKey: Date.now(),
        })
        if (index !== undefined) {
          this.formData[type].splice(index + 1, 0, item)
        } else {
          this.formData[type].push(item)
        }
      },
      async listDelete(type, index) {
        try {
          const tip =
            type === 'finc_list' &&
            this.formData.finc_list.length === 1 ? '清空' : '删除'
          await this.$confirm(`确认${tip}所选数据？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
        } catch (err) {
          console.log(err)
          return
        }

        this.formData[type].splice(index, 1)
        if (!this.formData[type].length) this.listPlus(type)
      },
      finc_listSelect(index) {
        const item = this.formData.finc_list[index]
        item.list = []
        if (item.type === 1024) {
          const pushItem = Object.assign({}, this.defaultListItemfinc_listListItem, {
            itemKey: Date.now(),
          })
          item.list.push(pushItem)
          return
        }
        const pushData = this.options[`exam_finc_type_subject_${item.type}`]
        pushData.forEach((subject, pushItemIndex) => {
          const pushItem = Object.assign({}, this.defaultListItemfinc_listListItem, { subject }, {
            itemKey: Date.now() + pushItemIndex,
          })
          item.list.push(pushItem)
        })
      },
      finc_listItemPlus(index, subIndex) {
        const pushItem = Object.assign({}, this.defaultListItemfinc_listListItem, {
          itemKey: Date.now(),
        })
        if (subIndex !== undefined) {
          this.formData.finc_list[index].list.splice(subIndex + 1, 0, pushItem)
        } else {
          this.formData.finc_list[index].list.push(pushItem)
        }
      },
      async finc_listItemDelete(index, subIndex) {
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

        const { list } = this.formData.finc_list[index]
        list.splice(subIndex, 1)
        if (!list.length) this.finc_listItemPlus(index)
      },
      listItemRules(listType, index, elses) {
        const push = { listType, index }
        const newRules = []
        if (elses) newRules.push(...elses)
        newRules.push(Object.assign({}, this.formDataRules.valueRequired[0], push))
        return newRules
      },

      getDate(date) {
        return !date ? '' : this.$utils.tools.formatDate(new Date(date), 'YYYY-MM-DD')
      },
      getValidate(cb) {
        return this.$refs.formData.validate(cb)
      },
      getData() {
        const data = Object.assign({}, this.formData)
        data.exam_info_finc_list = JSON.parse(JSON.stringify(data.finc_list))
        data.exam_info_broker_list = JSON.parse(JSON.stringify(data.broker_list))
        data.exam_info_other_list = JSON.parse(JSON.stringify(data.other_list))
        data.exam_info_lang_list = JSON.parse(JSON.stringify(data.lang_list))
        data.exam_info_computer_list = JSON.parse(JSON.stringify(data.computer_list))
        delete data.finc_list
        delete data.broker_list
        delete data.other_list
        delete data.lang_list
        delete data.computer_list
        data.exam_info_finc_list.forEach((item) => {
          item.list.forEach((listItem) => {
            listItem.pass_date = this.getDate(listItem.pass_date)
            this.clearKeys(listItem, 'finc_listListItem')
          })
          this.removeEmpty(item.list)
          item.pass_date = this.getDate(item.pass_date)
          this.clearKeys(item, 'finc_list')
        })
        data.exam_info_broker_list.forEach((item) => {
          item.pass_date = this.getDate(item.pass_date)
          this.clearKeys(item, 'broker_list')
        })
        data.exam_info_other_list.forEach((item) => {
          item.pass_date = this.getDate(item.pass_date)
          this.clearKeys(item, 'other_list')
        })
        data.exam_info_lang_list.forEach((item) => {
          this.clearKeys(item, 'lang_list')
        })
        data.exam_info_computer_list.forEach((item) => {
          this.clearKeys(item, 'computer_list')
        })
        this.removeEmpty(data.exam_info_finc_list)
        this.removeEmpty(data.exam_info_broker_list)
        this.removeEmpty(data.exam_info_other_list)
        this.removeEmpty(data.exam_info_lang_list)
        this.removeEmpty(data.exam_info_computer_list)
        data.exam_info_finc_list = JSON.stringify(data.exam_info_finc_list)
        data.exam_info_broker_list = JSON.stringify(data.exam_info_broker_list)
        data.exam_info_other_list = JSON.stringify(data.exam_info_other_list)
        data.exam_info_lang_list = JSON.stringify(data.exam_info_lang_list)
        data.exam_info_computer_list = JSON.stringify(data.exam_info_computer_list)
        return data
      },

      clearKeys(item, defaultKeys) {
        delete item.itemKey
        const listKeys = Object.keys(this[`defaultListItem${defaultKeys}`])
        // 不删除id字段
        listKeys.push('id')
        Object.keys(item).forEach((key) => {
          if (!listKeys.includes(key)) delete item[key]
        })
      },
      removeEmpty(arr) {
        const keys = []
        arr.forEach((item, index) => {
          const isAllEmpty = Object.keys(item).every((value) => {
            // 不判断id字段
            if (value === 'id') return true
            const isArray = Array.isArray(item[value])
            return !item[value] || (isArray && !item[value].length)
          })
          if (isAllEmpty) keys.push(index)
        })
        keys.reverse()
        keys.forEach(key => arr.splice(key, 1))
      },
    },
  }
  </script>

  <style lang="scss">
  .create-exam-info {
    .list-plus {
      margin-bottom: 0;
    }

    .panel-table .tr {
      .td {
        .el-form-item,
        .el-select,
        .el-date-editor {
          width: 100%;
        }
      }
    }
  }
</style>
