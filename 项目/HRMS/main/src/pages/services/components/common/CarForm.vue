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

    <template v-if="data.clfw_type === '1'">
      <m-section-row>
        <m-section-cell
          title="服务类型"
          prop="clfw_type_name" />

        <m-section-cell
          title="目的地"
          prop="clfw_target_place" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="乘车人数"
          prop="clfw_people_num" />

        <m-section-cell
          title="是否需配司机"
          prop="clfw_is_need_driver_name" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="用车原因"
          prop="clfw_reason" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="用车开始时间"
          prop="clfw_begin_time" />
        <m-section-cell
          title="用车结束时间"
          prop="clfw_end_time" />
      </m-section-row>
    </template>


    <template v-if="data.clfw_type === '2'">
      <m-section-row>
        <m-section-cell
          title="服务类型"
          prop="clfw_type_name" />

        <m-section-cell
          title="维修车辆"
          prop="clfw_plate_num" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="维修日期"
          prop="clfw_fix_date" />

        <m-section-cell
          title="维修地点"
          prop="clfw_fix_place" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="维修内容"
          prop="clfw_fix_content" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="里程"
          prop="clfw_mileage" />

        <m-section-cell
          title="维修金额"
          prop="clfw_fee" />
      </m-section-row>
    </template>


    <template v-if="data.clfw_type === '4'">
      <m-section-row>
        <m-section-cell
          title="服务类型"
          prop="clfw_type_name" />

        <m-section-cell
          title="加油车辆"
          prop="clfw_plate_num" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="加油卡号码"
          prop="clfw_add_card_num" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="本次购买显示里程"
          prop="clfw_add_mileage" />

        <m-section-cell
          title="本次购买金额"
          prop="clfw_fee" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="备注"
          prop="clfw_remark" />
      </m-section-row>
    </template>


    <template v-if="data.clfw_type === '8'">
      <m-section-row>
        <m-section-cell
          title="服务类型"
          prop="clfw_type_name" />

        <m-section-cell
          title="车牌号码"
          prop="clfw_park_plate_num" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="办公地点"
          prop="clfw_park_address" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="申请原因"
          prop="clfw_reason" />
      </m-section-row>
    </template>

  </m-section>
</template>

<script>
  export default {
    name: 'CarForm',
    props: {
      data: {
        type: Object,
        default: () => ({}),
      },
    },
  }
</script>
