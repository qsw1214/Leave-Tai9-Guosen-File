<template>
  <el-form
    label-width="140px"
    class="m-section--form"
    ref="form"
    :model="data"
    :rules="rules">

    <m-section-row>
      <el-form-item
        prop="serviceType"
        label="服务类型">

        <el-select
          v-model="serviceType"
          @change="changeServiceType">

          <el-option
            v-for="service in serviceTypes"
            :label="service.label"
            :value="service.value"
            :key="service.value" />
        </el-select>
      </el-form-item>

      <el-form-item
        prop="clfw_plate_num"
        label="加油车辆">

        <el-select
          placeholder="请选择"
          v-model="data.clfw_plate_num">
          <el-option
            v-for="(car, index) in cars"
            :label="car"
            :value="car"
            :key="index" />
        </el-select>
      </el-form-item>
    </m-section-row>

    <el-form-item
      prop="clfw_add_card_num"
      label="加油卡号">

      <el-input v-model="data.clfw_add_card_num" />
    </el-form-item>

    <m-section-row>
      <el-form-item
        prop="clfw_add_mileage"
        label="本次购买显示里程">

        <el-input
          type="number"
          :min="1"
          v-model="data.clfw_add_mileage">
          <template slot="append">公里</template>
        </el-input>
      </el-form-item>

      <el-form-item
        prop="clfw_fee"
        label="本次购买金额">

        <el-input
          type="number"
          :min="1"
          v-model="data.clfw_fee">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
    </m-section-row>

    <el-form-item
      prop="clfw_remark"
      label="备注">
      <el-input
        style="width: 100%;"
        v-model="data.clfw_remark" />
    </el-form-item>

  </el-form>
</template>

<script>
  import mixin from './mixin'

  export default {
    name: 'CarFuelCard',
    mixins: [mixin],

    data() {
      return {
        rules: {
          clfw_plate_num: [
            { required: true, message: '请选择加油车辆', trigger: 'blur' },
          ],
          clfw_add_card_num: [
            { required: true, message: '请填写加油卡号', trigger: 'blur' },
          ],
          clfw_add_mileage: [
            { required: true, message: '请填写本次购买显示里程', trigger: 'blur' },
            {
              message: '里程数必须大于0',
              pattern: /^([0-9]*[1-9][0-9]*(.[0-9]+)?|[0]+.[0-9]*[1-9][0-9]*)$/,
            },
          ],
          clfw_fee: [
            { required: true, message: '请填写本次购买金额', trigger: 'blur' },
            {
              message: '购买金额必须大于0',
              pattern: /^([0-9]*[1-9][0-9]*(.[0-9]+)?|[0]+.[0-9]*[1-9][0-9]*)$/,
            },
          ],
          clfw_remark: [
            { required: true, message: '请填写备注', trigger: 'blur' },
          ],
        },
      }
    },

    computed: {
      cars() {
        return this.$store.state.services.initData.clfw_plate_num
      },
    },
  }
</script>
