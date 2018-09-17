<template>
  <div class="m-progress" />
</template>

<script>
  export default { name: 'MProgress' }
</script>

<style lang="css">
  @import "~nprogress/nprogress.css";

  .nprogress-custom-parent {
    height: 3px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 20;
  }
</style>
