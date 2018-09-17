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
      <m-section-cell
        title="是否需要制作"
        prop="xcpyszz_is_need_make_name" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="宣传品类型"
        prop="xcpyszz_type_name" />
      <m-section-cell
        title="期望完成时间"
        prop="xcpyszz_finish_date" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="嘉宾是否我司投顾"
        prop="xcpyszz_is_self_adviser_name" />
      <m-section-cell
        title="宣传品归属"
        :content="xcpyszz_attribute.join('，')" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="活动内容"
        prop="xcpyszz_content" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="宣传品需求描述"
        prop="xcpyszz_desc" />
    </m-section-row>

    <template v-if="data.xcpyszz_is_need_make === '1'">
      <m-section-row
        v-if="data.approval_money || from !== 'approving'">
        <m-section-cell
          title="核价结果"
          :content="(parseInt(data.approval_money, 10) / 100) || '行政运营岗填写'" />
      </m-section-row>

      <el-form
        label-width="140px"
        class="m-section--form approval-money"
        v-else
        ref="form"
        :model="form"
        :rules="rules">

        <m-section-row>
          <el-form-item
            label="核价结果"
            prop="approval_money">
            <el-input
              placeholder="行政运营岗填写"
              type="number"
              :disabled="isOperate === '0'"
              v-model="form.approval_money"
              @change="emit" />
          </el-form-item>
        </m-section-row>

      </el-form>
    </template>

    <m-section-row>
      <m-section-cell title="附件列表">
        <m-attachment :data="data.attachment_list || []" />
      </m-section-cell>
    </m-section-row>
  </m-section>
</template>

<script>
  export default {
    name: 'MaterialPrintingFrom',

    props: {
      from: {
        type: String,
        default: 'application',
      },

      data: {
        type: Object,
        required: true,
      },

      isOperate: {
        type: String,
        default: '',
      },
    },

    data() {
      return {
        form: {
          approval_money: this.data.approval_money,
        },

        rules: {
          approval_money: [
            { required: true, message: '请填写核价结果', trigger: 'blur' },
            {
              message: '核价结果必须大于0',
              pattern: /^([0-9]*[1-9][0-9]*(.[0-9]+)?|[0]+.[0-9]*[1-9][0-9]*)$/,
            },
          ],
        },
      }
    },

    computed: {
      xcpyszz_attribute() {
        return this.data.xcpyszz_attribute_name || []
      },
    },

    methods: {
      emit() {
        this.$emit('emitForm', this.form.approval_money)
      },
    },
  }
</script>

<style lang="scss">
  .approval-money {
    border-bottom: 1px dashed #e5e5e5;
    padding-top: 10px;
    padding-bottom: 10px;

    .el-form-item__label {
      padding-left: 16px;
    }
  }
</style>
