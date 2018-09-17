<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="page page-pa-high-speed-market">

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
            label="资金账号"
            prop="gshqcg_fundid">
            <el-input v-model="info.flow_form_data.gshqcg_fundid" />
          </el-form-item>

          <el-form-item
            label="客户名称"
            prop="gshqcg_custname">
            <el-input v-model="info.flow_form_data.gshqcg_custname" />
          </el-form-item>
        </m-section-row>

        <m-section-row>
          <el-form-item
            label="费用来源"
            prop="gshqcg_fee_origin">
            <el-select
              placeholder="请选择"
              v-model="info.flow_form_data.gshqcg_fee_origin">
              <el-option
                label="个人购买"
                value="1" />
              <el-option
                label="部门经费"
                value="2" />
            </el-select>
          </el-form-item>

          <el-form-item
            label="申请单号"
            prop="gshqcg_order_num">
            <el-input v-model="info.flow_form_data.gshqcg_order_num" />
          </el-form-item>
        </m-section-row>

        <el-form-item
          prop="gshqcg_reason"
          label="申请理由">
          <el-input
            type="textarea"
            :rows="3"
            :maxlength="100"
            v-model="info.flow_form_data.gshqcg_reason" />
        </el-form-item>
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
    name: 'PAHighSpeedMarket',
    components: { Userinfo, LogsAndPath },
    mixins: [mixin.pa, mixin.flow, mixin.router],

    data() {
      return {
        breadcrumb: this.$breadcrumb([
          { name: '高速行情采购' },
        ]),

        rules: {
          gshqcg_fundid: [
            { required: true, message: '请输入资金账号', trigger: 'blur' },
          ],
          gshqcg_custname: [
            { required: true, message: '请输入客户名称', trigger: 'blur' },
          ],
          gshqcg_fee_origin: [
            { required: true, message: '请选择费用来源', trigger: 'blur' },
          ],
          gshqcg_order_num: [
            { required: true, message: '请输入申请单号', trigger: 'blur' },
          ],
          gshqcg_reason: [
            { required: true, message: '请输入申请理由', trigger: 'blur' },
            { max: 100, message: '最多只能输入 100 个字符', trigger: 'blur' },
          ],
        },
      }
    },

    created() {
      if (this.id) this.fetch()
    },
  }
</script>
