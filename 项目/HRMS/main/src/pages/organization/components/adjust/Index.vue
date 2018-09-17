<template>
  <div class="page page-adjust-index">

    <m-breadcrumb :items="breadcrumb" />

    <div class="block-margin-bottom">
      <el-button @click="clickSkip('/adjust/higher/change')">上级组织变更</el-button>
      <el-button @click="clickSkip('/adjust/merge')">组织合并</el-button>
      <el-button @click="clickSkip('/adjust/split')">组织拆分</el-button>
      <el-input
        class="search"
        placeholder="输入调整方案名称进行查询"
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
      :loading="loading"
      :data="data"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      @size-change="changeSize"
      @current-change="changePage">
      <template slot-scope="props">
        <el-table
          border
          stripe
          :max-height="props.maxHeight"
          :data="props.data"
          @row-dblclick="handleRowClick">
          <el-table-column
            label="调整方案"
            align="center"
            class-name="autotest-name"
            prop="name" />

          <el-table-column
            label="调整类型"
            align="center"
            class-name="autotest-typeName"
            prop="type_name" />

          <el-table-column
            label="生效日期"
            align="center"
            class-name="autotest-validDate"
            prop="valid_date" />

          <el-table-column
            label="流程状态"
            align="center"
            class-name="autotest-statusName"
            prop="status_name" />

          <el-table-column
            width="75"
            fixed="right"
            class-name="autotest-option"
            align="center"
            label="操作"
            v-if="$permission.valid(1010001)">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleRowClick(scope.row)">{{
                  scope.row.status ? '查看' : '重新提交'
                }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </m-table>

  </div>
</template>

<script>
  /**
   * @description 组织调整首页
   */

  export default {
    name: 'AdjustIndex',
    data() {
      const { keyword, page, size } = this.$route.query

      return {
        breadcrumb: [
          { name: '组织管理' },
          { name: '组织调整' },
        ],
        loading: false,
        data: [],
        keyword: keyword || '',
        cachedKeyword: '',
        pageSize: parseInt((size || 20), 10),
        currentPage: parseInt((page || 1), 10),
        total: 0,
        // 弹窗显示流程信息，暂未使用
        showFlow: false,
        flowTitle: '',
        currentItem: {},
        itemFlowData: {},
      }
    },
    created() {
      this.getData()
    },
    methods: {
      getData() {
        if (this.loading) return
        this.loading = true
        this.$axios({
          url: this.$api.organization.adjustList,
          params: {
            page: this.currentPage,
            per_page: this.pageSize,
            keywords: this.$utils.tools
              .splitKeyword(this.keyword.trim()).join(','),
          },
        }).then((data) => {
          this.loading = false
          switch (data.code) {
          case 0:
            this.data = data.data.list
            this.total = data.data.count
            break
          default:
            this.$message({
              message: data.msg,
              type: 'error',
            })
            break
          }
        }).catch(() => {
          this.loading = false
        })
      },
      clickItem(item) {
        this.currentItem = item
        this.showFlow = true
      },
      // 搜索
      search() {
        const { query } = this.$route

        this.$router.replace({
          query: Object.assign({}, query, { page: 1, keyword: this.keyword.trim() }),
        })

        this.currentPage = 1
        this.getData()
      },
      handleRowClick(row) {
        switch (row.type) {
        case '100001':
          this.$router.push({
            path: `/adjust/higher/${row.status ? 'detail' : 'change'}/${row.id}/${row.status}`,
          })
          break
        case '100002':
          this.$router.push({
            path: `/adjust/merge/${row.status ? 'detail/' : ''}${row.id}/${row.status}`,
          })
          break
        case '100003':
          this.$router.push({
            path: `/adjust/split/${row.status ? 'detail/' : ''}${row.id}/${row.status}`,
          })
          break
        default:
          break
        }
      },
      // 跳转
      clickSkip(path) {
        this.$router.push({
          path,
        })
      },
      // 更改每页显示条数
      changeSize(value) {
        this.pageSize = value
        this.currentPage = 1
        this.getData()
      },
      // 翻页
      changePage(value) {
        this.currentPage = value
        this.getData()
      },
    },
  }
</script>
