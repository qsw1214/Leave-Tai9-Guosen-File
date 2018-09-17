<template>
  <div>

    <div class="block-margin-bottom">
      <template v-if="$permission.valid('1050009')">
        <el-button
          icon="el-icon-plus"
          type="primary"
          @click="edit()">新建
        </el-button>
        <el-button
          icon="el-icon-download"
          @click="showImport = true">导入
        </el-button>
        <el-button
          icon="el-icon-delete"
          @click="delHandler">删除
        </el-button>
        <el-button
          icon="el-icon-success"
          @click="clickEnable">启用
        </el-button>
        <el-button
          @click="clickDisabled">
          <m-icon-forbidden />禁用
        </el-button>
      </template>

      <el-input
        class="search"
        placeholder="输入会议室区域或名称进行搜索"
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
            align="center"
            class-name="checkbox autotest-checkbox"
            width="75"
            v-if="$permission.valid('1050009')" />

          <el-table-column
            label="会议室区域"
            class-name="autotest-meetingDistrict"
            align="center"
            prop="district"
            width="120" />

          <el-table-column
            label="会议室名称"
            align="center"
            class-name="autotest-meetingName"
            prop="name" />

          <el-table-column
            label="会议室状态"
            align="center"
            class-name="autotest-meetingStatusName"
            prop="status_name"
            width="120" />

          <el-table-column
            label="可容纳人数"
            align="center"
            class-name="autotest-meetingCapacity"
            prop="capacity"
            width="120" />

          <el-table-column
            label="配套设备"
            class-name="autotest-meetingEquipments"
            prop="applier_emp_code"
            width="300">
            <template slot-scope="scope">
              <m-tag-multiple
                class="cell--tag-multiple"
                v-if="scope.row.equipments.length > 0"
                :data="scope.row.equipments"
                @more="showMoreTags" />
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            fixed="right"
            width="75"
            class-name="autotest-options"
            v-if="$permission.valid('1050009')">
            <template slot-scope="scope">
              <el-button
                type="text"
                icon="el-icon-edit"
                @click="edit(scope.row.id)" />
            </template>
          </el-table-column>
        </el-table>
      </template>
    </m-table>

    <room-edit
      ref="edit"
      @end="editEnd" />

    <m-import
      :upload-excel-url="$api.settings.meeting.mImport"
      :template-download-url="$api.settings.meeting.mTemplate"
      :show-import.sync="showImport"
      @completed="handleCompleted"
      @completedPart="handleCompleted" />

    <m-tags-dialog
      title="配套设备"
      :tags="tempTags"
      :table-head="['设备序号', '设备名称']"
      :show-tags-dialog="showTagsDialog"
      @close="closeTagsDialog" />
  </div>
</template>

<script>
  /*
  * @description 会议管理 > 会议室管理
  * @route /meeting/index/room
  */

  import RoomEdit from './RoomDialog'

  export default {
    components: { RoomEdit },
    data() {
      const { page, size, keyword } = this.$route.query

      return {
        loading: false,
        showImport: false,
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
          url: this.$api.settings.meeting.mGetList,
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

      // 点击修改、新建
      edit(id) {
        this.$refs.edit.open(id)
      },

      // 编辑完成
      editEnd(bool) {
        if (bool) this.getData()
      },

      // 导入
      handleCompleted() {
        this.getData()
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

      // 列表勾选回调
      selectionChange(items) {
        this.selectedItems = items
      },

      // 发送勾选请求
      async sendSelected(type, status, callback) {
        let ids = []
        if (this.selectedItems.length > 0) {
          ids = this.selectedItems.map(item => item.id)
        } else {
          ids = []
        }

        let url = this.$api.settings.meeting.mStatus
        if (type === 'del') {
          url = this.$api.settings.meeting.mDelete
        }

        this.loading = true
        await this.$axios({
          url,
          method: 'post',
          data: { status, ids: ids.join(',') },
        }).then((data) => {
          if (data.code === 0) callback(data)
        }).catch(() => {})
        this.loading = false
      },

      // 删除
      delHandler() {
        if (this.selectedItems.length === 0) {
          this.$message.error('请勾选需要删除的数据')
          return
        }
        this.$confirm('确认删除选中数据？', '提示', {
          type: 'warning',
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          showCancelButton: true,
        }).then(() => {
          this.sendSelected('del', null, this.getData)
        }).catch(() => {})
      },

      // 点击启用
      clickEnable() {
        if (this.selectedItems.length === 0) {
          this.$message.error('请先勾选一条待启用的会议室')
        } else {
          this.$confirm('确认启用所勾选的会议室吗？', '提示', {
            type: 'warning',
          }).then(() => {
            this.sendSelected('start', 1, () => {
              this.$message.success('勾选会议室已启用')
              this.getData()
            })
          }).catch(() => {})
        }
      },

      // 点击禁用
      clickDisabled() {
        if (this.selectedItems.length === 0) {
          this.$message.error('请先勾选一条待禁用的会议室')
        } else {
          this.$confirm('确认禁用所勾选的会议室吗？', '提示', {
            type: 'warning',
          }).then(() => {
            this.sendSelected('stop', 2, () => {
              this.$message.success('勾选会议室已禁用')
              this.getData()
            })
          }).catch(() => {})
        }
      },

      // 更多设备弹窗
      showMoreTags(tags) {
        this.showTagsDialog = true
        this.tempTags = tags
          .map(item => ({ name: item.name, code: item.code }))
      },

      // 关闭更多设备弹窗
      closeTagsDialog() {
        this.showTagsDialog = false
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
    },
  }
</script>
