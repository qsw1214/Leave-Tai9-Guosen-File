<template>
  <div class="container">
    <m-userinfo
      is-horizontal
      :userinfo="userinfo" />
  </div>
</template>

<script>

  export default {
    name: 'MUserinfoTest',

    data() {
      return {
        userinfo: {
          // avatar_url: 'http://img2.imgtn.bdimg.com/it/u=8232468,2916696848&fm=27&gp=0.jpg',
          avatar_url: '',
          name: '宋大可',
          org_name: '互联网研发部',
          job_name: 'web前端开发工程师',
          mobile: '13242931507',
          broker_code: '8249',
        },
      }
    },
  }
</script>
