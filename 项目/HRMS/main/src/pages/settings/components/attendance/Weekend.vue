<template>
  <!-- 周末设置 -->
  <div class="attendance-weekend">

    <div class="block-margin-bottom">
      <el-select
        class="set-part"
        v-model="setPart"
        @change="$nextTick(() => { $router.push('/attendance/holidays') })">
        <el-option
          label="节假日设置"
          value="节假日设置" />
        <el-option
          label="周末设置"
          value="周末设置" />
      </el-select>

      <el-date-picker
        class="set-part"
        value-format="yyyy"
        type="year"
        v-model="setYear"
        @change="search" />

      <el-input
        class="search"
        placeholder="输入日期进行搜索"
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
            label="周六/日"
            class-name="autotest-name"
            align="center"
            prop="name" />

          <el-table-column
            label="日期"
            class-name="autotest-start_date"
            align="center"
            prop="start_date" />

          <el-table-column
            label="休息"
            class-name="autotest-workday0"
            align="center">
            <template slot-scope="scope">
              <i
                class="el-icon-loading"
                v-if="scope.row.loading"
                :key="scope.row.id" />
              <el-checkbox
                v-else
                :key="scope.row.id"
                :checked="!scope.row.workday"
                :disabled="
                  scope.row.loading
                    || new Date(scope.row.start_date).getTime() <= Date.now()
                "
                @change="changeWorkday(scope.row)" />
            </template>
          </el-table-column>

          <el-table-column
            label="上班"
            class-name="autotest-workday1"
            align="center">
            <template slot-scope="scope">
              <i
                class="el-icon-loading"
                v-if="scope.row.loading"
                :key="scope.row.id" />
              <el-checkbox
                v-else
                :key="scope.row.id"
                :checked="!!scope.row.workday"
                :disabled="
                  scope.row.loading
                    || new Date(scope.row.start_date).getTime() <= Date.now()
                "
                @change="changeWorkday(scope.row)" />
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
      const { page, size, keyword, setPart, setYear } = this.$route.query
      const defaultYear = new Date().getFullYear().toString()

      return {
        loading: false,
        data: [],
        showData: [],
        selectedItems: [],
        setPart: setPart || '周末设置',
        setYear: setYear || defaultYear,
        // cachedSetPart: setPart || '周末设置',
        // cachedSetYear: setYear || defaultYear,
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
          url: this.$api.settings.attendance.weekendList,
          params: {
            per_page: this.pageSize,
            page: this.currentPage,
            keywords: this.$utils.tools
              .splitKeyword(this.cachedKeyword).join(','),
            year: this.setYear,
          },
        }).then(({ code, data }) => {
          if (code === 0) {
            this.data = data.list.map((_) => {
              _.loading = false
              return _
            })
            this.total = data.count || 0
            this.showData = this.data
          }
        }).catch(() => {})
        this.loading = false
      },
      // 列表过滤搜索
      search() {
        const { query } = this.$route
        const { setPart, setYear } = this

        this.$router.replace({
          query: Object.assign({}, query, {
            page: 1,
            keyword: this.keyword.trim(),
            setPart,
            setYear: setPart === '节假日设置' ? '' : setYear,
          }),
        })

        this.cachedKeyword = this.keyword.trim()
        // this.cachedSetPart = setPart
        // this.cachedSetYear = setYear

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
      // 修改
      async changeWorkday(row) {
        if (row.loading) return
        row.loading = true

        const data = { ...row }
        data.workday = 1 - row.workday
        data.type = 2
        delete data.loading

        // 数据提交
        try {
          const url = this.$api.settings.attendance.holidayEdit
          const { code, msg } = await this.$axios
            .post(url, data)
          // 失败
          if (code) await Promise.reject(msg)
          // 成功
          this.$emit('ok', '修改成功')
          row.workday = 1 - row.workday
        } catch (err) {
          console.log(err)
        }
        row.loading = false
      },
    },
  }
</script>

<style lang="scss">
.attendance-weekend {
  .set-part {
    margin-right: 10px;
    vertical-align: top;
  }
}
</style>
