<template>
  <section
    class="item"
    @click="toDetails">
    <m-section
      :title="data.title"
      :style-object="styleObject"
      :data="data">
      <m-section-row>
        <m-section-cell
          title="资料简介"
          prop="introduction" />

        <m-section-cell
          title="上传者"
          :content="name" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="附件列表">
          <div @click.stop>
            <m-attachment
              :data="data.aids|| []" />
          </div>

        </m-section-cell>
        <m-section-cell
          title="最新更新时间"
          prop="update_time" />
      </m-section-row>
    </m-section>
  </section>
</template>

<script>
  export default {
    name: 'Item',

    props: {
      data: {
        type: Object,
        default: () => ({}),
      },
    },

    data() {
      return {
        styleObject: {
          fontSize: '18px',
          color: '#333',
          lineHeight: '18px',
          borderLeft: '0px',
        },
      }
    },

    computed: {
      name() {
        return `${this.data.user_name}[${this.data.emp_code}] ${this.data.org_name}`
      },
    },

    methods: {
      toDetails() {
        this.$emit('click', this.data)
      },
    },
  }
</script>
