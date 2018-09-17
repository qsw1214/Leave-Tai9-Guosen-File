<template>
  <section
    v-loading.fullscreen.lock="loading"
    class="page page--pa-fixed__assets">
    <m-breadcrumb :items="breadcrumb" />
    <userinfo :data="userinfo" />

    <m-section
      title="申请表单"
      is-form>

      <m-section-row>
        <m-section-cell
          title="流程编码"
          :content="info.code || '提交后由系统生成'" />
        <m-section-cell
          title="申请日期"
          :content="info.apply_date || '提交后由系统生成'" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="流程状态"
          :content="info.status_name || '草稿'" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="入职日期"
          :content="joinDate" />
        <m-section-cell
          title="转正日期"
          :content="correctDate" />
      </m-section-row>

      <el-form
        class="m-section--form"
        label-width="140px"
        ref="form"
        :rules="rules"
        :model="form">

        <m-section-row>
          <el-form-item
            label="申请物品"
            prop="gdzcsq_goods">
            <el-select
              v-model="form.gdzcsq_goods">
              <el-option
                v-for="item in options"
                :label="item.label"
                :key="item.value"
                :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item
            label="申请数量"
            prop="gdzcsq_num">

            <el-input
              type="number"
              v-model="form.gdzcsq_num">
              <template slot="append">台</template>
            </el-input>

          </el-form-item>
        </m-section-row>

        <el-form-item
          label="申请原因"
          prop="gdzcsq_reason">
          <el-input
            placeholder="请输入申请原因"
            style="width: 100%;"
            type="textarea"
            v-model="form.gdzcsq_reason" />
        </el-form-item>

        <m-section-row>
          <el-form-item
            prop="gdzcsq_liabler_uid"
            label="责任人">
            <m-employee-select
              class="employee-select"
              :width="260"
              :employees.sync="form.gdzcsq_liabler_uid"
              @change="getEmployeeCharge" />
          </el-form-item>

          <el-form-item
            prop="gdzcsq_user_uid"
            label="使用人">
            <m-employee-select
              class="employee-select"
              :width="260"
              :employees.sync="form.gdzcsq_user_uid"
              @change="getEmployeeChargeUser" />
          </el-form-item>
        </m-section-row>
      </el-form>
    </m-section>

    <logs-and-path
      v-if="info.status === 94"
      :data="logsAndPath" />

    <application-button />
  </section>
</template>

<script>
  import mixin from '~services/mixin'
  import LogsAndPath from '@/components/logsAndPath'
  import Userinfo from '../common/Userinfo'
  import ApplicationButton from '../common/ApplicationButton'

  export default {
    name: 'FixedAssets',

    components: {
      Userinfo,
      LogsAndPath,
      ApplicationButton,
    },
    mixins: [mixin.pa, mixin.flow, mixin.router],

    data() {
      const { id } = this.$route.params

      return {
        breadcrumb: this.$breadcrumb([
          { name: '固定资产申请' },
        ]),
        userinfo: {},
        form: {
          gdzcsq_goods: '',
          gdzcsq_num: '',
          gdzcsq_reason: '',
          gdzcsq_liabler_uid: '',
          gdzcsq_user_uid: '',
        },
        rules: {
          gdzcsq_goods: [
            { required: true, message: '请选择申请物品种类', trigger: 'blur' },
          ],
          gdzcsq_num: [
            { required: true, message: '请填写申请数量', trigger: 'blur' },
            {
              message: '请输入大于0的整数',
              pattern: /^([1-9]*[1-9][0-9]*)$/,
            },
          ],
          gdzcsq_reason: [
            { required: true, message: '请填写申请原因', trigger: 'blur' },
          ],
          gdzcsq_liabler_uid: [
            { required: true, message: '请选择责任人', trigger: 'blur' },
          ],
          gdzcsq_user_uid: [
            { required: true, message: '请选择使用人', trigger: 'blur' },
          ],
        },
        id,
        options: [
          { value: '1', label: '台式机主机' },
          { value: '2', label: '台式机显示器' },
          { value: '4', label: '笔记本电脑' },
        ],
        submitMessage: '提交完成，请留意流程审批状态，通过后请至人力行政处领取',
      }
    },

    computed: {
      joinDate() {
        if (this.id) {
          return this.form.gdzcsq_applier_join_date
        }
        return this.info.join_date
      },

      correctDate() {
        if (this.id) {
          return this.form.gdzcsq_applier_correction_date || '未转正'
        }
        return this.info.correction_date || '未转正'
      },
    },

    created() {
      if (!this.id) {
        this.getInitUser()
          .then((res) => {
            this.userinfo = res.data
            this.info = res.data
          })
      } else {
        this.getInfo()
          .then((res) => {
            this.form = res.data.flow_form_data
            this.userinfo = this.info.applier_user_info

            if (Number(this.info.status) === 94) {
              this.getLogsAndPath()
            }
          })
      }
    },

    methods: {
      getEmployeeCharge(item) {
        const { id } = item[0]
        this.form.gdzcsq_liabler_uid = id
      },

      getEmployeeChargeUser(item) {
        const { id } = item[0]
        this.form.gdzcsq_user_uid = id
      },
    },
  }
</script>

<style lang="scss">
  .m-employee-select {
    .el-form-item {
      height: 0;
      margin: 0;
    }
  }
</style>
