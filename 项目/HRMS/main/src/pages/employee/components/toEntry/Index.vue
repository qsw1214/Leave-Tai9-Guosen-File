<template>
  <div />
</template>

<script>
  export default {
    name: 'EmployeeToEntryIndex',

    created() {
      let target = 'approving'

      if (this.$permission.valid('1030003')) target = 'application'

      this.$router.replace(`/to-entry/${target}`)
    },
  }
</script>
