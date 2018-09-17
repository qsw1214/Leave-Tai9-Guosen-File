<template>
  <div class="userinfo">
    <m-userinfo
      is-horizontal
      :userinfo="userinfo" />
  </div>
</template>

<script>
  export default {
    name: 'User',

    props: {
      data: {
        type: Object,
        default: () => {},
      },
    },

    computed: {
      userinfo() {
        if (this.data === undefined) return {}

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
  }
</script>

<style scoped>
  .userinfo {
    border: 1px solid #e9e9e9;
    background-color: #fff;
    margin: 14px 0;
    padding: 20px 0;
  }
</style>
