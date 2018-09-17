<template>
  <div class="container">
    <div class="icons">
      <div class="icon-item">
        <m-icon-forbidden fill="red" /> m-icon-forbidden
      </div>

      <div class="icon-item">
        <m-icon-attachment /> m-icon-attachment
      </div>

      <div class="icon-item">
        <m-icon-id-card /> m-icon-attachment
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Icons',
  }
</script>

<style lang="scss" scoped>
  .icon-item {
    margin-right: 20px;
    margin-bottom: 20px;
    display: inline-block;
  }

  .icons {
    padding: 20px 0 1px 20px;
    background-color: #bbb;
  }
</style>

