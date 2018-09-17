<template>
  <div class="login">
    <div class="login--logo"></div>
    <div class="login--text">
      <h2>{{ isLogin?'登录':'找回密码' }}</h2>
    </div>
    <div class="login--form">
      <div class="item">
        <div class="item--body" :class='{"error": error.mobile}'>
          <span class="icon icon--mobile"></span>
          <input
            @focus='inputFocus($event)'
            @blur='inputBlur($event)'
            type="number"
            id= 'mobile'
            placeholder="请输入手机号码"
            v-model='mobile'>
        </div>
      </div>
      <div class="item" v-if='!isLogin'>
        <div class="item--body" :class='{"error": error.verify}'>
          <span class="icon icon--verify"></span>
          <input 
            @focus='inputFocus($event)'
            @blur='inputBlur($event)'
            type="text" 
            placeholder="请输入验证码" 
            class="width60" 
            v-model='verify'>
          <div 
          :class='{"sendding": isSend}'
          v-tap='{methods: getVerify}'
          class="verify"><span v-if='isSend'>{{count}}s</span><span v-else>获取验证码</span></div>
        </div>
      </div>
      <div class="item">
        <div class="item--body" :class='{"error": error.password}'>
          <span class="icon icon--password"></span>
          <input 
            @focus='inputFocus($event)'
            @blur='inputBlur($event)'
            type="password" 
            :placeholder="passwordPlaceholder" 
            v-model='password'>
        </div>
        <p class='forget' v-if='isLogin'><span v-tap='{methods: forgetPassword}'>忘记密码</span></p>
      </div>
      <div class="item" v-if='!isLogin'>
        <div class="item--body">
          <span class="icon icon--password"></span>
          <input 
            @focus='inputFocus($event)'
            @blur='inputBlur($event)'
            type="password" 
            placeholder="请确认新密码" 
            v-model='againPassword'>
        </div>
      </div>
      <div class="item">
        <button
          v-tap='{ methods : submit }'
          class="submit">
          <i class="loading" v-if='isSubmit'></i>
          {{ isLogin?'登录':'修改密码' }}
        </button>
      </div>
    </div>
    <Tips
      @on-hide='hideTips'
      :show='tips.show'
      :time='tips.time'
      :type='tips.type'
      :text='tips.text'></Tips>
  </div>
