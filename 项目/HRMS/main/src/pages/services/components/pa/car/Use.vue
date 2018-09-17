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
        prop="clfw_target_place"
        label="目的地">
        <el-input v-model="data.clfw_target_place" />
      </el-form-item>
    </m-section-row>

    <m-section-row>
      <el-form-item
        prop="clfw_people_num"
        label="乘车人数">
        <el-input
          type="number"
          v-model="data.clfw_people_num">
          <template slot="append">人</template>
        </el-input>
      </el-form-item>

      <el-form-item
        prop="clfw_is_need_driver"
        label="是否需配司机">
        <el-select
          placeholder="请选择"
          v-model="data.clfw_is_need_driver">
          <el-option
            label="是"
            value="1" />
          <el-option
            label="否"
            value="0" />
        </el-select>
      </el-form-item>
    </m-section-row>

    <el-form-item
      prop="clfw_reason"
      label="用车原因">
      <el-input
        style="width:100%"
        v-model="data.clfw_reason" />
    </el-form-item>

    <m-section-row>
      <el-form-item
        prop="clfw_begin_time"
        required
        label="用车开始时间">

        <el-date-picker
          align="right"
          type="datetime"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
          placeholder="用车开始时间"
          v-model="data.clfw_begin_time"
          :picker-options="datepickerOptions" />
      </el-form-item>

      <el-form-item
        prop="clfw_end_time"
        required
        label="用车结束时间">

        <el-date-picker
          align="right"
          type="datetime"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
          placeholder="用车结束时间"
          v-model="data.clfw_end_time"
          :picker-options="datepickerOptions" />
      </el-form-item>
    </m-section-row>

  </el-form>
</template>

<script>
  import mixin from './mixin'

  export default {
    name: 'CarUse',
    mixins: [mixin],

    data() {
      const validStartTime = (rule, value, cb) => {
        const { clfw_end_time } = this.data
        if (!value) {
          cb(new Error('请选择用车开始时间'))
        } else if (clfw_end_time &&
          new Date(value).getTime() > new Date(clfw_end_time).getTime()) {
            cb(new Error('用车开始时间必须小于用车结束时间'))
        } else {
          cb()
        }
      }

      const validEndTime = (rule, value, cb) => {
        const { clfw_begin_time } = this.data
        if (!value) {
          cb(new Error('请选择用车结束时间'))
        } else if (clfw_begin_time &&
          new Date(value).getTime() < new Date(clfw_begin_time).getTime()) {
            cb(new Error('用车结束时间必须大于用车开始时间'))
        } else {
          cb()
        }
      }

      return {
        rules: {
          clfw_target_place: [
            { required: true, message: '请填写目的地', trigger: 'blur' },
          ],
          clfw_people_num: [
            { required: true, message: '请填写乘车人数', trigger: 'blur' },
            {
              message: '乘车人数必须为大于0的整数',
              pattern: /^([1-9]*[1-9][0-9]*)$/,
            },
          ],
          clfw_is_need_driver: [
            { required: true, message: '请选择是否需配司机', trigger: 'blur' },
          ],
          clfw_reason: [
            { required: true, message: '请填写用车原因', trigger: 'blur' },
          ],
          clfw_begin_time: [
            { validator: validStartTime, trigger: 'blur' },
          ],
          clfw_end_time: [
            { validator: validEndTime, trigger: 'blur' },
          ],
        },

        datepickerOptions: {
          disabledDate(time) {
            return time.getTime() < (Date.now() - 8.64e7)
          },
        },
      }
    },
  }
</script>
