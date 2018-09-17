<template>
  <div
    v-loading.fullscreen.lock="preloading"
    class="page page__department">

    <!-- 面包屑，固定层级 -->
    <m-breadcrumb :items="breadcrumb" />

    <!-- 顶部按钮 -->
    <div
      class="block-margin-bottom"
      v-show="!edit">
      <el-button
        v-permission="1010001"
        type="primary"
        icon="el-icon-edit"
        @click="getEditChange">编辑
      </el-button>
      <el-button
        v-permission="1010001"
        icon="el-icon-plus"
        v-if="routeFromCreate"
        @click="getToCreate">继续新建
      </el-button>
      <el-button
        icon="el-icon-d-arrow-left"
        v-if="redirect"
        @click="getToBack">返回
      </el-button>
      <el-button
        v-permission="'1010001,1010002'"
        icon="el-icon-tickets"
        v-if="!redirect && !routeFromCreate"
        @click="getToHistory">查看变更记录
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

      <div
        v-permission.del="'1030001,1030002'"
        class="employee-list"
        v-if="!redirect && !routeFromCreate"
        @click="getToEmployeeList">
        <icon-emp />员工列表
      </div>
    </div>

    <!-- 内容部分 -->
    <m-section
      is-form
      v-if="edit">
      <el-form
        class="m-section--form"
        label-position="left"
        label-width="140px"
        ref="detData"
        :model="detData"
        :rules="detDataRules">
        <m-section-row>
          <el-form-item
            label="生效日期"
            prop="valid_date"
            v-if="edit"
            key="valid_date"
            :rules="detDataRules.valid_date">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="detData.valid_date"
              :picker-options="valid_dateOptions"
              @change="validDateValidated('pid')" />
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="组织编码">
            {{ detDataTemp.code || '由系统生成' }}
          </el-form-item>

          <el-form-item
            label="组织名称"
            prop="name"
            key="name">
            <el-input
              v-model="detData.name" />
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="简称"
            prop="short_name"
            key="short_name">
            <el-input
              v-model="detData.short_name" />
          </el-form-item>

          <el-form-item
            label="上级组织"
            prop="pid"
            key="pid"
            :required="detDataTemp.level != 1">
            <m-cascader
              class="org-select"
              glass
              clearable
              init-change
              :width="260"
              :organization.sync="detData.pid"
              :valid-date="detData.valid_date"
              :placeholder="detDataTemp.level == 1 || !!detDataTemp.id ? ' ' : '请选择'"
              :disabled="detDataTemp.level == 1 || !!detDataTemp.id"
              @change="getPname" />
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="组织层级"
            key="level_name">
            <el-input
              disabled
              placeholder="由上级组织指定"
              v-model="detDataTemp.level_name" />
          </el-form-item>

          <el-form-item
            label="组织属性"
            prop="flag"
            key="flag"
            :required="detDataTemp.level != 1">
            <el-select
              v-model="detData.flag"
              :disabled="detDataTemp.level == 1">
              <el-option
                label=" "
                v-if="detDataTemp.level == 1"
                :key="0"
                :value="0" />
              <el-option
                v-for="item in dictionary.flagList"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="组织类型"
            prop="type"
            key="type">
            <el-select
              v-model="detData.type"
              :disabled="detDataTemp.level == 1">
              <el-option
                v-for="item in dictionary.typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item
            label="所属成本中心"
            key="legal_entity_id">
            <m-legal-entity-select
              class="legal-entity-select"
              init-change
              :width="260"
              :legal-entity.sync="detData.legal_entity_id"
              :valid-date="detData.valid_date"
              @change="getLegalEntity" />
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="负责人"
            key="leader_uid">
            <m-employee-select
              class="employee-select"
              store-name="orgCreEmployeeSelect"
              init-change
              :width="260"
              :employees.sync="detData.leader_uid"
              :valid-date="detData.valid_date"
              @change="getEmployeeLeader" />
          </el-form-item>

          <el-form-item
            label="分管领导"
            key="charge_uid">
            <m-employee-select
              class="employee-select"
              store-name="orgCreEmployeeSelect"
              init-change
              :width="260"
              :employees.sync="detData.charge_uid"
              :valid-date="detData.valid_date"
              @change="getEmployeeCharge" />
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="部门编制"
            prop="emp_count"
            v-if="edit"
            key="emp_count">
            <el-input
              v-model.number="detData.emp_count">
              <template slot="append">人</template>
            </el-input>
          </el-form-item>

          <el-form-item
            label="所属条线"
            prop="line"
            key="line">
            <el-select
              v-model="detData.line">
              <el-option
                v-for="item in dictionary.lineList"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="联系人"
            prop="contacts_uid"
            key="contacts_uid">
            <m-employee-select
              class="employee-select"
              store-name="orgCreEmployeeSelect"
              init-change
              :width="260"
              :employees.sync="detData.contacts_uid"
              :valid-date="detData.valid_date"
              @change="getEmployeeContacts" />
          </el-form-item>
        </m-section-row>

        <el-form-item
          label="地址信息"
          class="textarea"
          prop="address"
          key="address">
          <el-input
            type="textarea"
            autosize
            v-model="detData.address"
            :rows="1" />
        </el-form-item>

        <el-form-item
          label="部门职责说明书"
          class="textarea"
          prop="remark"
          key="remark">
          <el-input
            type="textarea"
            v-model="detData.remark"
            :autosize="{ minRows: 4 }"
            :rows="4" />
        </el-form-item>
      </el-form>
    </m-section>

    <m-section
      v-else>
      <m-section-row>
        <m-section-cell
          title="生效日期"
          :content="getDate(detData.valid_date)" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="组织编码"
          :content="detDataTemp.code" />

        <m-section-cell
          title="组织名称"
          :content="detData.name" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="简称"
          :content="detData.short_name" />

        <m-section-cell
          title="上级组织"
          :content="detDataTemp.pname" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="组织层级"
          :content="detDataTemp.level_name" />

        <m-section-cell
          title="组织属性"
          :content="
            1 > detData.flag || detData.line === undefined
              ? ''
              : dictionary.flagList[detData.flag].label
          " />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="组织类型"
          :content="
            1 > detData.type || detData.line === undefined
              ? ''
              : dictionary.typeList[detData.type].label
          " />

        <m-section-cell
          title="所属成本中心"
          :content="detDataTemp.legal_entity_name" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="负责人"
          :content="detDataTemp.leader_name" />

        <m-section-cell
          title="分管领导"
          :content="detDataTemp.charge_name" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="部门编制"
          :content="(detData.emp_count || 0) + '人'" />

        <m-section-cell
          title="所属条线"
          :content="
            1 > detData.line || detData.line === undefined
              ? ''
              : dictionary.lineList[detData.line].label
          " />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="联系人"
          :content="detDataTemp.contacts_name" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="地址信息"
          :content="detData.address.replace(/\n/g, '<br>')" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="部门职责说明书"
          :content="detData.remark.replace(/\n/g, '<br>')" />
      </m-section-row>
    </m-section>

    <!-- 提交返回 -->
    <div
      v-if="edit">
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
   * @description 组织新建、详情、编辑页面
   * 组织名称有非法字符校验
   * 生效日期和所选组织生效日期有先后校验
   */

  import iconEmp from './icon-emp'

  export default {
    name: 'Department',
    components: { iconEmp },
    data() {
      // 名称非法字符校验
      const nameValid = (rule, value, callback) => {
        const test = /[//]/im
        if (test.test(value)) {
          return callback('名称中不能包含非法字符')
        }
        return callback()
      }

      // 是否数字校验器
      const validatorNumber = (rule, value, callback) => {
        if (Number.isNaN(Number(value))) {
          return callback(new Error('请输入数字'))
        } else if (String(value).length > 10) {
          return callback(new Error('不超过10个字符'))
        }
        return callback()
      }

      // 生效日期时间校验器
      const validatorValidTime = (rule, value, callback) => {
        if (!this.p_valid_date) {
          this.valid_dateErr.delete('valid_date')
          return callback()
        }
        const pValidDate = new Date(this.p_valid_date).getTime()
        const validDate = new Date(value).getTime()
        if (validDate < pValidDate - 8.64e7) {
          this.valid_dateErr.add('valid_date')
          return callback(new Error('不能早于上级组织生效日期生效'))
        }
        this.valid_dateErr.delete('valid_date')
        return callback()
      }

      // 上级组织生效日期及是否必填校验器
      const validatorPid = (rule, value, callback) => {
        if (Number(this.detDataTemp.level) === 1) {
          this.valid_dateErr.delete('pid')
          return callback()
        } else if (!value) {
          this.valid_dateErr.add('pid')
          return callback(new Error('请选择上级组织'))
        } else if (!this.detData.valid_date) {
          this.valid_dateErr.delete('pid')
          return callback()
        }
        const pValidDate = new Date(this.p_valid_date).getTime()
        const validDate = new Date(this.detData.valid_date).getTime()
        if (validDate < pValidDate - 8.64e7) {
          this.valid_dateErr.add('pid')
          return callback(new Error('上级生效日期不能晚于当前生效日期'))
        }
        this.valid_dateErr.delete('pid')
        return callback()
      }

      // 组织属性动态校验器
      const validatorFlag = (rule, value, callback) => {
        if (Number(this.detDataTemp.level) === 1) {
          return callback()
        } else if (!value) {
          return callback(new Error('请选择组织属性'))
        }
        return callback()
      }

      // 生效日期时间计算器
      const disabledDate = (time) => {
        // 1、如果未来没生效或者
        // 2、新建则可以无限选择
        const case1 = !this.detDataTemp.valid_date
        const case2 = new Date(this.detDataTemp.valid_date).getTime() > Date.now()
        if (case1 || case2) return false
        // 否则不能早于已生效日期
        const minDate = new Date(this.detDataTemp.valid_date).getTime()
        return time.getTime() < minDate - 8.64e7
      }

      return {
        edit: false,
        noConfirm: false,
        routeFromCreate: false,
        preloading: false,
        loading: false,
        redirect: decodeURIComponent(this.$route.query.redirect || ''),
        valid_dateOptions: {
          disabledDate,
        },
        p_valid_date: '',
        valid_dateErr: new Set(),

        // 添加接口要求字段
        clearDetData: {},
        queryDetData: {},
        detData: {
          valid_date: '',
          name: '',
          short_name: '',
          pid: '',
          type: 1,
          flag: 1,
          legal_entity_id: '',
          leader_uid: '',
          charge_uid: '',
          contacts_uid: '',
          emp_count: '',
          line: '',
          address: '',
          remark: '',
        },

        // 其他显示字段
        clearDetDataTemp: {},
        queryDetDataTemp: {},
        detDataTemp: {
          id: '',
          name: '',
          code: '',
          pname: '',
          level: '',
          level_name: '',
          legal_entity_name: '',
          leader_name: '',
          charge_name: '',
          contacts_name: '',
          valid_date: '',
          newest_valid_date: '',
          isNewest: true,
        },

        // 表单校验条件
        detDataRules: {
          valid_date: [
            { type: 'date', required: true, message: '请输入生效日期', trigger: ['blur', 'change'] },
            { validator: validatorValidTime, trigger: ['blur', 'change'] },
          ],
          name: [
            { required: true, message: '请输入组织名称', trigger: ['blur', 'change'] },
            { validator: nameValid, trigger: ['blur', 'change'] },
            { max: 50, message: '不超过50个字符', trigger: ['blur', 'change'] },
          ],
          short_name: [
            { max: 20, message: '不超过20个字符', trigger: ['blur', 'change'] },
          ],
          emp_count: [
            { validator: validatorNumber, trigger: ['blur', 'change'] },
          ],
          pid: [
            { validator: validatorPid, trigger: ['blur', 'change'] },
          ],
          contacts_uid: [
            { required: true, message: '请选择联系人', trigger: ['blur', 'change'] },
          ],
          flag: [
            { validator: validatorFlag, trigger: ['blur', 'change'] },
          ],
          type: [
            { type: 'number', required: true, message: '请选择组织类型', trigger: ['blur', 'change'] },
          ],
          line: [
            { type: 'number', required: true, message: '请选择所属条线', trigger: ['blur', 'change'] },
          ],
          address: [
            { max: 100, message: '不超过100个字符', trigger: ['blur', 'change'] },
          ],
          remark: [
            { max: 500, message: '不超过500个字符', trigger: ['blur', 'change'] },
          ],
        },
      }
    },
    computed: {
      dictionary() {
        return this.$utils.config.dictionary.org
      },
      ajaxPath() {
        return this.$api.organization.org
      },
      breadcrumb() {
        const defaultBC = [
          { name: '组织管理' },
          { name: '组织维护', to: '/query' },
          { name: '组织详情' },
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
      toNextId() {
        if (!this.detDataTemp.id || !this.$store.getters.getMaintianIds) return ''
        const ids = this.$store.getters.getMaintianIds
        const thisIndex = ids.findIndex(v => v === this.detDataTemp.id)
        if (thisIndex === ids.length - 1) return ''
        return ids[thisIndex + 1]
      },
      toPrevId() {
        if (!this.detDataTemp.id || !this.$store.getters.getMaintianIds) return ''
        const ids = this.$store.getters.getMaintianIds
        const thisIndex = ids.findIndex(v => v === this.detDataTemp.id)
        if (thisIndex === 0) return ''
        return ids[thisIndex - 1]
      },
    },
    watch: {
      // 如果路由发生变化，拉取新数据，更新编辑状态
      $route(to, from) {
        // 1、从新建跳转到其他ID
        // 2、ID发生变化
        // 3、从已有ID跳新建
        const case1 = !from.params.id && String(to.params.id) !== String(this.detDataTemp.id)
        const case2 = to.params.id &&
          from.params.id &&
          String(to.params.id) !== String(from.params.id)
        const case3 = from.params.id && !to.params.id
        if (case1 || case2 || case3) this.getRouteChange()
        this.edit = !!to.query.edit || !to.params.id
        // 编辑态时初始化有效日期，其他恢复数据
        if (this.edit) {
          this.detData.valid_date = new Date()
        } else {
          this.$refs.detData.resetFields()
          Object.assign(this.detData, this.queryDetData)
          Object.assign(this.detDataTemp, this.queryDetDataTemp)
        }
      },
    },
    created() {
      // 数据初始化和缓存
      Object.assign(this.clearDetData, this.detData)
      Object.assign(this.clearDetDataTemp, this.detDataTemp)
      this.getRouteChange()
      this.edit = !!this.$route.query.edit || !this.$route.params.id
      // 编辑态时初始化有效日期
      if (this.edit) this.detData.valid_date = new Date()
      this.routeFromCreate = !this.$route.params.id
      // 本页面执行错误处理
      this.$on('error', this.$message.error)
      this.$on('ok', this.$message.success)
    },
    methods: {
      getRouteChange() {
        // 恢复原始状态，获取routeID和数据
        Object.assign(this.detData, this.clearDetData)
        Object.assign(this.detDataTemp, this.clearDetDataTemp)
        Object.assign(this.queryDetData, this.clearDetData)
        Object.assign(this.queryDetDataTemp, this.clearDetDataTemp)
        this.detDataTemp.id = this.$route.params.id || ''
        if (this.detDataTemp.id) this.getOrg()
      },

      getEditChange() {
        // 调整模式，手动触发路由变化
        if (this.edit) {
          const query = Object.assign({}, this.$route.query)
          if (query.edit) delete query.edit
          if (this.$route.params.id) {
            this.$router.push({
              path: this.$route.path,
              query,
            })
          } else {
            this.$router.push({
              name: this.$route.name,
              params: { id: this.detDataTemp.id },
              query,
            })
          }
        } else {
          this.$router.push({
            path: this.$route.path,
            query: Object.assign({}, this.$route.query, {
              edit: true,
            }),
          })
        }
      },

      getToCreate() {
        // 继续新建
        this.$router.push({
          name: this.$route.name,
          query: Object.assign({}, this.$route.query),
        })
      },

      getToBack() {
        // 返回回传地址
        window.location.href = this.redirect
      },

      getToHistory() {
        // 去历史
        this.$router.push({
          name: 'DepartmentHistory',
          params: { id: this.detDataTemp.id },
          query: Object.assign({}, this.$route.query, {
            name: this.detDataTemp.name,
          }),
        })
      },

      getToEmployeeList() {
        // 去员工列表，不用带其他参数
        this.$router.push({
          name: 'EmployeeList',
          params: { id: this.detDataTemp.id },
          query: { name: this.detDataTemp.name },
        })
      },

      getTo(type) {
        // 上一条下一条
        this.$router.replace({
          name: this.$route.name,
          params: { id: type === 'prev' ? this.toPrevId : this.toNextId },
          query: Object.assign({}, this.$route.query),
        })
      },

      async getOrg() {
        if (!this.detDataTemp.id) {
          return
        }

        // 获取数据
        if (this.preloading) return
        this.preloading = true
        try {
          const { data: detData } = await this.$axios
            .post(this.ajaxPath.get, { id: this.detDataTemp.id })

          // 处理字段
          detData.valid_date = new Date(detData.valid_date)
          Object.keys(this.detData).forEach((i) => {
            if (detData[i] !== undefined) this.detData[i] = detData[i]
          })
          Object.keys(this.detDataTemp).forEach((i) => {
            if (detData[i] !== undefined) this.detDataTemp[i] = detData[i]
          })

          // 确定本条记录是否最新
          const validDate = this.getDate(detData.valid_date)
          this.detDataTemp.isNewest = validDate === detData.newest_valid_date
          this.preloading = false
        } catch (err) {
          this.preloading = false
          console.log(err)
          return
        }

        Object.assign(this.queryDetData, this.detData)
        Object.assign(this.queryDetDataTemp, this.detDataTemp)

        // 编辑态时初始化有效日期
        if (this.edit) {
          this.detData.valid_date = new Date()
        }
      },

      getDate(date) {
        // YYYY-MM-DD
        return !date
          ? date
          : this.$utils.tools
            .formatDate(new Date(date), 'YYYY-MM-DD')
      },

      getLevelTranslate(num) {
        // 123 => 一二三
        const arr = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
        let re = '';
        [...`${num || 0}`].forEach((i) => {
          re = `${re}${arr[i]}`
        })
        return re
      },

      getPname(org) {
        // 获取组织选择器带出的数据用于显示和校验
        if (org.length) {
          this.p_valid_date = new Date(org[org.length - 1].valid_date)
          this.detDataTemp.pname = org[org.length - 1].label
          this.detDataTemp.level_name = this
            .getLevelTranslate(Number(org[org.length - 1].level) + 1)
          // 顶级节点做处理，并不可修改上级组织，组织类型，组织属性字段
          this.detDataTemp.level_name = `${Number(this.detDataTemp.level) === 1
            ? '一'
          : this.detDataTemp.level_name}级`
        } else {
          this.p_valid_date = ''
          this.detDataTemp.pname = ''
          this.detDataTemp.level_name = `${Number(this.detDataTemp.level) === 1
            ? '一级'
          : ''}`
        }
        this.validDateValidated('valid_date')
      },

      getLegalEntity(len) {
        // 获取成本中心选择器用于展示
        if (len.length) {
          this.detDataTemp.legal_entity_name = len[len.length - 1].name
        } else {
          this.detDataTemp.legal_entity_name = ''
        }
      },

      getEmployeeLeader(emp) {
        // 获取负责人带出数据用于展示
        if (emp.length) {
          this.detDataTemp.leader_name = emp[emp.length - 1].name
        } else {
          this.detDataTemp.leader_name = ''
        }
      },

      getEmployeeCharge(emp) {
        // 获取分管领导带出数据用于展示
        if (emp.length) {
          this.detDataTemp.charge_name = emp[emp.length - 1].name
        } else {
          this.detDataTemp.charge_name = ''
        }
      },

      getEmployeeContacts(emp) {
        // 获取联系人带出数据用于展示
        if (emp.length) {
          this.detDataTemp.contacts_name = emp[emp.length - 1].name
        } else {
          this.detDataTemp.contacts_name = ''
        }
      },

      validDateValidated(id) {
        // 校验生效日期回调
        if (this.valid_dateErr.has(id)) this.$refs.detData.validateField(id)
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

        // 提交确认
        const { newest_valid_date, isNewest, id, code } = this.detDataTemp
        try {
          let info = ''
          const validDate = new Date(this.getDate(newest_valid_date)).getTime()
          if (!isNewest) {
            // 确认删除未来记录
            info = `将会删除${newest_valid_date}的未生效记录，是否继续？`
          } else if (id && validDate > Date.now()) {
            // 确认修改本条未来记录
            info = `本次操作将覆盖原有${newest_valid_date}的未生效记录，是否继续？`
          }
          if (info) {
            await this.$confirm(info, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            })
          }
        } catch (err) {
          console.log(err)
          return
        }

        // 提交数据
        if (this.loading) return
        this.loading = true
        try {
          let url = ''
          let data = {}
          if (id) {
            url = this.ajaxPath.edit
            data = Object.assign(data, this.detData, { id })
          } else {
            url = this.ajaxPath.add
            data = Object.assign(data, this.detData)
          }
          data.valid_date = this.getDate(data.valid_date)

          const { data: postBack } = await this.$axios
            .post(url, data)

          // 新建或立即生效时要初始化校验时间，用来禁止选择过去
          if (!id || new Date(data.valid_date).getTime() <= Date.now()) {
            this.detDataTemp.valid_date = data.valid_date
          }
          // 更新是否最新、id、code和展示name
          this.detDataTemp.isNewest = true
          this.detDataTemp.newest_valid_date = data.valid_date
          this.detDataTemp.id = postBack.id || id
          this.detDataTemp.code = postBack.code || code
          this.detDataTemp.name = this.detData.name
          this.$emit('ok', '提交成功！')
          this.loading = false
        } catch (err) {
          this.loading = false
          console.log(err)
          return
        }

        Object.assign(this.queryDetData, this.detData)
        Object.assign(this.queryDetDataTemp, this.detDataTemp)
        this.$nextTick(this.pageBack)
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

        this.$nextTick(this.pageBack)
      },

      pageBack() {
        // 页面返回
        this.noConfirm = true
        if (this.detDataTemp.id) {
          this.getEditChange()
        } else if (this.redirect) {
          this.getToBack()
        } else {
          window.history.go(-1)
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

<style lang="scss" type="text/scss" rel="stylesheet/scss">
.page__department {
  .block-margin-bottom {
    clear: both;

    .employee-list {
      float: right;
      position: relative;
      font-size: 16px;
      line-height: 34px;
      padding-left: 31px;
      cursor: pointer;

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

        svg g g {
          fill: #5090f7;
        }
      }
    }
  }
}
</style>
