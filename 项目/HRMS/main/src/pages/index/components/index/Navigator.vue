<template>
  <index-item
    v-loading="loading"
    title="系统链接">
    <ul class="navigator">
      <li
        class="navigator--item"
        v-for="(item, index) in list"
        :key="index">
        <a
          target="_blank"
          :href="item.url">{{ item.name }}</a>
      </li>
    </ul>
  </index-item>
</template>

<script>
  import IndexItem from './IndexItem'

  export default {
    name: 'Navigator',
    components: { IndexItem },

    data() {
      return {
        list: [],
        loading: false,
      }
    },

    created() {
      this.fetch()
    },

    methods: {
      fetch() {
        this.loading = true
        this.$axios
          .get(this.$api.index.index.navigator)
          .then(({ data }) => {
            this.list = data.list
          })
          .catch(() => {})
          .then(() => {
            this.loading = false
          })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .navigator {
    padding: 0 20px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;

    &--item {
      display: block;
      margin-bottom: 20px;
      padding-right: 10px;
      line-height: 1.2;
      min-width: 25%;

      a {
        cursor: pointer;
        color: #666;
        text-decoration: underline;

        &:hover {
          color: #5090f7;
        }
      }
    }
  }
</style>

