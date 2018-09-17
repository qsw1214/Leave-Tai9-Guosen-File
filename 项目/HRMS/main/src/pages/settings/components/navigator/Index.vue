<template>
  <div class="page page--index-navigator">

    <m-breadcrumb :items="breadcrumb" />

    <el-row class="block-margin-bottom">
      <el-button
        v-permission="'1050007'"
        type="primary"
        icon="el-icon-plus"
        @click="create">新建</el-button>
      <el-button
        type="plain"
        icon="el-icon-upload2"
        @click="multi('export')">导出</el-button>
      <el-button
        v-permission="'1050007'"
        type="plain"
        icon="el-icon-delete"
        @click="multi('delete')">删除</el-button>

      <el-input
        class="search"
        placeholder="输入系统名称进行搜索"
        v-model="keyword"
        @keyup.enter.native="doSearch">
        <el-button
          icon="el-icon-search"
          slot="append"
          @click="doSearch" />
      </el-input>
    </el-row>

    <m-table
      is-full-table
      :total="pagination.total"
      :loading="loading.table"
      :current-page="pagination.currentPage"
      :page-size="pagination.pageSize"
      :data="list"
      @current-change="pageChange"
      @size-change="sizeChange">

      <template slot-scope="props">
        <el-table
          border
          :max-height="props.maxHeight"
          :data="props.data"
          @selection-change="selectionChange">

          <el-table-column
            type="selection"
            align="center"
            class-name="checkbox autotest-checkbox"
            width="75" />

          <el-table-column
            prop="name"
            class-name="autotest-name"
            align="center"
            label="系统名称" />

          <el-table-column
            prop="url"
            class-name="autotest-url"
            align="center"
            label="链接网址" />

          <el-table-column
            prop="status_name"
            class-name="autotest-status_name"
            align="center"
            label="状态" />

          <el-table-column
            width="75"
            class-name="autotest-actions"
            align="center"
            fixed="right"
            label="操作"
            v-if="$permission.valid('1050007')">
            <template slot-scope="scope">
              <el-button
                type="text"
                icon="el-icon-edit"
                @click="action(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      </template>
    </m-table>

    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      @close="onCloseDialog">
      <el-form
        label-width="115px"
        label-position="right"
        ref="form"
        :rules="rules"
        :model="form">
        <el-form-item
          prop="name"
          label="系统名称">
          <el-input
            maxlength="20"
            auto-complete="off"
            v-model="form.name" />
        </el-form-item>

        <el-form-item
          prop="url"
          label="链接网址">
          <el-input
            auto-complete="off"
            v-model="form.url" />
        </el-form-item>

        <el-form-item
          prop="status"
          label="状态">
          <el-select v-model="form.status">
            <el-option
              value="1"
              label="启用" />
            <el-option
              value="2"
              label="禁用" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <div
            class="page--index-navigator__btn">
            <el-button
              type="primary"
              v-if="!dialog.isEdit"
              :loading="dialog.saveAndCreate || dialog.save"
              @click="saveAndCreate">保存并继续新增</el-button>
            <el-button
              :loading="dialog.save || dialog.saveAndCreate"
              @click="save">保存</el-button>
            <el-button
              type="info"
              @click="dialog.visible = false">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
  import mixins from '@/mixins/routerQuery'

  export default {
    name: 'Navigator',
    mixins: [mixins],

    data() {
      return {
        breadcrumb: [
          { name: '数据管理' },
          { name: '系统链接' },
        ],

        list: [],
        loading: {
          table: false,
          export: false,
          delete: false,
          dialog: false,
        },
        keyword: '',
        form: {
          id: '',
          name: '',
          status: '1',
          url: '',
        },
        rules: {
          name: [
            { required: true, trigger: ['blur'], message: '请填写系统名称' },
          ],
          url: [
            { required: true, trigger: ['blur'], message: '请填写链接网址' },
          ],
          status: [
            { required: true, trigger: ['blur', 'change'], message: '请选择状态' },
          ],
        },
        dialog: {
          visible: false,
          title: '新建',
          save: false,
          saveAndCreate: false,
          isEdit: false,
        },
        selection: [],
        refresh: false,
      }
    },

    created() {
      this.fetch()
    },

    methods: {
      fetch() {
        const { pagination, keyword } = this
        this.loading.table = true
        this.$axios
          .get(this.$api.settings.navigator.list, {
            params: {
              page: pagination.currentPage,
              per_page: pagination.pageSize,
              keywords: keyword ? this.$utils.tools.splitKeyword(keyword).join(',') : '',
            },
          })
          .then(({ data }) => {
            this.list = data.list
            this.pagination.total = data.count
          })
          .catch(() => {})
          .then(() => {
            this.loading.table = false
          })
      },

      initForm(form) {
        const obj = form || {}
        this.form = {
          name: obj.name || '',
          status: obj.status ? `${obj.status}` : '1',
          url: obj.url || '',
          id: obj.id || '',
        }
      },

      create() {
        this.initForm()
        Object.assign(this.dialog, {
          title: '新建',
          visible: true,
          save: false,
          saveAndCreate: false,
          isEdit: false,
        })
      },

      doSave() {
        this.loading.dialog = true
        const params = this.form
        let uri = this.$api.settings.navigator.add

        if (!params.id) delete params.id
        else uri = this.$api.settings.navigator.edit

        this.refresh = true

        return this.$axios
          .post(uri, { ...params })
          .then(() => {
            const msg = this.dialog.isEdit ? '修改' : '新建'
            this.$message.success(`${msg}成功`)
            this.loading.dialog = false
          })
          .catch((e) => {
            this.loading.dialog = false
            return Promise.reject(e)
          })
      },

      save() {
        this.$refs.form
          .validate()
          .then(() => {
            this.dialog.save = true
            return this.doSave()
              .then(() => {
                this.dialog.visible = false
                this.dialog.save = false
              })
          })
          .catch(() => {
            this.dialog.save = false
          })
      },

      saveAndCreate() {
        this.$refs.form
          .validate()
          .then(() => {
            this.dialog.saveAndCreate = true
            return this.doSave()
              .then(this.create)
          })
          .catch(() => {
            this.dialog.saveAndCreate = false
          })
      },

      multi(type) {
        const name = type === 'export' ? '导出' : '删除'

        if (type === 'delete' && !this.selection.length) {
          return this.$message.error(`请先选择要${name}的数据`)
        }

        if (type === 'export') return this.doMulti(type)

        return this
          .$confirm('是否确定删除', '提示', { type: 'warning' })
          .then(() => {
            this.doMulti(type)
          })
          .catch(() => {})
      },

      doMulti(type) {
        this.loading[type] = true
        this.$axios
          .post(this.$api.settings.navigator.multi, {
            type,
            ids: this.selection.map(item => item.id).join(','),
            keywords: this.keywords,
          })
          .then(({ data }) => {
            if (data.url) this.$utils.tools.windowOpen(data.url)
            else {
              this.pagination.currentPage = 1
              this.fetch()
            }

            if (type === 'delete') {
              this.$message.success('删除成功')
            }
          })
      },

      action(row) {
        this.initForm(row)
        Object.assign(this.dialog, {
          title: '编辑',
          visible: true,
          save: false,
          saveAndCreate: false,
          isEdit: true,
        })
      },

      sizeChange(size) {
        Object.assign(this.pagination, {
          currentPage: 1,
          pageSize: size,
        })
        this.fetch()
      },

      pageChange(page) {
        this.pagination.currentPage = page
        this.fetch()
      },

      selectionChange(val) {
        this.selection = val
      },

      onCloseDialog() {
        if (this.refresh) {
          this.pagination.currentPage = 1
          this.$refs.form.clearValidate()
          this.fetch()
          this.refresh = false
        }
      },
    },
  }
</script>

<style lang="scss">
  .page--index-navigator {
    .el-dialog {
      min-width: 650px !important;
      width: 650px !important;
    }

    .el-form {
      margin-left: 40px;
      padding-top: 10px;
    }

    .el-form-item__content {
      width: 353px;
    }

    .el-select {
      width: 100%;
    }

    &__btn {
      white-space: nowrap;
      padding-top: 18px;
      margin-bottom: -12px;
    }
  }
</style>
