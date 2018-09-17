<template>
  <m-section
    :data="data"
    :title="data.title">
    <m-section-row>
      <m-section-cell
        prop="title"
        title="资料标题" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        prop="introduction"
        title="资料简介" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        prop="type_name"
        title="资料类型" />

      <m-section-cell
        prop="year"
        title="资料年份" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="附件列表">
        <m-attachment :data="data.aids" />
      </m-section-cell>
    </m-section-row>
  </m-section>
</template>

<script>
  export default {
    name: 'DetailForm',

    props: {
      data: {
        type: Object,
        default: () => ({}),
      },
    },
  }
</script>
