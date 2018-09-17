<template>
  <div class="uploader-container">
    <!--工具栏-->
    <ToolBar :company="company" @query="queryList"></ToolBar>
    <!--表格-->
    <div class="table-wrapper" :class="{ 'mt15': website != 0 }">
      <!--数据列表-->
      <el-table
        :data="unknowNameList"
        v-loading="loading">
        <el-table-column
          label="Excel压缩文件名">
          <template scope="scope">
            <span v-if="scope.row.zipName">{{ scope.row.zipName + '.zip' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Excel机构简称"
          prop="excelShortName">
        </el-table-column>
        <el-table-column
          v-if="website == 1"
          label="排排网机构简称"
          prop="ppShortName">
        </el-table-column>
        <el-table-column
          class-name="name"
          :label="companyShortName">
          <template scope="scope">
            <div>
              <el-select
                v-model="scope.row.newShortName"
                filterable
                remote
                clearable
                placeholder="请输入简称并选择"
                style="width: 180px;"
                :remote-method="remoteMethod"
                :loading="selectLoading">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="options" v-if="unknowNameList.length > 0">
        <el-button type="success" @click="submit">提交修改简称</el-button>
      </div>
      <div class="pager" v-if="unknowNameList.length > 0">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 15, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import ToolBar from './ToolBar.vue'
  export default {
    props: {
      website: {
        type: Number,
        required: true,
        default: 1
      }
    },
    name: 'Common',
    data () {
      return {
        loading: true,
        unknowNameList: [],
        options: [],
        currentPage: 1,
        pageSize: 15,
        total: 0,
        zipName: '',
        selectLoading: false
      }
    },
    created () {
      const zipName = this.$route.query.zipName
      this.zipName = zipName || ''
      this.getUnknowNameList()
    },
    methods: {
      // 根据Excel文件名查询
      queryList (keyword) {
        this.zipName = keyword
        this.currentPage = 1
        this.getUnknowNameList()
      },
      // 获取未知名称的列表
      getUnknowNameList () {
        this.loading = true
        let data = {
          type: this.website == 0 ? 1 : 2,
          zipName: this.zipName || '',
          pageNum: this.pageSize,
          page: this.currentPage
        }
        this.axios.post('/admin/FundCompanyScore/GetNotMarkList', data).then(res => {
          this.loading = false
          const { code, data } = res.data
          const { list, totalNum, page } = data
          if (code == 0) {
            list.forEach(item => {
              item.newShortName = ''
            })
            this.unknowNameList = list
            this.total = parseInt(totalNum)
            this.currentPage = parseInt(page)
          } else {
            this.unknowNameList = []
          }
        })
      },
      // 远程查询能够匹配的公司名称
      remoteMethod (query) {
        if (query !== '') {
          this.selectLoading = true
          setTimeout(() => {
            this.selectLoading = false
            this.axios.post('/admin/FundCompanyScore/GetThinkShortNameList', {type: this.website == 0 ? 1 : 2, keyword: query}).then(res => {
              const { code, error, data } = res.data
              const { list } = data
              if (code == 0) {
                this.options = list.map(item => {
                  return {
                    value: item,
                    label: item
                  }
                })
              }
            })
          }, 200)
        } else {
          this.options = []
        }
      },
      // 注释待补充
      changePage (page) {
        this.getUnknowNameList(page)
      },
      // 页面条数
      handleSizeChange (val) {
        this.pageSize = val
        this.getUnknowNameList()
      },
      // 当前页数
      handleCurrentChange (val) {
        this.currentPage = val
        this.getUnknowNameList()
      },
      // 提交变更
      submit () {
        const list = this.unknowNameList.filter(item => {
          return item.newShortName !== ''
        })
        if (list.length == 0) {
          this.$confirm('未对任何项目进行机构简称更改?', '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'error'
          })
        } else {
          let data = {}
          data.type = this.website == 0 ? 1 : 2
          data.list = list.map(item => {
            return {
              id: item.id,
              newShortName: item.newShortName
            }
          })
          const name = this.website == 0 ? '排排网' : '好买网'
          this.$confirm('此操作更改机构简称, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '检查下',
            type: 'warning'
          }).then(() => {
            this.$message({
              message: '成功更新其在的' + name + '机构名称。',
              type: 'success'
            })
            this.axios.post('/admin/FundCompanyScore/SaveShortName', data).then(res => {
              const { code, error, data } = res.data
              if (code == 0) {
                this.getUnknowNameList()
              }
            })
          }).catch((e) => {
            this.$message({
              message: '容我再仔细检查一遍。',
              type: 'warning'
            })
          })
        }
      }
    },
    components: {
      ToolBar
    },
    computed: {
      company () {
        const websiteName = ['排排网', '好买网']
        return websiteName[this.website]
      },
      companyShortName () {
        const websiteShortName = ['排排网', '好买网']
        return websiteShortName[this.website] + '机构简称'
      }
    }
  }
</script>


<style lang="scss" type="text/scss" rel="stylesheet/scss">
  .uploader-container {
    .table-wrapper {
      width: 780px;

      .name {
        .cell {
          padding: 10px 0px;
        }
      }
    }

    .mt15 {
      margin-top: 15px;
    }

    .options {
      text-align: center;
      margin: 20px 0px;
    }
  }
</style>
