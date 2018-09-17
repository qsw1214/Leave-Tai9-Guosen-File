<template>
  <div class="page page--attendance__pa">
    <m-breadcrumb :items="breadcrumb" />

    <Tabs :tabs="tabs" />

    <div
      v-loading="loading"
      class="tabs-panel pa">
      <ServedItem :items="items" />
    </div>
  </div>
</template>

<script>
  import mixin from '~services/mixin'
  import Tabs from '@/components/tabs'
  import flowMap from '@/components/flowMap'
  import ServedItem from '../common/ServedItem'

  export default {
    name: 'AttendancePA',

    components: {
      Tabs,
      ServedItem,
    },

    mixins: [mixin.tabs.attendance],

    data() {
      return {
        breadcrumb: this.$breadcrumb(null, 'attendance'),
        items: {
          title: '',
          children: [],
        },
        loading: false,
      }
    },

    created() {
      this.getMenuList()
    },

    methods: {
      getMenuList() {
        this.loading = true
        this
          .$axios(this.$api.services.pa.config)
          .then(({ data }) => {
            const { kq_list } = data

            this.items.children = kq_list.map(item => ({
              path: `/attendance/create/${flowMap[item.flow_config_code]}`,
              name: item.flow_config_name,
              module: `${flowMap[item.flow_config_code]} icon-flow-${item.flow_config_code}`,
              code: item.flow_config_code,
              type: item.flow_config_approval_type,
              url: item.flow_config_link_url,
            }))
          })
          .catch(() => {})
          .then(() => {
            this.loading = false
          })
      },
    },
  }
</script>

<style lang="scss">
  @import '../../assets/scss/tabs-panel.scss';

  .tabs-panel.pa {
    min-height: calc(100vh - 197px);
  }
</style>
