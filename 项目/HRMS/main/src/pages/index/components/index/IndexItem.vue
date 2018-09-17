<template>
  <div
    v-loading="loading.index"
    class="page--index-item">
    <div
      class="page--index-item-head"
      :class="{ 'is-list': isList }">
      <h3 class="title">{{ title }}</h3>
      <div class="operate">
        <span class="total">共{{ pagination.total }}条</span>
        <el-button
          class="more"
          type="text"
          v-if="pagination.total > 5"
          @click="toggleDialog">更多<i class="el-icon-arrow-right" /></el-button>
      </div>
    </div>

    <div class="page--index-item-body">
      <list
        v-if="uri && items.index.length"
        :items="items.index"
        @jump="jump" />

      <div
        class="empty"
        v-else-if="uri && !items.index.length">暂无数据</div>

      <slot />
    </div>

    <el-dialog
      :visible.sync="showDialog"
      :title="title"
      @open="open">
      <list
        v-loading="loading.dialog"
        :items="items.dialog"
        @jump="jump" />

      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        ref="pagination"
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        :page-sizes="[20, 50, 100]"
        :total="pagination.total"
        @size-change="changeSize"
        @current-change="changePage" />
    </el-dialog>
  </div>
</template>

<script>
  import List from './List'

  export default {
    name: 'IndexItem',
    components: { List },

    props: {
      title: {
        type: String,
        required: true,
      },

      isList: {
        type: Boolean,
        default: false,
      },

      // fetch list api
      uri: {
        type: String,
        default: '',
      },
    },

    data() {
      return {
        loading: {
          index: false,
          dialog: false,
        },

        items: {
          index: [],
          dialog: [],
        },

        pagination: {
          currentPage: 1,
          pageSize: 20,
          total: 0,
        },

        showDialog: false,
      }
    },

    created() {
      if (this.uri) this.fetch('index')
    },

    methods: {
      fetch(type) {
        const { currentPage, pageSize } = this.pagination

        this.loading[type] = true
        this.$axios
          .get(this.uri, {
            params: {
              page: type === 'index' ? 1 : currentPage,
              per_page: type === 'index' ? 5 : pageSize,
            },
          })
          .then(({ data }) => {
            this.items[type] = data.list
            this.pagination.total = data.count
          })
          .catch(() => {})
          .then(() => {
            this.loading[type] = false
          })
      },

      toggleDialog() {
        this.showDialog = !this.showDialog
      },

      open() {
        this.fetch('dialog')
      },

      changeSize(size) {
        Object.assign(this.pagination, {
          currentPage: 1,
          pageSize: size,
        })

        this.fetch('dialog')
      },

      changePage(page) {
        this.pagination.currentPage = page
        this.fetch('dialog')
      },

      jump(item) {
        this.$emit('jump', item)
      },
    },
  }
</script>

<style lang="scss">
  .page--index-item {
    &-head {
      padding-left: 10px;
      padding-right: 14px;
      position: relative;

      &.is-list {
        line-height: 54px;
        margin: 0;
        border-bottom: 1px solid #e9e9e9;
      }

      .title {
        font-size: 18px;
        line-height: 1;
        color: #000;
        font-weight: 500;
        margin: 14px 0 14px;
        position: relative;
        padding-left: 12px;

        &::before {
          content: "";
          height: 18px;
          width: 4px;
          background-color: #5090f7;
          position: absolute;
          left: 0;
          top: 50%;
          margin-top: -9px;
        }
      }

      .operate {
        position: absolute;
        top: 0;
        right: 14px;
        line-height: 16px;
        font-size: 14px;

        .more {
          font-size: 14px;
          margin-left: 12px;
          padding: 0;
        }
      }
    }

    .list {
      list-style: none;
      margin: 0;
      padding: 0;

      &--item {
        border-bottom: 1px dashed #e5e5e5;
        line-height: 1;
        margin-left: 20px;
        padding: 14px 14px 14px 0;
        cursor: pointer;

        &:hover .list--item-title {
          color: #5090f7;
        }

        &:last-child {
          border-bottom: 0;
        }

        &-title {
          font-size: 16px;
          margin-bottom: 12px;
        }

        &-meta {
          color: #999;
          display: flex;

          span {
            display: block;
            flex: 1;
          }

          .date {
            text-align: right;
          }
        }
      }
    }

    .empty {
      padding: 14px 14px 14px 20px;
    }

    .el-dialog {
      &__body {
        padding: 0 0 20px 0;
      }

      .list {
        height: 50vh;
        overflow-y: auto;
      }

      .el-pagination {
        margin-top: 20px;
        margin-right: 20px;
      }
    }
  }
</style>

