<template>
  <m-section
    title="申请表单"
    :data="data">

    <m-section-row>
      <m-section-cell
        title="流程编码"
        prop="code" />
      <m-section-cell
        title="申请日期"
        prop="apply_date" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="流程状态"
        prop="status_name" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="资金账号"
        prop="gshqcg_fundid" />
      <m-section-cell
        title="客户名称"
        prop="gshqcg_custname" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="费用来源"
        prop="gshqcg_fee_origin_name" />
      <m-section-cell
        title="申请单号"
        prop="gshqcg_order_num" />
    </m-section-row>

    <el-form
      class="m-section--form approval-order-num"
      label-width="140px"
      v-if="from === 'approving' &&
        data.gshqcg_fee_origin === '2' &&
      isOperate === '1'"
      ref="form"
      :model="form"
      :rules="rules">

      <m-section-row>
        <el-form-item
          label="订单号"
          prop="approval_order_num">
          <el-input
            v-model="form.approval_order_num"
            @change="emit" />
        </el-form-item>
      </m-section-row>

    </el-form>

    <m-section-row v-else-if="data.approval_order_num">
      <m-section-cell
        title="订单号"
        prop="approval_order_num" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="申请理由"
        prop="gshqcg_reason" />
    </m-section-row>

  </m-section>
</template>

<script>
  export default {
    name: 'HighSpeedMarketForm',

    props: {
      data: {
        type: Object,
        required: true,
      },

      from: {
        type: String,
        default: '',
      },

      isOperate: {
        type: String,
        default: '',
      },
    },

    data() {
      return {
        form: {
          approval_order_num: '',
        },
        rules: {
          approval_order_num: [
            { required: true, message: '请输入订单号', trigger: 'blur' },
          ],
        },
      }
    },

    methods: {
      emit() {
        this.$emit('emitForm', this.form.approval_order_num)
      },
    },
  }
</script>

<style lang="scss">
  .approval-order-num {
    border-bottom: 1px dashed #e5e5e5;
    padding-top: 10px;
    padding-bottom: 10px;

    .el-form-item__label {
      padding-left: 16px;
    }
  }
</style>
