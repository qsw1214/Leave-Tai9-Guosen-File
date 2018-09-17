<template>
  <section
    v-loading.fullscreen.lock="loading"
    class="page page--pa-temp__card">

    <m-breadcrumb :items="breadcrumb" />

    <userinfo :data="userinfo"/>

    <m-section
      title="申请表单"
      is-form>

      <m-section-row>
        <m-section-cell
          title="流程编码"
          :content="info.code || '由系统自动生成'" />

        <m-section-cell
          title="申请日期"
          :content="info.apply_date || '由系统自动生成'" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="流程状态"
          :content="info.status_name || '草稿'" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="流程说明">
          <p>1.中后台员工转岗至前台；</p>
          <p>2.前台员工转岗至中后台；</p>
          <p>3.指纹脱皮需申请运筹打卡。</p>
        </m-section-cell>
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="当前打卡方式">
          <span>{{ joinType }}</span>
        </m-section-cell>
      </m-section-row>

      <el-form
        class="m-section--form"
        label-width="140px"
        ref="form"
        :rules="rules"
        :model="form">

        <m-section-row>
          <el-form-item
            label="变更后方式"
            prop="kqdkfsbg_sign_type">
            <el-select
              multiple
              size="medium"
              v-model="signType"
              @change="changeMethod">
              <el-option
                v-for="(item, key) in options.type"
                :key="key"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item
            label="变更原因"
            prop="kqdkfsbg_reason">
            <el-select
              v-model="form.kqdkfsbg_reason">
              <el-option
                v-for="(item, key) in options.reason"
                :key="key"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
        </m-section-row>
      </el-form>
    </m-section>

    <logsAndPath
      v-if="info.status == '94'"
      :data="logsAndPath" />

    <div class="page--pa-actions">
      <el-button
        type="primary"
        :loading="button.submit"
        @click="preSubmit()">提交</el-button>

      <el-button
        type="info"
        @click="cancel">取消</el-button>
    </div>
  </section>
</template>

<script>
  import mixin from '~services/mixin'
  import logsAndPath from '@/components/logsAndPath'
  import Userinfo from '~services/components/common/Userinfo'

  export default {
    name: 'PunchCardMethod',

    components: { Userinfo, logsAndPath },

    mixins: [mixin.pa, mixin.flow, mixin.router],

    data() {
      const signType = (rule, value, callback) => {
        const bool = Boolean(value)

        if (!bool) {
          callback(new Error('请选择变更后打卡方式'))
        } else {
          callback()
        }
      }

      return {
        breadcrumb: this.$breadcrumb([{ name: '打卡方式变更' }], 'attendance'),
        form: {
          kqdkfsbg_sign_type: '',
          kqdkfsbg_reason: '',
        },
        rules: {
          kqdkfsbg_sign_type: [
            { required: true, message: '请选择变更后打卡方式', trigger: ['blur', 'change'] },
            { validator: signType, trigger: ['blur', 'change'] },
          ],
          kqdkfsbg_reason: [
            { required: true, message: '请选择变更原因', trigger: ['blur', 'change'] },
          ],
        },
        options: {
          type: [
            { label: '指纹打卡', value: '1' },
            { label: '掌静脉打卡', value: '2' },
            { label: '运筹系统打卡', value: '4' },
          ],
          reason: [
            { label: '因指纹模糊变更打卡方式', value: '1' },
            { label: '岗位调整（前台转中后台）', value: '2' },
            { label: '岗位调整（中后台转前台）', value: '4' },
          ],
        },
        isEdit: false,
        submitMessage: '提交完成，请留意流程审批状态',
        submitRedirectPath: '/attendance/application',
        signType: [],
        userinfo: {},
      }
    },

    computed: {
      joinType() {
        const { sign_type } = this.userinfo

        if (sign_type && sign_type.length > 0) {
          const str = sign_type.map(item => item.value)
          return str.join(',')
        }

        return ''
      },
    },

    created() {
      const { id } = this.$route.params
      this
        .getInitUser()
        .then((res) => {
          this.userinfo = res.data
        })

      if (id) {
        this.isEdit = true
        this.getInfo()
          .then((res) => {
            this.info = res.data
            this.form = res.data.flow_form_data
            this.signType = this.form.kqdkfsbg_sign_type_names.map(item => String(item.key))

            if (Number(this.info.status) === 94) this.getLogsAndPath()
          })
      }
    },

    methods: {
      uploadHandler() {
        this.form.qj_aids = this.$refs.upload.getFiles('string')
      },

      changeMethod(arr) {
        const getSum = (total, num) => (Number(total) + Number(num))
        this.form.kqdkfsbg_sign_type = arr.reduce(getSum, 0)
      },

      preSubmit() {
        const getSum = (total, num) => (Number(total) + Number(num))
        this.form.kqdkfsbg_sign_type = this.signType.reduce(getSum, 0)

        this.submit('submit')
      },
    },
  }
</script>

<style lang="scss" scoped>
  .m-section--form {
    .el-col {
      .el-form-item {
        width: auto;
        margin: 0;
      }
    }
  }
</style>
