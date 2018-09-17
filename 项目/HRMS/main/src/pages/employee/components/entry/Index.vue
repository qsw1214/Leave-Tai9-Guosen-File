<template>
  <div />
</template>

<script>
  export default {
    name: 'EmployeeEntryIndex',

    created() {
      let target = 'approving'

      if (this.$permission.valid('1030005')) target = 'application'

      this.$router.replace(`/entry/${target}`)
    },
  }
</script>
