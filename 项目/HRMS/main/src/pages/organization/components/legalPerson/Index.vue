<template>
  <div
    class="page page-legal-person-index">

    <m-breadcrumb :items="breadcrumb" />

    <div class="block-margin-bottom">
      <el-button
        v-permission="1010003"
        type="primary"
        icon="el-icon-plus"
        @click="clickSkip('/legalperson/create')">新建
      </el-button>
      <el-button
        v-permission="1010003"
        icon="el-icon-upload2"
        @click="exportExcel">导出
      </el-button>
      <el-button
        v-permission="1010003"
        icon="el-icon-delete"
        @click="clickDelete">删除
      </el-button>

      <el-input
        class="search"
        placeholder="输入法人单位名称进行查询"
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
      :loading="loading"
      :data="showData"
      :total="showData.length"
      :current-page="currentPage"
      :page-size="pageSize"
      :remote="false">
      <template slot-scope="props">
        <el-table
          border
          stripe
          :max-height="props.maxHeight"
          :data="props.data"
          @row-dblclick="dbClickRow"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            column-key="select"
            class-name="checkbox autotest-checkbox"
            align="center"
            width="75" />

          <el-table-column
            label="社会统一信用码"
            align="center"
            class-name="autotest-code"
            prop="yyzz_credit_code" />

          <el-table-column
            label="法人单位名称"
            align="center"
            class-name="autotest-legalName"
            prop="yyzz_legal_name" />

          <el-table-column
            label="法人单位成立日期"
            align="center"
            class-name="autotest-date"
            prop="yyzz_es_date" />

          <el-table-column
            label="负责人"
            align="center"
            class-name="autotest-charge"
            prop="yyzz_charge" />

          <el-table-column
            label="主体类型"
            align="center"
            class-name="autotest-entityType"
            prop="yyzz_entity_type" />

          <el-table-column
            label="操作"
            align="center"
            fixed="right"
            class-name="autotest-options"
            prop="operate"
            column-key="operate"
            width="75"
            v-if="$permission.valid(1010003)">
            <template slot-scope="scope">
              <el-button
                type="text"
                icon="el-icon-edit"
                @click="clickEdit(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      </template>
    </m-table>
  </div>
</template>

<script>
  /**
   * @description 法人设置首页
   */
  import { mapMutations, mapState } from 'vuex'
  import { legalPerson } from '~organization/store/mutationTypes'

  export default {
    name: 'LegalPersonIndex',
    data() {
      const { keyword, size, page } = this.$route.query

      return {
        breadcrumb: [
          { name: '组织管理' },
          { name: '法人单位设置' },
        ],
        // 超找关键字
        keyword: keyword || '',
        // 列表显示数据，查找筛选由前端进行
        listData: [],
        // 多选选中列表数据
        selectItems: [],
        // 选中单条
        currentItem: {},
        itemFlowData: {},
        pageSize: parseInt((size || 20), 10),
        currentPage: parseInt((page || 1), 10),
        loading: false,
        operating: false,
      }
    },
    computed: {
      ...mapState({
        showData: state => state.legalPerson.list || [],
      }),
    },
    created() {
      this.getData()
    },
    methods: {
      ...mapMutations({
        updateList: legalPerson.updateList,
        updateCurrent: legalPerson.updateCurrent,
      }),
      // 获取表格数据
      // 此页面前端分页
      getData() {
        this.loading = true
        this.$axios({
          url: this.$api.organization.legalPersonList,
        }).then(({ data }) => {
          this.listData = data.list

          if (this.keyword) {
            const showData = this.$utils.tools.arraySearch(data.list, ['yyzz_legal_name'], this.keyword)
            this.updateList(showData)
          } else {
            this.updateList(data.list)
          }

          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      // 删除选中数据
      sendDelete() {
        const items = this.selectItems.map(item => item.id)
        const ids = items.join(',')
        this.$axios({
          url: this.$api.organization.legalPersonSelected,
          params: {
            type: 'delete',
            ids,
          },
        }).then(() => {
          this.$message({
            message: '所选项目已经删除',
            type: 'success',
          })
          this.getData()
        }).catch(() => {})
      },
      // 表格选择后回调函数
      handleSelectionChange(value) {
        this.selectItems = value
      },
      // 导出
      exportExcel() {
        if (this.operating) return
        let items = []
        if (this.selectItems.length > 0) {
          items = this.selectItems.map(item => item.id)
        } else {
          items = this.showData.map(item => item.id)
        }
        const ids = items.join(',')
        this.operating = true
        this
          .$axios({
            url: '/legal-entity/multi',
            method: 'post',
            params: {
              type: 'export',
              ids,
            },
          })
          .then((data) => {
            this.$utils.tools.windowOpen(data.data.url)
          })
          .catch(() => {})
          .then(() => {
            this.operating = false
          })
      },
      // 点击表行的回调函数
      dbClickRow(row) {
        this.updateCurrent(row)
        this.$router.push({
          path: `/legalperson/details/${row.id}`,
        })
      },
      // 点击删除
      clickDelete() {
        if (this.selectItems.length === 0) {
          this.$message({
            type: 'error',
            message: '请勾选需要删除的法人单位信息',
          })
        } else {
          this.$confirm('确认删除选中数据？', '提示', {
            type: 'warning',
          }).then(() => {
            this.sendDelete()
          }).catch(() => {})
        }
      },
      // 点击修改
      clickEdit(row) {
        this.updateCurrent(row)
        this.$router.push({
          path: `/legalperson/create/${row.id}`,
          query: {
            callback: 'list',
          },
        })
      },
      // 点击跳转
      clickSkip(path) {
        this.$router.push({
          path,
        })
      },
      // 查找回调函数
      search() {
        const keyword = this.keyword.trim()
        const { query } = this.$route

        this.$router.replace({
          query: Object.assign({}, query, { keyword }),
        })

        if (keyword) {
          const showData = this.$utils.tools.arraySearch(this.listData, ['yyzz_legal_name'], keyword)
          this.updateList(showData)
        } else {
          this.updateList(this.listData)
        }
      },
    },
  }
</script>
