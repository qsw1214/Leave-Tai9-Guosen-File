<template>
  <div class="page-feedback-list-seft">
    <div class="block-margin-bottom">
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="toCreate(false)">新建
      </el-button>
      <el-button
        icon="el-icon-delete"
        @click="clickDelete">删除
      </el-button>

      <el-input
        class="search"
        placeholder="输入标题或处理状态进行搜索"
        v-model="keyword"
        @keyup.enter.native="search">
        <el-button
          icon="el-icon-search"
          slot="append"
          @click="search" />
      </el-input>
    </div>
    <m-table
      is-full-table
      ref="mtable"
      :loading="loading"
      :route="false"
      :data="data"
      :total="total"
      :page-size="pageSize"
      :current-page="pageIndex"
      @current-change="changePageIndex"
      @size-change="changePageSize">
      <template slot-scope="props">
        <el-table
          border
          stripe
          :max-height="props.maxHeight - 20"
          :data="props.data"
          @row-dblclick="toDetails"
          @selection-change="rowSelected">
          <el-table-column
            type="selection"
            column-key="select"
            align="center"
            class-name="checkbox autotest-checkbox"
            width="75" />
          <el-table-column
            label="标题"
            class-name="autotest-title"
            align="center"
            width="200"
            prop="title" />
          <el-table-column
            label="详细描述"
            class-name="autotest-content"
            align="center"
            min-width="200"
            prop="content" />
          <el-table-column
            label="反馈日期"
            class-name="autotest-date"
            align="center"
            width="150"
            prop="date" />
          <el-table-column
            label="处理状态"
            class-name="autotest-status_name"
            align="center"
            width="150"
            prop="status_name" />
          <el-table-column
            label="操作"
            class-name="autotest-code"
            align="center"
            width="75"
            fixed="right"
            prop="code">
            <template slot-scope="scope">
              <el-button
                type="text"
                v-if="scope.row.status === 1"
                @click="toCreate(true, scope.row.id)">提交</el-button>

              <el-button
                type="text"
                v-else
                @click="toDetails(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </m-table>
  </div>
</template>

<script>
  /**
   * @description 反馈建议 - 我的建议
   * @router /feedback/self
   */
  import mixins from '~index/mixins'

  export default {
    mixins: [mixins.feedback],
    data() {
      const fetchUrl = this.$api.index.feedback.listSelf
      return {
        fetchUrl,
      }
    },
    created() {
      this.fetch()
    },
    methods: {
      exportExcel() {},
      clickDelete() {
        if (this.selectedItems.length === 0) {
          this.$message({
            type: 'error',
            message: '请勾选需要删除的建议',
          })
          return
        }
        const dLength = this.selectedItems.filter(i => i.status > 1).length
        if (dLength > 0) {
          this.$message({
            type: 'error',
            message: '只能删除未提交的建议',
          })
          return
        }
        this.$confirm('确定删除勾选的选项吗？', '提示', {
          type: 'warning',
        })
          .then(() => {
            this.handleDelete()
          }).catch(() => {})
      },
      handleDelete() {
        const ids = this.selectedItems.map(i => i.id)
        return this.$axios({
          url: this.$api.index.feedback.listSelfSelected,
          method: 'post',
          data: {
            type: 'delete',
            ids,
          },
        })
          .then(() => {
            this.$message({
              type: 'success',
              message: '删除成功',
            })
            this.pageIndex = 1
            this.fetch()
          }).catch(() => {})
      },
      toDetails(row) {
        this.$router.push({
          path: `/feedback/details/${row.id}?tab=self`,
        })
      },
      toCreate(isEdit, id) {
        let path = '/feedback/create'
        if (isEdit) {
          path = `${path}/${id}`
        }
        this.$router.push({
          path,
        })
      },
    },
  }
</script>
