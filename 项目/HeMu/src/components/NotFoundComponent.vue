<template>
  <div class="nopage">
    <h1>404</h1>
    <p>您访问的页面{{path}}不存在！</p>
  </div>
</template>
<script>
  export default{
    name: 'Page_404',
    data () {
      let path = this.$route.path
      return {
        path
      }
    }
  }
</script>
<style lang='scss' scoped>
  .nopage {
    text-align: center;
    h1 {
      font-size: 20px;
      margin-top: 50px;
    }
    p {
      font-size: 18px;
    }
  }
</style>