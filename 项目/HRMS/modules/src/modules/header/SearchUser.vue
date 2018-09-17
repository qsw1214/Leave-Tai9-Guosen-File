<template>
  <div
    class="search"
    v-show="visible"
    id="search-user">

    <el-input
      class="search--input"
      placeholder="找人：输入姓名、员工ID、手机号码或短号"
      v-model="keyword"
      @keyup.enter.native="search"
      @change="reset">
      <el-button
        class="search--button"
        icon="el-icon-search"
        slot="append"
        @click="search" />
    </el-input>

    <el-collapse-transition>
      <ul
        class="search--result"
        v-show="show"
        ref="list">
        <li
          class="search--result-item"
          v-if="users && !users.length">
          <div class="empty">未搜索到匹配的数据。</div>
        </li>

        <template v-else-if="users && users.length">
          <li
            class="search--result-item"
            v-for="user in users"
            :key="user.id"
            @click="jump(user)">
            <div class="avatar">
              <img
                class="avatar"
                :src="user.avatar_url">
            </div>
            <div class="info">
              <div class="info--name">{{ user.name }}</div>
              <div class="info--extra">
                <span>{{ user.org_name }}</span>
                <span v-if="user.job_name">&middot; {{ user.job_name }}</span>
                <span v-if="user.emp_code">&middot; {{ user.emp_code }}</span>
              </div>
            </div>
          </li>
        </template>

        <li
          class="search--result-item item-more"
          ref="loader">
          <div
            class="more"
            v-if="isLast">没有更多了</div>
          <div
            class="more"
            v-else><i class="el-icon-loading" />加载数据中...</div>
        </li>
      </ul>
    </el-collapse-transition>

    <el-dialog
      custom-class="search-dialog"
      width="460px"
      :visible.sync="dialogVisibility">
      <div
        class="search-dialog--body"
        v-if="user">

        <div class="header">
          <div class="avatar">
            <img :src="user.avatar_url">
          </div>
          <div class="info">
            <div class="info--name">{{ user.name }}</div>
            <div class="info--extra">
              <span>{{ user.org_name }}</span>
              <span v-if="user.job_name">&middot; {{ user.job_name }}</span>
              <span v-if="user.emp_code">&middot; {{ user.emp_code }}</span>
            </div>
          </div>
        </div>

        <div class="item">
          <div class="item--row">
            <div class="label">手机号码</div>
            <div class="content">{{ user.mobile || '暂无' }}</div>
          </div>
          <div class="item--row">
            <div class="label">办公电话</div>
            <div class="content">{{ user.office_phone || '暂无' }}</div>
          </div>
        </div>

        <div class="item">
          <div class="item--row">
            <div class="label">短号</div>
            <div class="content">{{ user.mobile_short || '暂无' }}</div>
          </div>
          <div class="item--row">
            <div class="label">微信号</div>
            <div class="content">{{ user.weixin_num || '暂无' }}</div>
          </div>
        </div>

        <div class="item">
          <div class="item--row">
            <div class="label">内网邮箱</div>
            <div class="content">{{ user.email_inside || '暂无' }}</div>
          </div>
          <div class="item--row">
            <div class="label">外网邮箱</div>
            <div class="content">{{ user.email_outside || '暂无' }}</div>
          </div>
        </div>

      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'SearchUser',

    data() {
      const { path } = this.$route
      const visible = path === '/index'

      return {
        keyword: '',
        page: 1,
        per_page: 20,
        total: 0,
        isLast: false,
        users: null,
        show: false,
        loading: false,
        dialogVisibility: false,
        user: null,
        visible,
      }
    },

    watch: {
      $route(newVal) {
        if (newVal.path === '/index') this.visible = true
        else this.visible = false
      },
    },

    mounted() {
      document.addEventListener('click', this.hideResult)
    },

    unmounted() {
      document.removeEventListener('click', this.hideResult)
    },

    methods: {
      reset() {
        this.isLast = false
        this.page = 1
        this.users = null
      },

      search() {
        const { page, per_page, keyword } = this

        if (this.loading || this.isLast) return false
        if (!keyword) {
          this.$message.error('关键词不能为空')
          return false
        }

        if (!this.show) {
          this.$refs.list.addEventListener('scroll', this.search)
          this.show = true
        }

        const { offsetTop } = this.$refs.loader
        const { scrollTop } = this.$refs.list
        const listHeight = this.$refs.list.offsetHeight

        if (scrollTop + listHeight < offsetTop) return false

        const keywords = keyword ? this.$utils.tools.splitKeyword(keyword).join(',') : ''

        this.loading = true
        this.$axios
          .get(this.$api.common.search, {
            params: { page, per_page, keywords },
            showProgressBar: false,
          })
          .then(({ data }) => {
            this.total = data.count
            if (!this.users) this.users = data.list
            else this.users = this.users.concat(data.list)

            if (this.users.length === data.count) this.isLast = true
            else this.page += 1
          })
          .catch(() => {})
          .then(() => {
            this.loading = false
          })

        return true
      },

      jump(user) {
        this.show = false
        this.isLast = false
        this.page = 1

        setTimeout(() => {
          this.users = null
        }, 300)

        this.user = user
        this.dialogVisibility = true
      },

      hideDialog() {
        this.dialogVisibility = false
      },

      hideResult(e) {
        let el = e.srcElement || e.target

        while (el) {
          if (el !== document) {
            if (el.id === 'search-user') return
            el = el.parentNode
          } else {
            this.$refs.list.removeEventListener('scroll', this.search)
            this.show = false

            setTimeout(() => {
              this.isLast = false
              this.page = 1
              this.users = null
            }, 300)
            return
          }
        }
      },
    },
  }
