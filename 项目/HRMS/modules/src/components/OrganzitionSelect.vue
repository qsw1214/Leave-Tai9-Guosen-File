<template>
  <div>
    传入原数据：
    <m-organzition-select
      v-if="orgs.length > 0"
      :input-options="orgs"/>
    <hr>
    直接调用:
    <m-organzition-select />
  </div>
</template>

<script>
  export default {
    name: 'OrganzitionSelect',

    data() {
      return {
        orgs: [],
      }
    },

    mounted() {
      this.fetch()
    },

    methods: {
      fetch() {
        const validate = this.$utils.tools
          .formatDate(new Date(), 'YYYY-MM-DD')

        this
          .$axios
          .post('http://dev.hr.gxtr9.com/common/get-org-level', {
            validate,
          })
          .then(({ data }) => {
            this.orgs = [data]
          })
          .catch((error) => {
            console.dir(error)
          })
          .then(() => {
            this.loading = false
          })
      },
    },
  }
</script>
