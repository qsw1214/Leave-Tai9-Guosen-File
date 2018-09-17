<template>
  <section class="user-container">
    <!--数据表格-->
    <el-table :data="userList" border="border" highlight-current-row v-loading="loading" style="margin-top: 20px;">

      <el-table-column label="序号" min-width="80">
        <template scope="scope">
          <span >{{ (pager.currentPage - 1) * pager.limit + (scope.$index + 1) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="联系人" min-width="200" >
      </el-table-column>
      <el-table-column label="职位" min-width="180" >
        <template scope="scope">
          <span>{{ scope.row.position }}</span>
        </template>
      </el-table-column>
      <el-table-column  label="联系电话" min-width="200" >
        <template scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="contactName" label="微信号" min-width="200" >
        <template scope="scope">
          <span>{{ scope.row.wxid }}</span>
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
          <el-button size="mini" type="success" @click.native="option(scope)">审核通过</el-button>
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
//        3 / 4
        params.status = 3
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
      option (scope) {
        this.$confirm('确认通过此用户的申请？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post('/user/verify', {uid: scope.row.id, status: 4}).then(res => {
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
