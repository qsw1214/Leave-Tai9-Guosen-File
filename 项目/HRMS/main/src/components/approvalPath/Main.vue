<template>
  <div class="m-approval-path">
    <path-list
      v-for="(paths, index) in data"
      :data="paths"
      :key="index" />
  </div>
</template>

<script>
  import PathList from './PathList'

  export default {
    name: 'ApprovalPath',
    components: { PathList },

    props: {
      data: {
        type: Array,
        required: true,
        default() { return [] },
      },
    },
  }
</script>

<style lang="scss" type="text/scss">
  .m-approval-path {
    margin: 14px -5px -14px;
    display: flex;
    flex-flow: row wrap;
  }
</style>

