<template>
  <!-- 数据修正 -->
  <div>

    <div
      class="block-margin-bottom"
      style="color: #999;">
      说明：输入查询条件，开始查询。
    </div>

    <div class="block-margin-bottom">
      <el-button
        type="primary"
        @click="multiFix">批量修正
      </el-button>
      <el-button
        @click="$router.push({ query: { history: 1 } })">查看历史修正记录
      </el-button>
    </div>

    <div class="block-margin-bottom">
      <el-date-picker
        value-format="yyyy-MM"
        type="month"
        v-model="month"
        :picker-options="monthOptions"
        @change="(cachedKeyword || keyword) && search()" />

      <el-input
        class="search"
        placeholder="输入经纪号、员工姓名或ID搜索"
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
      :data="showData"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="changePageIndex"
      @size-change="changePageSize">
      <template slot-scope="props">
        <el-table
          border
          stripe
          :max-height="props.maxHeight - 20"
          :data="props.data"
          @selection-change="selectionChange">
          <el-table-column
            type="selection"
            column-key="select"
            class-name="checkbox autotest-checkbox"
            align="center"
            width="75" />

          <el-table-column
            label="姓名"
            class-name="autotest-name"
            align="center"
            prop="name" />

          <el-table-column
            label="员工ID"
            class-name="autotest-emp_code"
            align="center"
            prop="emp_code" />

          <el-table-column
            label="所属组织"
            class-name="autotest-org_name"
            align="center"
            prop="org_name" />

          <el-table-column
            label="经纪号"
            class-name="autotest-broker_code"
            align="center"
            prop="broker_code" />

          <el-table-column
            label="日期"
            class-name="autotest-date"
            align="center"
            prop="date" />

          <el-table-column
            label="状态"
            class-name="autotest-status"
            align="center">
            <template slot-scope="scope">
              上午：{{ scope.row.status[0].on_status_name }}
              下午：{{ scope.row.status[1].off_status_name }}
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            fixed="right"
            width="75"
            class-name="autotest-options">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="$refs.fix.open(Object.assign(
                  {},
                  scope.row,
                  {name: `${scope.row.name}(${scope.row.emp_code})`}
                ))"
              >修正</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </m-table>

    <correction-fix
      ref="fix"
      @end="editEnd" />
  </div>
</template>

<script>
  import CorrectionFix from './CorrectionFix'

  export default {
    components: { CorrectionFix },
    data() {
      const { page, size, keyword, month } = this.$route.query
      const defaultMonth = () => {
        let m = new Date().getMonth()
        if (m <= 8) m = `0${m + 1}`
        if (m > 8) m += 1
        return `${new Date().getFullYear()}-${m}`
      }

      return {
        loading: false,
        data: [],
        showData: [],
        selectedItems: [],
        month: month || defaultMonth(),
        // cachedMonth: month || defaultMonth(),
        monthOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          },
        },
        keyword: keyword || '',
        cachedKeyword: keyword || '',
        currentPage: parseInt((page || 1), 10),
        pageSize: parseInt((size || 20), 10),
        total: 0,
      }
    },
    created() {
      if (this.month && this.keyword) this.getData()
    },
    methods: {
      // 获取列表数据
      async getData() {
        this.loading = true
        await this.$axios({
          url: this.$api.settings.attendance.recordList,
          params: {
            per_page: this.pageSize,
            page: this.currentPage,
            keywords: this.$utils.tools
              .splitKeyword(this.cachedKeyword).join(','),
            date: this.month,
          },
        }).then(({ code, data }) => {
          if (code === 0) {
            this.data = data.list
            this.total = data.count || 0
            this.showData = this.data
          }
        }).catch(() => {})
        this.loading = false
      },
      // 列表过滤搜索
      search() {
        if (!this.month) {
          return this.$message.error('请选择查询月份')
        } else if (!this.keyword) {
          return this.$message.error('请输入查询参数')
        }

        const { query } = this.$route

        this.$router.replace({
          query: Object.assign({}, query, {
            page: 1,
            keyword: this.keyword.trim(),
            month: this.month,
          }),
        })

        this.cachedKeyword = this.keyword.trim()
        // this.cachedMonth = this.month
        this.currentPage = 1
        this.getData()

        return true
      },
      // 翻页
      changePageIndex(value) {
        this.currentPage = value
        this.getData()
      },
      // 更改每页显示条数
      changePageSize(value) {
        this.pageSize = value
        this.currentPage = 1
        this.getData()
      },
      // 列表勾选回调
      selectionChange(items) {
        this.selectedItems = items
      },
      multiFix() {
        if (!this.selectedItems.length) {
          return this.$message.error('请勾选需要修正的数据')
        }
        const ids = this.selectedItems.map(_ => _.id)
        return this.$refs.fix.open({
          ids,
          name: [...new Set(this.selectedItems.map(_ => `${_.name}(${_.emp_code})`))]
            .join('、'),
        })
      },
      // 编辑完成
      editEnd(bool) {
        if (bool) this.getData()
      },
    },
  }
</script>
