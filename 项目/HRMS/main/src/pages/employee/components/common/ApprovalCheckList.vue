<template>
  <div
    class="approval-check-list"
    v-if="todoList && todoList.length">
    <el-table
      border
      :data="todoList">

      <el-table-column
        type="index"
        class-name="autotest-table-index"
        align="center"
        width="80"
        label="序号" />

      <el-table-column
        prop="name"
        class-name="autotest-table-name"
        align="center"
        width="400"
        label="待办事项" />

      <el-table-column
        prop="status"
        class-name="autotest-table-status"
        align="center"
        width="90"
        label="是否完成">
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.status"
            :disabled="!checkable" />
        </template>
      </el-table-column>

      <el-table-column
        prop="remark"
        class-name="autotest-table-remark"
        align="center"
        label="备注">
        <template slot-scope="scope">
          <el-input
            class="remark"
            v-if="checkable"
            v-model="scope.row.remark" />
          <span v-else>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
    </el-table>
    <p
      class="el-form-item__error"
      v-show="isError">待办事项未完成不能继续下一步</p>
  </div>
</template>

<script>
  export default {
    name: 'ApprovalCheckList',

    props: {
      list: {
        type: [Array, String],
        default: () => ([]),
      },
      checkable: {
        type: Boolean,
        default: true,
      },
    },

    data() {
      return {
        isError: false,
      }
    },

    computed: {
      todoList() {
        const { list } = this

        if (typeof list === 'string') return JSON.parse(list)
        return list
      },
    },

    methods: {
      validate() {
        let flag = true
        this.list.some((it) => {
          if (!it.status) {
            flag = false
            return true
          }
          return false
        })

        this.isError = !flag

        return flag
      },
    },
  }
</script>
