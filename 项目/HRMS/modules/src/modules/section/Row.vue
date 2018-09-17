<template>
  <el-row class="m-section--row">
    <slot
      v-show="length"
      :length="length" />
  </el-row>
</template>

<script>
  export default {
    name: 'MSectionRow',
    data() {
      return { length: 0 }
    },

    mounted() {
      this.length = this.$children[0].$children.length
    },
  }
</script>
