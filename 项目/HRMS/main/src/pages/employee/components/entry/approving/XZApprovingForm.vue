<template>

  <el-form
    class="m-section--form"
    label-width="140px"
    ref="approvalForm"
    :rules="$parent.$parent.rules"
    :model="result">

    <m-section-row>
      <el-form-item
        label="审批日期">
        <span>由系统自动生成</span>
      </el-form-item>
    </m-section-row>

    <el-form-item
      label="审批意见"
      prop="approval_subject">
      <el-input
        type="textarea"
        placeholder="请输入审批意见"
        :rows="2"
        v-model="result.approval_subject" />
    </el-form-item>

    <m-section-row>
      <el-form-item
        label="流程说明">
        <span>请帮忙为新员工准备入职所需材料。</span>
      </el-form-item>
    </m-section-row>

    <m-section-row
      style="padding-right: 20px;">
      <el-table
        border
        size="mini"
        :data.sync="officeList">

        <el-table-column
          align="center"
          label="物料名称">
          <template slot-scope="scope">
            <b>{{ scope.row.name }}</b>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="型号">
          <template slot-scope="scope">
            <el-input
              placeholder="请输入型号"
              v-model="scope.row.model" />
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="数量">
          <template slot-scope="scope">
            <el-input
              placeholder="请输入数量"
              v-model="scope.row.number" />
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="编码">
          <template slot-scope="scope">
            <el-input
              placeholder="请输入编码"
              v-model="scope.row.code" />
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          width="200px"
          label="备注">
          <template slot-scope="scope">
            <el-input
              type="textarea"
              placeholder="请输入备注信息"
              :rows="1"
              v-model="scope.row.remark" />
          </template>
        </el-table-column>
      </el-table>
    </m-section-row>
  </el-form>
</template>

<script>
  export default {
    name: 'XZApprovingForm',

    props: {
      result: {
        type: Object,
        default: () => ({}),
      },
    },

    data() {
      const officeList = [
        { name: '办公电脑', model: '', number: '', remark: '', code: '' },
        { name: '办公电话', model: '', number: '', remark: '', code: '' },
        { name: '办公文具', model: '', number: '', remark: '', code: '' },
      ]
      const originOfficeList = JSON.stringify(officeList)

      return {
        officeList,
        originOfficeList,
      }
    },
    watch: {
      officeList: {
        handler(val) {
          const jsonStr = JSON.stringify(val)
          let str = ''

          if (jsonStr !== this.originOfficeList) {
            str = jsonStr
          }
          this.$parent.$parent.form.approval_xingzheng_json = str
        },
        deep: true,
      },
    },
  }
</script>
