<template lang="html">
  <section class="nodata">
    <i class="nodata-icon fa fa-info-circle fa-2x" aria-hidden="true"></i>
    <h4 class="nodata-text">暂无数据</h4>
  </section>
</template>

<script>
export default {
  name: 'Nodata'
}
</script>

<style lang="scss" rel="stylesheet/scss">
@import "~@/style/vars.scss";
.nodata {
  $height: 120px;
  background-color: #F5F5F5;
  color: #778899;
  height: $height;
  text-align: center;
  .nodata-icon {
    display: inline-block;
    vertical-align: top;
    line-height: $height;
  }
  .nodata-text {
    display: inline-block;
    vertical-align: top;
    line-height: $height;
    margin: 0;
    font-size: 18px;
    font-weight: bold;
    opacity: 0.8;
    letter-spacing: 1px;
  }
}
</style>
