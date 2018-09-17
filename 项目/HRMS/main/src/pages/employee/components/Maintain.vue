<template>
  <div
    v-loading.fullscreen.lock="preloading"
    class="page page--maintain">

    <m-breadcrumb :items="breadcrumb" />

    <div class="block-margin-bottom">
      <div class="buttons">
        <el-button
          v-permission="1030001"
          type="primary"
          icon="el-icon-plus"
          @click.native="handleOption('add')">新建
        </el-button>
        <el-button
          v-permission="1030001"
          icon="el-icon-download"
          @click.native="handleOption('import')">导入
        </el-button>
        <el-button
          v-permission="1030001"
          icon="el-icon-upload2"
          @click.native="handleOption('export')">导出
        </el-button>
        <el-button
          v-permission="1030001"
          icon="el-icon-upload2"
          @click.native="handleOption('exportZip')">员工履历导出
        </el-button>
      </div>

      <div
        class="case"
        @click="$router.push('/maintain/case')">
        <icon-setting />{{ caseName }}
      </div>
    </div>

    <div class="block-margin-bottom">
      <m-cascader
        placeholder="请选择组织机构"
        v-if="orgLevels.length"
        ref="cascader"
        :organization.sync="organization"
        :input-options="orgLevels"
        :width="240"
        @selectCompleted="selectCompleted" />

      <el-input
        class="search"
        placeholder="输入员工姓名或员工ID进行查询"
        v-model="keyword"
        @keyup.enter.native="handleFilter">
        <el-button
          icon="el-icon-search"
          slot="append"
          @click="handleFilter" />
      </el-input>
    </div>

    <m-table
      is-pagination
      is-full-table
      :loading="loading"
      :data="currentList"
      v-bind="pagination"
      @current-change="changeCurrentPage"
      @size-change="changeSize">
      <template slot-scope="props">
        <el-table
          border
          stripe
          :data="currentList"
          :max-height="props.maxHeight"
          @row-dblclick="dbClickRow"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            align="center"
            class-name="checkbox"
            width="75" />
          <template v-for="(field, index) in fields">
            <el-table-column
              align="center"
              :label="field.name"
              :key="index"
              :class-name="field.field"
              :min-width="field.width">
              <template slot-scope="scope">
                {{ scope.row[field.field] }}
              </template>
            </el-table-column>
          </template>
          <el-table-column
            width="75"
            fixed="right"
            align="center"
            label="操作"
            v-if="$permission.valid(1030001)">
            <template slot-scope="scope">
              <el-button
                type="text"
                icon="el-icon-edit"
                @click="handleOption('edit', scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      </template>
    </m-table>

    <!--Dialog-->
    <m-import
      :is-big-file="isBigFile"
      :data="form"
      :upload-excel-url="uploadExcelUrl"
      :template-download-url="templateDownloadUrl"
      :query-progress-url="queryProgressUrl"
      :show-import.sync="showImport"
      @completed="importCompleted"
      @completedPart="importCompleted" />

    <!--choose-->
    <el-dialog
      title="选择导入类型"
      custom-class="smallDialog"
      :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label=" ">
          <el-radio-group v-model="form.type">
            <template v-for="(item, index) in templateExcel">
              <div
                class="radio--wrap"
                :key="index">
                <el-radio :label="item.label">
                  {{ item.name }}
                </el-radio>
              </div>
            </template>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div
        class="dialog-footer"
        slot="footer">
        <el-button
          type="primary"
          :disabled="!form.type"
          @click.native="showImportOption">确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import iconSetting from './icon-setting'

  export default {
    name: 'MaintainList',
    components: { iconSetting },
    data() {
      const staticDownloadUrl = this.$api.employee.employeeImportTemplate
      const uploadExcelUrl = this.$api.employee.employeeUploadExcelUrl
      const queryProgressUrl = this.$api.employee.employeeUploadProgressUrl
      const { page, size, keyword, organization } = this.$route.query

      return {
        pagination: {
          pageSize: parseInt((size || 20), 10),
          currentPage: parseInt((page || 1), 10),
          total: 0,
        },
        remote: this.$api.common.organizationLevelAuth,
        isBigFile: true,
        currentList: [
        ],
        orgLevels: [],
        organization: organization || '',
        keyword: keyword || '',
        cachedKeyword: keyword || '',
        fields: [],
        caseName: '',
        showImport: false,
        loading: false,
        preloading: false,
        templateDownloadUrl: '',
        staticDownloadUrl,
        queryProgressUrl,
        uploadExcelUrl,
        multipleSelection: [],
        dialogFormVisible: false,
        form: {
          type: '',
        },
        templateExcel: [
          {
            label: 1,
            name: '员工个人信息导入',
          },
          {
            label: 2,
            name: '员工任职信息导入',
          },
          {
            label: 4,
            name: '员工履历信息导入',
          },
          {
            label: 8,
            name: '员工学历信息导入',
          },
          {
            label: 16,
            name: '员工家庭信息导入',
          },
          {
            label: 32,
            name: '员工资格信息导入',
          },
          {
            label: 64,
            name: '员工合同信息导入',
          },
          {
            label: 128,
            name: '员工奖惩信息导入',
          },
          {
            label: 256,
            name: '员工团队信息导入',
          },
        ],
        breadcrumb: [
          { name: '员工管理' },
          { name: '员工信息维护', to: '/maintain' },
        ],
        largeLength: [
          'tu-email',
          'tu-email_outside',
          'tu-family_address',
          'tuj-quit_instruction',
          'tuf-address',
          'tujr-measure',
          'tujr-reason',
          'tujp-measure',
          'tujp-reason',
          'tujc-content',
          'tujc-measure',
          'tujco-matter',
          'tujco-result',
          'tuc-finance_attribute',
          'tuc-subject_unit',
        ],
        /* eslint quotes:0 */
        smallLength: [
          "tu-code", "tu-emp_code", "tu-sex", "tu-birthday", "tu-age",
          "tu-identity", "tu-nation", "tu-health_status", "tu-constellation",
          "tu-blood_type", "tu-recruit_channel", "tu-political_status",
          "tu-entry_party_date", "tu-passport_valided_date", "tu-credential_keeper",
          "tu-mobile_short", "tu-enter_group_date", "tu-salary_type", "tu-enter_date",
          "tu-work_address", "tu-job_valid_date", "tuj-valid_date", "tuj-type",
          "tuj-quit_type", "tuj-quit_chat_record", "tuj-level", "tuj-name",
          "tu-status", "tu-begin_work_date", "tu-work_years", "tu-begin_broker_date",
          "tu-broker_work_year", "tur-begin_date", "tur-end_date", "tu-marriage_status",
          "tu-spouse_only_child", "tu-spouse_only_child_birthday", "tuel-language",
          "tuec-level", "tu-file_code", "tuc-employment_form", "tuc-begin_date",
          "tuc-end_date", "tuc-probation_term", "tuc-probation_begin_date",
          "tuc-probation_end_date", "tuc-plan_regular_date", "tuc-sign_date",
          "tujr-date", "tujp-date", "tujc-date", "tujco-date", "tu-team_ratio",
          "tu-business_direction", "tu-team_attribute", "tu-function",
          "tu-team_leader_broker_code", "tu-team_leader_name",
          "tu-people_remark", "tu-people_ratio",
        ],
        operating: false,
      }
    },
    watch: {
      // 关闭弹框
      showImport(val) {
        if (!val) this.form.type = ''
      },
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        this.getOrgLevels().then(() => {
          this.fetchData()
        })
      },
      // 获取组织架构
      // 此处没有采取组件内获取数据，外部获取数据填充
      getOrgLevels() {
        this.preloading = true
        const url = this.$api.common.organizationLevelAuth
        return this.$axios.post(url).then((res) => {
          const { data } = res
          this.orgLevels = [data]
          if (!this.organization) this.organization = data.id
        }).catch((error) => {
          console.log(error)
        }).then(() => {
          this.preloading = false
        })
      },
      // 拉取数据
      fetchData(silent) {
        if (!silent) {
          this.loading = true
        }
        const url = this.$api.employee.employList
        const schemesId = sessionStorage.getItem('caseId')
          ? sessionStorage.getItem('caseId')
          : ''
        this.$axios
          .post(url, {
            schemes_id: schemesId,
            per_page: this.pagination.pageSize,
            page: this.pagination.currentPage,
            module: 1,
            org_id: this.organization,
            keywords: this.keyword,
            showProgressBar: Boolean(silent),
          })
          .then((res) => {
            this.loading = false
            const { head, data, page, schemes } = res.data
            this.fields = Object.keys(head).map((field) => {
              let width
              if (this.largeLength.includes(field)) {
                width = 240
              } else if (this.smallLength.includes(field)) {
                width = 140
              } else {
                width = 200
              }
              return { name: head[field], field, width }
            })
            this.caseName = schemes
            this.$nextTick(() => {
              this.currentList = data
              this.pagination.total = Number(page.total)
              this.pagination.page = Number(page.current_page)
            })
          })
      },
      // 选择组织完成
      selectCompleted() {
        const { query } = this.$route

        this.$router.replace({
          query: Object.assign({}, query, {
            page: 1,
            organization: this.organization,
          }),
        })

        this.pagination.currentPage = 1
        this.fetchData()
      },
      // 双击行
      dbClickRow(row) {
        this.dispatchIds()
        this.$router.push({
          name: 'employeeProfile',
          params: {
            id: row.id,
          },
        })
      },
      // 选择列表
      handleSelectionChange(selection) {
        this.multipleSelection = selection
      },
      // 相关操作，执行函数
      handleOption(option, row) {
        switch (option) {
        case 'add':
          this.$router.push({
            path: '/maintain/create',
          })
          break
        case 'edit':
          this.dispatchIds()
          this.$router.push({
            name: 'EmployeeCreate',
            params: {
              id: row.id,
              type: 'base_info',
            },
          })
          break
        case 'import':
          this.dialogFormVisible = true
          break
        case 'export': {
          const ids = this.getIds()
          this.handleExport(ids)
          break
        }
        case 'exportZip': {
          const ids = this.getIds()
          this.handleExport(ids, true)
          break
        }
        default:
        }
      },
      // 获取选择项id
      getIds() {
        return this.multipleSelection.map(item => item.id)
      },
      // 改变分页
      changeSize(size) {
        this.pagination.pageSize = size
        this.pagination.currentPage = 1
        this.fetchData()
      },
      // 改变当前页码
      changeCurrentPage(page) {
        this.pagination.currentPage = page
        this.fetchData()
      },
      // 关键词过滤
      handleFilter() {
        const { query } = this.$route
        const keyword = this.keyword.trim()

        this.$router.replace({
          query: Object.assign({}, query, { page: 1, keyword }),
        })
        this.cachedKeyword = keyword

        this.pagination.currentPage = 1
        this.fetchData()
      },
      // 导出操作
      handleExport(ids, isZip) {
        if (this.operating) return
        const requestUrl = this.$api.employee.employeeExportUrl
        const schemesId = sessionStorage.getItem('caseId')
          ? sessionStorage.getItem('caseId')
          : ''
        this.operating = true
        this.$axios
          .post(requestUrl, {
            org_id: this.organization,
            keywords: this.cachedKeyword,
            schemes_id: schemesId,
            module: 1,
            ids: ids.join(','),
            type: isZip ? 'export_zip' : 'exp_index',
            showProgressBar: false,
          })
          .then((res) => {
            const { url } = res.data
            this.$utils.tools.windowOpen(url)
          })
          .catch(() => {})
          .then(() => {
            this.operating = false
          })
      },
      // 分发Ids到store
      dispatchIds() {
        const ids = this.currentList.map(item => item.id)
        this.$store.dispatch('updateIds', { ids })
      },
      // 导入成功或者部分成功回调函数
      importCompleted() {
        this.keyword = ''
        this.pagination.pageSize = 20
        this.pagination.currentPage = 1
        this.fetchData(true)
      },
      // 显示导入
      showImportOption() {
        this.dialogFormVisible = false
        this.templateDownloadUrl = `${this.staticDownloadUrl}?type=${this.form.type}`
        this.showImport = true
      },
    },
  }
</script>


<style lang="scss" type="text/scss" rel="stylesheet/scss">
  .page--maintain {
    .buttons {
      display: inline-block;
    }

    .case {
      float: right;
      cursor: pointer;
      position: relative;
      font-size: 16px;
      line-height: 34px;
      height: 34px;
      padding-left: 31px;

      svg {
        height: 26px;
        width: 26px;
        position: absolute;
        top: 50%;
        left: 26px;
        transform: translate3d(-100%, -50%, 0);
      }

      &:hover {
        color: #5090f7;

        svg path {
          fill: #5090f7;
        }
      }
    }

    .table {
      .tu-name {
        width: 400px;
      }
    }

    .radio--wrap {
      height: 34px;
    }

    .smallDialog {
      width: 320px;
      min-width: 320px;
    }
  }
</style>