</script>

<style lang="scss">
  .m-header {
    .search {
      position: absolute;
      width: 330px;
      height: 60px;
      top: 0;
      left: 20px;
      text-align: left;

      &--input {
        .el-input__inner {
          padding-left: 10px;
          padding-right: 10px;
          height: 30px;
          line-height: 30px;
        }
      }

      .el-input-group__append {
        min-width: 30px;
        max-width: 30px;
        overflow: hidden;
      }

      &--button {
        min-width: auto !important;

        &:hover {
          color: #666;
        }

        i {
          margin-top: -2px;
        }
      }

      &--result {
        background-color: #fff;
        border: 1px solid #e9e9e9;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        margin: 0;
        padding: 0;
        position: absolute;
        left: 0;
        top: 54px;
        min-width: 330px;
        max-height: 420px;
        overflow-y: auto !important;
        z-index: 10;

        &-item {
          padding: 14px 0;
          margin-left: 14px;
          border-bottom: 1px solid #e9e9e9;
          display: flex;
          cursor: default;

          &:last-child {
            border-bottom: 0;
          }

          &.item-more {
            padding: 0;
            margin-left: 0;
          }

          .avatar {
            margin-right: 5px;
            width: 46px;
            height: 46px;
            font-size: 0;

            img {
              border-radius: 50%;
            }
          }

          .info {
            flex: 1;
            line-height: 1;
            font-size: 14px;
            margin-top: 5px;

            &--extra {
              margin-top: 8px;
              color: #999;
              line-height: 1.2;
            }
          }
        }
      }

      .more {
        text-align: center;
        flex: 1;

        i {
          font-size: 20px;
          margin-right: 10px;
          vertical-align: middle;
        }
      }
    }

    .search-dialog {
      min-width: auto;

      .el-dialog__header {
        border-bottom: 0;
        height: 120px;
        background: url(../../assets/images/header-search-user-dialog.png) no-repeat center -3px;
        background-size: cover;
        padding: 0;
      }

      .el-dialog__headerbtn {
        right: 12px;
        top: 12px;
      }

      .el-icon-close {
        color: #fff;
        font-size: 22px;
        vertical-align: top;
      }

      .el-dialog__body {
        padding: 0;
      }

      .header {
        display: flex;
        margin: -46px 20px 10px;

        .avatar {
          width: 86px;
          height: 86px;
          padding: 3px;
          background-color: #fff;
          box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.3);
          border-radius: 50%;
          margin-right: 18px;
          font-size: 0;

          img {
            width: 80px;
            border-radius: 50%;
          }
        }

        .info {
          flex: 1;
          margin-top: 10px;

          &--name {
            color: #fff;
            font-size: 26px;
            font-weight: 500;
            margin-bottom: 14px;
            line-height: 26px;
          }

          &--extra {
            color: #999;
          }
        }
      }

      .item {
        display: flex;
        margin-left: 28px;
        border-bottom: 1px solid #e9e9e9;
        padding: 14px 0;

        &:last-child {
          border-bottom: 0;
        }

        &--row {
          width: 50%;
        }

        .label {
          color: #999;
          margin-bottom: 5px;
        }

        .content {
          font-size: 16px;
          font-weight: 500;
        }
      }
    }
  }
</style>
