<template>
  <div class="page page--application-index">

    <m-breadcrumb :items="breadcrumb" />
    <Tabs active-tab="application" />

    <div class="page--body panel">
      <div class="block-margin-bottom">
        <el-button
          icon="el-icon-delete"
          @click.native="delConfirm">删除
        </el-button>

        <el-input
          placeholder="请输入流程名称搜索"
          class="search"
          v-model="keyword"
          @keyup.enter.native="doSearch">
          <el-button
            icon="el-icon-search"
            slot="append"
            @click="doSearch" />
        </el-input>
      </div>

      <div class="tables">
        <m-table
          is-pagination
          is-full-table
          :data="currentList"
          :loading="loading"
          :total="pagination.total"
          :current-page="pagination.currentPage"
          :page-size="pagination.pageSize"
          @current-change="changePage"
          @size-change="changeSize">
          <template slot-scope="props">
            <el-table
              stripe
              border
              ref="multipleTable"
              :data="props.data"
              :max-height="props.maxHeight - 20"
              @selection-change="rowSelected">
              <el-table-column
                type="selection"
                align="center"
                class-name="checkbox"
                width="75"
                :selectable="isSelected" />
              <el-table-column
                label="流程类型"
                align="center"
                min-width="120"
                prop="flow_config_type_name" />

              <el-table-column
                label="流程名称"
                align="center"
                min-width="120"
                prop="name" />

              <el-table-column
                label="申请日期"
                align="center"
                min-width="120"
                prop="apply_date" />

              <el-table-column
                label="流程编码"
                align="center"
                min-width="120"
                prop="code" />

              <el-table-column
                label="流程状态"
                align="center"
                min-width="120"
                prop="status_name" />

              <el-table-column
                align="center"
                label="审批节点"
                prop="approvaler_names" />

              <el-table-column
                width="120"
                fixed="right"
                align="center"
                label="操作">
                <template slot-scope="scope">
                  <div class="options">
                    <el-button
                      type="text"
                      v-if="operateEditText(scope.row)"
                      @click="linkTo(scope.row, true)">{{ operateEditText(scope.row) }}</el-button>
                    <el-button
                      type="text"
                      v-else
                      @click="linkTo(scope.row)">{{ operateDetailsText(scope.row) }}</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </m-table>
        <!--0-未提交、30-审批中、90-审批通过、91-待确认、92-提交失败、93-作废、94-已退回、99-已完成-->
      </div>
    </div>
  </div>
</template>

<script>
  import mixin from '~services/mixin'
  import Tabs from '../common/Tabs'

  export default {
    name: 'ApplicationIndex',
    components: {
      Tabs,
    },
    mixins: [mixin.routerQuery, mixin.pl],
    data() {
      return {
        breadcrumb: this.$breadcrumb(),
        loading: true,
        pagination: {
          total: 0,
        },
        currentList: [],
        totalList: [],
      }
    },
    created() {
      this.fetch()
    },
    methods: {
      fetch() {
        this.loading = true
        const url = this.$api.services.application.list
        const { currentPage, pageSize } = this.pagination

        this.$axios.post(url, {
          type: 3,
          per_page: pageSize,
          page: currentPage,
          keywords: this.keywords,
        }).then((res) => {
          this.loading = false
          const { list, count } = res.data
          this.currentList = list
          this.pagination.total = Number(count)

          this.$store.dispatch('update_unread_message', { type: '1', module: '1' })
        })
      },
      changePage(page) {
        this.pagination.currentPage = page
        this.fetch()
      },
      changeSize(size) {
        Object.assign(this.pagination, { pageSize: size, currentPage: 1 })
        this.fetch()
      },
      linkTo(row, submit) {
        const { id, flow_config_code: code, status } = row
        const modulesArr = this.$store.state.services.modulesMapping
        const modluePath = modulesArr[code]
        let path
        if (submit) {
          path = `/pa/${modluePath}/${code}/${id}`
        } else if (status === 91 || status === 93) {
          path = `/application/${modluePath}/${code}/${id}?status=${status}`
        } else {
          path = `/application/${modluePath}/${code}/${id}`
        }
        this.$router.push(path)
      },
    },
  }
</script>

<style lang="scss" scoped type="text/scss" rel="stylesheet/scss">
  .page--application-index {
    .nav {
      display: flex;
      justify-content: space-between;

      .buttons {
        display: inline-block;
      }

      .search {
        display: inline-block;
      }
    }

    .tables {
      margin-top: 14px;
    }

    .panel {
      background: #fff;
      padding: 15px;
      border: 1px solid #e9e9e9;
      border-top: none;
    }

    .options {
      cursor: pointer;
      font-size: 13px;
      color: #5090f7;
    }
  }
</style>
