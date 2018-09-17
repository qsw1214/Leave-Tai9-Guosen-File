<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="page page--application-order-food">

    <m-breadcrumb :items="breadcrumb" />
    <userinfo :data="detail.applier_user_info" />

    <m-section
      title="申请表单"
      :data="detail">
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
          title="办公地点"
          :content="food.b_district_name" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="商家区域"
          :content="food.b_district_name" />
        <m-section-cell
          title="商家名称"
          :content="food.b_name" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="商品名称"
          :content="food.p_name" />
        <m-section-cell
          title="商品类别"
          :content="food.p_type_name" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="单价"
          :content="`${parseFloat(food.p_price / 10)}`" />
        <m-section-cell
          title="计量单位"
          :content="food.p_unit" />
      </m-section-row>
    </m-section>

    <status-button />

  </div>
</template>

<script>
  import mixin from '~services/mixin'
  import Userinfo from '../common/Userinfo'
  import StatusButton from '../common/StatusButton'

  export default {
    name: 'ApplicationOrderFood',
    components: { Userinfo, StatusButton },
    mixins: [mixin.flow, mixin.application, mixin.breadcrumb],

    data() {
      return {
        breadcrumb: this.$breadcrumb([
          { name: '我发起的', to: '/application/index' },
          { name: '订餐服务' },
        ]),
      }
    },

    computed: {
      food() {
        const form = this.info.flow_form_data
        return form.dcfw_book_dinner || {}
      },
    },

    methods: {
      getLogsAndPath() {
        //
      },
    },
  }
</script>
