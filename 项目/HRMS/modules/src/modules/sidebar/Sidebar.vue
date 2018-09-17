<template>
  <el-scrollbar
    tag="div"
    native
    class="m-sidebar">

    <a
      class="site-title"
      :href="indexURI">
      <!-- <img
        class="site-logo"
        src="@/../static/images/logo.png" > -->

      <!-- <logo class="site-logo" /> -->
    </a>

    <el-menu
      class="m-sidebar--menu"
      active-text-color="#ebebeb"
      ref="sidebar"
      :default-openeds="openeds"
      :unique-opened="true"
      :default-active="active"
      @open="open"
      @close="close"
      @select="select">

      <template v-for="(menu, i) in menus">
        <el-menu-item
          v-if="!menu.children || menu.children.length === 0"
          :key="i"
          :index="menu.index"
          :data-path="menu.path"
          :data-index="menu.index"
          @click="jump(menu)">
          <i :class="`menu-icon menu-icon--${menu.index}`" />
          <span slot="title">{{ menu.name }}</span>
        </el-menu-item>

        <el-submenu
          v-else
          :key="i"
          :index="menu.index">

          <template slot="title">
            <i :class="`menu-icon menu-icon--${menu.index}`" />
            <span>{{ menu.name }}</span>
          </template>


          <el-menu-item
            v-for="(child, j) in menu.children"
            :key="j"
            :data-index="child.index"
            :data-path="child.path"
            :index="`${menu.index}-${child.index}`"
            @click="jump(menu, child)">{{ child.name }}</el-menu-item>

        </el-submenu>
      </template>
    </el-menu>

  </el-scrollbar>
</template>

<script>
  /**
   * @description 公共边栏
   * @prop active {String}
   * @example <m-sidebar active="salary" />
   */

  // import Logo from './Logo'

  const { location } = window

  export default {
    name: 'MSidebar',
    // components: { Logo },

    props: {
      // 当前打开菜单
      current: {
        type: String,
        default: 'organization',
      },
    },

    data() {
      const configs = window.CONFIGS
      const menus = configs ? configs.menus : []

      return {
        indexURI: window.location.pathname.includes('/web')
          ? '/web/index.html'
          : '/index.html',
        menus,
        active: '',
        openeds: [this.current],
      }
    },

    created() {
      if (!this.menus || !this.menus.length) this.waitMenus()
    },

    methods: {
      // 等待菜单配置数据
      waitMenus() {
        const interval = setInterval(() => {
          const configs = window.CONFIGS

          if (configs) {
            this.menus = configs.menus
            this.updateActive()
            clearInterval(interval)
          }
        }, 100)
      },

      updateActive() {
        const { menus, current } = this
        let active = sessionStorage.getItem('ACTIVE_MENU') || ''

        if (active) {
          const indexes = active.split('-')

          if (indexes[0] !== current) active = ''
          // else if (indexes.length === 1) active = ''
          else if (indexes.length > 1 && menus.length) {
            let activeMenu = menus.filter(menu => menu.index === current)[0].children
            activeMenu = activeMenu.filter(menu => menu.index === indexes[1])

            const { path } = activeMenu[0]
            const regex = new RegExp(path)

            if (!regex.test(location.href)) active = ''
          }

          this.active = active
        }
      },

      open() {
        // key, keyPath
        // this.openeds = keyPath
      },

      close() {
        // close menu
      },

      select(index) {
        // select submenu
        this.active = index
        sessionStorage.setItem('ACTIVE_MENU', index)
      },

      jump(parent, child) {
        if (child) {
          if (parent.path === location.pathname) {
            // 相同模块，用 router 跳转
            this.$router.push(`${child.route}`)
          } else {
            location.href = child.path
          }
        } else if (parent.path !== location.pathname) {
          location.href = parent.path
        } else if (parent.path === location.pathname) {
          this.$router.push({ path: '/index' })
        }
      },
    },
  }
</script>
