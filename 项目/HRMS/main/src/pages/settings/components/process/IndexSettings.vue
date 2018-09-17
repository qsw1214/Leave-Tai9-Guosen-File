<template>
  <div class="page-process-index-default">

    <div class="block-margin-bottom">
      <el-button
        v-permission="1040003"
        icon="el-icon-success"
        @click="clickEnable">启用
      </el-button>
      <el-button
        v-permission="1040003"
        @click="clickDisabled">
        <m-icon-forbidden />禁用
      </el-button>
      <el-button
        v-permission="1040003"
        icon="el-icon-upload2"
        @click="handlerClick('export')">导出
      </el-button>

      <el-input
        class="search"
        placeholder="输入流程名称或状态进行搜索"
        v-model="keyword"
        @keyup.enter.native="search">
        <el-button
          icon="el-icon-search"
          slot="append"
          @click="search" />
      </el-input>
    </div>

    <m-table
      is-full-table
      ref="mtable"
      :loading="loading"
      :data="showData"
      :total="showData.length"
      :remote="false"
      :current-page="currentPage">
      <template slot-scope="props">
        <el-table
          border
          stripe
          :max-height="props.maxHeight - 20"
          :data="props.data"
          @row-dblclick="clickSkip('details', $event)"
          @selection-change="selectionChange">
          <el-table-column
            type="selection"
            column-key="select"
            align="center"
            class-name="checkbox autotest-checkbox"
            width="75" />

          <el-table-column
            label="流程名称"
            align="center"
            class-name="autotest-name"
            prop="name" />

          <el-table-column
            label="适用组织范围"
            align="left"
            header-align="center"
            class-name="autotest-range"
            width="300"
            prop="name">
            <template slot-scope="scope">
              <m-tag-multiple
                class="cell--tag-multiple"
                v-if="scope.row.org_list.length > 0"
                :data="scope.row.org_list"
                @more="showMoreTags" />
            </template>
          </el-table-column>

          <el-table-column
            label="适用人员类型"
            align="center"
            width="180"
            class-name="autotest-type"
            prop="name">
            <template slot-scope="scope">
              {{ scope.row.applier_status_list
              .map(item => item.status_name).join('，') }}
            </template>
          </el-table-column>

          <el-table-column
            label="状态"
            align="center"
            class-name="autotest-statusName"
            prop="status_name"
            width="120" />

          <el-table-column
            label="操作"
            align="center"
            prop="operate"
            class-name="autotest-options"
            column-key="operate"
            fixed="right"
            width="180">
            <template slot-scope="scope">
              <el-button
                type="text"
                v-if="$permission.valid('1040003')"
                @click="editProcess(scope.row)">编辑
              </el-button>
              <el-button
                type="text"
                v-if="$permission.valid('1040003') && scope.row.approval_type != 1024"
                @click="clickSkip('setting', scope.row)">设置
              </el-button>
              <el-button
                type="text"
                v-if="scope.row.approval_type != 1024"
                @click="clickSkip('details', scope.row)">查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </m-table>

    <m-tags-dialog
      title="适用组织范围"
      :tags="tagsDialogData"
      :table-head="['组织编码', '组织名称']"
      :show-tags-dialog="isShowTagsDialog"
      @close="closeTagsDialog" />

    <el-dialog
      title="流程信息编辑"
      custom-class="dialog-process-index"
      :visible.sync="isShowEdit">
      <el-form
        v-loading="loadingConfigData"
        class="form-edit"
        label-position="left"
        label-width="150px"
        ref="form"
        :model="formData"
        :rules="formRules">
        <el-form-item label="流程名称">
          {{ formData.name }}
        </el-form-item>
        <el-form-item
          label="适用人员类型"
          prop="applier_statuses">
          <multiple-select
            multiple
            placeholder="请选择"
            v-model="formData.applier_statuses">
            <el-option
              v-for="(item, key) in employeeOptions.job_status"
              :label="item"
              :value="key"
              :key="'job-status' + key" />
          </multiple-select>
        </el-form-item>
        <el-form-item
          label="状态"
          prop="status">
          <el-select v-model="formData.status">
            <el-option
              label="禁用"
              :value="0" />
            <el-option
              label="启用"
              :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="适用组织范围"
          prop="org_ids">
          <el-tree
            node-key="id"
            show-checkbox
            v-if="isShowEdit"
            ref="formTree"
            :data="organizations"
            :props="treeProps"
            :indent="16"
            :default-expanded-keys="treeExpandedKeys"
            :default-checked-keys="formData.org_ids" />
        </el-form-item>
        <el-form-item
          label="外链地址"
          prop="link_url"
          v-if="formDataType == 1024">
          <el-input
            placeholder="http://"
            v-model="formData.link_url" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="save">保存
          </el-button>
          <el-button
            type="info"
            @click="handlerClick('cancel')">取消
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  /*
  * @description 流程管理 > 流程设置
  * @route /process/index
  */
  import { mapMutations, mapState } from 'vuex'
  import { process as processManage } from '~settings/store/mutationTypes'

  export default {
    data() {
      const { page, size, keyword } = this.$route.query

      // 组织勾选验证
      const validatorOrgIds = (rule, value = [], callback) => {
        if (value.length === 0) {
          callback(new Error('请勾选适用组织范围'))
          return
        }
        callback()
      }
      // 使用人员验证
      const validatorTypes = (rule, value = [], callback) => {
        if (value.length === 0) {
          callback(new Error('请选择使用人员类型'))
          return
        }
        callback()
      }

      return {
        data: [],
        loading: false,
        operating: false,
        currentPage: parseInt((page || 1), 10),
        pageSize: parseInt((size || 20), 10),
        isShowEdit: false,
        selectedItems: [],
        loadingConfigData: false,
        organizations: [],
        employeeOptions: [],
        keyword: keyword || '',
        cachedKeyword: keyword || '',
        treeProps: {
          children: 'children',
          label: 'name',
        },
        isShowTagsDialog: false,
        tagsDialogData: [],
        formDataType: 0,
        formData: {
          name: '',
          status: 0,
          applier_statuses: [],
          org_ids: [],
          link_url: '',
          id: '',
        },
        formRules: {
          status: {
            required: true,
            trigger: 'blur',
            message: '请选择状态',
          },
          applier_statuses: {
            required: true,
            trigger: 'blur',
            message: '请选择使用人员类型',
            validator: validatorTypes,
          },
          org_ids: {
            required: true,
            trigger: 'blur',
            message: '请勾选适用组织范围',
            validator: validatorOrgIds,
          },
        },
      }
    },
    computed: {
      ...mapState({
        showData: state => state.process.settingList || [],
      }),
      treeExpandedKeys() {
        return this.organizations.map(item => item.id)
      },
    },
    created() {
      this.getData()
      this.getConfigData()
    },
    methods: {
      ...mapMutations({
        updateList: processManage.updateSettingList,
        updateCurrent: processManage.updateSettingCurrent,
      }),
      // 获取列表数据
      getData() {
        this.loading = true
        this.$axios({
          url: this.$api.settings.process.list,
        })
          .then(({ code, data }) => {
            this.loading = false
            if (code === 0) {
              this.data = data.list

              if (this.keyword) {
                const showData = this.$utils.tools
                  .arraySearch(this.data, ['name', 'status_name'], this.keyword)
                this.updateList(showData)
              } else {
                this.updateList(this.data)
              }
            }
          }).catch(() => {
            this.loading = false
          })
      },
      // 编辑保存
      save() {
        this.formData.org_ids = this.$refs.formTree.getCheckedKeys()
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.loadingConfigData = true
            const submitData = Object.assign({}, this.formData)
            submitData.applier_statuses = submitData.applier_statuses
              .reduce((prev, next) => Number(prev) + Number(next))
            this.$axios({
              url: this.$api.settings.process.configEdit,
              method: 'post',
              data: submitData,
            })
              .then((data) => {
                this.loadingConfigData = false
                if (data.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '流程信息编辑已保存',
                  })
                  this.isShowEdit = false
                  this.getData()
                }
              }).catch(() => {
                this.loadingConfigData = false
              })
          }
        })
      },
      // 获取流程配置数据
      editProcess(row) {
        this.formDataType = row.approval_type
        this.formData.status = row.status
        this.formData.id = row.id
        this.formData.name = row.name
        this.formData.link_url = row.link_url || ''
        if (row.applier_status_list.filter(item => item.status === 'all').length > 0) {
          this.formData.applier_statuses = Object.keys(this.employeeOptions.job_status)
        } else {
          this.formData.applier_statuses =
            row.applier_status_list.map(item => item.status.toString())
        }
        this.formData.org_ids = row.org_list.map(item => item.id)
        this.isShowEdit = true
      },
      // 获取编辑配置数据
      // 此处没有采取组件内获取数据，外部获取数据填充
      getConfigData() {
        this.loadingConfigData = true
        // 组织状态树获取
        const org = this.$axios({
          url: this.$api.common.organizationLevel,
        }).then(result => result).catch(e => e)
        // 员工状态获取
        const status = new Promise((resolve, reject) => {
          const result = this.$store.getters['EMPLOYEE_OPTIONS/get']
          if (result) {
            resolve(result)
          } else {
            this.$store.registerModule('EMPLOYEE_OPTIONS', this.$utils.config.dictionary.employee.employee)
            this.$store.dispatch('EMPLOYEE_OPTIONS/get')
              .then((options) => {
                resolve(options)
              }).then((e) => { reject(e) })
          }
        }).then(result => result).catch(e => e)
        Promise.all([org, status])
          .then((results) => {
            this.loadingConfigData = false
            const resultOrg = results[0]
            if (resultOrg.code === 0) {
              this.organizations = [resultOrg.data]
            }
            this.employeeOptions = results[1]
          }).catch(() => {
            this.loadingConfigData = false
          })
      },
      // 发送勾选请求
      sendSelected(type, callback) {
        if (this.operating) return
        if (type === 'export') this.operating = true
        let ids = []
        if (this.selectedItems.length > 0) {
          ids = this.selectedItems.map(item => item.id)
        } else {
          ids = this.showData.map(item => item.id)
        }

        this.$axios({
          url: this.$api.settings.process.listSelected,
          method: 'post',
          data: {
            type,
            ids: ids.join(','),
          },
        }).then((data) => {
          if (data.code === 0) {
            callback(data)
          }
        }).catch(() => {})
          .then(() => {
            if (type === 'export') this.operating = false
          })
      },
      // 列表勾选回调
      selectionChange(items) {
        this.selectedItems = items
      },
      // 显示使用组织范围弹层
      showMoreTags(data) {
        this.tagsDialogData = data
        this.isShowTagsDialog = true
      },
      // 关闭编辑弹层
      closeTagsDialog() {
        this.isShowTagsDialog = false
        this.tagsDialogData = []
      },
      // 搜索查找
      search() {
        const { query } = this.$route
        const keyword = this.keyword.trim()

        this.$router.replace({
          query: Object.assign({}, query, { page: 1, keyword }),
        })

        this.currentPage = 1
        let newShowData = []
        if (keyword) {
          newShowData = this.$utils.tools
            .arraySearch(this.data, ['name', 'status_name'], keyword)
        } else {
          newShowData = this.data
        }
        this.updateList(newShowData)
      },
      // 点击启用
      clickEnable() {
        if (this.selectedItems.length === 0) {
          this.$message({
            type: 'error',
            message: '请先勾选一条待启用的流程',
          })
        } else {
          this.$confirm('确认启用所勾选的流程吗？', '提示', {
            type: 'warning',
          }).then(() => {
            this.sendSelected('start', () => {
              this.$message({
                type: 'success',
                message: '勾选流程已启用',
              })
              this.getData()
            })
          }).catch(() => {})
        }
      },
      // 点击禁用
      clickDisabled() {
        if (this.selectedItems.length === 0) {
          this.$message({
            type: 'error',
            message: '请先勾选一条待禁用的流程',
          })
        } else {
          this.$confirm('确认禁用所勾选的流程吗？', '提示', {
            type: 'warning',
          }).then(() => {
            this.sendSelected('stop', () => {
              this.$message({
                type: 'success',
                message: '勾选流程已禁用',
              })
              this.getData()
            })
          }).catch(() => {})
        }
      },
      // 点击操作
      handlerClick(type) {
        switch (type) {
        case 'cancel':
          this.isShowEdit = false
          break
        case 'export':
          this.sendSelected('export', (data) => {
            this.$utils.tools.windowOpen(data.data.url)
          })
          break
        default:
          break
        }
      },
      // 点击跳转页面查看
      clickSkip(type, row) {
        switch (type) {
        case 'setting':
          this.$router.push({
            path: `/process/details/${row.id}?edit=true`,
          })
          break
        case 'details':
          this.$router.push({
            path: `/process/details/${row.id}`,
          })
          break
        default:
          break
        }
      },
    },
  }
</script>

<style lang="scss" type="text/scss">
.page-process-index-default {
  .dialog-process-index {
    width: 600px;
    min-width: 600px;

    .form-edit {
      margin-left: 40px;

      .el-tree {
        max-width: 260px;
        max-height: 338px;
      }

      .el-input {
        width: 260px;
      }

      .el-form-item:last-child {
        padding-top: 12px;
        margin-bottom: 0;
      }
    }
  }
}
</style>
