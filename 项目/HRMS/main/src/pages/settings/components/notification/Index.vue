<template>
  <div class="page">
    <m-breadcrumb :items="breadcrumb" />
    <tabs
      :badge="{ NotificationApproving: badge }"
      :tabs="tabs" />

    <div class="m-tabs--panel">

      <div class="block-margin-bottom">
        <el-button
          v-permission="'1050004'"
          type="primary"
          icon="el-icon-plus"
          @click="create">新建</el-button>
        <el-button
          v-permission="'1050004,1050005'"
          type="plain"
          icon="el-icon-upload2"
          :loading="button.export"
          @click="multi('export')">导出</el-button>
        <el-button
          v-permission="'1050004'"
          type="plain"
          icon="el-icon-delete"
          :loading="button.delete"
          @click="multi('delete')">删除</el-button>

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
            :loading="loading"
            :max-height="props.maxHeight - 20"
            :data="list"
            @selection-change="selectionChange">

            <el-table-column
              type="selection"
              align="center"
              class-name="checkbox autotest-checkbox"
              width="75" />

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
              prop="status_name"
              class-name="autotest-status_name"
              align="center"
              label="通告状态" />

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
              prop="release_time"
              class-name="autotest-release_time"
              align="center"
              width="110"
              label="发布时间" />

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
                  @click="action(scope.row)">{{ actionName(scope.row) }}</el-button>
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
    name: 'Notification',
    components: { Tabs },
    mixins: [mixins, notificationMixins],

    data() {
      return {
        uri: this.$api.settings.notification.list,
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

        selection: [],
        button: {
          export: false,
          delete: false,
        },
      }
    },

    computed: {
      badge() {
        return this.$store.state.notification.badge
      },
    },

    created() {
      this.fetch()
      this.$store.dispatch('getNotificationBadge')
    },

    methods: {
      create() {
        this.$router.push('/notification/create')
      },

      multi(type) {
        if (type === 'export') this.doMulti(type)
        else if (type === 'delete') {
          let canBeDeleted = true

          if (!this.selection.length) {
            return this.$message.error('请先勾选需要删除的数据')
          }

          this.selection.some((item) => {
            if (item.status === 4 || item.status === 8) {
              canBeDeleted = false
              return true
            }

            return false
          })

          if (canBeDeleted) {
            this.$message.error('仅可以删除未提交或已退回的通知公告，请重新选择')
            return false
          }

          this
            .$confirm('是否确定删除', '提示', { type: 'warning' })
            .then(() => {
              this.doMulti(type)
            })
            .catch(() => {})
        }

        return this
      },

      doMulti(type) {
        this.button[type] = true
        const ids = this.selection.map(item => item.id).join(',')
        this.$axios
          .post(this.$api.settings.notification.multi, {
            ids,
            type,
            keywords: this.keywords,
          })
          .then(({ data }) => {
            if (data.url) this.$utils.tools.windowOpen(data.url)
            else if (type === 'delete') this.fetch()

            this.button[type] = false
          })
          .catch(() => {
            this.button[type] = false
          })
      },

      action({ id, status }) {
        let path = `/notification/detail/${id}/${status}`

        if (this.$permission.valid('1050004')) {
          if (status === 8 || status === 4) {
            path = `/notification/create/${id}/${status}`
          }
        }

        this.$router.push({ path })
      },

      selectionChange(val) {
        this.selection = val
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

      actionName({ status }) {
        let name = '查看'

        if (this.$permission.valid('1050004')) {
          if (status === 8) name = '重新提交'
          else if (status === 4) name = '提交'
        }

        return name
      },
    },
  }
</script>
