<template>
  <div />
</template>

<script>
  export default {
    name: 'EmployeeBecomeRegularIndex',

    created() {
      let target = 'approving'

      if (this.$permission.valid('1030011')) target = 'application'

      this.$router.replace(`/become-regular/${target}`)
    },
  }
</script>
