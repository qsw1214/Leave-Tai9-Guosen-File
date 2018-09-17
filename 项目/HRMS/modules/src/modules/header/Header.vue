<template>
  <header class="m-header">

    <search v-if="isSearchUser" />

    <div
      class="m-header--item m-header--user"
      v-if="user">
      <div
        v-clickoutside="closeUserDropdown"
        class="m-header--user-link"
        @click.stop="toggleUserDropdown">
        <img
          class="m-header--user-avatar"
          :src="user.avatar_url" >
        <span>{{ user.name }}</span>
        <i class="el-icon-caret-bottom"/>
      </div>

      <el-collapse-transition>
        <ul
          class="m-header--dropdown"
          v-show="showUserDropdown"
          slot="dropdown">

          <li
            class="m-header--dropdown-item m-header--dropdown-feedback"
            @click="feedback">
            <i class="icon el-icon-message"/>
            <span>建议反馈</span>
          </li>

          <li
            class="m-header--dropdown-item m-header--dropdown-punchcard"
            v-if="isSystemCard"
            @click="punchCard">
            <i class="icon el-icon-date"/>
            <span>运筹系统打卡</span>
          </li>

          <li
            class="m-header--dropdown-item m-header--dropdown-logout"
            @click="logout">
            <icon-logout class="icon" />
            <span>退出系统</span>
          </li>

        </ul>
      </el-collapse-transition>
    </div>

  </header>
</template>

<script>
  import Clickoutside from 'element-ui/src/utils/clickoutside'
  import loader from 'little-loader'
  import IconLogout from './IconLogout'
  import Search from './SearchUser'

  export default {
    name: 'MHeader',
    components: { IconLogout, Search },
    directives: { Clickoutside },

    props: {
      // 是否显示搜索用户框
      isSearchUser: {
        type: Boolean,
        default: false,
      },
    },

    data() {
      let user = sessionStorage.getItem('USER_INFO')
      user = user ? JSON.parse(user) : null

      return {
        user,
        showUserDropdown: false,
      }
    },

    computed: {
      // 可否系统打卡
      isSystemCard() {
        let flag = false
        const { sign_type } = this.user

        if (sign_type) {
          sign_type.some((type) => {
            if (type.key === 4) {
              flag = true
              return true
            }

            return false
          })
        }

        return flag
      },
    },

    created() {
      this.getUser()
    },

    methods: {
      getUser() {
        return this.$axios.get(this.$api.common.userinfo)
          .then((res) => {
            const { data } = res

            if (!data.avatar_url) {
              data.avatar_url = './static/images/header-default-avatar.png'
            }

            this.user = res.data
            sessionStorage.setItem('USER_INFO', JSON.stringify(res.data))
          })
          .catch((error) => {
            console.dir(error)
          })
      },

      logout() {
        const { location } = window
        const env = process.env.NODE_ENV
        const isLocal = process.env.LOCAL
        let url = 'http://op.gxtr9.com/'

        if (isLocal || env === 'development') {
          url = 'http://dev.op.gxtr9.com/'
        } else if (env === 'testing') {
          url = 'http://test.op.gxtr9.com/'
        }

        localStorage.removeItem('token')
        sessionStorage.clear()
        location.replace(url)
      },

      feedback() {
        const { location } = window
        const isServer = location.pathname.includes('/web')
        const path = '/feedback/list'

        this.closeUserDropdown()

        if (location.pathname.indexOf('index.html') > -1) {
          this.$router.push({ path })
        } else {
          location.href = isServer ? `/web/index.html#${path}` : `/index.html#${path}`
        }
      },

      punchCard() {
        const loading = this.$loading({
          lock: true,
          text: '正在执行系统打卡...',
          customClass: 'punch-card-loading',
        })

        loader('https://api.map.baidu.com/getscript?v=3.0&ak=4kAd64ClDcY1vGsgtLV9ODf7OZHUBfqn', (err) => {
          if (err) {
            this.$message.error('地图加载失败，请重试')
            loading.close()
            return false
          }

          const { BMap, BMAP_STATUS_SUCCESS } = window
          const geolocation = new BMap.Geolocation()

          geolocation.getCurrentPosition((res) => {
            const status = geolocation.getStatus()
            if (status === BMAP_STATUS_SUCCESS) {
              console.log('baidu geolocation: ', res.point)
              this.$axios
                .post('/common/clock-in', res.point)
                .then(({ data, msg }) => {
                  console.log('系统打卡，距离偏移：', data.meter)
                  this.$message.success(msg)
                })
                .catch(() => {})
                .then(() => {
                  loading.close()
                })
            } else {
              console.error('geolocation.getCurrentPosition error', status)
              let errMsg = '获取地理位置信息不成功'

              switch (status) {
              case window.BMAP_STATUS_PERMISSION_DENIED:
                errMsg = '获取地理位置被禁用'
                break
              case window.BMAP_STATUS_SERVICE_UNAVAILABLE:
                errMsg = '服务不可用'
                break
              case window.BMAP_STATUS_UNKNOWN_LOCATION:
                errMsg = '未知位置信息'
                break
              case window.BMAP_STATUS_TIMEOUT:
                errMsg = '获取地理位置超时'
                break
              default:
              }

              this.$message.error(`系统打卡失败：${errMsg}`)
              loading.close()
            }

            return true
          }, { enableHighAccuracy: true })

          return true
        })

        return true
      },

      toggleUserDropdown() {
        this.showUserDropdown = !this.showUserDropdown
      },

      closeUserDropdown() {
        this.showUserDropdown = false
      },
    },
  }
</script>
