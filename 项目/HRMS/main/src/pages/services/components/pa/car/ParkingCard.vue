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
        prop="clfw_park_plate_num"
        label="车牌号码">
        <el-input v-model="data.clfw_park_plate_num" />
      </el-form-item>
    </m-section-row>

    <el-form-item
      prop="clfw_park_address"
      label="办公地点">

      <el-select
        placeholder="请选择"
        v-model="data.clfw_park_address">
        <el-option
          v-for="(district, prop) in districts"
          :label="district"
          :value="district"
          :key="prop" />
      </el-select>
    </el-form-item>

    <el-form-item
      prop="clfw_reason"
      label="申请原因">
      <el-input
        style="width: 100%;"
        v-model="data.clfw_reason" />
    </el-form-item>

  </el-form>
</template>

<script>
  import mixin from './mixin'

  export default {
    name: 'CarParkingCard',
    mixins: [mixin],

    data() {
      return {
        rules: {
          clfw_park_plate_num: [
            { required: true, message: '请填写车牌号码', trigger: 'blur' },
          ],
          clfw_park_address: [
            { required: true, message: '请选择办公地点', trigger: 'blur' },
          ],
          clfw_reason: [
            { required: true, message: '请填写申请原因', trigger: 'blur' },
          ],
        },
      }
    },

    computed: {
      districts() {
        return this.$store.state.services.districts
      },
    },
  }
</script>
