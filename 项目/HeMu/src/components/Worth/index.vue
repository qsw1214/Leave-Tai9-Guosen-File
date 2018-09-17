<template>
  <div class="worth">
    {{ worth }}
  </div>
</template>
<script>
  export default {
    name: 'Worth',
    data () {
      return {
        worth: 'This is a page of Worth'
      }
    }
  }
</script>
<style lang='scss' scoped>
  .worth {
    background: red;
  }
</style>