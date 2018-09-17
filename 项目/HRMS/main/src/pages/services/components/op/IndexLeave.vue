<template>
  <div class="page-op--transfer">
    <div class="block-margin-bottom">
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="hasApproval"
        @click="handledClick('initiated')">
        流程发起
      </el-button>
      <el-button
        icon="el-icon-delete"
        @click="delConfirm">
        删除
      </el-button>
    </div>
    <m-table
      is-full-table
      ref="mtable"
      :loading="loading"
      :route="false"
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
            label="申请日期"
            class-name="autotest-apply_time"
            align="center"
            width="120"
            prop="apply_time" />

          <el-table-column
            label="计划最后工作日"
            class-name="autotest-rslzgl_work_end_date"
            align="center"
            width="120"
            prop="rslzgl_work_end_date" />

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
            label="离职状态"
            class-name="autotest-approval_quit_status_name"
            align="center"
            width="120"
            prop="approval_quit_status_name" />

          <el-table-column
            label="操作"
            class-name="autotest-code"
            align="center"
            fixed="right"
            width="120"
            prop="code">
            <template slot-scope="scope">
              <el-button
                type="text"
                v-if="operateEditText(scope.row)"
                @click="toSubmit(scope.row)">
                {{ operateEditText(scope.row) }}
              </el-button>

              <el-button
                type="text"
                v-else
                @click="toDetails(scope.row)">
                {{ operateDetailsText(scope.row) }}
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
   * @description 组织人事 - 离职申请列表
   * @router /op 或者 /op/leave
   */
  export default {
    mixins: [mixin.pa, mixin.pl, mixin.op.list],
    data() {
      return {
        code: '200015',
        submitPath: '/op/initiated/leave',
        detailsPath: '/op/leave',
      }
    },
    created() {
      this.fetch()
    },
    methods: {
      leaveStatus(row) {
        let status = row.approval_move_status_name
        if (!row.approval_move_status_name) {
          if (Number(row.status !== 0)) {
            status = '待离职'
          } else {
            status = ''
          }
        }
        return status
      },
    },
  }
</script>

