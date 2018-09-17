<template>
  <div
    class="page page--employee-list">

    <m-breadcrumb :items="breadcrumb" />

    <el-row class="block-margin-bottom">
      <el-button
        icon="el-icon-upload2"
        :loading="exporting"
        @click="exporter">导出
      </el-button>

      <el-input
        class="search"
        placeholder="输入员工编码或名称进行查询"
        v-model="search"
        @keyup.enter.native="doSearch">
        <el-button
          icon="el-icon-search"
          slot="append"
          @click="doSearch" />
      </el-input>
    </el-row>

    <m-table
      is-full-table
      :loading="loading"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      :data="list"
      @current-change="pageChange"
      @size-change="sizeChange">
      <template slot-scope="props">
        <el-table
          border
          ref="multipleTable"
          :max-height="props.maxHeight"
          :data="list"
          @select="select"
          @select-all="selectAll">

          <el-table-column
            align="center"
            width="75"
            class-name="checkbox"
            type="selection" />

          <el-table-column
            align="center"
            prop="emp_code"
            label="员工编码" />

          <el-table-column
            align="center"
            prop="name"
            label="姓名" />

          <el-table-column
            align="center"
            prop="job"
            label="职位" />

          <el-table-column
            align="center"
            prop="enter_date"
            label="入职时间" />

          <el-table-column
            align="center"
            prop="mobile"
            label="手机号码" />

          <el-table-column
            align="center"
            prop="status_name"
            label="员工状态" />

        </el-table>
      </template>
    </m-table>
  </div>
</template>

<script>
  export default {
    name: 'EmployeeList',

    data() {
      const { query, params } = this.$route
      const { page, size, keyword } = query
      const department = {
        id: params.id,
        name: query.name,
      }

      return {
        department,
        breadcrumb: [
          { name: '组织管理' },
          { name: '组织维护', to: '/query' },
          { name: department.name, to: `/department/${department.id}` },
          { name: '员工列表' },
        ],
        search: keyword || '',
        keywords: keyword || '',
        list: [],
        loading: false,
        total: 0,
        currentPage: parseInt((page || 1), 10),
        pageSize: parseInt((size || 20), 10),
        selection: [],
        exporting: false,
      }
    },

    mounted() {
      this.fetch()
    },

    methods: {
      filterStatus(data) {
        const status = parseInt(data, 10)
        let res

        switch (status) {
        case 1:
          res = '正式'
          break
        case 2:
          res = '试用'
          break
        case 3:
          res = '实习'
          break
        default:
          //
        }

        return res
      },

      fetch() {
        const { currentPage, pageSize, department, keywords } = this

        if (this.loading) return
        this.loading = true

        this.$axios.get(this.$api.organization.user.list, {
          params: {
            org_id: department.id,
            page: currentPage,
            per_page: pageSize,
            keywords,
          },
        })
          .then((res) => {
            const { data } = res
            const { count, list } = data

            this.total = count
            this.list = list
          })
          .catch(() => {})
          .then(() => {
            this.loading = false
          })
      },

      pageChange(page) {
        this.currentPage = page
        this.fetch()
      },

      sizeChange(size) {
        this.pageSize = size
        this.currentPage = 1
        this.fetch()
      },

      select(selection) {
        this.selection = selection
      },

      selectAll(selection) {
        this.selection = selection
      },

      doSearch() {
        const { query } = this.$route

        this.$router.replace({
          query: Object.assign({}, query, { page: 1, keyword: this.search.trim() }),
        })
        this.keywords = this.$utils.tools.splitKeyword(this.search).join(',')
        this.currentPage = 1
        this.fetch()
      },

      exporter() {
        const { selection, keywords, department, exporting } = this
        const ids = selection.map(item => item.id)

        if (exporting) return
        this.exporting = true

        this.$axios
          .post(this.$api.organization.user.multiSelect, {
            ids,
            keywords,
            org_id: department.id,
            type: 'export',
          })
          .then((res) => {
            this.$utils.tools.windowOpen(res.data.url, '员工列表')
          })
          .catch(() => {})
          .then(() => {
            this.exporting = false
          })
      },
    },
  }
</script>
