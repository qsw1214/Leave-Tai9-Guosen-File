<template>
  <div class="page page--pa-index">
    <m-breadcrumb :items="breadcrumb" />
    <Tabs active-tab="pa" />
    <div
      v-loading="loading"
      class="panel">
      <template v-for="(item, index) in items">
        <ServedItem
          :key="index"
          :items="item" />
      </template>
    </div>
  </div>
</template>

<script>
  import Tabs from '../common/Tabs'
  import ServedItem from '../common/ServedItem'

  export default {
    name: 'PAIndex',
    components: {
      Tabs,
      ServedItem,
    },
    data() {
      return {
        breadcrumb: this.$breadcrumb(),
        loading: false,
        items: [],
      }
    },
    created() {
      this.getMenuList()
    },
    methods: {
      getNameByKeys(name) {
        const nameArr = {
          rs_list: '人事证明',
          xz_list: '行政服务',
        }
        return nameArr[name] || ''
      },
      getMenuList() {
        const url = this.$api.services.pa.config
        const modulesArr = this.$store.state.services.modulesMapping
        const items = []
        this.loading = true

        this
          .$axios
          .post(url)
          .then(({ data }) => {
            const { rs_list, xz_list } = data
            const origin = { rs_list, xz_list }

            Object.keys(origin).forEach((name) => {
              const temp = {}

              temp.title = this.getNameByKeys(name)
              temp.children = origin[name].map(item => ({
                path: `/pa/${modulesArr[item.flow_config_code]}`,
                name: item.flow_config_name,
                module: modulesArr[item.flow_config_code],
                code: item.flow_config_code,
                type: item.flow_config_approval_type,
                url: item.flow_config_link_url,
              }))

              items.push(temp)
            })

            this.items = items
          })
          .catch(() => {})
          .then(() => {
            this.loading = false
          })
      },
    },
  }
</script>

<style lang="scss" scoped type="text/scss">
  .page--pa-index {
    .panel {
      background: #fff;
      min-height: calc(100vh - 197px);
      padding: 14px;
      border: 1px solid #e9e9e9;
      border-top: none;
    }
  }
</style>
