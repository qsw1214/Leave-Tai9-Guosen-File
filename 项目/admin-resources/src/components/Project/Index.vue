<template>
  <section class="project-container">
    <!--查询条件-->
    <el-form :inline="true" label-position="left"  :model="form" class="toolbar">
      <el-row>
        <el-form-item label="融资项目">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query">查询</el-button>
        </el-form-item>
      </el-row>
    </el-form>

    <!--数据表格-->
    <el-table :data="access" border="border" highlight-current-row v-loading="loading">

      <el-table-column label="序号" min-width="80">
        <template scope="scope">
          <span>{{ (pager.currentPage - 1) * pager.limit + (scope.$index + 1) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目类型" min-width="180" >
        <template scope="scope">
          <el-tag type="gray" v-if="scope.row.type == '1'">融资项目</el-tag>
          <el-tag v-else>投资项目</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="项目名称" min-width="280" >
        <template scope="scope">
          <div><span>{{scope.row.name}}</span></div>
        </template>
      </el-table-column>
      <el-table-column label="当前状态" min-width="180" >
        <template scope="scope">
          <div><span>{{ scope.row.status == '1' ? '发布中' : '已下架'}}</span></div>
        </template>
      </el-table-column>
      <el-table-column label="项目主体" min-width="180" >
        <template scope="scope">
          <div><span>{{scope.row.company}}</span></div>
        </template>
      </el-table-column>
      <el-table-column prop="contactName" label="联系人" min-width="120" >
        <template scope="scope">
          <span>{{scope.row.contactName}}</span>
        </template>
      </el-table-column>
      <el-table-column label='项目金额' min-width="180" >
        <template scope="scope">
          {{scope.row.minAmount | exchange}} ~ {{scope.row.maxAmount | exchange}}
        </template>
      </el-table-column>
      <el-table-column label='发布时间' min-width="180" >
        <template scope="scope">
          {{ scope.row.ctime | moment}}
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="200">
        <template scope="scope">
          <el-button :plain="true" size="mini" type="info" @click.native="lookDetail(scope)">查看详情</el-button>
          <el-button  size="mini" type="danger" @click="option(scope)">删除</el-button>
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
    name: 'AllUser',
    data () {
      return {
        options: [{
          value: '-1',
          label: '所有项目'
        }, {
          value: '1',
          label: '融资项目'
        }, {
          value: '2',
          label: '投资项目'
        }],
        form: {
          type: '-1'
        },
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
      // 查看详情
      lookDetail (scope) {
        const id = scope.row.id
        this.$router.push('/project/' + id)
      },
      // 操作
      option (scope) {
        const projectId = scope.row.id
        this.$confirm('确认要删除该项目吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post('/project/del', {projectId}).then(res => {
            const { code } = res
            if (code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getTableList()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      },
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
        if (this.form.type !== '-1') {
          data.type = this.form.type
        }
        this.loading = true
        this.$axios
          .post('/project/list', data)
          .then(res => {
            const { code, data, pager } = res
            if (code === 0) {
              this.access = data.list
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
      },
      exchange (field) {
        if (parseInt(field) >= 10000) {
          field = (parseInt(field) / 10000).toFixed(2) + '亿'
        } else {
          field = parseInt(field) + '万'
        }
        return field
      }
    }
  }
</script>
