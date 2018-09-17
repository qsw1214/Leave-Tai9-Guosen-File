<template>
  <div class="userinfo-container">
    <m-userinfo
      is-horizontal
      :userinfo="userInfo || {}" />
  </div>
</template>

<script>
  export default {
    props: {
      data: {
        type: Object,
        default: () => (null),
      },
    },
    data() {
      return {}
    },
    computed: {
      userInfo() {
        if (this.data) {
          delete this.data.broker_code
          return this.data
        }
        const userInfo = JSON.parse(sessionStorage.getItem('USER_INFO'))
        delete userInfo.broker_code
        return userInfo
      },
    },
  }
</script>


<style lang="scss" type="text/scss">
.userinfo-container {
  background: #fff;
  border: 1px solid #e9e9e9;
  padding: 20px 0;
}
</style>
