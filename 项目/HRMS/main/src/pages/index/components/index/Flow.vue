<template>
  <index-item
    v-loading="loading"
    title="流程申请">

    <div class="flow">
      <span
        v-for="flow in flows"
        v-if="flow.flow_config_name"
        :key="flow.icon"
        :class="`flow--item icon-flow-${flow.flow_config_code}`"
        @click="jump(flow)">{{ flow.flow_config_name }}</span>
    </div>

  </index-item>
</template>

<script>
  import flowMap from '@/components/flowMap'
  import IndexItem from './IndexItem'

  export default {
    name: 'Flow',
    components: { IndexItem },
    data() {
      return {
        flows: [],
        loading: true,
      }
    },

    created() {
      this.fetch()
    },

    methods: {
      fetch() {
        this.loading = true
        this.$axios
          .get(this.$api.index.index.flows)
          .then(({ data }) => {
            const flows = []
            data.kq_list.forEach((item) => {
              const flow = flowMap[item.flow_config_code]
              if (flow) {
                const path = this.$utils.env === 'development' ? '' : '/web'
                const uri = `${path}/services.html#/attendance/create/${flow}/${item.flow_config_code}`
                flows.push(Object.assign({}, item, { uri }))
              }
            })

            this.flows = flows
          })
          .catch(() => {})
          .then(() => {
            this.loading = false
          })
      },

      jump({ uri }) {
        window.location.href = uri
      },
    },
  }
</script>

<style lang="scss" scoped>
  .flow {
    padding: 3px 14px;

    &--item {
      cursor: pointer;
      display: inline-block;
      margin-bottom: 14px;
      width: 25%;
      min-width: 70px;
      text-align: center;
      background-repeat: no-repeat;
      background-position: center top;
      background-size: 70px 60px;
      padding-top: 68px;
      vertical-align: top;
      white-space: nowrap;

      .name {
        display: block;
      }

      &:hover {
        color: #5090f7;
      }

      &.icon-flow-200023 {
        background-size: 60px 60px;
      }
    }
  }
</style>
