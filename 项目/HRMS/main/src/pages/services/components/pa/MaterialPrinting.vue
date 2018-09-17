<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="page page--pa-material-printing">
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
        class="m-section--form"
        label-width="140px"
        ref="form"
        :rules="rules"
        :model="info.flow_form_data">

        <m-section-row>
          <el-form-item
            prop="xcpyszz_is_need_make"
            label="是否需要制作">
            <el-select
              placeholder="请选择"
              v-model="info.flow_form_data.xcpyszz_is_need_make">
              <el-option
                value="1"
                label="是" />
              <el-option
                value="0"
                label="否" />
            </el-select>
          </el-form-item>

          <el-form-item
            prop="xcpyszz_type"
            label="宣传品类型">
            <el-select
              placeholder="请选择"
              v-model="info.flow_form_data.xcpyszz_type">
              <el-option
                value="1"
                label="海报设计" />
              <el-option
                value="2"
                label="摄影摄像" />
            </el-select>
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            prop="xcpyszz_is_self_adviser"
            label="嘉宾是否我司投顾">
            <el-select
              placeholder="请选择"
              v-model="info.flow_form_data.xcpyszz_is_self_adviser">
              <el-option
                value="1"
                label="是" />
              <el-option
                value="0"
                label="否" />
            </el-select>
          </el-form-item>

          <el-form-item
            prop="xcpyszz_attribute"
            label="宣传品归属">
            <multiple-select
              multiple
              placeholder="请选择"
              v-model="info.flow_form_data.xcpyszz_attribute">
              <el-option
                value="1"
                label="私行业务类" />
              <el-option
                value="2"
                label="私募业务类" />
              <el-option
                value="4"
                label="企业业务类" />
              <el-option
                value="8"
                label="人员招聘类" />
            </multiple-select>
          </el-form-item>
        </m-section-row>

        <el-form-item
          prop="xcpyszz_finish_date"
          label="期望完成时间">
          <el-date-picker
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            v-model="info.flow_form_data.xcpyszz_finish_date"
            :picker-options="datepickerOptions" />
        </el-form-item>

        <el-form-item
          prop="xcpyszz_content"
          label="活动内容">
          <el-input
            resize="none"
            type="textarea"
            :maxlength="100"
            v-model="info.flow_form_data.xcpyszz_content" />
        </el-form-item>

        <el-form-item
          prop="xcpyszz_desc"
          label="宣传品需求描述">
          <el-input
            type="textarea"
            :maxlength="100"
            :rows="3"
            v-model="info.flow_form_data.xcpyszz_desc" />
        </el-form-item>

        <el-form-item
          label="核价结果"
          v-show="info.flow_form_data.xcpyszz_is_need_make === '1'">
          <el-input
            disabled
            placeholder="行政运营岗填写" />
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
    name: 'PAMaterialPrinting',
    components: { Userinfo, LogsAndPath },
    mixins: [mixin.pa, mixin.flow, mixin.router],

    data() {
      return {
        breadcrumb: this.$breadcrumb([
          { name: '宣传品印刷制作' },
        ]),

        rules: {
          xcpyszz_is_need_make: [
            { required: true, message: '请选择是否需要制作', trigger: 'blur' },
          ],
          xcpyszz_type: [
            { required: true, message: '请选择宣传品类型', trigger: 'blur' },
          ],
          xcpyszz_is_self_adviser: [
            { required: true, message: '请选择嘉宾是否我司投顾', trigger: 'blur' },
          ],
          xcpyszz_attribute: [
            { required: true, message: '请选择归属', trigger: 'blur' },
          ],
          xcpyszz_finish_date: [
            { required: true, message: '请选择期望完成时间', trigger: 'blur' },
          ],
          xcpyszz_content: [
            { required: true, message: '请填写活动内容', trigger: 'blur' },
            { max: 100, message: '最多只能输入 100 个字符', trigger: 'blur' },
          ],
          xcpyszz_desc: [
            { required: true, message: '请填写需求描述', trigger: 'blur' },
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
          .then((res) => {
            this.info.flow_form_data.xcpyszz_attribute =
              this.info.flow_form_data.xcpyszz_attribute.split(',')

            if (res.data.status === 94) this.getLogsAndPath()
          })
      }
    },

    methods: {
      paramsHandler(type) {
        const { code, id, info } = this
        const data = JSON.parse(JSON.stringify(info.flow_form_data))
        const status = type === 'stash' ? '0' : '30'
        const url = id
          ? this.$api.services.pa.edit
          : this.$api.services.pa.add

        if (data.xcpyszz_attribute) {
          data.xcpyszz_attribute = data.xcpyszz_attribute.join(',')
        }

        if (this.$refs.upload.uploadFiles.length) {
          data.xcpyszz_aids = this.$refs.upload.getFiles('string')
        } else {
          data.xcpyszz_aids = ''
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
