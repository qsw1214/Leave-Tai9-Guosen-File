<template>
  <div class="news">
    {{ news }}
  </div>
</template>
<script>
  export default {
    name: 'News',
    data () {
      return {
        news: 'This is a page of News'
      }
    }
  }
</script>
<style lang='scss' scoped>
  .news {
    background: gray;
  }
</style>