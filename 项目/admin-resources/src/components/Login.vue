<template>
  <div class="login-container">
    <el-form ref="form" :model="form" label-width="80px">
      <h3 class="title">系统登录</h3>
      <el-form-item label="账号">
        <el-input v-model.trim="form.loginName"></el-input>
      </el-form-item>

      <el-form-item label="密码">
        <el-input v-model.trim="form.loginPwd" type="password" @keyup.enter.native='submit'></el-input>
      </el-form-item>

      <div class="submit">
        <el-button
          size="large"
          type="primary"
          @click="submit"
          style="width:270px;"
          :loading="loading">
          登 录</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  import md5 from 'md5'

  export default {
    name: 'Login',

    data () {
      return {
        form: {
          loginName: localStorage.getItem('ResourcesAdmin:name') || '',
          loginPwd: ''
        },
        loading: false
      }
    },

    methods: {
      // 验证
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
      // 提交
      submit () {
        if (!this.validator()) return false
        const { loginName, loginPwd } = this.form
        const pwd = md5(loginPwd)
        localStorage.setItem('ResourcesAdmin:name', loginName)
        this.loading = true
        this.$axios.get(`/login/logon?loginName=${loginName}&loginPwd=${pwd}`).then(res => {
          const { code, error, data } = res
          if (code === 0) {
            sessionStorage.setItem('token', data.token)
            this.$emit('Login:success')
            this.$router.push('/all-user')
          } else if (error) {
            this.$message.error(error)
          }
          this.loading = false
        }).catch(e => {
          this.loading = false
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;

    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }

    .submit
    {
      text-align: right;
    }
  }
</style>
