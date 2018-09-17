<template>
  <div class="page-op--transfer">
    <m-table
      is-full-table
      ref="mtable"
      :route="false"
      :loading="loading"
      :data="data"
      :total="data.length"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="changePage">
      <template slot-scope="props">
        <el-table
          border
          stripe
          :max-height="props.maxHeight - 20"
          :data="props.data"
          @selection-change="rowSelected">
          <el-table-column
            type="selection"
            column-key="select"
            align="center"
            class-name="checkbox autotest-checkbox"
            width="75"
            :selectable="isSelected" />
          <el-table-column
            label="流程编码"
            class-name="autotest-code"
            align="center"
            width="120"
            prop="code" />
          <el-table-column
            label="员工 ID"
            class-name="autotest-emp_code"
            align="center"
            width="100"
            prop="emp_code" />
          <el-table-column
            label="姓名"
            class-name="autotest-name"
            align="center"
            width="120"
            prop="name" />
          <el-table-column
            label="所属部门"
            class-name="autotest-org_name"
            align="center"
            width="120"
            prop="org_name" />
          <el-table-column
            label="职位"
            class-name="autotest-job_name"
            align="center"
            width="120"
            prop="job_name" />
          <el-table-column
            label="手机号码"
            class-name="autotest-mobile"
            align="center"
            width="120"
            prop="mobile" />
          <el-table-column
            label="拟转正日期"
            class-name="autotest-apply_time"
            align="center"
            width="120"
            prop="apply_time" />
          <el-table-column
            label="流程状态"
            class-name="autotest-status_name"
            align="center"
            width="120"
            prop="status_name" />
          <el-table-column
            label="审批节点"
            class-name="autotest-approvaler_names"
            align="center"
            width="120"
            prop="approvaler_names" />
          <el-table-column
            label="转正状态"
            class-name="autotest-approval_is_end_zz_name"
            align="center"
            width="120"
            prop="approval_is_end_zz_name" />
          <el-table-column
            label="操作"
            align="center"
            width="120"
            fixed="right"
            prop="code">
            <template slot-scope="scope">
              <el-button
                type="text"
                v-if="operateEditText(scope.row, scope.row.status === 30)"
                @click="toSubmit(scope.row, scope.row.status === 30)">
                {{ operateEditText(scope.row, scope.row.status === 30) }}
              </el-button>

              <el-button
                type="text"
                v-else
                @click="toDetails(scope.row)">
                {{ operateDetailsText(scope.row, scope.row.status === 30) }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </m-table>
  </div>
</template>

<script>
  import mixin from '~services/mixin'

  /**
   * @description 组织人事 - 转正申请列表
   * @router /op 或者 /op/become-regular
   */
  export default {
    mixins: [mixin.pa, mixin.pl, mixin.op.list],
    data() {
      return {
        code: '200017',
        submitPath: '/op/initiated/become-regular',
        approvingPath: '/op/approving/become-regular',
        detailsPath: '/op/become-regular',
      }
    },
    created() {
      this.fetch()
    },
    methods: {},
  }
</script>
