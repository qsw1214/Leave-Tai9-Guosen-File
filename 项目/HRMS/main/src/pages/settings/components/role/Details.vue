<template>
  <div
    v-loading.fullscreen.lock="preloading"
    class="page page__role--details">

    <!-- 面包屑，固定层级 -->
    <m-breadcrumb :items="breadcrumb" />

    <!-- 顶部按钮 -->
    <div
      class="block-margin-bottom"
      v-if="!edit">
      <el-button
        type="primary"
        icon="el-icon-edit"
        @click="getEditChange">编辑
      </el-button>
      <el-button
        icon="el-icon-plus"
        v-if="routeFromCreate"
        @click="getTo('create')">继续新建
      </el-button>
      <el-button
        icon="el-icon-d-arrow-left"
        v-if="redirect"
        @click="getTo('back')">返回
      </el-button>
      <el-button
        icon="el-icon-caret-left"
        v-if="!redirect && !routeFromCreate"
        :disabled="!toPrevId"
        @click="getTo('prev')">上一条
      </el-button>
      <el-button
        v-if="!redirect && !routeFromCreate"
        :disabled="!toNextId"
        @click="getTo('next')">下一条<i class="el-icon-caret-right el-icon--right" />
      </el-button>
    </div>

    <!-- 内容部分 -->
    <el-form
      label-position="right"
      label-width="140px"
      ref="detData"
      :model="detData"
      :rules="detDataRules">

      <!-- 基本字段 -->
      <m-section
        is-form
        v-if="edit">
        <div class="m-section--form">
          <m-section-row>
            <el-form-item label="角色编码">
              {{ detDataTemp.code || '由系统生成' }}
            </el-form-item>
          </m-section-row>

          <m-section-row>
            <el-form-item
              label="角色名称"
              prop="name">
              <el-input v-model="detData.name" />
            </el-form-item>
          </m-section-row>

          <el-form-item
            label="备注"
            prop="remark">
            <el-input
              type="textarea"
              v-model="detData.remark"
              :autosize="{ minRows: 4 }" />
          </el-form-item>
        </div>
      </m-section>

      <m-section
        v-else>
        <m-section-row>
          <m-section-cell
            title="角色编码"
            :content="detDataTemp.code || '由系统生成'" />
        </m-section-row>

        <m-section-row>
          <m-section-cell
            title="角色名称"
            :content="detData.name" />
        </m-section-row>

        <m-section-row>
          <m-section-cell
            title="备注"
            :content="detData.remark.replace(/\n/g, '<br>')" />
        </m-section-row>

      </m-section>

      <m-section
        :title="`${edit ? '' : '已'}分配功能权限`">
        <div
          v-loading.body="AELoading"
          class="tree-list-edit"
          v-if="edit">
          <el-tree
            show-checkbox
            node-key="id"
            key="authDataTree"
            ref="authDataTree"
            :data="authData"
            :props="treeProps" />
        </div>

        <div
          v-loading.body="AELoading"
          class="tree-list"
          v-else>
          <el-tree
            default-expand-all
            node-key="id"
            key="auth_listTree"
            ref="auth_listTree"
            :data="auth_list"
            :props="treeProps" />
        </div>
      </m-section>

      <m-section
        :title="`${edit ? '' : '已'}分配用户`">
        <div
          class="block-tip"
          v-if="edit">
          请单击选择列表中员工，则将该角色授权给选中员工。
        </div>

        <div
          class="choose-list"
          :class="{ edit }">
          <div
            class="choose-list-selected"
            v-if="edit">
            <div class="choose-list-title">选中用户列表：</div>
            <div class="choose-list-items">
              <div
                class="choose-list-item"
                v-for="user in detDataTemp.user_list"
                :key="user.id">
                {{ user.name }}({{ user.emp_code }})
                <el-button
                  class="error choose-list-close"
                  type="text"
                  icon="el-icon-circle-close"
                  @click="selectDel(user.id)" />
              </div>
            </div>
          </div>

          <div class="block-margin-bottom">
            <m-cascader
              placeholder="请选择组织机构"
              expand-trigger="click"
              change-on-select
              v-if="edit"
              ref="cascader"
              :organization.sync="detDataTemp.orgId"
              :show-all-levels="false"
              :width="240"
              @fetchCompleted="getTableChange"
              @selectCompleted="getTableChange" />

            <el-input
              class="search"
              placeholder="输入员工ID或姓名进行查询"
              v-model="detDataTemp.search"
              @keyup.enter.native="getTableChange('', 1)">
              <el-button
                icon="el-icon-search"
                slot="append"
                @click="getTableChange('', 1)" />
            </el-input>
          </div>

          <m-table
            v-loading.body="AULoading"
            is-pagination
            :data="detDataTemp.select_user_list"
            :total="edit ? detDataTemp.count : detDataTemp.search_user_list.length"
            :page-size="detDataTemp.selectSize"
            :current-page="detDataTemp.selectPage"
            :is-update-router="false"
            @current-change="changePage"
            @size-change="changeSize">
            <template slot-scope="props">
              <el-table
                border
                stripe
                max-height="400"
                row-key="id"
                :data="props.data"
                @row-click="selectChoose">
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
                  align="center">
                  <template slot-scope="scope">
                    {{ scope.row.job || scope.row.job_name }}
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </m-table>
        </div>
      </m-section>
    </el-form>

    <!-- 提交返回 -->
    <div v-if="edit">
      <el-button
        type="primary"
        :loading="loading"
        @click="update">保存
      </el-button>
      <el-button
        type="info"
        @click="cancel">取消
      </el-button>
    </div>

  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import AUTH_LIST from './AuthList'

  export default {
    data() {
      const nameValid = (rule, value, callback) => {
        const test = /[//]/im
        if (test.test(value)) {
          return callback('名称中不能包含非法字符')
        }
        return callback()
      }

      return {
        edit: false,
        noConfirm: false,
        routeFromCreate: false,
        preloading: false,
        loading: false,
        AELoading: false,
        AULoading: false,
        redirect: this.$route.query.redirect,
        // --添加接口要求字段
        // 默认字段，用于恢复默认
        clearDetData: {},
        // 接口字段，用于显示
        queryDetData: {},
        // 编辑字段，用于编辑绑定
        detData: {
          name: '',
          remark: '',
          auth_ids: [],
          uids: [],
        },
        // --其他显示字段
        // 默认字段，用于恢复默认
        clearDetDataTemp: {},
        // 接口字段，用于显示
        queryDetDataTemp: {},
        // 编辑显示字段，用于编辑绑定
        detDataTemp: {
          id: '',
          name: '',
          code: '由系统生成',
          // auth_list: [],
          user_list: [],

          search: '',
          selectPage: 1,
          selectSize: 20,
          orgId: '',
          search_user_list: [],
          select_user_list: [],
          count: 0,
        },
        // 表单校验条件
        detDataRules: {
          name: [
            { required: true, message: '请输入角色名称', trigger: ['blur', 'change'] },
            { validator: nameValid, trigger: ['blur', 'change'] },
            { max: 20, message: '不超过20个字符', trigger: ['blur', 'change'] },
          ],
          remark: [
            { max: 50, message: '不超过50个字符', trigger: ['blur', 'change'] },
          ],
        },
        // 全部的auth树，用于编辑
        authData: [],
        treeProps: { label: 'name' },
      }
    },
    computed: {
      dictionary() {
        return this.$utils.config.dictionary.settings
      },
      ajaxPath() {
        return this.$api.settings.role
      },
      breadcrumb() {
        const defaultBC = [
          { name: '基础配置' },
          { name: '角色管理', to: '/role' },
          { name: '角色详情' },
        ]

        const status = {
          name: this.detDataTemp.id ? '修改' : '新建',
        }
        if (!this.detDataTemp.id) defaultBC.pop()
        if (this.edit) defaultBC.push(status)
        if (!this.detDataTemp.name) return defaultBC

        const name = {
          name: this.detDataTemp.name,
        }

        if (this.edit) {
          name.to = {
            name: this.$route.name,
            params: { id: this.detDataTemp.id },
          }
        }

        defaultBC.splice(2, 1, name)
        return defaultBC
      },
      ...mapGetters({ ids: 'getRoleIds' }),
      toNextId() {
        if (!this.detDataTemp.id || !this.ids) return ''
        const thisIndex = this.ids.findIndex(v => v === this.detDataTemp.id)
        if (thisIndex === this.ids.length - 1) return ''
        return this.ids[thisIndex + 1]
      },
      toPrevId() {
        if (!this.detDataTemp.id || !this.ids) return ''
        const thisIndex = this.ids.findIndex(v => v === this.detDataTemp.id)
        if (thisIndex === 0) return ''
        return this.ids[thisIndex - 1]
      },
      // 已选的树，用于详情
      auth_list() {
        const authList = []
        this.authData.forEach((firstLevel) => {
          const first = Object.assign({}, firstLevel, { children: [] })
          firstLevel.children.forEach((secondLevel) => {
            if (this.detData.auth_ids.includes(secondLevel.id)) {
              first.children.push(secondLevel)
            }
          })
          if (first.children.length) {
            authList.push(first)
          }
        })
        return authList
      },
    },
    watch: {
      // 如果路由发生变化，拉取新数据，更新编辑状态
      $route(to, from) {
        this.edit = !!to.query.edit || !to.params.id
        this.routeFromCreate = !this.$route.params.id || from.name === 'RoleCreate' || this.routeFromCreate
        // 1、从新建跳转到其他ID
        // 2、ID发生变化
        // 3、从已有ID跳新建
        const case1 = !from.params.id &&
          String(to.params.id) !== String(this.detDataTemp.id)
        const case2 = to.params.id &&
          from.params.id &&
          String(to.params.id) !== String(from.params.id)
        const case3 = from.params.id && !to.params.id
        if (case1 || case2 || case3) this.getRouteChange()
        if (!this.edit) {
          // 重置页面
          this.$refs.detData.resetFields()
          // 恢复了页面选择状态及各种数据重置
          Object.assign(this.detData, JSON.parse(JSON.stringify(this.queryDetData)))
          Object.assign(this.detDataTemp, JSON.parse(JSON.stringify(this.queryDetDataTemp)))
          this.getTableChange()
        } else {
          // 恢复页面选择状态
          this.getReSetAttr(true)
          // 重新或初始设定数据
          this.$nextTick(() => {
            this.$refs.authDataTree.setCheckedKeys(this.detData.auth_ids)
          })
        }
      },
    },
    created() {
      // 数据初始化和缓存
      Object.assign(this.clearDetData, JSON.parse(JSON.stringify(this.detData)))
      Object.assign(this.clearDetDataTemp, JSON.parse(JSON.stringify(this.detDataTemp)))
      this.edit = !!this.$route.query.edit || !this.$route.params.id
      this.routeFromCreate = !this.$route.params.id
      this.getRouteChange()
      this.getAuthList()
      if (!this.edit) this.getTableChange()
      // 本页面执行错误处理
      this.$on('error', this.$message.error)
      this.$on('ok', this.$message.success)
    },
    methods: {
      getRouteChange() {
        // 恢复原始状态，获取routeID和数据
        Object.assign(this.detData, JSON.parse(JSON.stringify(this.clearDetData)))
        Object.assign(this.detDataTemp, JSON.parse(JSON.stringify(this.clearDetDataTemp)))
        Object.assign(this.queryDetData, JSON.parse(JSON.stringify(this.clearDetData)))
        Object.assign(this.queryDetDataTemp, JSON.parse(JSON.stringify(this.clearDetDataTemp)))
        this.detDataTemp.id = this.$route.params.id || ''
        if (this.detDataTemp.id) this.getRole()
      },
      getReSetAttr(type) {
        // 恢复页面选项状态
        const keys = [
          'search', 'selectPage', 'selectSize',
          'search_role_info', 'select_role_info', 'count',
        ]
        const reSet = {}
        keys.forEach((key) => {
          reSet[key] = this.clearDetDataTemp[key]
          if (type) {
            this.detDataTemp[key] = this.clearDetDataTemp[key]
          }
        })

        return reSet
      },
      getEditChange(flag) {
        // 调整模式，手动触发路由变化
        const query = Object.assign({}, this.$route.query)
        if (this.edit || !flag) {
          if (query.edit) delete query.edit
          this.$router.push({
            name: 'RoleEdit',
            params: { id: this.detDataTemp.id },
            query,
          })
        } else {
          this.$router.push({
            path: this.$route.path,
            query: Object.assign(query, { edit: true }),
          })
        }
      },
      getTo(type) {
        switch (type) {
        // 继续新建
        case 'create':
          this.$router.push({
            name: 'RoleCreate',
            query: Object.assign({}, this.$route.query),
          })
          break
        // 返回回传地址
        case 'back':
          window.location.href = this.redirect
          break
        default:
          // 上一条下一条
          this.$router.replace({
            name: this.$route.name,
            params: { id: type === 'prev' ? this.toPrevId : this.toNextId },
            query: Object.assign({}, this.$route.query),
          })
          break
        }
      },
      async getAuthList() {
        // 获取全部权限列表
        // 后台写死，全模块仅获取一次
        // store 取值
        this.authData = this.$store.getters['AUTH_LIST/get'] || []
        if (this.authData.length) return
        // store 注册
        this.AELoading = true
        this.$store.registerModule('AUTH_LIST', AUTH_LIST)
        // store 拉取
        this.$store.dispatch('AUTH_LIST/get')
          .then((list) => {
            this.authData = list || []
            this.AELoading = false
          })
      },
      async getRole() {
        // 获取数据
        if (!this.detDataTemp.id) return
        if (this.preloading) return
        this.preloading = true
        try {
          const { detail } = this.ajaxPath
          const { data: detData } = await this.$axios
            .post(detail, { id: this.detDataTemp.id })

          this.detData.name = detData.name
          this.detData.remark = detData.remark
          this.detData.auth_ids = detData.auth_list.map(_ => _.id)
          this.detData.uids = detData.user_list.map(_ => _.id)
          // 初始设定数据
          if (this.edit) {
            this.$refs.authDataTree.setCheckedKeys(this.detData.auth_ids)
          }

          this.detDataTemp.id = detData.id
          this.detDataTemp.name = detData.name
          this.detDataTemp.code = detData.code
          this.detDataTemp.user_list = detData.user_list
          if (!this.edit) {
            this.getTableChange()
          }
          this.preloading = false
        } catch (err) {
          this.preloading = false
          console.log(err)
          return
        }

        // 备份数据
        Object.assign(this.queryDetData, JSON.parse(JSON.stringify(this.detData)))
        Object.assign(this.queryDetDataTemp, JSON.parse(JSON.stringify(this.detDataTemp)))
      },
      async getTableChange(OjId, page = '') {
        if (page) this.detDataTemp.selectPage = page
        const employeeList = this.$api.common.employee
        const { search, selectPage, selectSize, orgId, user_list: userList } = this.detDataTemp
        const searchArray = this.$utils.tools.splitKeyword(search)

        // 非编辑态直接本地数据
        if (!this.edit) {
          const start = (selectPage - 1) * selectSize
          const end = selectPage * selectSize
          const searchKeys = ['name', 'emp_code']

          if (!searchArray.length) {
            this.detDataTemp.search_user_list = userList
          } else if (searchArray.length === 1) {
            const { convertRegStr } = this.$utils.tools
            const searchExp = new RegExp(convertRegStr(searchArray.join('|')))
            this.detDataTemp.search_user_list = userList.filter((item) => {
              // 处理能搜索
              const testObject = {}
              searchKeys.forEach((key) => {
                testObject[key] = item[key]
              })
              return searchExp.test(Object.values(testObject).join(' '))
            })
          } else {
            this.detDataTemp.search_user_list = userList.filter((item) => {
              // 处理能搜索
              const testObject = {}
              searchKeys.forEach((key) => {
                testObject[key] = item[key]
              })
              return Object.keys(testObject)
                .some(key => searchArray.includes(item[key]))
            })
          }
          this.detDataTemp.select_user_list = this.detDataTemp.search_user_list
            .slice(start, end)
          return
        }

        // 编辑态获取服务器数据
        this.AULoading = true
        try {
          if (!orgId && OjId.length) this.detDataTemp.orgId = OjId[0].id
          const { data } = await this.$axios
            .post(employeeList, {
              // 没有传生效日期的
              org_id: orgId || OjId[0].id,
              keywords: searchArray.join(','),
              per_page: selectSize,
              page: selectPage,
            })
          this.detDataTemp.select_user_list = data.list || []
          this.detDataTemp.count = data.count
        } catch (err) {
          console.log(err)
        }
        this.AULoading = false
      },
      changePage(page) {
        this.detDataTemp.selectPage = page
        this.getTableChange()
      },
      changeSize(size) {
        this.detDataTemp.selectSize = size
        this.detDataTemp.selectPage = 1
        this.getTableChange()
      },
      selectChoose(employee) {
        if (this.detData.uids.includes(employee.id)) return
        this.detData.uids.push(employee.id)
        this.detDataTemp.user_list.push(employee)
      },
      selectDel(empId) {
        if (this.detData.uids.includes(empId)) {
          const uidsIndex = this.detData.uids.findIndex(_ => _ === empId)
          const userListIndex = this.detDataTemp.user_list.findIndex(_ => _.id === empId)
          this.detData.uids.splice(uidsIndex, 1)
          this.detDataTemp.user_list.splice(userListIndex, 1)
        }
      },
      async update() {
        // 表单校验
        try {
          await this.$refs.detData.validate()
        } catch (err) {
          console.log(err)
          return
        }

        // 权限选择校验
        this.detData.auth_ids = this.$refs.authDataTree.getCheckedKeys()
        if (!this.detData.auth_ids.length) {
          this.$emit('error', '请至少分配一项权限')
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
          const postData = Object.assign({}, this.detData)
          // 去除一级节点
          const firstIds = this.authData.map(_ => _.id)
          postData.auth_ids = postData.auth_ids.filter(id => !firstIds.includes(id))
          // 字符化字段
          postData.auth_ids = postData.auth_ids.join(',')
          postData.uids = postData.uids.join(',')
          if (this.detDataTemp.id) postData.id = this.detDataTemp.id

          const { edit, add } = this.ajaxPath
          const url = this.detDataTemp.id ? edit : add
          const { data: postBack } = await this.$axios
            .post(url, postData)
          if (postBack.id) {
            this.detDataTemp.id = postBack.id
            this.detDataTemp.code = postBack.code
          }
          this.detDataTemp.name = postData.name
          this.loading = false
        } catch (err) {
          this.loading = false
          console.log(err)
          return
        }

        // 备份数据
        Object.assign(this.queryDetData, JSON.parse(JSON.stringify(this.detData)))
        // 恢复页面选择状态（先恢复，防止queryDetDataTemp被覆盖）
        Object.assign(
          this.queryDetDataTemp,
          JSON.parse(JSON.stringify(this.detDataTemp)), this.getReSetAttr()
        )
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
        if (this.detDataTemp.id) {
          this.getEditChange()
        } else if (this.redirect) {
          this.getTo('back')
        } else {
          window.history.back()
        }
      },
    },
    beforeRouteUpdate(to, from, next) {
      // 阻止未保存离开
      if (this.noConfirm) {
        this.noConfirm = false
        next()
        return
      }
      // 1、从编辑到非编辑
      // 2、从编辑到编辑但ID变更
      // 3、从新建到非编辑
      // 4、从新建到编辑
      const case1 = from.query.edit && !to.query.edit
      const case2 = from.query.edit &&
        to.query.edit &&
        String(to.params.id) !== String(from.params.id)
      const case3 = !from.query.edit && !from.params.id && !to.query.edit
      const case4 = !from.query.edit &&
        !from.params.id &&
        to.query.edit &&
        to.params.id
      if (case1 || case2 || case3 || case4) {
        next(false)
        setTimeout(() => {
          this.$confirm('系统可能不会保存您所做的更改，确认离开？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => next()).catch(() => next(false))
        }, 0)
      } else {
        next()
      }
    },
    beforeRouteLeave(to, from, next) {
      // 阻止未保存离开
      if (this.noConfirm) {
        this.noConfirm = false
        next()
        return
      }
      // 1、从编辑到其他
      // 2、从新建到其他
      if (from.query.edit || (!from.query.edit && !from.params.id)) {
        next(false)
        setTimeout(() => {
          this.$confirm('系统可能不会保存您所做的更改，确认离开？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => next()).catch(() => next(false))
        }, 0)
      } else {
        next()
      }
    },
  }
</script>
<style lang="scss">
@import '../../assets/details.scss';
</style>
