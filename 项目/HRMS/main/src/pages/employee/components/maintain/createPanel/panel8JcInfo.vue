<template>
  <div class="create-panel create-jc-info">
    <div class="panel-title">
      <div>奖惩信息</div>
    </div>

    <el-form
      ref="formData"
      :model="formData"
      :rules="formDataRules">
      <m-section
        title="奖励信息">
        <div class="panel-table">
          <div class="tr">
            <div class="table-th th has-date">奖励日期</div>
            <div class="table-th th">奖励名称</div>
            <div class="table-th th">奖励机构</div>
            <div class="table-th th">奖励措施</div>
            <div class="table-th th">奖励事由</div>
            <div class="table-th th">备注</div>
            <div class="table-th th-no-border" />
          </div>
          <div
            class="tr"
            v-for="(item, index) in formData.reward_list"
            :key="item.id || item.itemKey">
            <div class="table-td td has-date">
              <el-form-item label-width="0px">
                <el-date-picker
                  type="date"
                  placeholder="请选择"
                  v-model="item.date" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`reward_list.${index}.name`"
                :rules="formDataRules.max30">
                <el-input
                  type="textarea"
                  autosize
                  v-model="item.name" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`reward_list.${index}.mechanism_name`"
                :rules="formDataRules.max20">
                <el-input
                  type="textarea"
                  autosize
                  v-model="item.mechanism_name" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`reward_list.${index}.measure`"
                :rules="formDataRules.max50">
                <el-input
                  type="textarea"
                  autosize
                  v-model="item.measure" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`reward_list.${index}.reason`"
                :rules="formDataRules.max50">
                <el-input
                  type="textarea"
                  autosize
                  v-model="item.reason" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`reward_list.${index}.remark`"
                :rules="formDataRules.max20">
                <el-input
                  type="textarea"
                  autosize
                  v-model="item.remark" />
              </el-form-item>
            </div>
            <div class="table-td td-no-border">
              <div>
                <el-button
                  type="text"
                  icon="el-icon-circle-plus"
                  @click="listPlus('reward_list', index)" />
                <el-button
                  class="error"
                  type="text"
                  icon="el-icon-circle-close"
                  v-if="formData.reward_list.length > 1"
                  @click="listDelete('reward_list', index)" />
              </div>
            </div>
          </div>
        </div>
      </m-section>

      <m-section
        title="处罚信息">
        <div class="panel-table">
          <div class="tr">
            <div class="table-th th has-date">处罚日期</div>
            <div class="table-th th">处罚类型</div>
            <div class="table-th th">处罚机构</div>
            <div class="table-th th">处罚措施</div>
            <div class="table-th th">处罚事由</div>
            <div class="table-th th">备注</div>
            <div class="table-th th-no-border" />
          </div>
          <div
            class="tr"
            v-for="(item, index) in formData.punish_list"
            :key="item.id || item.itemKey">
            <div class="table-td td has-date">
              <el-form-item
                label-width="0px">
                <el-date-picker
                  type="date"
                  placeholder="请选择"
                  v-model="item.date" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`punish_list.${index}.type`"
                :rules="formDataRules.max20">
                <el-input
                  type="textarea"
                  autosize
                  v-model="item.type" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`punish_list.${index}.mechanism_name`"
                :rules="formDataRules.max20">
                <el-input
                  type="textarea"
                  autosize
                  v-model="item.mechanism_name" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`punish_list.${index}.measure`"
                :rules="formDataRules.max50">
                <el-input
                  type="textarea"
                  autosize
                  v-model="item.measure" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`punish_list.${index}.reason`"
                :rules="formDataRules.max50">
                <el-input
                  type="textarea"
                  autosize
                  v-model="item.reason" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`punish_list.${index}.remark`"
                :rules="formDataRules.max20">
                <el-input
                  type="textarea"
                  autosize
                  v-model="item.remark" />
              </el-form-item>
            </div>
            <div class="table-td td-no-border">
              <div>
                <el-button
                  type="text"
                  icon="el-icon-circle-plus"
                  @click="listPlus('punish_list', index)" />
                <el-button
                  class="error"
                  type="text"
                  icon="el-icon-circle-close"
                  v-if="formData.punish_list.length > 1"
                  @click="listDelete('punish_list', index)" />
              </div>
            </div>
          </div>
        </div>
      </m-section>

      <m-section
        title="合规诚信">
        <div class="panel-table">
          <div class="tr">
            <div class="table-th th has-date">通报日期</div>
            <div class="table-th th">违规类型</div>
            <div class="table-th th">通报机构</div>
            <div class="table-th th">通报内容</div>
            <div class="table-th th">问责措施</div>
            <div class="table-th th">备注</div>
            <div class="table-th th-no-border" />
          </div>
          <div
            class="tr"
            v-for="(item, index) in formData.compliance_list"
            :key="item.id || item.itemKey">
            <div class="table-td td has-date">
              <el-form-item label-width="0px">
                <el-date-picker
                  type="date"
                  placeholder="请选择"
                  v-model="item.date" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`compliance_list.${index}.type`"
                :rules="formDataRules.max20">
                <el-input
                  type="textarea"
                  autosize
                  v-model="item.type" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`compliance_list.${index}.mechanism_name`"
                :rules="formDataRules.max20">
                <el-input
                  type="textarea"
                  autosize
                  v-model="item.mechanism_name" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`compliance_list.${index}.content`"
                :rules="formDataRules.max50">
                <el-input
                  type="textarea"
                  autosize
                  v-model="item.content" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`compliance_list.${index}.measure`"
                :rules="formDataRules.max50">
                <el-input
                  type="textarea"
                  autosize
                  v-model="item.measure" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`compliance_list.${index}.remark`"
                :rules="formDataRules.max20">
                <el-input
                  type="textarea"
                  autosize
                  v-model="item.remark" />
              </el-form-item>
            </div>
            <div class="table-td td-no-border">
              <div>
                <el-button
                  type="text"
                  icon="el-icon-circle-plus"
                  @click="listPlus('compliance_list', index)" />
                <el-button
                  class="error"
                  type="text"
                  icon="el-icon-circle-close"
                  v-if="formData.compliance_list.length > 1"
                  @click="listDelete('compliance_list', index)" />
              </div>
            </div>
          </div>
        </div>
      </m-section>

      <m-section
        title="客户投诉记录">
        <div class="panel-table">
          <div class="tr">
            <div class="table-th th has-date">投诉日期</div>
            <div class="table-th th">投诉人</div>
            <div class="table-th th">投诉人资金账号</div>
            <div class="table-th th">投诉人联系方式</div>
            <div class="table-th th">投诉类型</div>
            <div class="table-th th">投诉事项</div>
            <div class="table-th th">处理结果</div>
            <div class="table-th th">投诉来源</div>
            <div class="table-th th">备注</div>
            <div class="table-th th-no-border" />
          </div>
          <div
            class="tr"
            v-for="(item, index) in formData.complaint_list"
            :key="item.id || item.itemKey">
            <div class="table-td td has-date">
              <el-form-item
                label-width="0px">
                <el-date-picker
                  type="date"
                  placeholder="请选择"
                  v-model="item.date" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`complaint_list.${index}.complaint_name`"
                :rules="formDataRules.max20">
                <el-input
                  type="textarea"
                  autosize
                  v-model="item.complaint_name" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`complaint_list.${index}.complaint_num`"
                :rules="formDataRules.max20">
                <el-input
                  type="textarea"
                  autosize
                  v-model="item.complaint_num" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`complaint_list.${index}.complaint_phone`"
                :rules="formDataRules.max20">
                <el-input
                  type="textarea"
                  autosize
                  v-model="item.complaint_phone" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`complaint_list.${index}.type`"
                :rules="formDataRules.max20">
                <el-input
                  type="textarea"
                  autosize
                  v-model="item.type" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`complaint_list.${index}.matter`"
                :rules="formDataRules.max50">
                <el-input
                  type="textarea"
                  autosize
                  v-model="item.matter" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`complaint_list.${index}.result`"
                :rules="formDataRules.max50">
                <el-input
                  type="textarea"
                  autosize
                  v-model="item.result" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`complaint_list.${index}.source`"
                :rules="formDataRules.max20">
                <el-input
                  type="textarea"
                  autosize
                  v-model="item.source" />
              </el-form-item>
            </div>
            <div class="table-td td">
              <el-form-item
                label-width="0px"
                :prop="`complaint_list.${index}.remark`"
                :rules="formDataRules.max20">
                <el-input
                  type="textarea"
                  autosize
                  v-model="item.remark" />
              </el-form-item>
            </div>
            <div class="table-td td-no-border">
              <div>
                <el-button
                  type="text"
                  icon="el-icon-circle-plus"
                  @click="listPlus('complaint_list', index)" />
                <el-button
                  class="error"
                  type="text"
                  icon="el-icon-circle-close"
                  v-if="formData.complaint_list.length > 1"
                  @click="listDelete('complaint_list', index)" />
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
        default: {
          reward_list: [],
          punish_list: [],
          compliance_list: [],
          complaint_list: [],
        },
        defaultListItemreward_list: {
          date: '',
          name: '',
          mechanism_name: '',
          measure: '',
          reason: '',
          remark: '',
        },
        defaultListItempunish_list: {
          date: '',
          type: '',
          mechanism_name: '',
          measure: '',
          reason: '',
          remark: '',
        },
        defaultListItemcompliance_list: {
          date: '',
          type: '',
          mechanism_name: '',
          content: '',
          measure: '',
          remark: '',
        },
        defaultListItemcomplaint_list: {
          date: '',
          complaint_name: '',
          complaint_num: '',
          complaint_phone: '',
          type: '',
          matter: '',
          result: '',
          source: '',
          remark: '',
        },
        formData: {},
        formDataRules: {
          max10: [{ max: 10, message: '最长10个字符', trigger: ['blur', 'change'] }],
          max20: [{ max: 20, message: '最长20个字符', trigger: ['blur', 'change'] }],
          max30: [{ max: 30, message: '最长30个字符', trigger: ['blur', 'change'] }],
          max50: [{ max: 50, message: '最长50个字符', trigger: ['blur', 'change'] }],
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
      this.getFormData()
    },
    methods: {
      getFormData() {
        // 表单已经存在就重置表单
        if (this.$refs.formData) this.$refs.formData.resetFields()
        // 初始化字段
        const jcInfo = Object.assign({}, this.detData.jc_info || {})
        jcInfo.reward_list = JSON.parse(JSON.stringify(jcInfo.reward_list || []))
        jcInfo.punish_list = JSON.parse(JSON.stringify(jcInfo.punish_list || []))
        jcInfo.compliance_list = JSON.parse(JSON.stringify(jcInfo.compliance_list || []))
        jcInfo.complaint_list = JSON.parse(JSON.stringify(jcInfo.complaint_list || []))
        if (jcInfo.reward_list) {
          jcInfo.reward_list.forEach((item) => {
            if (item.date) item.date = new Date(item.date)
          })
        }
        if (jcInfo.punish_list) {
          jcInfo.punish_list.forEach((item) => {
            if (item.date) item.date = new Date(item.date)
          })
        }
        if (jcInfo.compliance_list) {
          jcInfo.compliance_list.forEach((item) => {
            if (item.date) item.date = new Date(item.date)
          })
        }
        if (jcInfo.complaint_list) {
          jcInfo.complaint_list.forEach((item) => {
            if (item.date) item.date = new Date(item.date)
          })
        }
        // 获取值
        Object.keys(this.default).forEach((key) => {
          if (key === 'list') {
            this.$set(this.formData, key, jcInfo[key] || [])
          } else {
            this.$set(this.formData, key, jcInfo[key] || this.default[key])
          }
        })
        if (!this.formData.reward_list.length) this.$nextTick(this.listPlus('reward_list'))
        if (!this.formData.punish_list.length) this.$nextTick(this.listPlus('punish_list'))
        if (!this.formData.compliance_list.length) this.$nextTick(this.listPlus('compliance_list'))
        if (!this.formData.complaint_list.length) this.$nextTick(this.listPlus('complaint_list'))
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
          await this.$confirm('确认删除所选数据？', '提示', {
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

      getDate(date) {
        return !date ? '' : this.$utils.tools.formatDate(new Date(date), 'YYYY-MM-DD')
      },
      getValidate(cb) {
        return this.$refs.formData.validate(cb)
      },
      getData() {
        const data = Object.assign({}, this.formData)
        const keys = ['reward_list', 'punish_list', 'compliance_list', 'complaint_list']
        keys.forEach((key) => {
          data[`jc_info_${key}`] = JSON.parse(JSON.stringify(data[key]))
          delete data[key]
          this.clearKeysAddRemoveEmpty(data[`jc_info_${key}`], key)
          data[`jc_info_${key}`] = JSON.stringify(data[`jc_info_${key}`])
        })
        return data
      },

      clearKeysAddRemoveEmpty(arr, defaultKeys) {
        const keys = []
        arr.forEach((item, index) => {
          item.date = this.getDate(item.date)
          delete item.itemKey
          const listKeys = Object.keys(this[`defaultListItem${defaultKeys}`])
          // 不删除id字段
          listKeys.push('id')
          Object.keys(item).forEach((key) => {
            if (!listKeys.includes(key)) delete item[key]
          })
          const isAllEmpty = Object.keys(item).every((value) => {
            // 不判断id字段
            if (value === 'id') return true
            return !item[value]
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
.create-jc-info {
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
