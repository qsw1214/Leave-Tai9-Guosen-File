<template>
  <div>

    <div class="block-margin-bottom">
      <el-button
        v-permission="1040003"
        icon="el-icon-upload2"
        @click="clickExport">导出
      </el-button>

      <el-input
        class="search"
        placeholder="输入流程名称或申请人搜索"
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
          @row-dblclick="clickDetials"
          @selection-change="selectionChange">
          <el-table-column
            type="selection"
            column-key="select"
            align="center"
            class-name="checkbox autotest-checkbox"
            width="75" />

          <el-table-column
            label="流程类型"
            class-name="autotest-flowType"
            align="center"
            width="120"
            prop="flow_config_type_name" />

          <el-table-column
            label="流程名称"
            align="center"
            width="120"
            class-name="autotest-flowName"
            prop="name" />

          <el-table-column
            label="流程编码"
            align="center"
            width="120"
            class-name="autotest-flowCode"
            prop="code" />

          <el-table-column
            label="申请人"
            align="center"
            width="120"
            class-name="autotest-applierName"
            prop="applier_name" />

          <el-table-column
            label="员工ID"
            align="center"
            width="90"
            class-name="autotest-applierId"
            prop="applier_emp_code" />

          <el-table-column
            label="部门"
            align="center"
            width="120"
            class-name="autotest-applierOrgName"
            prop="applier_org_name" />

          <el-table-column
            label="职位名称"
            align="center"
            width="120"
            class-name="autotest-applierJobName"
            prop="applier_job_name" />

          <el-table-column
            label="申请日期"
            class-name="autotest-applyDate"
            align="center"
            width="100"
            prop="apply_date" />

          <el-table-column
            label="流程状态"
            align="center"
            class-name="autotest-statusName"
            width="90"
            prop="status_name" />

          <el-table-column
            label="审批节点"
            align="center"
            width="120"
            class-name="autotest-approvalerNames"
            prop="approvaler_names" />

          <el-table-column
            label="操作"
            align="center"
            fixed="right"
            width="75"
            class-name="autotest-options"
            prop="name"
            v-if="$permission.valid('1040003,1040004')">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="clickDetials(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </m-table>
  </div>
</template>

<script>
  /*
  * @description 流程管理 > 流程监控
  * @route /process/index/monitor
  */
  import flowMap from '@/components/flowMap'

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
        operating: false,
      }
    },
    created() {
      this.getData()
    },
    methods: {
      // 获取数据
      getData() {
        this.loading = true
        this.$axios({
          url: this.$api.settings.process.monitor,
          params: {
            per_page: this.pageSize,
            page: this.currentPage,
            keywords: this.$utils.tools.splitKeyword(this.keyword).join(','),
          },
        })
          .then(({ code, data }) => {
            this.loading = false
            if (code === 0) {
              this.data = data.list
              this.total = data.count
              this.showData = this.data
            }
          }).catch(() => {
            this.loading = false
          })
      },
      // 列表勾选回调
      selectionChange(items) {
        this.selectedItems = items
      },
      // 查找
      search() {
        const { query } = this.$route

        this.$router.replace({
          query: Object.assign({}, query, { page: 1, keyword: this.keyword.trim() }),
        })

        this.cachedKeyword = this.keyword.trim()
        this.currentPage = 1
        this.getData()
      },
      // 点击导出
      clickExport() {
        if (this.operating) return
        this.operating = true
        const ids = this.selectedItems.map(item => item.id)
        this
          .$axios({
            url: this.$api.settings.process.monitorSelected,
            method: 'post',
            data: {
              ids: ids.join(','),
              type: 'monitor_export',
              keywords: this.$utils.tools.splitKeyword(this.cachedKeyword).join(','),
            },
          })
          .then(({ data }) => {
            this.$utils.tools.windowOpen(data.url)
          })
          .catch(() => {})
          .then(() => {
            this.operating = false
          })
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
      // 查看详情
      clickDetials(row) {
        const code = String(row.flow_config_code)
        let path = ''
        let pathname = ''
        const from = encodeURIComponent(`${window.location.pathname}${window.location.hash}`)

        switch (code) {
        case '200013':
        case '200014':
        case '200015':
        case '200016':
        case '200017':
          path = `/${flowMap[code]}/application/${code}/${row.id}`
          pathname = process.env.NODE_ENV !== 'development'
            ? '/web/employee.html'
            : '/employee.html'
          break
        case '200018':
        case '200019':
        case '200020':
        case '200021':
        case '200022':
        case '200023':
          path = `/attendance/application/${flowMap[code]}/${code}/${row.id}`
          pathname = process.env.NODE_ENV !== 'development'
            ? '/web/services.html'
            : '/services.html'
          break
        default:
          path = `/application/${flowMap[code]}/${code}/${row.id}`
          pathname = process.env.NODE_ENV !== 'development'
            ? '/web/services.html'
            : '/services.html'
          break
        }
        window.location.href = `${pathname}#${path}?from=${from}`
      },
    },
  }
</script>
