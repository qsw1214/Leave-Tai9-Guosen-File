<template>
  <div class="client">
    {{ client }}
  </div>
</template>
<script>
  export default {
    name: 'Client',
    data () {
      return {
        client: 'This is a page of Client'
      }
    }
  }
</script>
<style lang='scss' scoped>
  .client {
    background: green;
  }
</style>