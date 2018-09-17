<template>
  <section
    v-loading.fullscreen.lock="loading"
    class="page page--pa-temp__card">

    <m-breadcrumb :items="breadcrumb" />

    <userinfo />

    <m-section
      title="申请表单"
      is-form>

      <m-section-row>
        <m-section-cell
          title="流程编码"
          :content="flowcode" />
        <m-section-cell
          title="申请日期"
          :content="date" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="流程状态"
          :content="status" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          content="<p style='margin-top: 0;'>1.访客临时领用，无须工单申领，到前台签收即可；</p>
              <p>2.实习生临时申领，由其对接人代替发起申领流程；</p>
              <p> 3.新人入职及遗失补办临时申领，一旦正式工牌制作完成，申请人须退还临时工牌。否则申请人须承担50元工本费。</p>"
          title="申请说明" />
      </m-section-row>

      <el-form
        class="m-section--form"
        label-width="140px"
        ref="form"
        :rules="rules"
        :model="form">

        <m-section-row>
          <el-form-item
            label="申请原因"
            prop="lsgpsq_reason"
            required>
            <el-select
              placeholder="请选择申请原因"
              v-model="form.lsgpsq_reason">
              <el-option
                label="新人入职申领"
                value="1" />
              <el-option
                label="实习生临时申领"
                value="2" />
              <el-option
                label="遗失补办临时申领"
                value="4" />
            </el-select>
          </el-form-item>
          <el-form-item
            label="预计归还时间"
            prop="lsgpsq_return_date"
            v-if="form.lsgpsq_reason == '2'"
            :rules="rules.lsgpsq_return_date">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :picker-options="options"
              v-model="form.lsgpsq_return_date" />
          </el-form-item>
        </m-section-row>

        <m-section-row v-if="form.lsgpsq_reason == '2'">
          <el-form-item
            label="实际使用人"
            prop="lsgpsq_user_name"
            :rules="rules.lsgpsq_user_name">
            <el-input
              placeholder="请填写实际使用人"
              v-model="form.lsgpsq_user_name" />
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
        @click="submit('submit')">提交</el-button>

      <el-button
        type="info"
        :loading="button.stash"
        @click="submit('stash')">暂存</el-button>

      <el-button
        type="info"
        @click="cancel">取消</el-button>
    </div>
  </section>
</template>

<script>
  import mixin from '~services/mixin'
  import logsAndPath from '@/components/logsAndPath'
  import Userinfo from '../common/Userinfo'

  export default {
    name: 'PATempCard',
    components: { Userinfo, logsAndPath },
    mixins: [mixin.pa, mixin.flow, mixin.router],
    data() {
      const validateDate = (rule, value, callback) => {
        if (this.paRequired) {
          if (value === '') {
            callback(new Error('请选择预计归还时间'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      const validatePerson = (rule, value, callback) => {
        if (this.paRequired) {
          if (value === '') {
            callback(new Error('请填写实际使用人'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      return {
        breadcrumb: this.$breadcrumb([
          { name: '临时工卡申请' },
        ]),
        form: {
          lsgpsq_reason: '',
          lsgpsq_user_name: '',
          lsgpsq_return_date: '',
        },
        rules: {
          lsgpsq_reason: [
            { required: true, message: '请选择申请原因', trigger: 'blur' },
          ],
          lsgpsq_return_date: [
            { required: true, message: '请选择预计归还时间', trigger: 'blur' },
            { validator: validateDate, trigger: 'blur' },
          ],
          lsgpsq_user_name: [
            { required: true, message: '请填写实际使用人', trigger: 'blur' },
            { validator: validatePerson, trigger: 'blur' },
          ],
        },
        options: {
          disabledDate(date) {
            const currentDay = Date.now() - (24 * 60 * 60 * 1000)
            return date.getTime() <= currentDay
          },
        },
        isEdit: false,
        submitMessage: '提交完成，预计两个工作日后可领取，请留意流程审批状态',
      }
    },

    computed: {
      paRequired() {
        if (this.form.lsgpsq_reason === '2') {
          return true
        }
        return false
      },
      flowcode() {
        return this.isEdit ? this.info.code : '由系统自动生成'
      },
      date() {
        const date = this.info.apply_date
        return date || '由系统自动生成'
      },
      status() {
        return this.isEdit ? this.info.status_name : '草稿'
      },
    },
    created() {
      const { id } = this.$route.params

      if (id) {
        this.isEdit = true
        this.getInfo()
          .then((res) => {
            this.info = res.data
            this.form = res.data.flow_form_data
            if (Number(this.info.status) === 94) this.getLogsAndPath()
          })
      }
    },
  }
</script>