</template>
<script>
  import Toast from 'helper/toast'
  import MESSAGE from 'helper/message'
  import Tips from 'components/Common/Tips'

  export default {
    name: 'Login',
    data () {
      let direct = this.$route.query.direct
      let action = this.$route.query.action === '0' ? 0 : 1
      return {
        // 0为登录 1为找回密码
        isLogin: action,
        mobile: '',
        password: '',
        againPassword: '',
        verify: '',
        hasSend: false,
        isSend: false,
        isSubmit: false,
        // 计时器秒钟数
        count: 10,
        // 登录成功后
        direct,
        tips: {
          show: false,
          time: 2000,
          type: 'loading',
          text: ''
        },
        error: {
          mobile: false,
          verify: false,
          password: false,
          againPassword: false
        }
      }
    },
    methods: {
      // 登录或者找回密码的提交
      submit () {
        let isLogin = this.isLogin
        if (!this.validate('mobile')) {
          Toast(MESSAGE.LOGIN_VALIDATE_FAIL_MOBILE)
          return false
        }
        if (!isLogin) {
          if (!this.validate('verify')) {
            Toast(MESSAGE.LOGIN_VALIDATE_FAIL_VERIFY)
            return false
          }
        }
        if (!this.validate('password')) {
          Toast(MESSAGE.LOGIN_VALIDATE_FAIL_PASSWORD)
          return false
        }
        if (!isLogin) {
          if (this.password !== this.againPassword) {
            Toast(MESSAGE.LOGIN_VALIDATE_FAIL_DIFFERENTPASSWORD)
            return false
          }
        }
        let data = {}
        data.mobile = this.mobile
        data.password = this.password
        if (!isLogin) {
          data.verify_code = this.verify
          data.password_confirm = this.againPassword
        }
        this.isSubmit = true
        if (isLogin) {
          this.$http.post('/ajax/WechatService/Index/doLogin', data).then((response) => {
            let res = response.body
            this.isSubmit = false
            this.$nextTick(() => {
              if (res.error === 0) {
                this.showTips({show: true, time: 2000, type: 'success', text: MESSAGE.LOGIN_SUCCEED})
                setTimeout(() => {
                  if (this.direct) {
                    this.$router.push({ path: this.direct })
                  } else {
                    this.$router.push({ path: 'news' })
                  }
                }, 2000)
              } else {
                Toast(res.msg)
              }
            })
          })
        } else {
          this.$http.post('/ajax/WechatService/Index/findPasswordBack', data).then((response) => {
            let res = response.body
            this.isSubmit = false
            this.$nextTick(() => {
              if (res.error === 0) {
                this.showTips({show: true, time: 2000, type: 'success', text: MESSAGE.LOGIN_MODIFY_SUCCEED})
                setTimeout(() => {
                  let query = this.$route.query
                  this.password = ''
                  let params = Object.assign({}, query, { action: '1' })
                  this.$router.push({ path: 'login', query: params })
                }, 2000)
              } else {
                Toast(res.msg)
              }
            })
          })
        }
      },
      // 忘记密码
      forgetPassword () {
        // 清除有填写的密码
        this.password = ''
        // 跳转本身带上路由信息
        let query = this.$route.query
        let params = Object.assign({}, query, { action: '0' })
        this.$router.push({ path: 'login', query: params })
      },
      // 获取验证码
      getVerify () {
        document.querySelector('#mobile').blur()
        if (!this.validate('mobile')) {
          Toast(MESSAGE.LOGIN_VALIDATE_FAIL_MOBILE)
          return false
        }
        if (this.isSend) return
        this.$http.post('/ajax/WechatService/Index/sendVerifyMsg', {mobile: this.mobile, type: 2}).then((response) => {
          let res = response.body
          if (res.error === 0) {
            this.beginTimer()
            Toast(MESSAGE.LOGIN_SEND_VERIFY_SUCCEED)
          } else {
            Toast(res.msg)
          }
        })
      },
      // 表单验证
      validate (type) {
        let flag = true
        switch (type) {
          case 'mobile':
            let mobileReg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            if (!mobileReg.test(this.mobile)) {
              this.error.mobile = true
              flag = false
            } else {
              this.error.mobile = false
            }
            break
          case 'password':
            let passwordReg = /^\w{6,18}$/
            // 登录验证密码
            if (this.isLogin) {
              if (!passwordReg.test(this.password)) {
                this.error.password = true
                flag = false
              } else {
                this.error.mobile = false
              }
            //  找回密码验证两者
            } else {
              if (!passwordReg.test(this.password) && !passwordReg.test(this.againPassword)) {
                this.error.password = true
                flag = false
              } else {
                this.error.mobile = false
              }
            }
            break
          case 'verify':
            let verifyReg = /^\d+$/
            if (!verifyReg.test(this.verify)) {
              this.error.verify = true
              flag = false
            } else {
              this.error.mobile = false
            }
        }
        return flag
      },
      // 启动倒计时
      beginTimer () {
        this.isSend = true
        window.verifyTimer = setInterval(() => {
          if (--this.count < 1) {
            clearInterval(window.verifyTimer)
            this.count = 10
            this.isSend = false
          }
        }, 1000)
      },
      // 显示提示
      showTips ({show, time, type, text}) {
        this.tips.show = show
        this.tips.time = time
        this.tips.type = type
        this.tips.text = text
      },
      // 隐藏提示
      hideTips () {
        this.tips.show = false
        this.tips.time = 2000
      },
      // 获得焦点
      inputFocus (event) {
        let $el = event.target
        let $parent = $el.parentNode
        $parent.classList.add('focus')
      },
      // 失去焦点
      inputBlur (event) {
        let $el = event.target
        let $parent = $el.parentNode
        $parent.classList.remove('focus')
      },
      // 重置错误flag
      resetErrorFlag () {
        Object.keys(this.error).forEach((errorName) => {
          this.error[errorName] = false
        })
      }
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': function () {
        let action = this.$route.query.action === '0' ? 0 : 1
        this.isLogin = action
        this.resetErrorFlag()
      }
    },
    computed: {
      passwordPlaceholder () {
        return this.isLogin ? '请输入密码' : '请输入新密码'
      }
    },
    components: {
      Tips
    }
  }
