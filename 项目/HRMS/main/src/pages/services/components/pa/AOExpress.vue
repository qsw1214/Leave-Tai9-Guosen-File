<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="page page-pa-ao-express">

    <m-breadcrumb :items="breadcrumb" />
    <userinfo />

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

      <el-form
        label-width="140px"
        class="m-section--form"
        ref="form"
        :model="info.flow_form_data"
        :rules="rules">

        <m-section-row>
          <el-form-item
            label="预算金额"
            prop="xzyyzcbgfsq_money">
            <el-input
              type="number"
              ref="money"
              :min="1"
              v-model.number="info.flow_form_data.xzyyzcbgfsq_money"
              @input="onInputMoney">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>

          <m-section-cell
            title="大写金额"
            v-if="info.flow_form_data.xzyyzcbgfsq_money > 0"
            :content="info.flow_form_data.xzyyzcbgfsq_money | digitUppercase" />

          <m-section-cell
            title="大写金额"
            content="由系统自动生成"
            v-else />
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="期望完成时间"
            prop="xzyyzcbgfsq_finish_date">
            <el-date-picker
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              v-model="info.flow_form_data.xzyyzcbgfsq_finish_date"
              :picker-options="datepickerOptions" />
          </el-form-item>
        </m-section-row>

        <el-form-item
          prop="xzyyzcbgfsq_reason"
          label="申请理由">
          <el-input
            type="textarea"
            :rows="3"
            :maxlength="100"
            v-model="info.flow_form_data.xzyyzcbgfsq_reason" />
        </el-form-item>

        <m-section-row>
          <el-form-item
            label="附件上传">
            <m-upload
              ref="upload"
              :accept="upload.accept"
              :file-list="upload.files"
              :action="upload.action" />
          </el-form-item>
        </m-section-row>

      </el-form>
    </m-section>

    <logs-and-path
      v-if="info.status === 94"
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

  </div>
</template>

<script>
  import mixin from '~services/mixin'
  import LogsAndPath from '@/components/logsAndPath'
  import Userinfo from '../common/Userinfo'

  export default {
    name: 'PAAOExpress',
    components: { Userinfo, LogsAndPath },
    mixins: [mixin.pa, mixin.flow, mixin.router],

    data() {
      return {
        breadcrumb: this.$breadcrumb([
          { name: '行政运营支持办公费申请' },
        ]),

        rules: {
          xzyyzcbgfsq_money: [
            { required: true, message: '请输入预算金额', trigger: 'blur' },
            {
              message: '预算金额必须大于0',
              pattern: /^([0-9]*[1-9][0-9]*(.[0-9]+)?|[0]+.[0-9]*[1-9][0-9]*)$/,
            },
            { type: 'number', message: '预算金额必须为数字', trigger: 'blur' },
          ],
          xzyyzcbgfsq_finish_date: [
            { required: true, message: '请选择期望完成时间', trigger: 'blur' },
          ],
          xzyyzcbgfsq_reason: [
            { required: true, message: '请输入申请原因', trigger: 'blur' },
          ],
        },

        datepickerOptions: {
          disabledDate(time) {
            return time.getTime() < (Date.now() - 8.64e7)
          },
        },
      }
    },

    created() {
      if (this.id) {
        this.getInfo()
          .then(() => {
            const { info } = this
            info.flow_form_data.xzyyzcbgfsq_money =
              parseInt(info.flow_form_data.xzyyzcbgfsq_money, 10) / 100

            if (info.status === 94) {
              this.getLogsAndPath()
            }
          })
      }
    },

    methods: {
      onInputMoney(value) {
        const reg = /^\d+(\.\d{1,2})?$/
        let v = parseFloat(value)

        // eslint-disable-next-line no-restricted-globals
        if (isNaN(v)) return

        if (!reg.test(v)) {
          v = parseFloat(v.toFixed(2))

          this.$nextTick(() => {
            this.info.flow_form_data.xzyyzcbgfsq_money = v
          })
        }
      },

      paramsHandler(type) {
        const { code, id, info } = this
        const data = JSON.parse(JSON.stringify(info.flow_form_data))
        const status = type === 'stash' ? '0' : '30'

        const url = id
          ? this.$api.services.pa.edit
          : this.$api.services.pa.add

        data.xzyyzcbgfsq_money *= 100

        if (this.$refs.upload.uploadFiles.length) {
          data.xzyyzcbgfsq_aids = this.$refs.upload.getFiles('string')
        } else {
          data.xzyyzcbgfsq_aids = ''
        }

        const params = {
          status,
          flow_form_data: JSON.stringify(data),
        }

        if (id) params.id = id
        else params.flow_config_code = code

        return {
          url, params,
        }
      },
    },
  }
</script>
