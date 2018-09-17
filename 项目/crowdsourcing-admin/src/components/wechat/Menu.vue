<template>
  <div class="menu-container">
    <!--<pre>{{ menuList }}</pre>-->
    <div class="toolbar">
      <el-button type="info" @click="addParentMenu">新增父菜单</el-button>
      <el-button type="info" :plain="true" @click="addSubMenu">新增子菜单</el-button>
      <div class="right">
        <el-button type="info" @click="publicMenu">发布至微信公众号</el-button>
      </div>
    </div>
    <!--数据列表-->
    <el-table
      :data="menuList"
      v-loading="loading"
      :default-expand-all="expandAll"
      style="width: 100%">
      <el-table-column type="expand">
        <template scope="props">
          <el-table
            stripe
            border
            empty-text="尚未创建子菜单"
            :data="props.row.sub"
            style="width: 1200px;">
            <el-table-column
              label="排序值"
              width="80"
              align="center"
              prop="sort">
            </el-table-column>
            <el-table-column
              label="子菜单名称"
              prop="name">
            </el-table-column>
            <el-table-column
              width="120"
              label="子菜单类型">
              <template scope="scope">
                <span>{{ scope.row.type | menuType }}</span>
              </template>
            </el-table-column>
            <el-table-column
              width="120"
              align="center"
              label="当前状态">
              <template scope="scope">
                <el-tag
                  :type="scope.row.status === '1' ? 'success' : 'danger'"
                  close-transition>{{ scope.row.status | statusEnable }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="content"
              label="内容">
            </el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <el-button
                  size="small"
                  @click="editSubMenu(scope.row)">编辑</el-button>
                <el-button
                  size="small"
                  type="warning"
                  @click="delSubMenu(scope.$index, scope.row, props.row.sub)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        label="排序值"
        align="center"
        width="80"
        prop="sort">
      </el-table-column>
      <el-table-column
        label="菜单名称"
        prop="name">
      </el-table-column>
      <el-table-column
        label="当前状态">
        <template scope="scope">
          <el-tag
            :type="scope.row.status === '1' ? 'success' : 'danger'"
            close-transition>{{ scope.row.status | statusEnable }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="菜单类型">
        <template scope="scope">
          <span>{{ scope.row.type | menuType }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="内容"
        prop="content">
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button
            size="small"
            @click="editParentMenu(scope.row)">编辑</el-button>
          <el-button
            size="small"
            type="danger"
            @click="delParentMenu(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--父菜单编辑或者新增-->
    <el-dialog :title="title" v-model="formParentVisible" :close-on-click-modal="false" size="tiny">
      <!--:rules="modifyFormRules"-->
      <el-form :model="modifyForm" label-width="90px"  ref="modifyForm">
        <el-form-item label="排序值" prop="sort" required>
          <el-input v-model="modifyForm.sort" style="width: 120px" placeholder="数值越小越靠前" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="菜单名称" prop="name" required>
          <el-input v-model="modifyForm.name" style="width: 120px" placeholder="通常4个字以内" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="菜单类型">
          <el-select v-model="modifyForm.type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="菜单内容" prop="content">
          <el-input v-model="modifyForm.content" placeholder="链接为网址、点击事件为字符" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="当前状态" required>
          <el-radio-group v-model="modifyForm.status">
            <el-radio class="radio" :label='"1"'>正常</el-radio>
            <el-radio class="radio" :label='"2"'>下架</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="formParentVisible = false">取消</el-button>
        <el-button type="primary" @click="submitParentForm">提交</el-button>
      </div>
    </el-dialog>
    <!--子菜单的编辑和删除-->
    <el-dialog :title="title" v-model="formSubVisible" :close-on-click-modal="false" size="tiny">
      <!--:rules="modifyFormRules"-->
      <el-form :model="modifyForm" label-width="90px"  ref="modifySubForm">
        <el-form-item label="父菜单" required>
          <el-select v-model="modifyForm.parent" placeholder="请选择父菜单">
            <el-option
              v-for="item in parentMenuList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="排序值" prop="sort" required>
          <el-input v-model="modifyForm.sort" style="width: 120px" placeholder="数值越小越靠前" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="菜单名称" prop="name" required>
          <el-input v-model="modifyForm.name" style="width: 120px" placeholder="通常4个字以内" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="菜单类型" required>
          <el-select v-model="modifyForm.type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="菜单内容" prop="content" required>
          <el-input v-model="modifyForm.content" placeholder="链接为网址、点击事件为字符" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="当前状态" required>
          <el-radio-group v-model="modifyForm.status">
            <el-radio class="radio" :label='"1"'>正常</el-radio>
            <el-radio class="radio" :label='"2"'>下架</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="formSubVisible = false">取消</el-button>
        <el-button type="primary" @click="submitSubMenu">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import axios from '../../assets/axios'
  export default {
    name: 'Menu',
    data() {
      return {
        expandAll: true,
        menuList: [],
        title: '编辑',
        formParentVisible: false,
        formSubVisible: false,
        tempRow: {},
        modifyForm: {},
        parentMenuList: [],
        loading: false,
        parentAction: '',
        subAction: '',
        options: [{
          value: '1',
          label: '普通链接'
        }, {
          value: '2',
          label: '点击事件'
        }]
      }
    },
    created () {
      this.getMenuList()
    },
    methods: {
      // 获取菜单列表
      getMenuList () {
        this.loading = true
        axios
          .post('/wechat/menulist')
          .then(res => {
            this.loading = false
            const { code, error, data } = res.data
            const { list } = data
            if (code == 0) {
              this.menuList = list
              this.parentMenuList = list.map(item => {
                return {
                  value: item.id,
                  label: item.name
                }
              })
            }else {
              this.menuList = []
            }
          })
          .catch(e => {
            this.loading = false
            this.$message.error(error);
          })
      },
      // 编辑一级菜单
      editParentMenu (row) {
        this.formParentVisible = true
        this.tempRow = row
        this.modifyForm = Object.assign({}, row)
        this.parentAction = 'modify'
        this.title = '编辑'
      },
      // 新增一级菜单
      addParentMenu () {
        this.formParentVisible = true
        let data  = {
          id: '',
          name: '',
          type: '',
          parent: '',
          sort: '',
          status: '',
          content: ''
        }
        this.modifyForm = Object.assign({},data)
        this.parentAction = 'add'
        this.title = '新增'
      },
      // 一级菜单的提交
      submitParentForm () {
        const action = this.parentAction
        const {id, name, type, parent, sort, status, content} = this.modifyForm
        let data = {id, name, type, parentId:parent, sort, status, content}
        let message
        if (action == 'add') {
          // 新增建议直接跑一次接口
          message = '恭喜你！新增成功'
        } else if (action == 'modify'){
          // 直接设置，如果设置失败再将数据还原
          message = '恭喜你！修改成功'
          Object.assign(this.tempRow, {name, parent, type, sort, status, content})
          this.formParentVisible = false
        }
        if (sort == '') {
          this.$message.error('请填写排序值！')
          return
        }
        if (name == '') {
          this.$message.error('请填写菜单名称！')
          return
        }
        if (status == '') {
          this.$message.error('请选择当前状态！')
          return
        }
        axios
          .post('/wechat/pubmenu', data)
          .then(res => {
            let { code, error } = res.data
            if (code == 0) {
              this.$message({
                message,
                type: 'success'
              })
              if (action == 'add') {
                this.formParentVisible = false
                this.getMenuList()
              }
            } else if (error) {
              this.$message.error(error)
              if (action == 'add') {
                // todo
              } else if (action == 'modify') {
                let temp = Object.assign({}, this.tempRow)
                Object.assign(this.tempRow, temp)
              }
            }
          })
          .catch(e => {
            this.$message.error(error)
          })
      },
      // 删除父菜单
      delParentMenu (index, row) {
        let temp = [].concat(this.menuList)
        this.$confirm('此操作将永久删除该父菜单，同时子菜单也会被删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 直接移除
          this.menuList.splice(index, 1)
          axios
            .post('/wechat/del', {id: row.id, type: 2})
            .then(res => {
              let { code, error } = res.data
              if (code == 0) {
                this.$message({
                  message: '恭喜！成功删除。',
                  type: 'success'
                })
              } else if (error) {
                error = '删除失败! ' + error
                this.$message.error(error)
                this.menuList = [].concat(temp)
              }
            })
            .catch(e => {
              this.$message.error(error)
              this.menuList = [].concat(temp)
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 新增子菜单
      addSubMenu () {
        this.formSubVisible = true
        let data  = {
          id: '',
          name: '',
          type: '',
          parent: '',
          sort: '',
          status: '',
          content: ''
        }
        this.modifyForm = Object.assign({},data)
        this.subAction = 'add'
        this.title = '新增子菜单'
      },
      // 删除子菜单
      delSubMenu (index, row, subs) {
//        let temp = this.menuList.slice(0)
        this.$confirm('此操作将永久删除该子菜单', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 直接移除
//          subs.splice(index, 1)
          axios
            .post('/wechat/del', {id: row.id, type: 2})
            .then(res => {
              let { code, error } = res.data
              if (code == 0) {
                this.$message({
                  message: '恭喜！成功删除。',
                  type: 'success'
                })
                this.getMenuList()
              } else if (error) {
                error = '删除失败! ' + error
                this.$message.error(error)
//                this.menuList = [].concat(temp)
              }
            })
            .catch(e => {
              this.$message.error(error)
//              this.menuList = [].concat(temp)
            })
        }).catch((e) => {
          console.log(e)
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 编辑子菜单
      editSubMenu (row) {
        this.formSubVisible = true
        this.subAction = 'edit'
        this.title = '编辑子菜单'
        this.modifyForm = Object.assign({}, row)
      },
      // 修改子菜单
      submitSubMenu () {
        const action = this.subAction
        const {id, name, type, parent, sort, status, content} = this.modifyForm
        console.log(this.modifyForm.content)
        console.log(content)
        let data = {id, name, type, parentId:parent, sort, status, content}
        const message = action == 'add' ? '恭喜你！新增成功' : '恭喜你！修改成功'
        if (parent == '') {
          this.$message.error('请选择父菜单！')
          return
        }
        if (sort == '') {
          this.$message.error('请填写排序值！')
          return
        }
        if (status == '') {
          this.$message.error('请选择当前状态！')
          return
        }
        axios
          .post('/wechat/pubmenu', data)
          .then(res => {
            let { code, error } = res.data
            if (code == 0) {
              this.formSubVisible = false
              this.getMenuList()
              this.$message({
                message,
                type: 'success'
              })
            } else if (error) {
              this.$message.error(error)
            }
          })
          .catch(e => {
            this.$message.error(error)
          })
      },
      // 发布修改后的菜单
      publicMenu () {
        this.$confirm('立刻同步菜单更改到公众号，如未更改请勿操作！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _loading = this.$loading({
            text: '正在发布菜单'
          })
          axios
            .post('/wechat/publishmenu')
            .then(res => {
              _loading.close()
              let { code, error } = res.data
              if (code == 0) {
                this.$message({
                  message: '恭喜！发布成功。',
                  type: 'success'
                })
              } else if (error) {
                this.$message.error(error)
              }
            })
            .catch(e => {
              this.$message.error(error)
            })
        }).catch((e) => {
          console.log(e)
          this.$message({
            type: 'info',
            message: '已取消发布！'
          })
        })
      }
    },
    // 过滤器
    filters: {
      // 菜单启用状态过滤器
      statusEnable (value) {
        return {'1': '正常', '2': '下架'}[value]
      }
    }
  }
</script>

<style lang="scss" scoped  rel="stylesheet/scss">
  .menu-container {
    .right {
      display: inline-block;
      float: right;
    }
  }
</style>
