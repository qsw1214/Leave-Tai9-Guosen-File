<template>
  <div class="page">

    <m-breadcrumb :items="breadcrumb" />

    <div class="block-margin-bottom">
      <el-button
        icon="el-icon-plus"
        type="primary"
        @click="$router.push('/meeting/check')">新建会议
      </el-button>

      <el-input
        class="search"
        placeholder="输入会议主题或会议参与人进行搜索"
        v-model="keyword"
        @keyup.enter.native="search">
        <el-button
          icon="el-icon-search"
          slot="append"
          @click="search" />
      </el-input>
    </div>

    <m-table
      is-full-table
      ref="mtable"
      :loading="loading"
      :data="showData"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="changePageIndex"
      @size-change="changePageSize">
      <template slot-scope="props">
        <el-table
          border
          stripe
          :max-height="props.maxHeight"
          :data="props.data">
          <el-table-column
            label="会议主题"
            class-name="autotest-theme"
            align="center"
            prop="theme"
            width="200" />

          <el-table-column
            label="开始时间"
            class-name="autotest-begin_time"
            align="center"
            prop="begin_time"
            width="150" />

          <el-table-column
            label="结束时间"
            class-name="autotest-end_time"
            align="center"
            prop="end_time"
            width="150" />

          <el-table-column
            label="会议状态"
            class-name="autotest-status_name"
            align="center"
            prop="status_name"
            width="80">
            <template slot-scope="scope">
              {{ getStatus(scope.row) }}
            </template>
          </el-table-column>

          <el-table-column
            label="会议室区域"
            class-name="autotest-district"
            align="center"
            prop="district"
            width="129" />

          <el-table-column
            label="会议室名称"
            class-name="autotest-name"
            align="center"
            prop="name"
            width="120" />

          <el-table-column
            label="发起人"
            class-name="autotest-initiator"
            align="center"
            prop="initiator"
            width="120">
            <template slot-scope="scope">
              {{ scope.row.initiator.name }}({{ scope.row.initiator.emp_code }})
            </template>
          </el-table-column>

          <el-table-column
            label="会议参与人"
            class-name="autotest-user_list"
            prop="user_list"
            width="390">
            <template slot-scope="scope">
              <m-tag-multiple
                class="authUser"
                v-if="scope.row.user_list.length > 0"
                :attrs="['name', {
                  key: 'emp_code',
                  all: true,
                  render: (item, attr) => { return `(${item[attr.key]})` }
                }]"
                :data="scope.row.user_list"
                @more="showMoreTags" />
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            class-name="autotest-options"
            align="center"
            fixed="right"
            width="120">
            <template slot-scope="scope">
              <el-button
                type="text"
                v-if="scope.row.status === 2"
                @click="$router.push(`/meeting/book-detail/${scope.row.id}`)">查看</el-button>
              <template
                v-if="uid === scope.row.initiator.id">
                <el-button
                  type="text"
                  v-if="scope.row.status === 2 && checkStatus(scope.row) < 0"
                  @click="$router.push(`/meeting/book/${scope.row.id}`)">修改</el-button>
                <el-button
                  type="text"
                  v-if="scope.row.status === 2 && checkStatus(scope.row) < 0"
                  @click="multi(scope.row, 'cancel')">撤销</el-button>
                <el-button
                  type="text"
                  v-if="scope.row.status === 1"
                  @click="$router.push(`/meeting/book/${scope.row.id}`)">提交</el-button>
                <el-button
                  type="text"
                  v-if="scope.row.status === 1"
                  @click="multi(scope.row, 'delete')">删除</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </m-table>

    <!--浮层-->
    <m-tags-dialog
      title="会议参与人"
      :tags="tempTags"
      :table-head="['员工ID', '员工姓名']"
      :show-tags-dialog="showTagsDialog"
      @close="closeTagsDialog" />
  </div>
</template>

<script>
  /*
  * @description 企业OA > 会议管理
  * @route /meeting
  */

  export default {
    data() {
      const { page, size, keyword } = this.$route.query

      return {
        breadcrumb: [
          { name: '企业OA' },
          { name: '会议管理' },
        ],
        loading: false,
        uid: JSON.parse(sessionStorage.getItem('USER_INFO')).id,
        data: [],
        showData: [],
        selectedItems: [],
        keyword: keyword || '',
        cachedKeyword: keyword || '',
        currentPage: parseInt((page || 1), 10),
        pageSize: parseInt((size || 20), 10),
        total: 0,
        showTagsDialog: false,
        tempTags: [],
      }
    },
    created() {
      this.getData()
    },
    methods: {
      // 获取列表数据
      async getData() {
        this.loading = true
        await this.$axios({
          url: this.$api.oa.meeting.meetingList,
          params: {
            per_page: this.pageSize,
            page: this.currentPage,
            keywords: this.$utils.tools
              .splitKeyword(this.keyword).join(','),
          },
        }).then(({ code, data }) => {
          if (code === 0) {
            this.data = data.list
            this.total = data.count || 0
            this.showData = this.data
          }
        }).catch(() => {})
        this.loading = false
      },
      // 列表过滤搜索
      search() {
        const { query } = this.$route

        this.$router.replace({
          query: Object.assign({}, query, {
            page: 1,
            keyword: this.keyword.trim(),
          }),
        })

        this.cachedKeyword = this.keyword.trim()
        this.currentPage = 1
        this.getData()
      },
      // 翻页
      changePageIndex(value) {
        this.currentPage = value
        this.getData()
      },
      // 更改每页显示条数
      changePageSize(value) {
        this.pageSize = value
        this.currentPage = 1
        this.getData()
      },
      // 判断时间状态
      checkStatus(row) {
        const starttime = new Date(row.begin_time).getTime()
        const endtime = new Date(row.end_time).getTime()
        if (starttime > Date.now()) {
          return -1
        } else if (starttime < Date.now() && endtime > Date.now()) {
          return 0
        }
        return 1
      },
      // 判断会议状态
      getStatus(row) {
        if (row.status === 1) {
          return '未提交'
        } else if (this.checkStatus(row) < 0) {
          return '未开始'
        } else if (this.checkStatus(row) === 0) {
          return '进行中'
        } else if (this.checkStatus(row) > 0) {
          return '已结束'
        }
        return '已撤销'
      },
      // 多选操作
      async multi(row, type) {
        if (this.loading) return

        const msg = type === 'delete' ? '删除' : '撤销'

        // 操作确认
        try {
          await this.$confirm(`是否${msg}提交？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
        } catch (err) {
          console.log(err)
          return
        }

        this.loading = true
        await this.$axios({
          url: this.$api.oa.meeting.multi,
          params: {
            id: row.id,
            type,
          },
        }).then(async (data) => {
          if (data.code === 0) {
            this.$message.success(`${msg}成功！`)
            await this.getData()
          }
        }).catch(() => {})
        this.loading = false
      },
      // 更多设备弹窗
      showMoreTags(tags) {
        this.showTagsDialog = true
        this.tempTags = tags
          .map(item => ({ name: item.name, code: item.emp_code }))
      },
      // 关闭更多设备弹窗
      closeTagsDialog() {
        this.showTagsDialog = false
      },
    },
  }
</script>
