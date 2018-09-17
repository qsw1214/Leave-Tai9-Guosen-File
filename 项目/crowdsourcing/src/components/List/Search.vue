<template>
  <section class="search">
    <!--weui-search-bar_focusing -->
    <div class="weui-search-bar" id="searchBar">
      <form class="weui-search-bar__form">
        <div class="weui-search-bar__box">
          <i class="weui-icon-search"></i>
          <input type="search" class="weui-search-bar__input" id="searchInput" placeholder="搜索" required="">
          <a href="javascript:" class="weui-icon-clear" id="searchClear"></a>
        </div>
        <label class="weui-search-bar__label" id="searchText">
          <i class="weui-icon-search"></i>
          <span>搜索</span>
        </label>
      </form>
      <a href="javascript:" class="weui-search-bar__cancel-btn" id="searchCancel">取消</a>
    </div>
    <div class="weui-cells searchbar-result" id="searchResult">
      <div class="weui-cell weui-cell_access">
        <div class="weui-cell__bd weui-cell_primary">
          <p>实时搜索文本</p>
        </div>
      </div>
      <div class="weui-cell weui-cell_access">
        <div class="weui-cell__bd weui-cell_primary">
          <p>实时搜索文本</p>
        </div>
      </div>
      <div class="weui-cell weui-cell_access">
        <div class="weui-cell__bd weui-cell_primary">
          <p>实时搜索文本</p>
        </div>
      </div>
      <div class="weui-cell weui-cell_access">
        <div class="weui-cell__bd weui-cell_primary">
          <p>实时搜索文本</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'Search',
    data () {
      return {
        test: 'Search'
      }
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped type="text/scss" rel="stylesheet/scss">
  .search {
    position: relative;

    .searchbar-result {
      margin-top: 0px;
      opacity: 1;
      display: none;
    }

    .weui-search-bar__form {
      font-size: 16px;
    }
  }
</style>
