<template>
  <div>

    <div
      class="block-margin-bottom"
      v-if="$permission.valid('1050009')">
      <el-button
        icon="el-icon-plus"
        type="primary"
        @click="edit()">新建
      </el-button>
      <el-button
        icon="el-icon-delete"
        @click="delHandler">删除
      </el-button>
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
            width="75"
            v-if="$permission.valid('1050009')" />

          <el-table-column
            label="设备序号"
            class-name="autotest-equipmentCode"
            align="center"
            prop="code"
            width="120" />

          <el-table-column
            label="设备名称"
            class-name="autotest-equipmentName"
            align="center"
            prop="name" />

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
                @click="edit(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      </template>
    </m-table>

    <equipment-edit
      ref="edit"
      @end="editEnd" />
  </div>
</template>

<script>
  /*
  * @description 会议管理 > 设备管理
  * @route /meeting/index/equipment
  */
  import EquipmentEdit from './EquipmentDialog'

  export default {
    components: { EquipmentEdit },
    data() {
      const { page, size, keyword } = this.$route.query

      return {
        loading: false,
        data: [],
        showData: [],
        selectedItems: [],
        keyword: keyword || '',
        cachedKeyword: keyword || '',
        currentPage: parseInt((page || 1), 10),
        pageSize: parseInt((size || 20), 10),
        total: 0,
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
          url: this.$api.settings.meeting.eGetList,
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

      // 点击修改
      edit(id) {
        this.$refs.edit.open(id)
      },

      // 编辑完成
      editEnd(bool) {
        if (bool) this.getData()
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
          ids = this.showData.map(item => item.id)
        }

        const url = this.$api.settings.meeting.eDelete

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
