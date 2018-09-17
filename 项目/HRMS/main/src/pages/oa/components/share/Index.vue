<template>
  <div />
</template>

<script>
  export default {
    name: 'OAShareIndex',

    created() {
      let target = 'warehouse'

      if (!this.$permission.valid('1070005')) target = 'mine'

      this.$router.replace(`/share/${target}`)
    },
  }
</script>
