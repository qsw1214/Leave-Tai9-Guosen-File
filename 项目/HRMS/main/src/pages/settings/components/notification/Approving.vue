<template>
  <div class="page">
    <m-breadcrumb :items="breadcrumb" />
    <tabs :tabs="tabs" />

    <div class="m-tabs--panel">

      <div class="block-margin-bottom">
        <el-input
          class="search"
          placeholder="输入通告标题进行搜索"
          v-model="keyword"
          @keyup.enter.native="doSearch">
          <el-button
            icon="el-icon-search"
            slot="append"
            @click="doSearch" />
        </el-input>
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
            :max-height="props.maxHeight - 20"
            :data="list">

            <el-table-column
              prop="title"
              class-name="autotest-title"
              align="center"
              label="通告标题" />

            <el-table-column
              prop="category_name"
              class-name="autotest-category_name"
              align="center"
              label="通告类别" />

            <el-table-column
              prop="type_name"
              class-name="autotest-type_name"
              align="center"
              label="通告类型" />

            <el-table-column
              prop="number"
              class-name="autotest-number"
              align="center"
              label="文号" />

            <el-table-column
              class-name="autotest-org_list"
              width="300"
              label="可查阅部门">
              <template slot-scope="scope">
                <m-tag-multiple
                  v-if="scope.row.org_list.length > 0"
                  :key="scope.row.id"
                  :data="scope.row.org_list"
                  @more="moreOrg" />
              </template>
            </el-table-column>

            <el-table-column
              prop=""
              class-name="autotest-user_list"
              width="390"
              label="可查阅用户">
              <template slot-scope="scope">
                <m-tag-multiple
                  v-if="scope.row.user_list.length > 0"
                  :key="scope.row.id"
                  :data="scope.row.user_list"
                  @more="moreUser" />
              </template>
            </el-table-column>

            <el-table-column
              prop="user_name"
              class-name="autotest-user_name"
              align="center"
              label="起草人" />

            <el-table-column
              prop="create_time"
              class-name="autotest-create_time"
              align="center"
              width="110"
              label="起草时间" />

            <el-table-column
              prop="org_name"
              class-name="autotest-org_name"
              align="center"
              width="180"
              label="发文单位" />

            <el-table-column
              prop="is_top_name"
              class-name="autotest-is_top_name"
              align="center"
              label="是否置顶" />

            <el-table-column
              width="75"
              class-name="autotest-actions"
              align="center"
              fixed="right"
              label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="action(scope.row)">审核</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </m-table>
    </div>

    <m-tags-dialog
      :tags="tags.list"
      :title="tags.title"
      :table-head="tags.head"
      :show-tags-dialog="tags.show"
      @close="tags.show = false" />
  </div>
</template>

<script>
  import Tabs from '@/components/tabs'
  import mixins from '@/mixins/routerQuery'
  import notificationMixins from './mixins'

  export default {
    name: 'NotificationApproving',
    components: { Tabs },
    mixins: [mixins, notificationMixins],

    data() {
      return {
        uri: this.$api.settings.notification.approvingList,
        breadcrumb: [
          { name: '数据管理' },
          { name: '通知公告' },
        ],

        tabs: [
          { label: '已起草的', name: 'NotificationIndex', permission: '1050004,1050005' },
          { label: '待我审核', name: 'NotificationApproving', permission: '1050006' },
          { label: '我已审核', name: 'NotificationApproved', permission: '1050006' },
        ],

        loading: false,
        list: [],
      }
    },

    created() {
      this.fetch()
    },

    methods: {
      action({ id }) {
        this.$router.push({ path: `/notification/approving/${id}` })
      },

      sizeChange(size) {
        Object.assign(this.pagination, {
          currentPage: 1,
          pageSize: size,
        })

        this.fetch()
      },

      pageChange(page) {
        this.pagination.currentPage = page
        this.fetch()
      },

      moreOrg(tags) {
        Object.assign(this.tags, {
          show: true,
          list: tags,
          title: '可查阅部门',
          head: ['部门编码', '部门名称'],
        })
      },

      moreUser(tags) {
        Object.assign(this.tags, {
          show: true,
          list: tags.map(item => ({ name: item.name, code: item.emp_code })),
          title: '可查阅用户',
          head: ['员工ID', '员工姓名'],
        })
      },
    },
  }
</script>
