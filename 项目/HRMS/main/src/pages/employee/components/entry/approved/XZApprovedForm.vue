<template>
  <m-section
    :title="title"
    :style-object="styleObject"
    :data="result">
    <m-section-row>
      <m-section-cell
        title="审批日期"
        prop="approval_time" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="审批意见"
        prop="approval_subject" />
    </m-section-row>

    <m-section-row
      style="border-bottom: 0;"
      v-if="result.approval_xingzheng_json">
      <m-section-cell
        title="说明"
        content="为新员工准备入职所需材料如下：" />
    </m-section-row>

    <m-section-row
      style="margin: 20px 20px;"
      v-if="result.approval_xingzheng_json">

      <el-table
        border
        style="width: 985px;"
        :data="JSON.parse(result.approval_xingzheng_json)">

        <el-table-column
          align="center"
          prop="name"
          label="物料名称" />

        <el-table-column
          align="center"
          prop="model"
          label="型号" />

        <el-table-column
          align="center"
          prop="number"
          label="数量" />

        <el-table-column
          align="center"
          prop="code"
          label="编码" />

        <el-table-column
          align="center"
          width="200px"
          prop="remark"
          label="备注" />
      </el-table>
    </m-section-row>
  </m-section>
</template>

<script>
  import props from './props'

  export default {
    name: 'XZApprovedForm',

    mixins: [props],
  }
</script>
