<template>
  <div
    v-loading="loading"
    class="page--index-item page--index-user">

    <div class="user--media">
      <div class="avatar">
        <img :src="user.avatar_url">
      </div>

      <div class="join">
        您已加入泰九<br>
        <span
          class="join--date"
          v-for="(num, index) in user.formatDate"
          :key="index"><span>{{ num }}</span></span><span class="join--date"><span>天</span></span>
      </div>
    </div>

    <div class="user--body">
      <div class="user--head">
        <div class="name">{{ user.name }}</div>
        <div class="job">{{ user.org_name }} &bull; {{ user.job_name }}</div>
        <div
          class="more"
          @click="jump(user)">我的信息 &rarr;</div>
      </div>

      <div class="user--foot">
        <!-- <img src="../../assets/images/slogan.png"> -->
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'User',

    data() {
      return {
        user: {},
        loading: true,
      }
    },

    created() {
      this.waitUser()
    },

    methods: {
      waitUser() {
        let user = sessionStorage.getItem('USER_INFO')

        if (user) {
          this.handler(user)
          return
        }

        const interval = setInterval(() => {
          user = sessionStorage.getItem('USER_INFO')
          if (user) {
            this.handler(user)
            clearInterval(interval)
          }
        }, 250)
      },

      handler(json) {
        const user = JSON.parse(json)

        user.formatDate = user.join_days.toString().split('')
        this.user = user
        this.loading = false
      },

      jump({ id }) {
        this.$router.push(`/profile/${id}`)
      },
    },
  }
</script>

<style lang="scss">
  .page {
    &--index-user {
      background: #fff url(../../assets/images/user-bg.jpg) no-repeat;
      background-size: 100% auto;
      background-position: 0 calc(100% - 132px);
      padding: 32px 28px;
      display: flex;

      .user {
        &--body,
        &--media {
          flex: 1;
        }

        &--media {
          margin-right: 22px;
          text-align: center;
          max-width: 110px;

          .avatar {
            background-color: #fff;
            border-radius: 50%;
            overflow: hidden;
            padding: 4px;
            box-shadow: 0 1px 10px rgba(0, 0, 0, 0.35);
            width: 108px;
            height: 108px;
            margin-bottom: 12px;

            img {
              width: 100px;
              height: 100px;
              border-radius: 50%;
            }
          }

          .join {
            margin-top: 5px;
            line-height: 20px;

            &--date {
              display: inline-block;
              width: 18px;
              height: 20px;
              line-height: 20px;
              border: 1px solid #ededed;
              color: #ff8b5f;
              margin-right: 2px;
              background-color: #f5f5f5;
              position: relative;

              span {
                position: relative;
                z-index: 1;
              }

              &::before {
                content: "";
                position: absolute;
                left: 0;
                right: 0;
                height: 50%;
                bottom: 0;
                background-image: linear-gradient(to top, #f5f5f5, #fefefe);
              }

              &::after {
                content: "";
                position: absolute;
                left: 0;
                right: 0;
                top: 50%;
                z-index: 2;
                background-color: #fff;
                height: 1px;
              }

              &:last-child {
                color: #333;
                background-image: none;

                &::after {
                  display: none;
                }
              }
            }
          }
        }

        &--head {
          color: #fff;
          margin-top: 10px;
          line-height: 1;

          .name {
            font-size: 26px;
            font-weight: 500;
            margin-bottom: 10px;
          }

          .more {
            position: absolute;
            right: 14px;
            top: 60px;
            cursor: pointer;

            &:hover {
              color: #f5f5f5;
            }
          }
        }

        &--foot {
          text-align: center;
          margin-top: 34px;

          img {
            width: 394px;
          }
        }
      }
    }
  }
</style>
