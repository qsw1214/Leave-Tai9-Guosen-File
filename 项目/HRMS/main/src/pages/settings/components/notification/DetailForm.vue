<template>
  <m-section
    title="通告基本信息"
    :data="data">

    <m-section-row>
      <m-section-cell
        title="起草人"
        prop="user_name" />

      <m-section-cell
        title="起草时间"
        v-if="importer !== 'index'"
        :content="time" />
      <m-section-cell
        title="发布时间"
        prop="release_time"
        v-else />
    </m-section-row>

    <m-section-row v-if="importer !== 'index'">
      <m-section-cell
        title="通告状态"
        prop="status_name" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="通告标题"
        prop="title" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="通告类别"
        prop="category_name" />
      <m-section-cell
        title="通告类型"
        prop="type_name" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="文号"
        prop="number" />
      <m-section-cell
        title="发文单位"
        prop="org_name" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="是否置顶"
        prop="is_top_name"
        v-if="importer !== 'index'" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="正文内容"
        prop="content" />
    </m-section-row>

    <m-section-row>
      <m-section-cell title="附件上传">
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
        required: true,
      },

      // 从哪里导入
      importer: {
        type: String,
        default: '',
      },
    },

    computed: {
      time() {
        if (Number(this.data.status) === 4) {
          return '由系统自动生成'
        }

        return (this.data.create_time || '草稿')
      },
    },
  }
</script>
