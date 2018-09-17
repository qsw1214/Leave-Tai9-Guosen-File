<template>
  <div
    v-loading.fullscreen.lock="preloading"
    class="page page__permission--details">

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
        icon="el-icon-d-arrow-left"
        v-if="redirect"
        @click="getTo('back')">返回
      </el-button>
      <el-button
        icon="el-icon-caret-left"
        v-if="!redirect"
        :disabled="!toPrevId"
        @click="getTo('prev')">上一条
      </el-button>
      <el-button
        v-if="!redirect"
        :disabled="!toNextId"
        @click="getTo('next')">下一条<i class="el-icon-caret-right el-icon--right" />
      </el-button>
    </div>

    <!-- 头像和状态 -->
    <div class="userinfo--wrap">
      <m-userinfo
        :userinfo="userinfo" />
    </div>

    <!-- 内容部分 -->
    <el-form
      class="wrap"
      label-position="right"
      label-width="140px"
      ref="detData"
      :model="detData"
      :rules="detDataRules">
      <m-section
        :is-form="edit">
        <div
          class="m-section--form"
          v-if="edit">
          <m-section-row>
            <el-form-item
              label="用户状态">
              <el-select
                v-model="detData.is_lock">
                <el-option
                  v-for="item in dictionary.isLock"
                  :value="item.value"
                  :key="item.value"
                  :label="item.label" />
              </el-select>
            </el-form-item>
          </m-section-row>
        </div>

        <m-section-row v-else>
          <m-section-cell
            title="用户状态"
            :content="dictionary.isLock[detData.is_lock].label" />
        </m-section-row>
      </m-section>

      <m-section
        :title="`${edit ? '' : '已'}分配角色`">
        <div
          class="block-tip"
          v-if="edit">
          请单击选择列表中角色，则将该员工授权选中角色。
        </div>

        <div
          class="choose-list"
          :class="{ edit }">
          <div
            class="choose-list-selected"
            v-if="edit">
            <div class="choose-list-title">选中角色列表：</div>
            <div class="choose-list-items">
              <div
                class="choose-list-item"
                v-for="role in detDataTemp.role_info"
                :key="role.id">
                {{ role.name }}
                <el-button
                  class="error choose-list-close"
                  type="text"
                  icon="el-icon-circle-close"
                  @click="selectDel(role.id)" />
              </div>
            </div>
          </div>

          <div class="block-margin-bottom">
            <el-input
              class="search"
              v-model="detDataTemp.search"
              :placeholder="edit? '输入名称进行查询' : '输入编码或名称进行查询'"
              @keyup.enter.native="getTableChange(1)">
              <el-button
                icon="el-icon-search"
                slot="append"
                @click="getTableChange(1)" />
            </el-input>
          </div>

          <m-table
            v-loading.body="ARLoading"
            is-pagination
            :data="detDataTemp.select_role_info"
            :total="edit ? detDataTemp.count : detDataTemp.search_role_info.length"
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
                  label="角色编码"
                  align="center"
                  prop="code" />
                <el-table-column
                  label="角色名称"
                  align="center"
                  prop="name" />
                <el-table-column
                  label="备注"
                  align="center"
                  prop="remark" />
              </el-table>
            </template>
          </m-table>
        </div>
      </m-section>

      <m-section
        :title="`${edit ? '' : '已'}分配组织范围权限`">
        <div
          class="block-tip"
          v-if="edit">
          该组织权限范围仅对员工管理模块有效，其他模块则不受组织权限范围影响。
        </div>

        <div
          class="tree-list-edit"
          v-if="edit">
          <el-tree
            show-checkbox
            node-key="id"
            key="authDataTree"
            ref="orgDataTree"
            :data="orgData"
            :default-expanded-keys="[orgData[0] ? orgData[0].id : '']"
            :props="treeProps" />
        </div>
        <div
          class="tree-list"
          v-else>
          <el-tree
            default-expand-all
            node-key="id"
            key="auth_listTree"
            ref="org_infoTree"
            :data="org_info"
            :props="treeProps" />
        </div>
      </m-section>
    </el-form>

    <!-- 提交返回 -->
    <div v-if="edit && detDataTemp.name">
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

  export default {
    data() {
      return {
        edit: false,
        noConfirm: false,
        preloading: false,
        loading: false,
        ARLoading: false,
        AOLoading: false,
        redirect: this.$route.query.redirect,
        // --添加接口要求字段
        // 默认字段，用于恢复默认
        clearDetData: {},
        // 接口字段，用于显示
        queryDetData: {},
        // 编辑字段，用于编辑绑定
        detData: {
          is_lock: 0,
          role_list: [],
          org_list: [],
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
          emp_code: '',
          org_name: '',
          job_name: '',
          avatar_url: '',
          role_info: [],

          search: '',
          selectPage: 1,
          selectSize: 20,
          search_role_info: [],
          select_role_info: [],
          count: 0,
          // org_list: []
        },
        // 表单校验条件
        detDataRules: {},
        // 全部的组织树，用于编辑
        orgData: [],
        treeProps: { label: 'name' },
      }
    },
    computed: {
      dictionary() {
        return this.$utils.config.dictionary.settings
      },
      ajaxPath() {
        const { organizationLevel } = this.$utils.api.common
        const { permission, roleList } = this.$api.settings
        const ajaxPath = Object.assign({ organizationLevel, roleList }, permission)
        return ajaxPath
      },
      breadcrumb() {
        const defaultBC = [
          { name: '基础配置' },
          { name: '权限管理', to: '/permission' },
          { name: '权限详情' },
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
      ...mapGetters({ ids: 'getPermissionIds' }),
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
      org_info() {
        return this.forEachOrg(this.orgData, this.detData.org_list)
      },
      userinfo() {
        const { avatar_url, name, emp_code, org_name, job_name, broker_code } = this.detDataTemp
        return { avatar_url, name, emp_code, org_name, job_name, broker_code }
      },
    },
    watch: {
      // 如果路由发生变化，拉取新数据，更新编辑状态
      $route(to, from) {
        this.edit = !!to.query.edit
        // 1、从无ID跳转到其他ID
        // 2、ID发生变化
        // 3、从已有ID跳无ID
        const case1 = !from.params.id && String(to.params.id) !== String(this.detDataTemp.id)
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
        } else {
          // 恢复页面选择状态
          this.getReSetAttr(true)
          // 重新或初始设定数据
          this.$nextTick(() => {
            this.$refs.orgDataTree.setCheckedKeys(this.detData.org_list)
          })
        }
        this.getTableChange()
      },
    },
    created() {
      // 数据初始化和缓存
      Object.assign(this.clearDetData, JSON.parse(JSON.stringify(this.detData)))
      Object.assign(this.clearDetDataTemp, JSON.parse(JSON.stringify(this.detDataTemp)))
      this.edit = !!this.$route.query.edit
      this.getRouteChange()
      this.getOrgList()
      this.getTableChange()
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
        if (this.detDataTemp.id) this.getPermission()
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
            name: this.$route.name,
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
        // 其他形式的页面跳转
        switch (type) {
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
      // 此处没有采取组件内获取数据，外部获取数据填充
      async getOrgList() {
        // 获取全部组织，用于组织范围选择和显示
        // 非缓存，便于及时更新
        const url = this.ajaxPath.organizationLevel
        this.AOLoading = true
        try {
          const { data } = await this.$axios
            // 没有传生效日期的
            .post(url)
          this.orgData = data ? [data] : []
        } catch (err) {
          console.log(err)
        }
        this.AOLoading = false
      },
      async getPermission() {
        // 获取数据
        if (!this.detDataTemp.id) return
        if (this.preloading) return
        this.preloading = true
        try {
          const { id } = this.detDataTemp
          const { detail } = this.ajaxPath
          const { data: detData } = await this.$axios
            .post(detail, { id })

          this.detData.is_lock = Number(detData.base_info.is_lock)
          this.detData.role_list = detData.role_info.map(_ => _.id)
          this.detData.org_list = detData.org_info.map(_ => _.id)
          // 初始设定数据
          if (this.edit) {
            this.$refs.orgDataTree.setCheckedKeys(this.detData.org_list)
          }

          this.detDataTemp.id = id
          this.detDataTemp.name = detData.base_info.name
          this.detDataTemp.emp_code = detData.base_info.emp_code
          this.detDataTemp.org_name = detData.base_info.org_name
          this.detDataTemp.job_name = detData.base_info.job_name
          this.detDataTemp.broker_code = detData.base_info.broker_code
          this.detDataTemp.avatar_url = detData.base_info.avatar_url
          this.detDataTemp.role_info = detData.role_info
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
      async getTableChange(page = '') {
        if (page) this.detDataTemp.selectPage = page
        const { roleList } = this.ajaxPath
        const { search, selectPage, selectSize, role_info: roleInfo } = this.detDataTemp
        const searchArray = this.$utils.tools.splitKeyword(search)

        // 非编辑态直接本地数据
        if (!this.edit) {
          const start = (selectPage - 1) * selectSize
          const end = selectPage * selectSize
          const searchKeys = ['code', 'name']

          if (!searchArray.length) {
            this.detDataTemp.search_role_info = roleInfo
          } else if (searchArray.length === 1) {
            const { convertRegStr } = this.$utils.tools
            const searchExp = new RegExp(convertRegStr(searchArray.join('|')))
            this.detDataTemp.search_role_info = roleInfo.filter((item) => {
              // 处理能搜索
              const testObject = {}
              searchKeys.forEach((key) => {
                testObject[key] = item[key]
              })
              return searchExp.test(Object.values(testObject).join(' '))
            })
          } else {
            this.detDataTemp.search_role_info = roleInfo.filter((item) => {
              // 处理能搜索
              const testObject = {}
              searchKeys.forEach((key) => {
                testObject[key] = item[key]
              })
              return Object.keys(testObject).some(key => searchArray.includes(item[key]))
            })
          }
          this.detDataTemp.select_role_info = this.detDataTemp.search_role_info
            .slice(start, end)
          return
        }

        // 编辑态获取服务器数据
        this.ARLoading = true
        try {
          const { data } = await this.$axios
            .post(roleList, {
              keywords: searchArray.join(','),
              per_page: selectSize,
              page: selectPage,
            })
          this.detDataTemp.select_role_info = data.list || []
          this.detDataTemp.count = data.count
        } catch (err) {
          console.log(err)
        }
        this.ARLoading = false
      },
      forEachOrg(arr, target) {
        // 遍历orgList，用于详情
        const result = []
        arr.forEach((item) => {
          const OjItem = Object.assign({}, item)
          delete OjItem.children
          if (target.includes(item.id)) {
            result.push(OjItem)
          }
          if (item.children && item.children.length) {
            OjItem.children = this.forEachOrg(item.children, target)
            if (OjItem.children.length) {
              if (!result.includes(OjItem)) result.push(OjItem)
            } else {
              delete OjItem.children
            }
          }
        })
        return result
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
      selectChoose(role) {
        if (this.detData.role_list.includes(role.id)) return
        this.detData.role_list.push(role.id)
        this.detDataTemp.role_info.push(role)
      },
      selectDel(roleId) {
        if (this.detData.role_list.includes(roleId)) {
          const listIndex = this.detData.role_list.findIndex(_ => _ === roleId)
          const infoIndex = this.detDataTemp.role_info.findIndex(_ => _.id === roleId)
          this.detData.role_list.splice(listIndex, 1)
          this.detDataTemp.role_info.splice(infoIndex, 1)
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
        if (!this.detDataTemp.id) return
        if (this.loading) return
        this.loading = true
        try {
          this.detData.org_list = this.$refs.orgDataTree.getCheckedKeys()
          const postData = Object.assign({}, this.detData)
          // 字符化字段
          postData.role_list = postData.role_list.join(',')
          postData.org_list = postData.org_list.join(',')
          postData.id = this.detDataTemp.id

          const { edit } = this.ajaxPath
          await this.$axios
            .post(edit, postData)
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
      const case1 = from.query.edit && !to.query.edit
      const case2 = from.query.edit &&
        to.query.edit &&
        String(to.params.id) !== String(from.params.id)
      if (case1 || case2) {
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
      if (from.query.edit) {
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

.page__permission {
  &--details {
    .userinfo--wrap {
      margin-top: 14px;
      margin-bottom: 14px;
      background: #fff;
      border: 1px solid #e9e9e9;
      padding: 20px 0;
    }
  }
}
</style>
