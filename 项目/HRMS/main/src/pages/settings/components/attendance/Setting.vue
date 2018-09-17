<template>
  <!-- 考勤设置 -->
  <div>

    <div class="block-margin-bottom">
      <el-button
        icon="el-icon-download"
        @click="dialogVisible = true">导入
      </el-button>
      <el-button
        icon="el-icon-upload2"
        @click="handleExport">导出
      </el-button>
    </div>

    <div class="block-margin-bottom">
      <m-cascader
        placeholder="请选择组织机构"
        ref="cascader"
        :width="240"
        :organization.sync="organization"
        @fetchCompleted="init"
        @selectCompleted="selectCompleted" />

      <el-input
        class="search"
        placeholder="输入员工姓名或员工ID进行搜索"
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
          :max-height="props.maxHeight - 20"
          :data="props.data"
          @selection-change="selectionChange">
          <el-table-column
            type="selection"
            column-key="select"
            class-name="checkbox autotest-checkbox"
            align="center"
            width="75" />

          <el-table-column
            label="姓名"
            class-name="autotest-name"
            align="center"
            prop="name"
            width="110" />

          <el-table-column
            label="员工ID"
            class-name="autotest-emp_code"
            align="center"
            prop="emp_code"
            width="75" />

          <el-table-column
            label="所属组织"
            class-name="autotest-org_name"
            align="center"
            prop="org_name"
            width="110" />

          <el-table-column
            label="职位名称"
            class-name="autotest-job_name"
            align="center"
            prop="job_name"
            width="110" />

          <el-table-column
            label="打卡方式"
            class-name="autotest-sign_type"
            align="center"
            prop="sign_type"
            width="180">
            <template slot-scope="scope">
              {{ [...scope.row.sign_type.map(_ => _.sign_type_name)].join('，') }}
            </template>
          </el-table-column>

          <el-table-column
            label="打卡地点"
            class-name="autotest-sign_area"
            prop="sign_area"
            width="300">
            <template slot-scope="scope">
              <m-tag-multiple
                class="cell--tag-multiple"
                v-if="scope.row.sign_area.length > 0"
                :attrs="['sign_area_name']"
                :data="scope.row.sign_area"
                @more="showMoreTags" />
            </template>
          </el-table-column>

          <el-table-column
            label="适用班次"
            class-name="autotest-schedule_name"
            align="center"
            prop="schedule_name"
            width="110" />

          <el-table-column
            label="班次截止日期"
            class-name="autotest-schedule_expire"
            align="center"
            prop="schedule_expire"
            width="110" />

          <el-table-column
            label="备注"
            class-name="autotest-remark"
            align="center"
            prop="remark"
            width="110" />

          <el-table-column
            label="操作"
            align="center"
            fixed="right"
            width="75"
            class-name="autotest-options">
            <template slot-scope="scope">
              <el-button
                type="text"
                icon="el-icon-edit"
                @click="$refs.edit.open(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      </template>
    </m-table>

    <setting-edit
      ref="edit"
      @end="editEnd" />

    <m-import
      :upload-excel-url="$api.settings.attendance.confImport"
      :template-download-url="$api.settings.attendance.confITemplate"
      :show-import.sync="dialogVisible"
      @completed="handleCompleted"
      @completedPart="handleCompleted" />

    <m-tags-dialog
      title="打卡地点"
      :tags="tempTags"
      :table-head="['打卡地点']"
      :table-column="['sign_area_name']"
      :show-tags-dialog="showTagsDialog"
      @close="closeTagsDialog" />
  </div>
</template>

<script>
  import SettingEdit from './SettingDialog'

  export default {
    components: { SettingEdit },
    data() {
      const { page, size, keyword, organization } = this.$route.query

      return {
        loading: true,
        data: [],
        showData: [],
        selectedItems: [],
        organization: organization || '',
        keyword: keyword || '',
        cachedKeyword: keyword || '',
        currentPage: parseInt((page || 1), 10),
        pageSize: parseInt((size || 20), 10),
        total: 0,
        dialogVisible: false,
        operating: false,
        showTagsDialog: false,
        tempTags: [],
      }
    },
    methods: {
      // 获取列表数据
      async getData() {
        this.loading = true
        await this.$axios({
          url: this.$api.settings.attendance.confList,
          params: {
            per_page: this.pageSize,
            page: this.currentPage,
            keywords: this.$utils.tools
              .splitKeyword(this.cachedKeyword).join(','),
            org_id: this.organization,
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
            organization: this.organization,
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
      // 列表勾选回调
      selectionChange(items) {
        this.selectedItems = items
      },
      // 初次组织架构获取
      init(organization) {
        if (!this.organization) this.organization = organization[0].id
        this.getData()
      },
      // 选择级联列表后查询
      selectCompleted() {
        const { organization } = this
        const { query } = this.$route

        this.$router.replace({
          query: Object.assign({}, query, { organization }),
        })
        this.getData()
      },
      // 完成导入操作
      handleCompleted() {
        this.keyword = ''
        this.cachedKeyword = ''
        this.pageSize = 20
        this.currentPage = 1
        this.$refs.cascader.getFetchData()
      },
      // 导出操作
      handleExport() {
        if (this.operating) return

        const ids = this.selectedItems.map(item => item.id)
        this.operating = true
        this.$axios
          .post(this.$api.settings.attendance.confExport, {
            ids: ids.join(','),
            type: 'export',
            keywords: this.$utils.tools
              .splitKeyword(this.cachedKeyword).join(','),
            org_id: this.organization,
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
      // 编辑完成
      editEnd(bool) {
        if (bool) this.getData()
      },
      // 更多打卡地点
      showMoreTags(tags) {
        this.showTagsDialog = true
        this.tempTags = tags
          .map(item => ({ sign_area_name: item.sign_area_name }))
      },
      // 关闭更多设备弹窗
      closeTagsDialog() {
        this.showTagsDialog = false
      },
    },
  }
</script>
