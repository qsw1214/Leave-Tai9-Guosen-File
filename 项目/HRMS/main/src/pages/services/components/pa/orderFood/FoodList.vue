<template>
  <div class="m-section food-list">

    <div class="block-margin-bottom">
      <div
        class="selected-menu"
        v-show="!!currentMenuName">
        {{ currentMenuName }}
        <el-button
          class="error"
          type="text"
          icon="el-icon-circle-close"
          @click="delMenu" />
      </div>

      <el-input
        class="search"
        placeholder="输入商家名称或商品名称搜索"
        v-model="search"
        @keyup.enter.native="doSearch">
        <el-button
          icon="el-icon-search"
          slot="append"
          @click="doSearch" />
      </el-input>
    </div>

    <m-table
      is-pagination
      :total="total"
      :is-update-router="false"
      :page-size="per_page"
      :page-sizes="[10, 20, 50]"
      :data="foodList"
      @current-change="changePage"
      @size-change="changeSize">

      <template slot-scope="props">
        <el-table
          max-height="420"
          width="100%"
          highlight-current-row
          stripe
          border
          ref="table"
          :data="foodList"
          @current-change="select">
          <el-table-column
            prop="b_district_value"
            align="center"
            label="商家区域" />

          <el-table-column
            prop="b_name"
            align="center"
            label="商家名称" />

          <el-table-column
            min-width="350"
            prop="p_name"
            align="center"
            label="商品名称" />

          <el-table-column
            prop="p_type_value"
            align="center"
            label="商品类别" />

          <el-table-column
            prop="p_price"
            align="center"
            label="商品价格">
            <template slot-scope="scope">
              {{ scope.row.p_price }}元/{{ scope.row.p_unit }}
            </template>
          </el-table-column>
        </el-table>
      </template>
    </m-table>
  </div>
</template>

<script>
  export default {
    name: 'FoodList',

    props: {
      // 根据办公地点过滤
      district: {
        type: String,
        default: '',
      },
    },

    data() {
      return {
        originList: [],
        per_page: 10,
        page: 1,
        search: '',
        keywords: '',
        currentMenu: null,
      }
    },

    computed: {
      currentMenuName() {
        let name = ''
        const { currentMenu } = this

        if (currentMenu) {
          name = `${currentMenu.b_name} - ${currentMenu.p_name}`
        }

        return name
      },

      foodList() {
        const { originList, district, per_page, page } = this
        let list = originList

        if (district) {
          list = list.filter(item => item.b_district_value.includes(district))
        }

        return list.slice((page - 1) * per_page, per_page * page)
      },

      total() {
        const { originList, district } = this
        let list = originList

        if (district) {
          list = list.filter(item => item.b_district_value.includes(district))
        }

        return list.length
      },
    },

    created() {
      this.fetch()
      this.$on('delMenu', this.delMenu)
    },

    methods: {
      fetch() {
        const { keywords } = this
        this.$axios.get(this.$api.services.foodList, {
          params: { keywords },
        })
          .then((res) => {
            const { data } = res
            this.originList = data.list
          })
      },

      changePage(page) {
        this.page = page
      },

      changeSize(size) {
        this.per_page = size
        this.page = 1
      },

      select(val) {
        if (!val) return
        this.currentMenu = val
        this.$emit('selectMenuItem', val)
      },

      delMenu() {
        this.currentMenu = null
        this.$refs.table.setCurrentRow()
        this.$emit('selectMenuItem', null)
      },

      doSearch() {
        this.keywords = this.$utils.tools.splitKeyword(this.search).join(',')
        this.page = 1
        this.fetch()
      },
    },
  }
</script>

<style type="text/scss" lang="scss">

  .page--pa-order-food {
    .food-list {
      padding: 18px 20px 22px 20px;

      &--header {
        margin-bottom: 10px;
      }

      .el-table__row:hover {
        cursor: pointer;
      }

      .el-col-16 {
        min-height: 1px;
      }

      .selected-menu {
        line-height: 34px;

        .error {
          vertical-align: top;
          margin-left: 3px;
        }
      }
    }
  }

</style>
