<template>
  <section class="feedback-container">
    <!--数据表格-->
    <el-table :data="access" border="border" highlight-current-row v-loading="loading" style="margin-top: 20px;">
      <el-table-column label="序号" min-width="80">
        <template scope="scope">
          <span >{{ (pager.currentPage - 1) * pager.limit + (scope.$index + 1) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="反馈内容" min-width="180" >
        <template scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label='反馈人' min-width="180" >
        <template scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label='反馈时间' min-width="180" >
        <template scope="scope">
          {{ scope.row.ctime | moment}}
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="toolbar">
      <el-pagination
        class="pagination"
        v-if="true"
        layout="total, prev, pager, next, jumper"
        @current-change="pagination"
        :current-page = 'pager.currentPage'
        :page-size="pager.limit"
        :total="pager.total">
      </el-pagination>
    </div>
  </section>
</template>
<script>
  import moment from 'moment'
  export default {
    name: 'FeedBack',
    data () {
      return {
        pageList: [],
        keyword: [],
        loading: false,
        pager: {
          total: 0,
          limit: 15,
          currentPage: 1
        },
        access: []
      }
    },
    mounted () {
      this.getTableList()
    },
    methods: {
      // 查询
      query () {
        this.pager.currentPage = 1
        this.getTableList()
      },
      // 获取访问页面table列表
      getTableList () {
        let data = {}
        data.pageIndex = this.pager.currentPage
        data.pageSize = this.pager.limit
        this.loading = true
        this.$axios
          .post('/user/feedbackList', data)
          .then(res => {
            const { code, pager, data } = res
            if (code === 0) {
              this.access = data.list
              console.log(this.access)
              this.pager.total = parseInt(pager.total)
              this.pager.currentPage = parseInt(pager.page)
            }
            this.loading = false
          })
          .catch(e => {
            this.loading = false
          })
      },
      // 分页
      pagination (page) {
        this.pager.currentPage = page
        this.getTableList()
      }
    },
    filters: {
      moment (val) {
        return moment.unix(Number(val)).format('YYYY-MM-DD HH:mm')
      }
    }
  }
</script>
