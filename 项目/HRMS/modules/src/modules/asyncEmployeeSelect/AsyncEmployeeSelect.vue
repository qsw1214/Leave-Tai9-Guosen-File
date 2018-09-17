<template>
  <div class="m__rsync-employee-select">
    <div class="choosed">
      <div class="choosed--title">选中用户列表</div>
      <div class="choosed--content">
        <el-tag
          closable
          size="medium"
          v-for="tag in employeeChoosed"
          :key="tag.id"
          :hit="false"
          @close="removeTag(tag)">
          {{ tag.name }}({{ tag.emp_code }})
        </el-tag>
        <span
          class="unchoose"
          v-if="employeeChoosed.length === 0">尚未选择</span>
      </div>
    </div>

    <el-row class="block-margin-bottom">
      <m-cascader
        :width="240"
        :organization.sync="organization"
        @fetchCompleted="init"
        @selectCompleted="getEmployee" />

      <el-input
        class="search"
        v-model="keyword"
        :placeholder="placeholder"
        @keyup.enter.native="getEmployee">
        <el-button
          icon="el-icon-search"
          slot="append"
          @click="getEmployee" />
      </el-input>
    </el-row>

    <m-table
      :data="employeeList"
      :total="pagination.total"
      :current-page="pagination.currentPage"
      :page-size="pagination.pageSize"
      @current-change="pageChange"
      @size-change="sizeChange">
      <template slot-scope="props">
        <el-table
          v-loading="loading"
          border
          stripe
          max-height="400"
          row-key="id"
          :data="props.data"
          @row-click="choose">
          <el-table-column
            label="姓名"
            align="center"
            prop="name" />
          <el-table-column
            label="员工ID"
            align="center"
            prop="emp_code" />
          <el-table-column
            label="所属组织"
            align="center"
            prop="org_name" />
          <el-table-column
            label="职位名称"
            prop="job_name"
            align="center" />
        </el-table>
      </template>
    </m-table>
  </div>
</template>

<script>
  export default {
    name: 'MRsyncEmployeeSelect',

    props: {
      employee: {
        type: Array,
        default: () => [],
      },

      placeholder: {
        type: String,
        default: '输入员工ID或姓名进行查询',
      },

      multiple: {
        type: Boolean,
        default: true,
      },
    },

    data() {
      return {
        employeeChoosed: [].concat(this.employee),
        employeeList: [],
        organization: '',
        keyword: '',
        loading: false,
        pagination: {
          total: 0,
          pageSize: 20,
          currentPage: 1,
        },
      }
    },

    watch: {
      employee(newValue) {
        this.employeeChoosed = [].concat(newValue)
      },
    },

    methods: {
      removeTag(item) {
        const index = this.employeeChoosed.indexOf(item)
        this.employeeChoosed.splice(index, 1)

        this.selected()
      },

      init(data) {
        this.organization = data[0].id
        this.getEmployee()
      },

      getEmployee() {
        this.loading = true
        this
          .$axios
          .post(this.$api.common.employee, {
            org_id: this.organization,
            keywords: this.keyword.trim(),
            per_page: this.pagination.pageSize,
            page: this.pagination.currentPage,
          })
          .then(({ data }) => {
            const { list, count } = data
            this.employeeList = list
            this.pagination.total = Number(count)
          })
          .catch(() => {})
          .then(() => {
            this.loading = false
          })
      },

      pageChange(page) {
        this.pagination.currentPage = Number(page)
        this.getEmployee()
      },

      sizeChange(size) {
        this.pagination.pageSize = Number(size)
        this.getEmployee()
      },

      choose(row) {
        const { id } = row
        const hasExist = this.employeeChoosed
          .map(item => item.id).includes(id)
        const temp = Object.assign({}, row)

        if (!hasExist) {
          if (this.multiple) this.employeeChoosed.push(temp)
          else this.employeeChoosed = [temp]
        }

        this.selected()
      },

      selected() {
        this.$emit('selected', this.employeeChoosed)
      },
    },
  }
</script>

<style lang="scss">
  .m__rsync-employee-select {
    .choosed {
      display: flex;
      margin-bottom: 14px;
      line-height: 34px;

      &--title {
        margin-right: 17px;
        width: 100px;
      }

      &--content {
        flex: 1;

        .el-tag {
          margin-right: 5px;
        }
      }
    }

    .unchoose {
      color: #999;
    }
  }
</style>
