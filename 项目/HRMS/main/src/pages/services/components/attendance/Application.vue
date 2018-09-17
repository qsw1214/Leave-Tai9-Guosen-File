<template>
  <div class="page page--attendance__application">

    <m-breadcrumb :items="breadcrumb" />

    <Tabs :tabs="tabs" />

    <div class="tabs-panel">

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
          :loading="loading"
          :data="list"
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
  import Tabs from '@/components/tabs'
  import flowMap from '@/components/flowMap'

  export default {
    name: 'AttendanceApplicationList',

    components: {
      Tabs,
    },

    mixins: [mixin.tabs.attendance, mixin.routerQuery, mixin.pl],

    data() {
      return {
        breadcrumb: this.$breadcrumb(null, 'attendance'),
        list: [],
        loading: false,
        pagination: {
          total: 0,
        },
      }
    },

    created() {
      this.fetch()
    },

    methods: {
      fetch() {
        const url = this.$api.services.application.list
        const { currentPage, pageSize } = this.pagination

        this.loading = true
        this
          .$axios
          .post(url, {
            type: 4,
            per_page: pageSize,
            page: currentPage,
            keywords: this.keywords,
          })
          .then((res) => {
            const { list, count } = res.data
            this.list = list
            this.pagination.total = Number(count)
            this.$store.dispatch('update_unread_message', { type: '1', module: '2' })
          })
          .catch(() => {})
          .then(() => {
            this.loading = false
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
        const modluePath = flowMap[code]
        let path

        if (submit) {
          path = `/attendance/create/${modluePath}/${code}/${id}`
        } else if (status === 91 || status === 93) {
          path = `/attendance/application/${modluePath}/${code}/${id}?status=${status}`
        } else {
          path = `/attendance/application/${modluePath}/${code}/${id}`
        }

        this.$router.push(path)
      },
    },
  }
</script>

<style lang="scss">
  @import '../../assets/scss/tabs-panel.scss';
</style>
