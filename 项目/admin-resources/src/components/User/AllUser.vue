<template>
  <section class="user-container">
    <!--查询条件-->
    <el-form :inline="true" label-position="left"  :model="form" class="toolbar">
      <el-row>
        <el-form-item label="用户状态">
          <el-select v-model="form.status" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付费状态" v-if="form.status == 4">
          <el-select v-model="form.payFlag" placeholder="请选择">
            <el-option
              v-for="item in payOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query">查询</el-button>
        </el-form-item>
      </el-row>
    </el-form>

    <!--数据表格-->
    <el-table :data="userList" border="border" highlight-current-row v-loading="loading">

      <el-table-column label="序号" min-width="80">
        <template scope="scope">
          <span >{{ (pager.currentPage - 1) * pager.limit + (scope.$index + 1) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户状态" min-width="180" >
        <template scope="scope">
          <el-tag v-if="scope.row.status == '2'">已作废</el-tag>
          <el-tag v-if="scope.row.status == '4'" type="primary">已审核</el-tag>
          <el-tag v-if="scope.row.payFlag == '1'" type="success">已付费</el-tag>
          <el-tag v-if="scope.row.status == '3'" type="danger">待审核</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="联系人" min-width="200" >
      </el-table-column>
      <el-table-column label="职位" min-width="180" >
        <template scope="scope">
          <span>{{ scope.row.position }}</span>
        </template>
      </el-table-column>
      <el-table-column label='注册时间' min-width="180" >
        <template scope="scope">
          {{ scope.row.registTime | moment}}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="200">
        <template scope="scope">
          <el-button :plain="true" size="mini" type="info" @click.native="lookDetails(scope)">查看详情</el-button>
          <el-button :plain="true" size="mini" type="danger" @click.native="option('void', scope)" v-if="scope.row.status != '2'">作废</el-button>
          <el-button  size="mini" type="success" @click.native="option('upgrade', scope)" v-if="scope.row.status == '4' && scope.row.payFlag == '0'">升级为付费会员</el-button>
          <!--<el-button  size="mini" type="success" @click.native="option('upgrade', scope)">升级为付费会员</el-button>-->
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
    <el-dialog title="用户信息"
               :visible.sync="dialogFormVisible"
               custom-class="small"
               size="tiny">
      <div class="loading" v-if="isDetailLoading" style="text-align: center">加载中</div>
      <el-form :model="detail" label-width="80px" v-if="!isDetailLoading">
        <el-form-item label="姓名">
          <el-input v-model="detail.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="detail.sex" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="职位">
          <el-input v-model="detail.position" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="detail.mobile" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="detail.email" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="微信">
          <el-input v-model="detail.wxid" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="所在公司">
          <el-input v-model="detail.company" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="个人名片">
          <a :href="detail.businessCard" target="_blank" v-if="detail.businessCard">
            <img :src="detail.businessCard" alt="个人名片" class="card">
          </a>
          <p v-else style="line-height: 1; margin: 0px; padding-top: 11px;">尚未上传个人名片</p>
        </el-form-item>
      </el-form>
    </el-dialog>
  </section>
</template>
<script>
  import moment from 'moment'
  export default {
    name: 'AllUser',
    data () {
      return {
        options: [
          {
            value: '-1',
            label: '所有用户'
          },
          {
            value: '3',
            label: '待审核'
          },
          {
            value: '4',
            label: '已审核'
          },
          {
            value: '2',
            label: '已作废'
          }
        ],
        payOptions: [
          {
            value: '-1',
            label: '不限'
          },
          {
            value: '0',
            label: '非付费用户'
          },
          {
            value: '1',
            label: '付费用户'
          }
        ],
        form: {
          status: '-1',
          payFlag: '-1'
        },
        dialogFormVisible: false,
        loading: false,
        pager: {
          total: 0,
          limit: 15,
          currentPage: 1
        },
        detail: {},
        isDetailLoading: false,
        userList: []
      }
    },
    mounted () {
      this.getUserList()
    },
    methods: {
      // 查询
      query () {
        this.pager.currentPage = 1
        this.getUserList()
      },
      // 获取访问页面table列表
      getUserList () {
        let params = {}
        params.pageIndex = this.pager.currentPage
        params.pageSize = this.pager.limit
        if (this.form.status !== '-1') {
          params.status = this.form.status
          if (params.status === '4') {
            if (this.form.payFlag !== '-1') {
              params.payFlag = this.form.payFlag
            }
          }
        }
        this.loading = true
        this.$axios
          .post('/user/list', params)
          .then(res => {
            const { code, data, pager } = res
            if (code === 0) {
              this.userList = data.list
              this.pager.total = parseInt(pager.total)
              this.pager.currentPage = parseInt(pager.page)
            }
            this.loading = false
          })
          .catch(e => {
            this.loading = false
          })
      },
      // 查看详情
      lookDetails (scope) {
        this.dialogFormVisible = true
        const uid = scope.row.id
        this.isDetailLoading = true
        this.$axios.post('/user/detail', {uid}).then(res => {
          this.isDetailLoading = false
          const { code, data } = res
          if (code === 0) {
            data.detail.sex = data.detail.sex === '1' ? '男' : '女'
            this.detail = data.detail
          }
        })
      },
      // 分页
      pagination (page) {
        this.pager.currentPage = page
        this.getUserList()
      },
      // 操作
      option (option, scope) {
        let msg = ''
        let apiUrl = ''
        let data = {}
        data.uid = scope.row.id
        switch (option) {
          case 'void':
            apiUrl = '/user/verify'
            msg = '确认要作废此用户？'
            data.status = 2
            break
          case 'upgrade':
            apiUrl = '/user/markPay'
            msg = '确认升级该用户为付费用户？'
            data.payFlag = 1
            break
          default:
        }
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post(apiUrl, data).then(res => {
            const { code } = res
            if (code === 0) {
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
              this.getUserList()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      }
    },
    filters: {
      moment (val) {
        return moment.unix(Number(val)).format('YYYY-MM-DD HH:mm')
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .user-container {
    .small {
      width: 480px;
    }
  }

  .card {
    max-width: 460px;
    max-height: 200px;
  }
</style>
