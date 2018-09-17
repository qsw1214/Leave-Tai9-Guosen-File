<template>
  <section class="page page--warehouse">
    <m-breadcrumb :items="breadcrumb" />

    <tabs active-name="warehouse">
      <div slot="warehouse">
        <div class="block-margin-bottom">
          <el-input
            placeholder="请输入资料标题搜索"
            class="search"
            v-model="keyword"
            @keyup.enter.native="doSearch">
            <el-button
              icon="el-icon-search"
              slot="append"
              @click="doSearch" />
          </el-input>
        </div>

        <Condition
          ref="condition"
          :data="options"
          @change="changeCondition" />
      </div>
    </tabs>

    <div
      class="items"
      :class="{ 'loading': loading }">
      <Item
        v-for="(item, key) in list"
        :data="item"
        :key="key"
        @click="detail(item)" />
    </div>

    <div
      class="empty"
      v-if="list.length == 0">
      <span>抱歉！未找到相关资料。</span>
    </div>

    <div class="m-table--pagination">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        :page-sizes="[20, 50, 100]"
        :total="pagination.total"
        @size-change="changeSize"
        @current-change="changePage" />
    </div>

  </section>
</template>

<script>
  import mixin from '~oa/mixins'
  import Tabs from './Tabs'
  import Item from './warehouse/Item'
  import Condition from './warehouse/Condition'

  export default {
    name: 'Warehouse',

    components: {
      Tabs,
      Item,
      Condition,
    },

    mixins: [mixin.routerQuery],

    data() {
      const currentYears = new Date().getFullYear()
      const years = []

      for (let i = 2012; i <= currentYears; i += 1) {
        const temp = {}
        temp.name = i
        temp.code = i
        temp.value = i
        temp.origin = 'years'
        years.push(temp)
      }

      return {
        breadcrumb: [
          { name: '企业OA' },
          { name: '知识仓库' },
        ],
        list: [],
        pagination: {
          total: 0,
        },
        loading: true,
        arrOrgs: [],
        options: {
          orgs: [],
          years,
          types: [
            {
              name: '内部文档',
              code: '1',
              value: '1',
              origin: 'types',
            },
            {
              name: '外部文档',
              code: '2',
              value: '2',
              origin: 'types',
            },
            {
              name: '其他',
              code: '4',
              value: '4',
              origin: 'types',
            },
          ],
        },
      }
    },

    created() {
      this
        .getOrgList()
        .then(() => {
          this.fetch()
        })
        .catch(() => {})
    },

    methods: {
      fetch() {
        const { pageSize, currentPage } = this.pagination

        this.loading = true
        this.$axios
          .get(this.$api.oa.warehouse.list, {
            params: {
              per_page: pageSize,
              page: currentPage,
              keywords: this.keyword,
              org_ids: this.$refs.condition.orgs.join(','),
              year: this.$refs.condition.years.join(','),
              type: this.$refs.condition.types.join(','),
            },
          })
          .then((res) => {
            const { list, count } = res.data

            this.pagination.total = count
            this.list = list
          })
          .catch(() => {})
          .then(() => {
            this.loading = false
          })
      },

      getOrgList() {
        const date = this.$utils.tools.formatDate(new Date().getTime())

        return this.$axios
          .post(this.$api.oa.warehouse.orgs, {
            valid_date: date,
          })
          .then((res) => {
            res.data.list.forEach((item) => {
              item.origin = 'orgs'
            })
            this.options.orgs = res.data.list
          })
      },

      changeSize(size) {
        Object.assign(this.pagination, { pageSize: size, currentPage: 1 })
        console.log(size)
        const { query } = this.$route
        this.$router.replace({
          query: Object.assign({}, query, { size }, { page: 1 }),
        })
        this.fetch()
      },

      changePage(page) {
        this.pagination.currentPage = page
        const { query } = this.$route
        this.$router.replace({
          query: Object.assign({}, query, { page }),
        })
        this.fetch()
      },

      changeCondition() {
        this.pagination.currentPage = 1
        const { query } = this.$route
        this.$router.replace({
          query: Object.assign({}, query, { page: 1 }),
        })
        this.fetch()
      },

      detail(item) {
        this.$router.push({
          name: 'warehouseDetails',
          params: {
            id: item.id,
          },
        })
        this.dispatchIds()
      },

      dispatchIds() {
        const ids = this.list.map(item => item.id)
        this.$store.dispatch('saveWarehouseIds', { ids })
      },
    },
  }
</script>

<style lang="scss">
  .page--warehouse {
    .block-margin-bottom {
      .search {
        float: left !important;
      }
    }

    .sticky {
      background: #fff;
      padding: 20px;
    }

    .loading {
      filter: blur(2px);
    }

    .m-table--pagination {
      .el-pagination {
        text-align: right;
      }
    }

    .items {
      .item {
        cursor: pointer;

        .m-section {
          &:hover {
            box-shadow: -4px -4px 40px -12px rgba(0, 0, 0, 0.1) inset;
          }
        }
      }
    }

    .empty {
      height: 280px;
      line-height: 280px;
      background: #fff;
      border: 1px solid #e9e9e9;
      text-align: center;
      font-size: 28px;
      color: #999;
      margin: 20px 0;
    }
  }
</style>
