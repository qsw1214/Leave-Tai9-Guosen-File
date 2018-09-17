<template>
  <div class="client">
    <div class="client--head">
      <component :is="currentView" :overview="overview">
      </component>
      <tabs></tabs>
    </div>
    <div class='client--body' :class='{"preview": (preview == "1")}'>
      <Loader></Loader>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  import Overview from './Overview'
  import Preview from './Preview'
  import Tabs from './Tabs'
  import Loader from 'components/Common/Loader'
  import { mapGetters } from 'vuex'
  import JSBridge from 'helper/JSBridge'

  export default {
    name: 'Client',
    data () {
      let preview = this.$route.query.preview
      let currentView = 'overview'
      if (preview === '1') {
        this.$store.dispatch('isPreview')
        currentView = 'preview'
      }
      return {
        currentView,
        preview
      }
    },
    created () {
      // 兼容android总是拿不到token改成明文传输
      let token = this.$route.query.token
      if (token) {
        JSBridge.client.setToken(token)
      }
    },
    mounted () {
      // 5833e21733c0f 默认id
      let currentCustomerID = this.$route.query.customerID
      let storeCustomerID = this.$store.state.client.customerID
      if (storeCustomerID !== currentCustomerID) {
        this.fetchOverview(currentCustomerID)
      }
    },
    methods: {
      fetchOverview (customerID) {
        console.log('Index Fetch Overview')
        let uid = this.$route.query.uid
        this.$store.dispatch('saveCustomerID', customerID)
        this.$store.dispatch('getOverviewById', { customerID, uid })
      }
    },
    computed: mapGetters({
      overview: 'getOverview'
    }),
    components: {
      Overview,
      Preview,
      Tabs,
      Loader
    }
  }
</script>
<style lang='scss' scoped>
  @import '../../style/mixin';
  @import '~bourbon/app/assets/stylesheets/bourbon';

  .client {
    &--head {
      position: fixed;
      left: 0px;
      top: 0px;
      z-index: 99;
      width: 100%;
    }

    &--body {
      padding-top: px2rem(298);

      &.preview {
        padding-top: px2rem(131);
      }
    }
  }
</style>