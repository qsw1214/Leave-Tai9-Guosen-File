<template>
  <div />
</template>

<script>
  export default {
    name: 'EmployeeLeaveIndex',

    created() {
      let target = 'approving'

      if (this.$permission.valid('1030007')) target = 'application'

      this.$router.replace(`/leave/${target}`)
    },
  }
</script>
