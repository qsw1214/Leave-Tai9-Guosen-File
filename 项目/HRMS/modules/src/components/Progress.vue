<template>
  <m-progress />
</template>

<script>
  export default {
    name: 'Progress',

    mounted() {
      this.fetch()
    },

    methods: {
      fetch() {
        this.$axios.get('/mock/axios')
          .then(() => {})
          .catch(() => {})
      },
    },
  }
</script>
