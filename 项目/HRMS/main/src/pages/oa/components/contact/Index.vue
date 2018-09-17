<template>
  <div class="page page--contact">
    <m-breadcrumb :items="breadcrumb" />

    <div class="block-margin-bottom">
      <m-cascader
        placeholder="请选择组织机构"
        v-if="orgLevels.length"
        ref="cascader"
        :organization.sync="organization"
        :input-options="orgLevels"
        :width="240"
        @selectCompleted="selectCompleted" />
    </div>

    <m-table
      is-full-table
      :total="pagination.total"
      :loading="loading"
      :current-page="pagination.currentPage"
      :page-size="pagination.pageSize"
      :data="list"
      @current-change="pageChange"
      @size-change="sizeChange">

      <template slot-scope="props">
        <el-table
          border
          :max-height="props.maxHeight"
          :data="list">

          <el-table-column
            width="120"
            align="center"
            label="姓名">
            <template slot-scope="scope">
              <el-popover
                trigger="hover"
                placement="right"
                v-if="scope.row.name">
                <div class="m-userinfo">
                  <div class="m-userinfo--avatar">
                    <div
                      class="img"
                      :style="`background-image: url('${ scope.row.avatar_url }')`" />
                  </div>
                </div>
                <div
                  class="name-wrapper"
                  slot="reference">
                  <el-tag size="medium">{{ scope.row.name }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>

          <el-table-column
            prop="emp_code"
            width="120"
            align="center"
            label="员工ID" />

          <el-table-column
            prop="org_name"
            align="center"
            width="210"
            label="所属部门" />

          <el-table-column
            prop="job_name"
            align="center"
            width="120"
            label="职位" />

          <el-table-column
            prop="mobile"
            align="center"
            width="120"
            label="手机号码" />

          <el-table-column
            prop="office_phone"
            align="center"
            width="120"
            label="办公电话" />

          <el-table-column
            prop="mobile_short"
            align="center"
            width="120"
            label="短号" />

          <el-table-column
            prop="weixin_num"
            width="120"
            align="center"
            label="微信号" />

          <el-table-column
            prop="email_inside"
            align="center"
            width="200"
            label="内网邮箱" />

          <el-table-column
            prop="email_outside"
            align="center"
            width="200"
            label="外网邮箱" />
        </el-table>
      </template>
    </m-table>
  </div>
</template>

<script>
  export default {
    name: 'Contact',

    data() {
      const { page, size, organization } = this.$route.query

      return {
        breadcrumb: [
          { name: '企业OA' },
          { name: '通讯录' },
        ],
        list: [],
        pagination: {
          pageSize: parseInt((size || 20), 10),
          currentPage: parseInt((page || 1), 10),
          total: 0,
        },
        loading: true,
        organization: organization || '',
        orgLevels: [],
      }
    },

    created() {
      this.init()
    },

    methods: {
      init() {
        this
          .getOrgLevels()
          .then(() => {
            this.fetch()
          })
      },

      // 此处没有采取组件内获取数据，外部获取数据填充
      getOrgLevels() {
        const url = this.$api.common.organizationLevelAuth

        return this.$axios
          .post(url)
          .then((res) => {
            const { data } = res
            this.orgLevels = [data]
            if (!this.organization) this.organization = data.id
          })
          .catch(() => {})
      },

      fetch() {
        const { pageSize, currentPage } = this.pagination

        this.loading = true
        this.$axios
          .get(this.$api.oa.contact, {
            params: {
              org_id: this.organization,
              per_page: pageSize,
              page: currentPage,
            },
          })
          .then((res) => {
            const { list, count } = res.data

            this.pagination.total = count
            this.list = list
          })
          .catch(() => {})
          .then(() => {
            this.loading = false
          })
      },

      selectCompleted() {
        this.fetch()
      },

      pageChange(page) {
        this.pagination.currentPage = page
        this.fetch()
      },

      sizeChange(size) {
        Object.assign(this.pagination, { pageSize: size, currentPage: 1 })
        this.fetch()
      },
    },
  }
</script>
