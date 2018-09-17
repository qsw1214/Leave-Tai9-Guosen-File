<template>
  <!-- 节假日设置 -->
  <div class="attendance-holidays">

    <div class="block-margin-bottom">
      <el-select
        class="set-part"
        v-model="setPart"
        @change="$nextTick(() => $router.push('/attendance/holidays?weekend=1'))">
        <el-option
          label="节假日设置"
          value="节假日设置" />
        <el-option
          label="周末设置"
          value="周末设置" />
      </el-select>

      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="edit()">新建
      </el-button>
      <el-button
        icon="el-icon-delete"
        @click="delHandler">删除
      </el-button>

      <el-input
        class="search"
        placeholder="输入节假日名称进行搜索"
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
            width="75"
            :selectable="selectable" />

          <el-table-column
            label="节假日名称"
            class-name="autotest-name"
            align="center"
            prop="name" />

          <el-table-column
            label="开始日期"
            class-name="autotest-start_date"
            align="center"
            prop="start_date" />

          <el-table-column
            label="结束日期"
            class-name="autotest-end_date"
            align="center"
            prop="end_date" />

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
                :disabled="
                  new Date(scope.row.start_date).getTime()
                    <= Date.now()
                "
                @click="edit(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      </template>
    </m-table>

    <holidays-edit
      ref="edit"
      @end="editEnd" />
  </div>
</template>

<script>
  import HolidaysEdit from './HolidaysDialog'

  export default {
    components: { HolidaysEdit },
    data() {
      const { page, size, keyword, setPart } = this.$route.query

      return {
        loading: false,
        data: [],
        showData: [],
        selectedItems: [],
        setPart: setPart || '节假日设置',
        cachedSetPart: setPart || '节假日设置',
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
          url: this.$api.settings.attendance.holidayList,
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
        const { setPart } = this

        this.$router.replace({
          query: Object.assign({}, query, {
            page: 1,
            keyword: this.keyword.trim(),
            setPart,
          }),
        })

        this.cachedKeyword = this.keyword.trim()
        this.cachedSetPart = setPart
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

      // 点击修改
      edit(id) {
        this.$refs.edit.open(id)
      },

      // 编辑完成
      editEnd(bool) {
        if (bool) this.getData()
      },

      // selectable
      selectable(row) {
        return new Date(row.start_date).getTime()
          > Date.now()
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

        const url = this.$api.settings.attendance.holidayDel

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

<style lang="scss">
.attendance-holidays {
  .set-part {
    margin-right: 10px;
    vertical-align: top;
  }
}
</style>
