<template>
  <section
    v-loading.fullscreen.lock="loading"
    class="page page--details">
    <m-breadcrumb :items="breadcrumb" />

    <div class="options">
      <el-button
        icon="el-icon-caret-left"
        :disabled="disabledPrev"
        @click="prev">上一条
      </el-button>
      <el-button
        icon="el-icon-caret-right"
        :disabled="disabledNext"
        @click="next">下一条
      </el-button>
    </div>
    <commonDetail :data="data" />
  </section>
</template>

<script>
  import commonDetail from './common/DetailForm'

  export default {
    name: 'WarehouseDetails',

    components: {
      commonDetail,
    },

    data() {
      return {
        breadcrumb: [
          { name: '企业OA' },
          { name: '知识仓库', to: '/share' },
          { name: '资料仓库', to: '/share/warehouse' },
          { name: '' },
        ],
        loading: false,
        data: {},
      }
    },

    computed: {
      ids() {
        return this.$store.state.share.warehouseIds
      },

      disabledPrev() {
        const { id } = this.$route.params
        const index = this.ids.indexOf(id)

        if (index === -1 || this.ids.length <= 1 || index === 0) {
          return true
        }
        return false
      },

      disabledNext() {
        const { id } = this.$route.params
        const index = this.ids.indexOf(id)
        const len = this.ids.length

        if (index === -1 || len <= 1 || index === (len - 1)) {
          return true
        }
        return false
      },
    },

    created() {
      this.fetch()
    },

    methods: {
      fetch() {
        this.loading = true
        this.$axios
          .get(this.$api.oa.warehouse.detail, {
            params: {
              id: this.$route.params.id,
            },
          })
          .then(({ data }) => {
            this.data = data
            const temp = { name: data.title }
            this.breadcrumb.splice(3, 1, temp)
          })
          .catch(() => {})
          .then(() => {
            this.loading = false
          })
      },

      reset(bool) {
        const { params } = this.$route
        const index = this.ids.indexOf(params.id)
        const key = bool ? (index + 1) : (index - 1)
        const id = this.ids[key]
        this.$router.replace({
          params: Object.assign({}, params, { id }),
        })
      },

      prev() {
        this.reset(false)
        this.$nextTick(() => {
          this.fetch()
        })
      },

      next() {
        this.reset(true)
        this.$nextTick(() => {
          this.fetch()
        })
      },
    },
  }
</script>
