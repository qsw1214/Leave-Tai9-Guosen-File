<template>
  <div class="create-panel create-family-info">
    <div class="panel-title">
      <div>家庭信息</div>
    </div>

    <el-form
      label-position="left"
      label-width="140px"
      ref="formData"
      :model="formData"
      :rules="formDataRules">
      <m-section
        title="配偶信息"
        is-form>
        <div class="m-section--form">
          <m-section-row>
            <el-form-item
              label="婚姻状况"
              prop="marriage_status">
              <el-select
                placeholder="请选择"
                v-model="formData.marriage_status">
                <el-option
                  v-for="(i, k) in options.family_marriage_status"
                  :key="k"
                  :label="i"
                  :value="Number(k)" />
              </el-select>
            </el-form-item>

            <el-form-item
              label="配偶姓名"
              prop="spouse_name"
              v-if="formData.marriage_status == 2">
              <el-input v-model="formData.spouse_name" />
            </el-form-item>
          </m-section-row>

          <m-section-row
            v-if="formData.marriage_status == 2">
            <el-form-item
              label="配偶证件类型"
              prop="spouse_credential_type">
              <el-select
                placeholder="请选择"
                v-model="formData.spouse_credential_type">
                <el-option
                  v-for="(i, k) in options.credential_type"
                  :key="k"
                  :label="i"
                  :value="Number(k)" />
              </el-select>
            </el-form-item>

            <el-form-item
              label="配偶证件号码"
              prop="spouse_credential_num">
              <el-input v-model="formData.spouse_credential_num" />
            </el-form-item>
          </m-section-row>

          <m-section-row
            v-if="formData.marriage_status == 2">
            <el-form-item
              label="配偶工作单位"
              prop="spouse_work_unit">
              <el-input v-model="formData.spouse_work_unit" />
            </el-form-item>

            <el-form-item
              label="配偶职务"
              prop="spouse_duty">
              <el-input v-model="formData.spouse_duty" />
            </el-form-item>
          </m-section-row>

          <m-section-row
            v-if="formData.marriage_status == 2">
            <el-form-item
              label="配偶联系电话"
              prop="spouse_phone">
              <el-input v-model="formData.spouse_phone" />
            </el-form-item>

            <el-form-item
              label="是否有独生子女"
              prop="spouse_only_child">
              <el-select
                placeholder="请选择"
                v-model="formData.spouse_only_child">
                <el-option
                  label="是"
                  :value="1" />
                <el-option
                  label="否"
                  :value="0" />
              </el-select>
            </el-form-item>
          </m-section-row>

          <m-section-row
            v-if="
              formData.marriage_status == 2
            && formData.spouse_only_child === 1">
            <el-form-item
              label="独生子女出生日期"
              prop="spouse_only_child_birthday"
              :rules="formDataRules.spouse_only_child_birthday">
              <el-date-picker
                type="date"
                placeholder="请选择"
                v-model="formData.spouse_only_child_birthday" />
            </el-form-item>
          </m-section-row>
        </div>
      </m-section>

      <m-section
        title="家庭信息"
        is-form>
        <div class="panel-table">
          <div class="tr">
            <div class="table-th th"><span class="required">* </span>家庭成员姓名</div>
            <div class="table-th th"><span class="required">* </span>与本人关系</div>
            <div class="table-th th"><span class="required">* </span>证件类型</div>
            <div class="table-th th"><span class="required">* </span>证件号码</div>
            <div class="table-th th">工作单位</div>
            <div class="table-th th">职务</div>
            <div class="table-th th"><span class="required">* </span>联系电话</div>
            <div class="table-th th">联系地址</div>
            <div class="table-th th-no-border" />
          </div>
          <div
            class="tr"
            v-for="(item, index) in formData.list"
            :key="item.id || item.itemKey">
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`list.${index}.name`"
                :rules="formDataRules.name">
                <el-input v-model="item.name" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`list.${index}.relationship`"
                :rules="formDataRules.relationship">
                <el-select
                  placeholder="请选择"
                  v-model="item.relationship">
                  <el-option
                    v-for="(i, k) in options.family_relationship"
                    :key="k"
                    :label="i"
                    :value="Number(k)" />
                </el-select>
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`list.${index}.credential_type`"
                :rules="formDataRules.credential_type">
                <el-select
                  placeholder="请选择"
                  v-model="item.credential_type">
                  <el-option
                    v-for="(i, k) in options.credential_type"
                    :key="k"
                    :label="i"
                    :value="Number(k)" />
                </el-select>
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`list.${index}.credential_num`"
                :rules="formDataRules.credential_num">
                <el-input
                  type="textarea"
                  autosize
                  v-model="item.credential_num" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`list.${index}.work_unit`"
                :rules="formDataRules.work_unit">
                <el-input
                  type="textarea"
                  autosize
                  v-model="item.work_unit" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`list.${index}.duty_name`"
                :rules="formDataRules.duty_name">
                <el-input
                  type="textarea"
                  autosize
                  v-model="item.duty_name" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`list.${index}.phone`"
                :rules="formDataRules.phone">
                <el-input
                  type="textarea"
                  autosize
                  v-model="item.phone" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`list.${index}.address`"
                :rules="formDataRules.address">
                <el-input
                  type="textarea"
                  autosize
                  v-model="item.address" />
              </el-form-item>
            </div>
            <div class="table-td td-no-border">
              <div>
                <el-button
                  type="text"
                  icon="el-icon-circle-plus"
                  @click="listPlus(index)" />
                <el-button
                  class="error"
                  type="text"
                  icon="el-icon-circle-close"
                  v-if="formData.list.length > 1"
                  @click="listDelete(index)" />
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
      return {
        options: {},
        default: {
          marriage_status: '',
          spouse_name: '',
          spouse_credential_type: '',
          spouse_credential_num: '',
          spouse_work_unit: '',
          spouse_duty: '',
          spouse_phone: '',
          spouse_only_child: '',
          spouse_only_child_birthday: '',
          list: [],
        },
        defaultListItem: {
          name: '',
          relationship: '',
          credential_type: '',
          credential_num: '',
          work_unit: '',
          duty_name: '',
          address: '',
          phone: '',
        },
        formData: {},
        formDataRules: {
          marriage_status: [{
            required: true, type: 'number', message: '请选择婚姻状况', trigger: ['blur', 'change'],
          }],
          spouse_name: [
            { required: true, message: '请输入配偶姓名', trigger: ['blur', 'change'] },
            { max: 20, message: '最长20个字符', trigger: ['blur', 'change'] },
          ],
          spouse_credential_type: [{
            required: true, type: 'number', message: '请选择配偶证件类型', trigger: ['blur', 'change'],
          }],
          spouse_credential_num: [
            { required: true, message: '请输入配偶证件号码', trigger: ['blur', 'change'] },
            { max: 30, message: '最长30个字符', trigger: ['blur', 'change'] },
          ],
          spouse_work_unit: [
            { required: true, message: '请输入配偶工作单位', trigger: ['blur', 'change'] },
            { max: 20, message: '最长20个字符', trigger: ['blur', 'change'] },
          ],
          spouse_duty: [
            { required: true, message: '请输入配偶职务', trigger: ['blur', 'change'] },
            { max: 20, message: '最长20个字符', trigger: ['blur', 'change'] },
          ],
          spouse_phone: [
            { required: true, message: '请输入配偶联系电话', trigger: ['blur', 'change'] },
            { max: 20, message: '最长20个字符', trigger: ['blur', 'change'] },
          ],
          spouse_only_child: [{
            required: true, type: 'number', message: '请选择是否有独生子女', trigger: ['blur', 'change'],
          }],
          spouse_only_child_birthday: [{
            required: true, type: 'date', message: '请选择独生子女出生日期', trigger: ['blur', 'change'],
          }],

          name: [
            { required: true, message: '请输成员姓名', trigger: ['blur', 'change'] },
            { max: 20, message: '最长20个字符', trigger: ['blur', 'change'] },
          ],
          relationship: [{
            required: true, type: 'number', message: '请选择关系', trigger: ['blur', 'change'],
          }],
          credential_type: [{
            required: true, type: 'number', message: '请选择类型', trigger: ['blur', 'change'],
          }],
          credential_num: [
            { required: true, message: '请输证件号码', trigger: ['blur', 'change'] },
            { max: 30, message: '最长30个字符', trigger: ['blur', 'change'] },
          ],
          work_unit: [
            // { required: true, message: '请输入工作单位', trigger: ['blur', 'change'] },
            { max: 30, message: '最长30个字符', trigger: ['blur', 'change'] },
          ],
          duty_name: [
            // { required: true, message: '请输入职务', trigger: ['blur', 'change'] },
            { max: 20, message: '最长20个字符', trigger: ['blur', 'change'] },
          ],
          address: [{ max: 50, message: '最长50个字符', trigger: ['blur', 'change'] }],
          phone: [
            { required: true, message: '请输联系电话', trigger: ['blur', 'change'] },
            { max: 20, message: '最长20个字符', trigger: ['blur', 'change'] },
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
      getFormData() {
        // 表单已经存在就重置表单
        if (this.$refs.formData) this.$refs.formData.resetFields()
        // 初始化字段
        const familyInfo = Object.assign({}, this.detData.family_info || {})
        familyInfo.list = JSON.parse(JSON.stringify(familyInfo.list || []))
        if (familyInfo.marriage_status) {
          familyInfo.marriage_status = Number(familyInfo.marriage_status)
        }
        if (familyInfo.spouse_credential_type) {
          familyInfo.spouse_credential_type = Number(familyInfo.spouse_credential_type)
        }
        if (familyInfo.spouse_only_child_birthday) {
          familyInfo.spouse_only_child_birthday = new Date(familyInfo.spouse_only_child_birthday)
        }
        if (familyInfo.list) {
          familyInfo.list.forEach((item) => {
            item.relationship = Number(item.relationship)
            item.credential_type = Number(item.credential_type)
          })
        }
        // 获取值
        Object.keys(this.default).forEach((key) => {
          if (key === 'list') {
            this.$set(this.formData, key, familyInfo[key] || [])
          } else if (key === 'spouse_only_child' && familyInfo[key] === 0) {
            // 特殊处理值为0的情况
            this.$set(this.formData, key, familyInfo[key])
          } else {
            this.$set(this.formData, key, familyInfo[key] || this.default[key])
          }
        })
        if (!this.formData.list.length) this.$nextTick(this.listPlus)
      },
      listPlus(index = 0) {
        const item = Object.assign({}, this.defaultListItem, {
          itemKey: Date.now(),
        })
        this.formData.list.splice(index + 1, 0, item)
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

      getDate(date) {
        return !date ? '' : this.$utils.tools.formatDate(new Date(date), 'YYYY-MM-DD')
      },
      getValidate(cb) {
        return this.$refs.formData.validate(cb)
      },
      getData() {
        const data = Object.assign({}, this.formData)
        data.family_info_list = JSON.parse(JSON.stringify(data.list))
        delete data.list
        data.family_info_list.forEach((item) => {
          delete item.itemKey
          const listKeys = Object.keys(this.defaultListItem)
          // 不删除id字段
          listKeys.push('id')
          Object.keys(item).forEach((key) => {
            if (!listKeys.includes(key)) delete item[key]
          })
        })
        data.family_info_list = JSON.stringify(data.family_info_list)
        if (data.marriage_status !== 2) {
          delete data.spouse_name
          delete data.spouse_credential_type
          delete data.spouse_credential_num
          delete data.spouse_work_unit
          delete data.spouse_duty
          delete data.spouse_phone
          delete data.spouse_only_child
          delete data.spouse_only_child_birthday
        } else if (data.spouse_only_child === 1) {
          data.spouse_only_child_birthday = this.getDate(data.spouse_only_child_birthday)
        } else {
          data.spouse_only_child_birthday = ''
        }
        return data
      },
    },
  }
</script>
