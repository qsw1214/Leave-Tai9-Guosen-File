<template>
  <div class="followrecord">
    <choose-topic></choose-topic>
    <item-list></item-list>
    <add-button :overview="overview"></add-button>
  </div>
</template>
<script>
  import ChooseTopic from './ChooseTopic'
  import ItemList from './ItemList'
  import AddButton from './AddButton'
  import { mapGetters } from 'vuex'
  
  export default {
    name: 'FollowRecord',
    mounted () {
      // 如果缓存中无数据
      if (this.list == null) {
        // 大纲数据不存在
        if (this.overview == null) {
          let customerID = this.$route.query.customerID
          let uid = this.$route.query.uid
          console.log('FollowRecord Fetch Overview!')
          this.$store.dispatch('getOverviewById', { customerID, uid }).then(() => {
            this.fetchData()
          })
        } else {
          this.fetchData()
        }
      }
      // let _this = this
      // 采用了防抖动
      // document.addEventListener('scroll',_this.debounce(_this.saveScrollPosition,500));
    },
    methods: {
      fetchData () {
        let customerID = this.$route.query.customerID
        let uid = this.$route.query.uid
        this.$store.dispatch('setLoadding')
        this.$store.dispatch('fetchClientList', { customerID, uid })
      },
      saveScrollPosition () {
        // console.log('scroll')
      },
      // 简单的防抖动函数
      debounce (func, wait) {
        // 定时器变量
        var timeout
        return () => {
          // 每次触发 scroll handler 时先清除定时器
          clearTimeout(timeout)
          // 指定 xx ms 后触发真正想进行的操作 handler
          timeout = setTimeout(func, wait)
        }
      }
    },
    components: {
      ChooseTopic,
      ItemList,
      AddButton
    },
    computed: {
      ...mapGetters({
        overview: 'getOverview',
        list: 'getList'
      })
    },
    destory () {
      // console.log('destory')
      // let _this = this
      // document.removeEventListener('scroll',_this.debounce);
    }
  }
</script>

<style lang='scss' scoped>
  @import '../../../style/mixin';

  .followrecord {
    width: 100%;
  }
</style>
