<template>
  <div
    class="m-section"
    :class="{ 'is-form': isForm }">

    <h3
      class="m-section--title"
      v-if="title"
      :style="styleObject">{{ title }}</h3>

    <div class="m-section--content">
      <slot :data="data" />
    </div>

  </div>
</template>

<script>
  export default {
    name: 'MSection',
    props: {
      /* eslint-disable vue/require-default-prop */
      data: {
        type: Object,
      },

      title: {
        type: String,
      },

      // 是否含 form 表单
      isForm: {
        type: Boolean,
        default: false,
      },

      // 是否小型的title
      styleObject: {
        type: Object,
      },
      /* eslint-enable vue/require-default-prop */
    },
  }
</script>
