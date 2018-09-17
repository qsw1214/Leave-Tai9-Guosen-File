<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="page">

    <m-breadcrumb :items="breadcrumb" />
    <userinfo />

    <m-section
      is-form
      title="申请表单">

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

      <use-car
        v-if="info && info.flow_form_data.clfw_type === '1'"
        ref="form"
        :service-types="serviceTypes"
        :data="info.flow_form_data"
        @changeServiceType="changeServiceType" />

      <maintaince
        v-if="info && info.flow_form_data.clfw_type === '2'"
        ref="form"
        :service-types="serviceTypes"
        :data="info.flow_form_data"
        @changeServiceType="changeServiceType" />

      <fuel-card
        v-if="info && info.flow_form_data.clfw_type === '4'"
        ref="form"
        :service-types="serviceTypes"
        :data="info.flow_form_data"
        @changeServiceType="changeServiceType" />

      <parking-card
        v-if="info && info.flow_form_data.clfw_type === '8'"
        ref="form"
        :service-types="serviceTypes"
        :data="info.flow_form_data"
        @changeServiceType="changeServiceType" />

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
  import UseCar from './car/Use'
  import Maintaince from './car/Maintaince'
  import FuelCard from './car/FuelCard'
  import ParkingCard from './car/ParkingCard'

  const form = {
    clfw_target_place: '',
    clfw_people_num: '',
    clfw_is_need_driver: '',
    clfw_reason: '',
    clfw_begin_time: '',
    clfw_end_time: '',
    clfw_plate_num: '',
    clfw_fix_date: '',
    clfw_fix_place: '',
    clfw_fix_content: '',
    clfw_mileage: '',
    clfw_fee: '',
    clfw_add_card_num: '',
    clfw_add_mileage: '',
    clfw_remark: '',
    clfw_park_plate_num: '',
    clfw_park_address: '',
  }

  export default {
    name: 'PACar',
    components: {
      Userinfo,
      LogsAndPath,
      UseCar,
      Maintaince,
      FuelCard,
      ParkingCard,
    },
    mixins: [mixin.pa, mixin.flow, mixin.router],

    data() {
      const { id } = this.$route.params

      return {
        breadcrumb: this.$breadcrumb([
          { name: '车辆服务' },
        ]),

        info: {
          flow_form_data: {
            clfw_type: id ? '' : '1',
            ...form,
          },
        },

        submitMessage: '提交完成，请留意流程审批状态，通过后请至人力行政处领用',
      }
    },

    computed: {
      serviceTypes() {
        /**
         * serviceTypes: [
         *   { label: '车辆使用', value: '1' },
         *   { label: '车辆维修保养', value: '2' },
         *   { label: '加油卡申请', value: '4' },
         *   { label: '停车卡申请', value: '8' }
         * ]
         */
        const { clfw_type } = this.$store.state.services.initData
        const types = []

        if (!clfw_type) return []

        Object.keys(clfw_type).forEach((prop) => {
          types.push({ label: clfw_type[prop], value: prop })
        })
        return types
      },
    },

    created() {
      this.fetch()
    },

    methods: {
      // 更改服务类型
      changeServiceType(type) {
        this.info.flow_form_data = {
          clfw_type: type,
          ...form,
        }

        let msg
        if (type === '1' || type === '4' || type === '8') {
          msg = '提交完成，请留意流程审批状态，通过后请至人力行政处领用'
        } else if (type === '2') {
          msg = '提交完成，请留意流程审批状态'
        }

        this.submitMessage = msg
      },
    },
  }
</script>
