<template>
  <!-- 数据修正历史 -->
  <div>

    <div class="block-margin-bottom">
      <el-button
        icon="el-icon-upload2"
        @click="handleExport">导出
      </el-button>
      <el-button
        @click="$router.go(-1)">返回
      </el-button>

      <el-input
        class="search"
        placeholder="输入员工姓名或ID搜索"
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
            label="修正记录"
            class-name="autotest-record"
            align="center">
            <template slot-scope="scope">
              {{ getRecordText(scope.row.record) }}
            </template>
          </el-table-column>

          <el-table-column
            label="操作人"
            class-name="autotest-fixed_user"
            align="center"
            prop="fixed_user" />

          <el-table-column
            label="操作时间"
            class-name="autotest-fixed_time"
            align="center"
            prop="fixed_time" />
        </el-table>
      </template>
    </m-table>
  </div>
</template>

<script>
  export default {
    data() {
      const { page, size, keyword } = this.$route.query

      return {
        loading: false,
        operating: false,
        data: [],
        showData: [],
        selectedItems: [],
        keyword: keyword || '',
        cachedKeyword: keyword || '',
        currentPage: parseInt((page || 1), 10),
        pageSize: parseInt((size || 20), 10),
        total: 0,
      }
    },
    created() {
      this.getData()
    },
    methods: {
      // 获取列表数据
      async getData() {
        this.loading = true
        await this.$axios({
          url: this.$api.settings.attendance.recordHistory,
          params: {
            per_page: this.pageSize,
            page: this.currentPage,
            keywords: this.$utils.tools
              .splitKeyword(this.cachedKeyword).join(','),
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
        const { query } = this.$route

        this.$router.replace({
          query: Object.assign({}, query, {
            page: 1,
            keyword: this.keyword.trim(),
          }),
        })

        this.cachedKeyword = this.keyword.trim()
        this.currentPage = 1
        this.getData()
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
      // 获取显示文本
      getRecordText(record) {
        return record.map((re) => {
          if (re.on_status_name) return `上午修正为${re.on_status_name}`
          if (re.off_status_name) return `下午修正为${re.off_status_name}`
          return ''
        }).join('，')
      },
      // 导出操作
      handleExport() {
        if (this.operating) return

        const ids = this.selectedItems.map(item => item.id)
        this.operating = true
        this.$axios
          .post(this.$api.settings.attendance.recordHistoryExport, {
            ids: ids.join(','),
            keywords: this.$utils.tools
              .splitKeyword(this.cachedKeyword).join(','),
          })
          .then((res) => {
            const { url } = res.data
            this.$utils.tools.windowOpen(url)
          })
          .catch(() => {})
          .then(() => {
            this.operating = false
          })
      },
    },
  }
</script>
