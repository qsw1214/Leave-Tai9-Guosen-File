<template>
  <!-- 班次 -->
  <div>

    <div class="block-margin-bottom">
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="$router.push('/attendance/shifts/edit')">新建
      </el-button>
      <el-button
        icon="el-icon-delete"
        @click="delHandler">删除
      </el-button>

      <el-input
        class="search"
        placeholder="输入班次名称进行搜索"
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
          @row-dblclick="gotoDet"
          @selection-change="selectionChange">
          <el-table-column
            type="selection"
            column-key="select"
            class-name="checkbox autotest-checkbox"
            align="center"
            width="75" />

          <el-table-column
            label="班次编码"
            class-name="autotest-code"
            align="center"
            prop="code" />

          <el-table-column
            label="班次名称"
            class-name="autotest-name"
            align="center"
            prop="name" />

          <el-table-column
            label="是否默认班次"
            class-name="autotest-default_name"
            align="center"
            prop="default_name" />

          <el-table-column
            label="上班时间"
            class-name="autotest-on_time"
            align="center"
            prop="on_time" />

          <el-table-column
            label="下班时间"
            class-name="autotest-off_time"
            align="center"
            prop="off_time" />

          <el-table-column
            label="备注"
            class-name="autotest-remark"
            align="center"
            prop="remark" />

          <el-table-column
            label="操作"
            align="center"
            fixed="right"
            width="75"
            class-name="autotest-options">
            <template slot-scope="scope">
              <el-button
                type="text"
                icon="el-icon-edit"
                @click="$router.push(`/attendance/shifts/edit/${scope.row.id}`)" />
            </template>
          </el-table-column>
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
          url: this.$api.settings.attendance.scheduleList,
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
      // 去详情
      gotoDet(row) {
        const ids = this.data.map(item => item.id)
        this.$store.dispatch('updateShiftsIds', { ids })
        this.$router.push(`/attendance/shifts/details/${row.id}`)
      },
      // 删除
      delHandler() {
        if (this.selectedItems.length === 0) {
          this.$message.error('请勾选需要删除的数据')
          return
        }
        this.$confirm('确认删除选中数据？', '提示', {
          type: 'warning',
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          showCancelButton: true,
        }).then(() => {
          this.sendSelected('del', null, this.getData)
        }).catch(() => {})
      },
      // 发送勾选请求
      async sendSelected(type, status, callback) {
        let ids = []
        if (this.selectedItems.length > 0) {
          ids = this.selectedItems.map(item => item.id)
        }

        const url = this.$api.settings.attendance.scheduleDel

        this.loading = true
        await this.$axios({
          url,
          method: 'post',
          data: { ids: ids.join(',') },
        }).then((data) => {
          if (data.code === 0) callback(data)
        }).catch(() => {})
        this.loading = false
      },
    },
  }
</script>
