<template>
  <section
    v-loading.fullscreen.lock="preloading"
    class="page page__query">

    <m-breadcrumb :items="breadcrumb" />

    <div
      class="page--body">

      <!--options-->
      <el-row class="block-margin-bottom">
        <el-col
          :span="16">
          <el-button
            v-permission="1010001"
            type="primary"
            icon="el-icon-plus"
            @click.native="handleOption('add')">新建
          </el-button>
          <el-button
            v-permission="1010001"
            icon="el-icon-download"
            @click.native="handleOption('import')">导入
          </el-button>
          <el-button
            v-permission="1010001"
            icon="el-icon-upload2"
            @click.native="handleOption('export')">导出
          </el-button>
          <el-button
            v-permission="1010001"
            icon="el-icon-delete"
            @click.native="handleOption('del')">删除
          </el-button>
        </el-col>
        <el-col
          class="program"
          :span="8">
          <div
            v-permission="'1010001,1010002'"
            class="item"
            @click="$router.push('/organization')">
            <icon-gr />组织架构图
          </div>
        </el-col>
      </el-row>

      <!--table-->
      <div
        class="block-margin-bottom">
        <m-cascader
          placeholder="请选择组织机构"
          ref="cascader"
          :organization.sync="organization"
          :width="240"
          @fetchCompleted="init"
          @selectCompleted="selectCompleted" />

        <el-input
          class="search"
          placeholder="输入组织编码或名称进行查询"
          v-model="keyword"
          @keyup.enter.native="handleFilter">
          <el-button
            icon="el-icon-search"
            slot="append"
            @click="handleFilter" />
        </el-input>
      </div>

      <m-table
        is-pagination
        is-full-table
        :loading="loading"
        :data="currentList"
        v-bind="pagination"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange">
        <template slot-scope="props">
          <el-table
            border
            stripe
            :data="props.data"
            :max-height="props.maxHeight"
            @row-dblclick="handleRowClick"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              align="center"
              class-name="checkbox autotest-checkbox"
              width="75" />

            <el-table-column
              label="组织编码"
              align="center"
              class-name="autotest-code"
              prop="code"
              min-width="120" />

            <el-table-column
              label="组织名称"
              class-name="autotest-name"
              align="center"
              prop="name"
              min-width="200" />

            <el-table-column
              label="简称"
              align="center"
              class-name="autotest-shortName"
              prop="short_name"
              min-width="120" />

            <el-table-column
              label="上级组织"
              align="center"
              prop="pname"
              class-name="autotest-pname"
              min-width="200" />

            <el-table-column
              label="组织层级"
              align="center"
              class-name="autotest-levelName"
              prop="level_name"
              min-width="120" />

            <el-table-column
              label="组织属性"
              align="center"
              class-name="autotest-flagName"
              prop="flag_name"
              min-width="120" />

            <el-table-column
              label="组织类型"
              align="center"
              prop="type_name"
              class-name="autotest-typeName"
              min-width="120" />

            <el-table-column
              label="所属中心成本中心"
              align="center"
              prop="legal_entity_name"
              class-name="autotest-legalEntityName"
              min-width="220" />

            <el-table-column
              label="负责人"
              align="center"
              prop="leader_name"
              class-name="autotest-leaderName"
              min-width="120" />

            <el-table-column
              label="分管领导"
              align="center"
              prop="charge_name"
              class-name="autotest-chargeName"
              min-width="120" />

            <el-table-column
              label="部门编制"
              align="center"
              class-name="autotest-empCount"
              min-width="120">
              <template slot-scope="scope">
                {{ scope.row.emp_count }}人
              </template>
            </el-table-column>

            <el-table-column
              label="所属条线"
              align="center"
              class-name="autotest-line"
              min-width="120">
              <template slot-scope="scope">
                {{ scope.row.line }}
              </template>
            </el-table-column>

            <el-table-column
              label="联系人"
              align="center"
              prop="contacts_name"
              class-name="autotest-contactsName"
              min-width="120" />

            <el-table-column
              label="地址信息"
              align="center"
              class-name="autotest-address"
              prop="address"
              min-width="200" />

            <el-table-column
              width="75"
              fixed="right"
              class-name="autotest-option"
              align="center"
              label="操作"
              v-if="$permission.valid(1010001)">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  icon="el-icon-edit"
                  @click="handleOption(
                    'edit',
                    scope.row
                  )" />
              </template>
            </el-table-column>
          </el-table>
        </template>
      </m-table>

      <!--Dialog-->
      <m-import
        :upload-excel-url="uploadExcelUrl"
        :template-download-url="templateDownloadUrl"
        :show-import.sync="dialogVisible"
        @completed="handleCompleted"
        @completedPart="handleCompleted" />
    </div>
  </section>