</script>
<style lang='scss' scoped>
  @import '~bourbon/app/assets/stylesheets/bourbon';
  @import '../../style/mixin';
  .login {
    height: 100%;
    background: #fff;
    
    &--logo {
      width: px2rem(56);
      height: px2rem(66);
      margin: px2rem(56) auto px2rem(48) auto;
      background-image: url(../../assets/logo@2x.png);
      background-size: 100%;
      background-repeat: no-repeat;
    }

    &--text {
      h2 {
        @include fontSize(17px);
        padding: 0 px2rem(12) 0 px2rem(12);
        text-align: center;
        color: #17558E;
        font-weight: normal;
        text-align: left;
      }
    }

    &--form {
      box-sizing:border-box;
      padding:px2rem(16) px2rem(12) px2rem(80) px2rem(12);

      .item {
        margin-bottom: px2rem(12);
        &--title {
          position: relative;
          span {
            display: inline-block;
            @include fontSize(14px);
            line-height: 1.5;
          }
          span.required {
            &:after {
              content: '*';
              @include fontSize(14px);
              color: #f00;
              position: absolute;
              left: px2rem(-4);
            }
          }
        }

        &--body {
          box-sizing:border-box;
          height: px2rem(44);
          border-radius: px2rem(2);
          position: relative;
          border: 1px #E0E0E0 solid;
          
          &.error {
            border: 1px #F2455A solid !important;
          }

          &.focus {
            border: 1px #17558E solid;
          }

          .icon {
            display: inline-block;
            vertical-align: middle;
            width: px2rem(15);
            height: px2rem(15);
            background-size: 100%;
            background-repeat: no-repeat;
            margin-left: px2rem(8);
            margin-right: px2rem(4);

            &.icon--mobile {
              background-image: url(../../assets/mobile@2x.png);

              [data-dpr="3"] & {
                background-image: url(../../assets/mobile@3x.png);
              }
            }

            &.icon--password {
              background-image: url(../../assets/password@2x.png);

              [data-dpr="3"] & {
                background-image: url(../../assets/password@3x.png);
              }
            }

            &.icon--verify {
              background-image: url(../../assets/verify@2x.png);

              [data-dpr="3"] & {
                background-image: url(../../assets/verify@3x.png);
              }
            }
          }

          input {
            -webkit-appearance:none;
            display: inline-block;
            vertical-align: middle;
            box-sizing:border-box;
            background: none;
            border: none;
            height: px2rem(42);
            width: px2rem(310);
            color: #4D4D4D;
            @include fontSize(15px);
            box-shadow: none;
            outline: none;
          }

          input.width60 {
            width: 40%;
          }

          .verify {
            position: absolute;
            right: px2rem(6);
            top: px2rem(5);
            box-sizing: border-box;
            width: px2rem(110);
            height: px2rem(32);
            line-height: px2rem(32);
            background: #F9F9F9;;
            text-align: center;
            @include fontSize(14px);
            padding:0px px2rem(12);
            border-radius: px2rem(2);
            border: 1px #E0E0E0 solid;
            border-radius: px2rem(2px);

            &.sendding {
              color: #999;
            }

            span {
              color: #999;
            }
          }
        }

        .forget {
          @include fontSize(14px);
          margin-top: px2rem(16);
          line-height: 1.2;
          color: #17558E;
        }

        .submit {
          display: inline-block;
          box-sizing:border-box;
          width: 100%;
          border: none;
          height: px2rem(48);
          border-radius: px2rem(4);
          @include fontSize(18px);
          font-weight: normal;
          color: #fff;
          background-color: #17558E;
          outline: none;
          margin-top: px2rem(20);

          &:active {
            background-color: #114E86;;
          }

          .weui-loading{
            display: inline-block;
            width: px2rem(20);
            height: px2rem(20);
            vertical-align: middle;
          }
        }
      }
    }
  }
</style>