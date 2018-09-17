<template>
  <div class="uploader-container">
    <Common :website="1"></Common>
  </div>
</template>

<script>
  import Common from './Common.vue'
  export default {
    name: 'RenameHowBuy',
    data () {
      return {
        test: ''
      }
    },
    components: {
      Common
    }
  }
</script>


<style lang="scss" scoped type="text/scss" rel="stylesheet/scss">
  .uploader-container {
  }
</style>
