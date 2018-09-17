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
        label="维修车辆">

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

    <m-section-row>
      <el-form-item
        prop="clfw_fix_date"
        label="维修日期">

        <el-date-picker
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          :picker-options="datepickerOptions"
          v-model="data.clfw_fix_date" />
      </el-form-item>

      <el-form-item
        prop="clfw_fix_place"
        label="维修地点">
        <el-input v-model="data.clfw_fix_place" />
      </el-form-item>
    </m-section-row>

    <el-form-item
      prop="clfw_fix_content"
      label="维修内容">
      <el-input
        style="width: 100%;"
        v-model="data.clfw_fix_content" />
    </el-form-item>

    <m-section-row>
      <el-form-item
        prop="clfw_mileage"
        label="里程">

        <el-input
          type="number"
          :min="1"
          v-model="data.clfw_mileage">
          <template slot="append">公里</template>
        </el-input>
      </el-form-item>

      <el-form-item
        prop="clfw_fee"
        label="维修金额">

        <el-input
          type="number"
          :min="1"
          v-model="data.clfw_fee">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
    </m-section-row>

  </el-form>
</template>

<script>
  import mixin from './mixin'

  export default {
    name: 'CarMaintaince',
    mixins: [mixin],

    data() {
      return {
        datepickerOptions: {
          disabledDate(time) {
            return time.getTime() < (Date.now() - 8.64e7)
          },
        },

        rules: {
          clfw_plate_num: [
            { required: true, message: '请选择维修车辆', trigger: 'blur' },
          ],
          clfw_fix_date: [
            { required: true, message: '请选择维修日期', trigger: 'blur' },
          ],
          clfw_fix_place: [
            { required: true, message: '请填写维修地点', trigger: 'blur' },
          ],
          clfw_fix_content: [
            { required: true, message: '请填写维修内容', trigger: 'blur' },
          ],
          clfw_mileage: [
            { required: true, message: '请填写里程', trigger: 'blur' },
            {
              message: '里程数必须大于0',
              pattern: /^([0-9]*[1-9][0-9]*(.[0-9]+)?|[0]+.[0-9]*[1-9][0-9]*)$/,
            },
          ],
          clfw_fee: [
            { required: true, message: '请填写维修金额', trigger: 'blur' },
            {
              message: '维修金额必须大于0',
              pattern: /^([0-9]*[1-9][0-9]*(.[0-9]+)?|[0]+.[0-9]*[1-9][0-9]*)$/,
            },
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
