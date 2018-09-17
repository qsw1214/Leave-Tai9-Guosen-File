<template>
  <div>
    <m-section
      v-for="(log, index) in nodes"
      :key="index"
      :data="log"
      :style-object="{ fontSize: '14px' }"
      :title="`审批表单-${log.approvaler_name}`">

      <m-section-row>
        <m-section-cell
          prop="approval_time"
          title="审批日期" />

        <m-section-cell
          prop="approval_quit_status_name"
          title="离职状态确认"
          v-if="log.approval_form_type === '200015018'" />
      </m-section-row>

      <template v-if="log.approval_form_type === '200015001'">
        <m-section-row>
          <m-section-cell
            prop="approval_is_all_transfer_name"
            title="交接事项是否完整" />

          <m-section-cell
            prop="approval_last_date"
            title="确认最后工作日期" />
        </m-section-row>

        <m-section-row v-if="log.approval_chat_log">
          <m-section-cell
            prop="approval_chat_log"
            title="离职面谈" />
        </m-section-row>
      </template>

      <m-section-row v-if="log.approval_transfer_json">
        <m-section-cell>
          <el-table
            border
            :data="JSON.parse(log.approval_transfer_json)">
            <el-table-column
              width="80"
              type="index"
              align="center"
              label="序号" />
            <el-table-column
              prop="transfer_user_name"
              align="center"
              width="140"
              label="拟离职交接人" />
            <el-table-column
              prop="transfer_matters"
              label="拟交接工作事项" />

            <el-table-column
              prop="status"
              align="center"
              width="160"
              label="是否已完成工作交接">
              <template slot-scope="scope">
                <el-checkbox
                  disabled
                  v-model="scope.row.status" />
              </template>
            </el-table-column>
          </el-table>
        </m-section-cell>
      </m-section-row>

      <m-section-row>
        <m-section-cell
          prop="approval_subject"
          title="审批意见" />
      </m-section-row>

      <m-section-row
        v-if="log.approval_form_type !== '200015002' && getList(log)">
        <m-section-cell>
          <check-list
            :list="getList(log)"
            :checkable="false" />
        </m-section-cell>
      </m-section-row>
    </m-section>
  </div>
</template>

<script>
  import CheckList from '../../common/ApprovalCheckList'
  import json from '../json'

  export default {
    name: 'ApprovalLogNodes',
    components: { CheckList },

    props: {
      nodes: {
        type: Array,
        default: () => ([]),
      },
    },

    data() {
      return {
        map: json.map,
      }
    },

    methods: {
      getList(node) {
        const { map } = this
        const prop = `approval_${map[node.approval_form_type]}_json`
        return node[prop]
      },
    },
  }
</script>
