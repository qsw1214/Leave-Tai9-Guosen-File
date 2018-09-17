<template>
  <div />
</template>

<script>
  export default {
    name: 'NotificationJumper',

    created() {
      let target

      if (this.$permission.valid('1050004,1050005')) target = 'index'
      else if (this.$permission.valid('1050006')) target = 'approving'

      this.$router.replace(`/notification/${target}`)
    },
  }
</script>
