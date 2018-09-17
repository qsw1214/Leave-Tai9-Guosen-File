<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="page">
    <m-breadcrumb :items="breadcrumb" />
    <detail-form
      importer="index"
      v-if="detail"
      :data="detail" />
  </div>
</template>

<script>
  import DetailForm from '~settings/components/notification/DetailForm'

  export default {
    name: 'Notification',
    components: {
      DetailForm,
    },

    data() {
      const { params } = this.$route

      return {
        loading: false,
        id: params.id,
        breadcrumb: [
          { name: '主页', to: '/index' },
          { name: '通知公告' },
        ],
        detail: null,
      }
    },

    created() {
      this.fetch()
    },

    methods: {
      fetch() {
        this.loading = true
        this.$axios
          .get(this.$api.index.notification, {
            params: { id: this.id },
          })
          .then(({ data }) => {
            this.detail = data
          })
          .catch(() => {})
          .then(() => {
            this.loading = false
          })
      },
    },
  }
</script>
