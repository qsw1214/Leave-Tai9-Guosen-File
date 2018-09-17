<template>
  <div class="page-feedback-list-process">
    <div class="block-margin-bottom">
      <el-button
        icon="el-icon-upload2"
        @click="exportExcel">导出
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
            label="提交人姓名"
            class-name="autotest-user_name"
            align="center"
            width="120"
            prop="user_name" />
          <el-table-column
            label="员工ID"
            class-name="autotest-emp_code"
            align="center"
            width="120"
            prop="emp_code" />
          <el-table-column
            label="所属部门"
            class-name="autotest-org_name"
            align="center"
            width="120"
            prop="org_name" />
          <el-table-column
            label="手机号码"
            class-name="autotest-mobile"
            align="center"
            width="120"
            prop="mobile" />
          <el-table-column
            label="标题"
            class-name="autotest-title"
            align="center"
            width="150"
            prop="title" />
          <el-table-column
            label="详细描述"
            class-name="autotest-content"
            align="center"
            width="200"
            prop="content" />
          <el-table-column
            label="反馈日期"
            class-name="autotest-date"
            align="center"
            width="120"
            prop="date" />
          <el-table-column
            label="处理状态"
            class-name="autotest-status_name"
            align="center"
            width="120"
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
                v-if="scope.row.status === 2 || scope.row.status === 16"
                @click="clickPercess(scope.row.id)">处理</el-button>

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
   * @description 反馈建议 - 后台处理列表
   * @router /feedback/process
   */
  import mixins from '~index/mixins'

  export default {
    mixins: [mixins.feedback],
    data() {
      const fetchUrl = this.$api.index.feedback.listProcess
      return {
        fetchUrl,
      }
    },
    created() {
      this.fetch()
    },
    methods: {
      exportExcel() {
        let ids = ''
        if (this.selectedItems.length > 0) {
          const idArr = this.selectedItems.map(item => item.id)
          ids = idArr.join(',')
        }
        this.$axios({
          url: this.$api.index.feedback.listProcessSelected,
          method: 'post',
          data: {
            ids,
            type: 'export',
            keywords: this.keywordValues,
          },
        })
          .then((data) => {
            this.$utils.tools.windowOpen(data.data.url)
          }).catch(() => {})
      },
      clickPercess(id) {
        this.$router.push({
          path: `/feedback/details/${id}/process`,
        })
      },
      toDetails(row) {
        this.$router.push({
          path: `/feedback/details/${row.id}?tab=process`,
        })
      },
    },
  }
</script>
