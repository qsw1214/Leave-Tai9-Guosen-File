<template>
  <div class="tab">
    <div class="tab--item current">近2年</div>
    <div class="tab--item ">近1年</div>
    <div class="tab--item">今年以来</div>
  </div>
</template>

<script>
  export default {
    name: 'Tab',
    data () {
      return {
        test: ''
      }
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped type="text/scss" rel="stylesheet/scss">
  .tab {
    display: flex;
    padding:0px 0.5rem;

    &--item {
      position: relative;
      display: block;
      flex: 1;
      padding: 5px 0;
      text-align: center;
      font-size: 14px;
      color: #2C82EF;
      border: 1px solid #2C82EF;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

      &.current {
        background: #2C82EF;
        color: #fff;
        font-weight: bold;
      }
    }

    &--item:nth-child(2n) {
      border-left: none;
      border-right: none;
    }

    &__panel {

    }
  }
</style>
