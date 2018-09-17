<template>
  <index-item
    v-loading="loading"
    title="通知公告"
    is-list
    :uri="$api.index.index.notification"
    @jump="jump" />
</template>

<script>
  import IndexItem from './IndexItem'

  export default {
    name: 'Notification',
    components: { IndexItem },

    data() {
      return {
        loading: false,
      }
    },

    methods: {
      jump({ id, quote_id }) {
        this.loading = true
        this.markAsRead(id).then(() => {
          this.$router.push({ path: `/notification/${quote_id}` })
        })
      },

      markAsRead(id) {
        return this.$axios
          .post(
            this.$api.index.index.readed,
            { id },
            { showProgressBar: false }
          )
      },
    },
  }
</script>
