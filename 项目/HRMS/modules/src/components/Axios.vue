<template>
  <div class="axios">
    development of axios module
  </div>
</template>

<script>
  import tools from '@/utils/tools'

  export default {
    name: 'Axios',

    mounted() {
      this.fetch()
    },

    methods: {
      fetch() {
        this.$axios.post('/org/get-list', {
          showProgressBar: false,
        })
          .then(() => {
            const { messageHandler } = tools
            messageHandler('Fuck || and Fuck', () => {
              console.log('Ehat')
            })
          })
          .catch(() => {
            const { messageHandler } = tools
            messageHandler('Fuck || and Fuck')
          })
      },
    },
  }
</script>
