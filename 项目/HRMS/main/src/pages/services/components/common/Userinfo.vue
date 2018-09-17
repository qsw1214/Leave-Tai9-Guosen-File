<template>
  <div class="userinfo--wrap"><m-userinfo
    is-horizontal
    :userinfo="userinfo" /></div>
</template>

<script>
  export default {
    name: 'Userinfo',

    props: {
      data: {
        type: Object,
        default: () => null,
      },
    },

    computed: {
      userinfo() {
        if (this.data === null) return this.$store.state.services.userinfo
        const {
          avatar_url,
          mobile,
          name,
          job_name,
          org_name,
          sex,
          emp_code,
        } = this.data
        return { avatar_url, mobile, name, job_name, org_name, sex, emp_code }
      },
    },

    mounted() {
      if (this.data === null) this.$store.dispatch('get_initial_data')
    },
  }
</script>

<style lang="scss" scoped rel="stylesheet/scss">
  .userinfo--wrap {
    background: #fff;
    border: 1px solid #e9e9e9;
    padding: 20px 0;
  }
</style>
