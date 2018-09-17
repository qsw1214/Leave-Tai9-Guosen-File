<template>
  <div />
</template>

<script>
  export default {
    name: 'EmployeeTransferIndex',

    created() {
      let target = 'approving'

      if (this.$permission.valid('1030009')) target = 'application'

      this.$router.replace(`/transfer/${target}`)
    },
  }
</script>