</template>

<script>
  /**
   * A query page in organization.
   * Created on 2017/8/28
   * @namespace query
   * @module components/query/index
   * @author Yangleilei
   */

  import iconGr from './icon-gr'

  export default {
    name: 'OrgQuery',
    components: { iconGr },
    data() {
      const templateDownloadUrl = this.$api.organization.downloadExcel
      const uploadExcelUrl = this.$api.organization.uploadExcel
      const { page, size, keyword, organization } = this.$route.query

      return {
        breadcrumb: [
          { name: '组织管理' },
          { name: '组织维护' },
        ],
        preloading: true,
        loading: false,
        organization: [organization],
        oldOrganization: [organization],
        totalList: [],
        currentList: [],
        keyword: keyword || '',
        // 点击搜索后缓存 keyword，供导出使用
        cachedKeyword: keyword || '',
        multipleSelection: [],
        pagination: {
          pageSize: parseInt((size || 20), 10),
          currentPage: parseInt((page || 1), 10),
          total: 0,
        },
        dialogVisible: false,
        // 静默处理用于弹窗后的刷新
        slient: false,
        uploadExcelUrl,
        templateDownloadUrl,
        operating: false,
      }
    },
    methods: {
      // 选择级联列表后查询
      selectCompleted() {
        const { oldOrganization, organization } = this

        if (oldOrganization !== organization) {
          const { query } = this.$route

          this.$router.replace({
            query: Object.assign({}, query, {
              organization: organization[organization.length - 1],
            }),
          })

          this.fetchOrganization()
          this.oldOrganization = organization
        }
      },
      // 请求当前选中组织下的组织
      fetchOrganization() {
        if (!this.slient) this.loading = true
        const length = this.organization.length - 1
        this.$axios
          .post(this.$api.organization.maintainList, {
            id: this.organization[length],
          })
          .then((res) => {
            this.loading = false
            this.slient = false
            this.totalList = res.data.list
            this.showCurrentList()
          })
          .catch((error) => {
            this.loading = false
            this.slient = false
            console.dir(error)
          })
      },
      // 筛选条件自动后调用相当于init
      init(data) {
        const initId = data[0].id || ''
        this.organization = [initId]
        this.oldOrganization = [initId]
        this.$nextTick(() => {
          const { organization } = this.$route.query

          if (organization) {
            this.organization.push(organization)
            this.oldOrganization.push(organization)
          }
          this.preloading = false
          this.fetchOrganization()
        })
      },
      // 多选操作
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      // 分页页面变动处理函数
      handleCurrentChange(page) {
        this.pagination.currentPage = page
        this.showCurrentList()
      },
      // 分页条目数发生变化
      handleSizeChange(number) {
        this.pagination.pageSize = number
        this.pagination.currentPage = 1
        this.showCurrentList()
      },
      // 对查询结果本地过滤操作
      handleFilter() {
        const { query } = this.$route

        this.$router.replace({
          query: Object.assign({}, query, { page: 1, keyword: this.keyword }),
        })
        this.pagination.currentPage = 1
        this.cachedKeyword = this.keyword
        this.showCurrentList()
      },
      // 确认选择的条目数
      checkSelectionNumber() {
        const { length } = this.multipleSelection
        if (length === 0) {
          this.$message.error('请勾选需要删除的组织')
          return true
        }
        return false
      },
      // 删除操作
      handleDelete() {
        const ids = this.multipleSelection.map(item => item.id)
        this.loading = true
        return this.$axios
          .post(this.$api.organization.delUrl, {
            ids: ids.join(','),
            type: 'delete',
          })
          .then(() => {
            this.$message({
              showClose: false,
              message: '删除成功！',
              type: 'success',
            })
            this.multipleSelection.forEach((item) => {
              const pos = this.totalList.indexOf(item)
              this.totalList.splice(pos, 1)
            })
            this.loading = false
            this.showCurrentList()
          })
          .catch(() => {
            this.loading = false
          })
      },
      // 完成导入操作
      handleCompleted() {
        this.keyword = ''
        this.cachedKeyword = ''
        this.pagination.pageSize = 20
        this.pagination.currentPage = 1
        this.slient = true
        this.$refs.cascader.getFetchData()
      },
      // 导出操作
      handleExport(ids) {
        if (this.operating) return
        this.operating = true
        this.$axios
          .post(this.$api.organization.exportUrl, {
            ids: ids.join(','),
            type: 'export',
          })
          .then((res) => {
            const { url } = res.data
            this.$utils.tools.windowOpen(url)
          })
          .catch(() => {})
          .then(() => {
            this.operating = false
          })
      },
      // 相关操作，执行函数
      handleOption(option, row) {
        switch (option) {
        case 'add':
          this.$router.push({
            path: '/department',
          })
          break
        case 'edit':
          this.dispatchIds()
          this.$router.push({
            name: 'Department',
            params: {
              id: row.id,
            },
            query: {
              edit: true,
            },
          })
          break
        case 'import':
          this.dialogVisible = true
          break
        case 'export': {
          let ids = []
          // 未选择导出所有
          if (this.multipleSelection.length === 0) {
            const filterList = this.getDataByFilters()
            ids = filterList.map(item => item.id)
          } else {
            this.multipleSelection
              .sort((a, b) => (parseInt(a.code, 10) - parseInt(b.code, 10)))
            ids = this.multipleSelection.map(item => item.id)
          }

          this.handleExport(ids)
          break
        }
        case 'del':
          if (!this.checkSelectionNumber()) {
            this
              .showAlert({
                type: 'warning',
                message: '确认删除选中数据',
              })
              .then(() => {
                this.handleDelete()
              }).catch((e) => {
                console.dir(e)
              })
          }
          break
        default:
        }
      },
      // 点击当前行跳转
      handleRowClick(row) {
        this.$router.push({
          name: 'Department',
          params: {
            id: row.id,
          },
        })
        this.dispatchIds()
      },
      // 获取当前页面显示内容
      // 此页面前端分页
      showCurrentList() {
        const offset = Number(this.pagination.pageSize)
        const page = Number(this.pagination.currentPage)
        const begin = (page - 1) * offset
        const end = page * offset
        const filterList = this.getDataByFilters()
        this.pagination.total = filterList.length
        this.currentList = filterList.slice(begin, end)
      },
      // 通过关键字获取其它筛选条件获取过滤后的数据
      getDataByFilters() {
        const keywordArr = this.$utils.tools.splitKeyword(this.cachedKeyword)
        let filterData = []
        const { length } = keywordArr
        if (length !== 0) {
          if (length === 1) {
            // 模糊匹配
            const str = keywordArr.join('|')
            const regStr = this.$utils.tools.convertRegStr(str)
            const reg = new RegExp(regStr)
            this.totalList.forEach((item) => {
              const searchStr = `${item.code} ${item.name}`
              if (reg.test(searchStr)) {
                filterData.push(item)
              }
            })
          } else {
            // 精准搜索
            this.totalList.forEach((item) => {
              if (keywordArr.includes(item.code) || keywordArr.includes(item.name)) {
                filterData.push(item)
              }
            })
          }
        } else {
          filterData = this.totalList
        }
        return filterData
      },
      // 分发当前ids到vuex
      dispatchIds() {
        const filterList = this.getDataByFilters()
        const ids = filterList.map(item => item.id)
        this.$store.dispatch('updateIds', { ids })
      },
      // 错误提示
      showAlert({
        type = 'info',
        showCancelButton = true,
        message,
        cancelButtonText = '取消',
        confirmButtonText = '确定',
      }) {
        return this.$confirm(message, '提示', {
          confirmButtonText,
          cancelButtonText,
          showCancelButton,
          type,
        })
      },
    },
  }
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  .page__query {
    .program {
      text-align: right;

      .item {
        position: relative;
        display: inline-block;
        line-height: 34px;
        font-size: 16px;
        padding-left: 31px;
        cursor: pointer;

        svg {
          height: 26px;
          width: 26px;
          position: absolute;
          top: 50%;
          left: 26px;
          transform: translate3d(-100%, -50%, 0);
        }

        &:hover {
          color: #5090f7;

          svg g g {
            fill: #5090f7;
          }
        }
      }
    }
  }
</style>
