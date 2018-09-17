<template>
  <div class="login-container">
    <Particle></Particle>
    <div class="form">
      <h2>登&nbsp;&nbsp;&nbsp;&nbsp;录</h2>
      <div class="input">
        <input class="input--field" type="text" name="username" placeholder="用户名" v-model="form.loginName">
        <div class="input--label" for="username"></div>
      </div>

      <div class="input" style="margin-top: 30px;">
        <input class="input--field" type="password" name="password" placeholder="密码" v-model="form.loginPwd" @keyup.enter="submit" autocomplete="off">
        <div class="input--label" for="username"></div>
      </div>

      <div class="input"  style="margin-top: 40px;">
        <el-button style="width: 100%" :loading="loading" size="large" @click="submit">登 录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import md5 from 'md5'
  import Particle from './Particle'

  export default {
    name: 'Login',
    data () {
      return {
        form: {
          loginName: localStorage.getItem('WebankDrawerAdmin:name') || '',
          loginPwd: ''
        },
        loading: false
      }
    },
    methods: {
      validator () {
        const { loginName, loginPwd } = this.form
        let msg

        if (!loginName.trim()) msg = '请输入账号'
        else if (!loginPwd) msg = '请输入密码'

        if (msg) {
          this.$message.error(msg)
          return false
        }

        return true
      },
      submit () {
        if (!this.validator()) return false

        const { loginName, loginPwd } = this.form
        const pwd = md5(loginPwd)

        localStorage.setItem('WebankDrawerAdmin:name', loginName)
        this.loading = true

        this.axios
          .get(`/admin/Unauthorized/Logon?userName=${loginName}&password=${pwd}`)
          .then(res => {
            const { code, error, data } = res.data
            if (code == 0) {
              sessionStorage.setItem('token', data.token)
              this.$emit('success')
              const redirect = this.$route.query.redirect
              if (redirect) {
                this.$router.push(redirect)
              } else {
                this.$router.push({path: '/uploader/excel_uploader'})
              }
            }
            this.loading = false
          })
          .catch(e => {
            this.loading = false
          })
      }
    },
    components: {
      Particle
    }
  }
</script>

<style lang="scss" scoped type="text/scss" rel="stylesheet/scss">
  .login-container {
    .form {
      width: 350px;
      height: 400px;
      margin: 150px auto 0 auto;
      position: relative;
      right: -40px;
      padding: 50px;
      z-index: 2;

      .input {
        position: relative;
        box-sizing: border-box;
        width: 300px;

        &--label {
          content: ' ';
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          z-index: 3;
          background: transparent;
          box-shadow: 0px 0px 0px 0px rgba(199,152,157, 0.6);
          z-index: 1;
        }

        &--field {
          width: 300px;
          appearance: none;
          -webkit-appearance: none;
          outline: none;
          border: none;
          position: relative;
          z-index: 2;
          padding: 0.6em;
          border-radius: none;
          box-sizing: border-box;
          background: rgba(0,0,0,.2);
          position: relative;
          display: block;
          font-size: 18px;
          font-weight: bold;
          color: rgb(255, 255, 255);

          &:focus {
            box-shadow: 0px 0px 0px 2px #eca29b;
            background: rgba(0,0,0,.4);
            transition: all 0.3s;

            & + .input--label {
              animation: animate-shadow 0.3s forwards;
            }

            @keyframes animate-shadow {
              to {
                box-shadow: 0px 0px 100px 50px rgba(199,152,157, 0.6);
                opacity: 0;
              }
            }
          }
        }
      }

      h2 {
        text-align: center;
        font-size: 28px;
        color: #666;
        margin-bottom: 30px;
        text-indent: -50px;
      }
    }
  }
</style>
