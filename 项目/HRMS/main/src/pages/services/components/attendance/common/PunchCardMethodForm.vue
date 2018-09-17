
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
        title="变更后打卡方式">
        <span>{{ nowSignType }}</span>
      </m-section-cell>

      <m-section-cell
        title="变更前打卡方式">
        <span>{{ originSignType }}</span>
      </m-section-cell>
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="变更原因"
        prop="kqdkfsbg_reason_name" />
    </m-section-row>
  </m-section>
</template>

<script>
  export default {
    name: 'PunchCardMethodForm',

    props: {
      data: {
        type: Object,
        default: () => ({}),
      },
    },

    computed: {
      originSignType() {
        const val = this.data.kqdkfsbg_original_sign_type_names

        if (val) {
          return val.map(item => item.value).join(',')
        }

        return ''
      },

      nowSignType() {
        const val = this.data.kqdkfsbg_sign_type_names

        if (val) {
          return val.map(item => item.value).join(',')
        }

        return ''
      },
    },
  }
</script>
