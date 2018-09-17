<template>
  <transition name="el-zoom-in-top">
    <div class="field--result">
      <template v-for="(tag, index) in tags">
        <div :key="index">
          <el-tag
            size="medium"
            type="primary"
            close-transition
            :closable="tag.disable"
            @close="close(tag)">{{ tag.name }}</el-tag>
        </div>
      </template>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'FieldResult',
    data() {
      return {
        test: '',
      }
    },
    computed: {
      tags() {
        const currentCase = this.$store.getters.getCurrentCase
        return currentCase.detail.head
      },
    },
    methods: {
      close(tag) {
        this.$store.dispatch('remove_head_choose', { tag })
      },
    },
  }
</script>


<style lang="scss" scoped type="text/scss" rel="stylesheet/scss">
  .field--result {
    width: 300px;
    height: 500px;
    border: 1px solid #b3b3b3;
    background-color: #fff;
    box-sizing: border-box;
    overflow-y: scroll;
    padding: 10px 10px 2px 10px;

    .el-tag--primary {
      margin-bottom: 8px;
    }
  }
</style>
