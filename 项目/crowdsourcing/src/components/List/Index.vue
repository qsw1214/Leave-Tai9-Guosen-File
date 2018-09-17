<template>
  <section class="page--list">
    <Search></Search>
    <Tab></Tab>
    <TabPanel></TabPanel>
  </section>
</template>

<script>
  import Search from './Search'
  import Tab from './Tab'
  import TabPanel from './TabPanel'
  export default {
    name: 'List',
    data () {
      return {
        test: 'This is List'
      }
    },
    methods: {
    },
    components: {
      Search,
      Tab,
      TabPanel
    }
  }
</script>

<style lang="scss" scoped type="text/scss" rel="stylesheet/scss">
  .page--list {

  }
</style>
