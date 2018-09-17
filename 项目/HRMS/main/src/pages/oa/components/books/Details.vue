<template>
  <div
    v-loading="loading"
    class="page page-book-details">
    <m-breadcrumb :items="breadcrumb" />
    <div
      class="btn-handle"
      v-if="isEdit || isCreate">
      <div v-if="isCreate">
        <el-button
          icon="el-icon-edit"
          type="primary"
          @click="toCreate(true)">编辑</el-button>
        <el-button
          icon="el-icon-plus"
          @click="toCreate(false)">继续新建</el-button>
      </div>
      <div v-if="isEdit">
        <el-button
          icon="el-icon-edit"
          type="primary"
          @click="toCreate(true)">编辑</el-button>
        <el-button
          icon="el-icon-caret-left"
          :disabled="isPrev"
          @click="clickPrev">上一条
        </el-button>
        <el-button
          :disabled="isNext"
          @click="clickNext">下一条<i class="el-icon-caret-right el-icon--right" />
        </el-button>
      </div>
    </div>

    <m-section title="图书信息">
      <m-section-row>
        <m-section-cell title="图书编码">
          {{ data.code }}
        </m-section-cell>
      </m-section-row>

      <m-section-row>
        <m-section-cell title="图书名称">
          {{ data.name }}
        </m-section-cell>
        <m-section-cell title="图书状态">
          {{ data.status_name }}
        </m-section-cell>
      </m-section-row>

      <m-section-row>
        <m-section-cell title="总体库存">
          {{ data.total }}
        </m-section-cell>
        <m-section-cell title="计量单位">
          {{ data.unit_name }}
        </m-section-cell>
      </m-section-row>

      <m-section-row>
        <m-section-cell title="可借数量">
          {{ data.count }}
        </m-section-cell>
        <m-section-cell title="推荐指数">
          <el-rate
            disabled
            text-color="#ff9900"
            v-model="data.recommendation_index" />
        </m-section-cell>
      </m-section-row>

      <m-section-row>
        <m-section-cell title="图书简介">
          {{ data.introduction }}
        </m-section-cell>
      </m-section-row>
    </m-section>

    <m-section
      title="借阅信息">
      <div class="msection-block">
        <m-table
          :data="data.body"
          :total="data.body.length"
          :remote="false"
          :current-page="pageIndex"
          @current-change="changePageIndex">
          <template slot-scope="props">
            <el-table
              border
              stripe
              :data="props.data">
              <el-table-column
                label="借阅人"
                align="center"
                class-name="autotest-name"
                prop="name" />
              <el-table-column
                label="员工ID"
                align="center"
                class-name="autotest-emp_code"
                prop="emp_code" />
              <el-table-column
                label="借阅日期"
                align="center"
                class-name="autotest-borrowing_date"
                prop="borrowing_date" />
              <el-table-column
                label="预计归还日期"
                align="center"
                class-name="autotest-return_date"
                prop="return_date" />
              <el-table-column
                label="借阅状态"
                align="center"
                class-name="autotest-status_name"
                prop="status_name" />
              <el-table-column
                label="实际归还日期"
                align="center"
                class-name="autotest-actual_return_date"
                prop="actual_return_date" />
            </el-table>
          </template>
        </m-table>
      </div>
    </m-section>
  </div>
</template>

<script>
  /**
  * @description 图书详情
  * @router /books/details/:id
  */

  import { mapState } from 'vuex'

  export default {
    data() {
      const { query } = this.$route
      let isEdit = false
      if (query.isEdit) {
        isEdit = true
      }
      let isCreate = false
      if (query.isCreate) {
        isCreate = true
      }
      const breadcrumb = [
        { name: '企业OA' },
        { name: '图书借阅', to: '/books/list/share' },
      ]
      breadcrumb.push({ name: '图书详情' })
      return {
        isEdit,
        isCreate,
        breadcrumb,
        loading: true,
        pageIndex: 1,
        data: {
          body: [],
        },
      }
    },
    computed: {
      ...mapState({
        listData: state => state.books.listShare,
      }),
      detailsIndex() {
        let currentIndex = -1
        this.listData.map((item, index) => {
          if (item.id === this.data.id) {
            currentIndex = index
          }
          return item
        })
        return currentIndex
      },
      isPrev() {
        if (this.listData.length === 0) return true
        if (this.detailsIndex <= 0) return true
        return false
      },
      isNext() {
        if (this.listData.length === 0) return true
        if (this.detailsIndex < 0 || this.detailsIndex === this.listData.length - 1) return true
        return false
      },
    },
    created() {
      this.fetch()
    },
    methods: {
      fetch(id) {
        this.loading = true
        this.$axios({
          method: 'post',
          url: this.$api.oa.books.shareDetails,
          data: {
            id: id || this.$route.params.id,
          },
        })
          .then((data) => {
            this.pageIndex = 1
            this.loading = false
            this.data = data.data
            const lastBreadCrumb = this.breadcrumb[this.breadcrumb.length - 1]
            lastBreadCrumb.name = this.data.name
            if (!this.data.body) {
              this.data.body = []
            }
          }).catch(() => {})
      },
      // 点击上一条
      clickPrev() {
        const prev = this.listData[this.detailsIndex - 1]
        const { query } = this.$route
        this.$router.push({
          path: `/books/details/${prev.id}`,
          query,
        })
        this.fetch(prev.id)
      },
      changePageIndex(value) {
        this.pageIndex = value
      },
      // 点击下一条
      clickNext() {
        const next = this.listData[this.detailsIndex + 1]
        const { query } = this.$route
        this.$router.push({
          path: `/books/details/${next.id}`,
          query,
        })
        this.fetch(next.id)
      },
      toCreate(isEdit) {
        let path = '/books/create'
        if (isEdit) {
          path = `/books/create/${this.data.id}`
        }
        this.$router.push({
          path,
        })
      },
    },
  }
</script>

<style lang="scss" type="text/scss">
.page-book-details .el-rate {
  position: relative;
  top: 1px;
}

.page-book-details .msection-block {
  margin: 18px 20px 22px 20px;
}
</style>
