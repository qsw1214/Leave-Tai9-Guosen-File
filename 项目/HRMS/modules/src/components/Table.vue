<template>
  <div
    class="container"
    style="padding: 40px;">
    <div style="margin: 20px 0; text-align:right; width: 800px;">
      <div style="display: inline-block; width: 300px;">
        <el-input
          class="search"
          placeholder="通过方案名称或者调整类型搜索"
          v-model="keyword"
          @keyup.enter.native="search">
          <el-button
            icon="el-icon-search"
            slot="append"
            @click="search" />
        </el-input>
      </div>
    </div>

    <div style="width: 800px;">
      <m-table
        :data="showData"
        :total="total"
        :is-pagination="isPagination"
        @current-change="changePage"
        @size-change="changeSize">
        <template slot-scope="props">
          <el-table
            border
            stripe
            :data="props.data"
            :total="100">
            <el-table-column
              label="序号"
              align="center"
              prop="index" />
            <el-table-column
              label="调整方案"
              align="center"
              prop="name" />
            <el-table-column
              label="调整类型"
              align="center"
              prop="type" />
          </el-table>
        </template>
      </m-table>
      <el-checkbox v-model="isPagination">显示翻页</el-checkbox>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Table',

    data() {
      return {
        data: [],
        pageSize: 10,
        pageIndex: 1,
        total: 500,
        isPagination: true,
        keyword: '',
        showData: [],
      }
    },
    created() {
      this.getData()
    },
    methods: {
      getData() {
        const listdata = []
        for (let i = 1; i <= this.pageSize; i += 1) {
          const index = ((this.pageIndex - 1) * 10) + i
          const obj = {
            index,
            name: `方案：${index}`,
            type: i % 2 === 0 ? '组织合并?' : '组织变更**',
          }
          listdata.push(obj)
        }
        this.data = listdata
        this.showData = listdata
      },
      changeSize(value) {
        this.pageSize = value
        this.getData()
      },
      changePage(value) {
        this.pageIndex = value
        this.getData()
      },
      search() {
        this.showData = this.$utils.tools.arraySearch(this.data, ['name', 'type'], this.keyword)
      },
    },
  }

</script>
