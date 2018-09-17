<template>
  <section
    v-loading.fullscreen.lock="loading"
    class="page page--details">

    <m-breadcrumb :items="breadcrumb" />

    <div class="options">
      <el-button
        type="primary"
        icon="el-icon-edit"
        @click="goEdit">
        编辑
      </el-button>

      <el-button
        type="primary"
        v-if="isFromAdd"
        @click="$router.push('/share/mine/edit')">
        继续新增
      </el-button>

      <template v-if="!isFromAdd">
        <el-button
          icon="el-icon-caret-left"
          :disabled="disabledPrev"
          @click="prev">上一条
        </el-button>
        <el-button
          icon="el-icon-caret-right"
          :disabled="disabledNext"
          @click="next">下一条
        </el-button>
      </template>
    </div>

    <commonDetail :data="data" />

    <m-section title="资料权限设置">
      <div style="padding: 20px;">
        <el-alert
          title="以下为已授权可查阅的部门"
          type="success"
          :closable="false" />

        <el-tree
          style="margin-top: 20px; border: 1px solid #e2e2e2;"
          default-expand-all
          key="auth_listTree"
          :data="hasAuthOrgs"
          :props="treeProps" />

        <el-alert
          style="margin-top: 20px;"
          title="以下为已授权可查阅的员工"
          type="success"
          :closable="false" />

        <div class="users-list">
          <el-row style="padding: 20px 0; text-align: right;">
            <el-input
              class="search"
              placeholder="输入编码或名称进行查询"
              v-model="keyword"
              @keyup.enter.native="doSearch">
              <el-button
                icon="el-icon-search"
                slot="append"
                @click="doSearch" />
            </el-input>
          </el-row>

          <m-table
            :data="employee"
            :total="pagination.total"
            :current-page="pagination.currentPage"
            :page-size="pagination.pageSize"
            @current-change="pageChange"
            @size-change="sizeChange">

            <template slot-scope="props">
              <el-table
                border
                stripe
                max-height="400"
                row-key="id"
                :data="props.data">
                <el-table-column
                  label="姓名"
                  align="center"
                  prop="name" />
                <el-table-column
                  label="员工ID"
                  align="center"
                  prop="emp_code" />
                <el-table-column
                  label="所属组织"
                  align="center"
                  prop="org_name" />
                <el-table-column
                  label="职位名称"
                  align="center">
                  <template slot-scope="scope">
                    {{ scope.row.job || scope.row.job_name }}
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </m-table>
        </div>
      </div>
    </m-section>
  </section>
</template>

<script>
  import commonDetail from './common/DetailForm'

  export default {
    name: 'WarehouseDetails',

    components: {
      commonDetail,
    },

    data() {
      const { from } = this.$route.query
      const isFromAdd = from === 'add'

      return {
        breadcrumb: [
          { name: '企业OA' },
          { name: '知识仓库', to: '/share' },
          { name: '我的资料', to: '/share/mine' },
          { name: '' },
        ],
        loading: true,
        isFromAdd,
        data: {},
        pagination: {
          total: 0,
          pageSize: 20,
          currentPage: 1,
        },
        orgs: [],
        hasAuthOrgs: [],
        keyword: '',
        employee: [],
        treeProps: { label: 'name' },
      }
    },

    computed: {
      ids() {
        return this.$store.state.share.mineIds
      },

      disabledPrev() {
        const { id } = this.$route.params
        const index = this.ids.indexOf(id)

        if (index === -1 || this.ids.length <= 1 || index === 0) {
          return true
        }
        return false
      },

      disabledNext() {
        const { id } = this.$route.params
        const index = this.ids.indexOf(id)
        const len = this.ids.length

        if (index === -1 || len <= 1 || index === (len - 1)) {
          return true
        }
        return false
      },

    },

    created() {
      this.getAllOrgs()
        .then(() => {
          this.fetch()
        })
    },

    methods: {
      // 此处没有采取组件内获取数据，外部获取数据填充
      getAllOrgs() {
        return this.$axios
          .post(this.$api.common.organizationLevel)
          .then(({ data }) => {
            this.orgs = data ? [data] : []
          })
      },

      fetch() {
        this.loading = true
        console.log(this.$route.params.id)
        this.$axios
          .get(this.$api.oa.warehouse.detail, {
            params: {
              id: this.$route.params.id,
            },
          })
          .then(({ data }) => {
            this.data = data
            const temp = { name: data.title }
            this.breadcrumb.splice(3, 1, temp)
            const orgList = this.data.org_list.map(item => item.id)
            const authOrgs = this.getOrgs(this.orgs, orgList)
            this.hasAuthOrgs = authOrgs
            this.getEmployee()
          })
          .catch(() => {})
          .then(() => {
            this.loading = false
          })
      },

      doSearch() {
        this.getEmployee()
      },

      reset(bool) {
        this.pagination = {
          total: 0,
          pageSize: 20,
          currentPage: 1,
        }
        this.keyword = ''
        const { params } = this.$route
        const index = this.ids.indexOf(params.id)
        const key = bool ? (index + 1) : (index - 1)
        const id = this.ids[key]
        this.$router.replace({
          params: Object.assign({}, params, { id }),
        })
      },

      prev() {
        this.reset(false)
        this.$nextTick(() => {
          this.fetch()
        })
      },

      next() {
        this.reset(true)
        this.$nextTick(() => {
          this.fetch()
        })
      },

      pageChange(page) {
        this.pagination.currentPage = Number(page)
        this.getEmployee()
      },

      sizeChange(size) {
        this.pagination.pageSize = Number(size)
        this.getEmployee()
      },

      filterDataByKeyword() {
        const keywords = this.$utils.tools.splitKeyword(this.keyword)
        const { length } = keywords
        const users = this.data.user_list || []
        let temp = []

        if (length !== 0) {
          if (length === 1) {
            const str = keywords.join('|')
            const regStr = this.$utils.tools.convertRegStr(str)
            const reg = new RegExp(regStr)

            users.forEach((item) => {
              const searchStr = `${item.name} ${item.emp_code}`
              if (reg.test(searchStr)) {
                temp.push(item)
              }
            })
          } else {
            users.forEach((item) => {
              if (keywords.includes(item.name) || keywords.includes(item.emp_code)) {
                temp.push(item)
              }
            })
          }
        } else {
          temp = users
        }

        return temp
      },

      getEmployee() {
        const offset = Number(this.pagination.pageSize)
        const page = Number(this.pagination.currentPage)
        const begin = (page - 1) * offset
        const end = page * offset
        const filterList = this.filterDataByKeyword()
        this.pagination.total = filterList.length
        this.employee = filterList.slice(begin, end)
      },

      // 遍历树找出对应的层级
      getOrgs(arr, target) {
        const result = []
        arr.forEach((item) => {
          const OjItem = Object.assign({}, item)
          delete OjItem.children
          if (target.includes(item.id)) {
            result.push(OjItem)
          }
          if (item.children && item.children.length) {
            OjItem.children = this.getOrgs(item.children, target)
            if (OjItem.children.length) {
              if (!result.includes(OjItem)) result.push(OjItem)
            } else {
              delete OjItem.children
            }
          }
        })
        return result
      },

      goEdit() {
        const { id } = this.$route.params
        this.$router.push({
          path: '/share/mine/edit',
          query: {
            id,
          },
        })
      },
    },
  }
</script>
