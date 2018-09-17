<template>
  <div
    v-loading.fullscreen.lock="preloading"
    class="page page__employee--create">

    <!-- 面包屑，固定层级 -->
    <m-breadcrumb :items="breadcrumb" />

    <!-- 内容部分 -->
    <div>
      <base-info
        v-if="typeId == 1"
        ref="panel"
        :det-data="detData" />
      <job-info
        v-if="typeId == 2"
        ref="panel"
        :det-data="detData" />
      <resume-info
        v-if="typeId == 4"
        ref="panel"
        :det-data="detData" />
      <education-info
        v-if="typeId == 8"
        ref="panel"
        :det-data="detData" />
      <family-info
        v-if="typeId == 16"
        ref="panel"
        :det-data="detData" />
      <exam-info
        v-if="typeId == 32"
        ref="panel"
        :det-data="detData" />
      <contract-info
        v-if="typeId == 64"
        ref="panel"
        :det-data="detData" />
      <jc-info
        v-if="typeId == 128"
        ref="panel"
        :det-data="detData" />
      <team-info
        v-if="typeId == 256"
        ref="panel"
        :det-data="detData" />
    </div>

    <!-- 提交返回 -->
    <div>
      <el-button
        type="primary"
        :loading="loading"
        @click="update">保存</el-button>
      <el-button
        type="info"
        @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
  /**
   * @prop $route.params.id id
   * @prop $route.params.type 类型
   * @prop $route.query.redirect 回跳地址
   */

  export default {
    name: 'EmployeeCreate',
    components: {
      BaseInfo: () => import('./createPanel/panel1BaseInfo'),
      JobInfo: () => import('./createPanel/panel2JobInfo'),
      ResumeInfo: () => import('./createPanel/panel3ResumeInfo'),
      EducationInfo: () => import('./createPanel/panel4EducationInfo'),
      FamilyInfo: () => import('./createPanel/panel5FamilyInfo'),
      ExamInfo: () => import('./createPanel/panel6ExamInfo'),
      ContractInfo: () => import('./createPanel/panel7ContractInfo'),
      JcInfo: () => import('./createPanel/panel8JcInfo'),
      TeamInfo: () => import('./createPanel/panel9TeamInfo'),
    },
    data() {
      return {
        noConfirm: false,
        routeFromCreate: false,
        preloading: false,
        loading: false,
        redirect: this.$route.query.redirect,

        // 类型列表
        typeList: {
          base_info: 1,
          job_info: 2,
          resume_info: 4,
          education_info: 8,
          family_info: 16,
          exam_info: 32,
          contract_info: 64,
          jc_info: 128,
          team_info: 256,
        },

        // 添加接口要求字段
        detData: {},
        detName: '',
      }
    },
    computed: {
      typeId() {
        return this.typeList[this.$route.params.type] || 1
      },
      dictionary() {
        return this.$utils.config.dictionary.employee
      },
      ajaxPath() {
        return this.$api.employee
      },
      breadcrumb() {
        const defaultBC = [
          { name: '员工管理' },
          { name: '员工信息维护', to: '/maintain' },
          { name: '员工详情' },
        ]

        if (!this.detData.id) defaultBC.pop()

        const status = {
          name: this.detData.id ? '修改' : '新建',
        }
        defaultBC.push(status)

        if (!this.detName) return defaultBC

        const type = this.$route.params.type || 'base_info'
        const name = {
          name: this.detName,
          to: `/maintain/profile/${this.detData.id}/${type}`,
        }

        defaultBC.splice(2, 1, name)
        return defaultBC
      },
    },
    watch: {
      // 如果路由发生变化，拉取新数据
      $route(to, from) {
        // 1、从新建跳转到其他ID
        // 2、ID发生变化
        // 3、从已有ID跳新建
        // 4、type发生变化
        const case1 = !from.params.id && String(to.params.id)
        const case2 = to.params.id &&
          from.params.id &&
          String(to.params.id) !== String(from.params.id)
        const case3 = from.params.id && !to.params.id
        const case4 = String(to.params.type) !== String(from.params.type)
        if (case1 || case2 || case4) this.getEmployee()
        if (case3) {
          this.detData = {}
          this.detName = ''
        }
      },
    },
    created() {
      // 数据初始化
      this.routeFromCreate = !this.$route.params.id
      this.getEmployee()
      // 本页面执行错误处理
      this.$on('error', this.$message.error)
      this.$on('ok', this.$message.success)
    },
    methods: {
      getToDet() {
        // 跳转详情
        let path = '/maintain/profile'
        const id = this.$route.params.id || this.detData.id
        const type = this.$route.params.type || 'base_info'
        path += `/${id}/${type}`
        path = { path, query: {} }
        if (this.routeFromCreate) {
          path.query.isCreated = 1
        }
        this.$router.push(path)
      },

      async getEmployee() {
        // 获取员工信息
        if (!this.$route.params.id) {
          return
        }

        // 获取数据
        if (this.preloading) return
        this.preloading = true

        const url = this.ajaxPath.employeeDetail
        await this.$axios
          .post(url, {
            id: this.$route.params.id,
            type: this.typeId,
          })
          .then(({ data }) => {
            this.detData = data
            this.detName = this.detData.name
          })
          .catch((err) => {
            console.log(err)
          })
          .then(() => {
            this.preloading = false
          })
      },

      async update() {
        // 提交员工信息
        // 表单校验
        try {
          if (!this.$refs.panel) return
          await this.$refs.panel.getValidate()
        } catch (err) {
          console.log(err)
          return
        }

        // 提交确认
        try {
          await this.$confirm('是否确认提交？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
        } catch (err) {
          console.log(err)
          return
        }

        // 提交数据
        if (this.loading) return
        this.loading = true

        try {
          const postData = this.$refs.panel.getData()
          let url = this.ajaxPath.employeeCreate
          if (this.$route.params.id) {
            postData.id = this.$route.params.id
            postData.type = this.typeId
            url = this.ajaxPath.employeeEdit
          }

          await this.$axios
            .post(url, postData)
            .then(({ data }) => {
              this.detData.id = data.id || this.detData.id
              this.loading = false
            })
        } catch (err) {
          this.loading = false
          console.log(err)
          return
        }

        this.pageBack()
      },

      async cancel() {
        // 取消确认
        try {
          await this.$confirm('系统可能不会保存您所做的更改，确认离开？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
        } catch (err) {
          console.log(err)
          return
        }

        this.pageBack()
      },

      pageBack() {
        // 页面返回
        this.noConfirm = true
        if (this.detData.id) {
          this.getToDet()

          // 头像修改
          let userinfo = sessionStorage.getItem('USER_INFO')
          userinfo = JSON.parse(userinfo)
          if (
            this.typeId !== 1 ||
            (
            this.detData.base_info &&
            userinfo.emp_code !== this.detData.base_info.emp_code
            )
          ) return
          sessionStorage.removeItem('USER_INFO')
          this.$nextTick(() => {
            window.location.reload()
          })
        } else if (this.redirect) {
          window.location.href = this.redirect
        } else {
          window.history.back()
        }
      },
    },
    beforeRouteUpdate(to, from, next) {
      // 阻止未保存离开
      next(false)
      setTimeout(() => {
        this.$confirm('系统可能不会保存您所做的更改，确认离开？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => next()).catch(() => next(false))
      }, 0)
    },
    beforeRouteLeave(to, from, next) {
      // 阻止未保存离开
      if (this.noConfirm) {
        this.noConfirm = false
        next()
        return
      }

      next(false)
      setTimeout(() => {
        this.$confirm('系统可能不会保存您所做的更改，确认离开？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => next()).catch(() => next(false))
      }, 0)
    },
  }
</script>

<style lang="scss">
.create-panel {
  .panel-title {
    font-size: 20px;
    line-height: 44px;
    color: #333;
    margin-bottom: 14px;
    text-align: center;
    position: relative;

    &::before {
      content: "";
      position: absolute;
      top: 22px;
      height: 1px;
      display: block;
      background: #e1e1e1;
      width: 100%;
    }

    & > div {
      height: 44px;
      background: #eaeaea;
      border-radius: 100px;
      display: inline-block;
      padding: 0 28px;
      position: relative;

      &::after,
      &::before {
        content: "";
        position: absolute;
        display: block;
        height: 44px;
        z-index: 0;
        top: 0;
        background-color: #f7f7f7;
        width: 10px;
      }

      &::before {
        left: -10px;
      }

      &::after {
        right: -10px;
      }
    }
  }

  .m-section--form {
    position: relative;

    .delete {
      position: absolute;
      z-index: 2;
      top: 0;
      right: 10px;
    }
  }

  .panel-table {
    margin: 18px 20px 22px 20px;
    max-width: calc(50% + 390px + 80px);

    .required {
      color: #ff4b4b;
    }

    .tr {
      display: flex;
      border-left: 1px solid #d7d7d7;

      &:last-child {
        .td {
          border-bottom: 1px solid #d7d7d7;
        }
      }

      .th {
        background-color: #ededef;
      }

      .th-no-border,
      .td-no-border {
        width: 80px;
      }

      .td {
        display: flex;
        align-items: center;
      }

      .th,
      .td {
        flex: 1;
        border-top: 1px solid #d7d7d7;
        border-right: 1px solid #d7d7d7;
      }

      .has-date {
        min-width: 155px;
      }
    }

    .table-th {
      text-align: center;
      font-size: 13px;
      color: #666;
      padding: 8px 0;
    }

    .table-td {
      font-size: 13px;
      padding: 8px 14px 0 14px;
    }
  }

  .list-plus {
    margin-bottom: 14px;
  }
}
</style>
