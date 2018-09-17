<template>
  <transition name="el-zoom-in-top">
    <div class="condition">
      <!--筛选字段-->
      <Field :index="index" />
      <!--选择符号-->
      <Symbols />
      <!--字段值-->
      <FieldValue />
    </div>
  </transition>
</template>

<script>
  import Field from './Field'
  import Symbols from './Symbol'
  import FieldValue from './FieldValue'

  export default {
    name: 'OnceCondition',
    components: {
      Field,
      Symbols,
      FieldValue,
    },
    props: {
      index: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        test: '',
      }
    },
    computed: {
      condition() {
        return this.$store.getters.getConditionByIndex(this.index)
      },
    },
  }
</script>
