<template>
  <div
    :style="{
      height:divHeight,
      zIndex:zIndex
    }">
    <div
      :class="className"
      :style="{
        top: stickyTop + 'px',
        zIndex: zIndex,
        position: position,
        boxShadow: active ? boxShadow : '0px',
        width: width,
        height: divHeight
      }">
      <slot>
        <div>sticky</div>
      </slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Sticky',

    props: {
      stickyTop: {
        type: Number,
        default: 0,
      },

      zIndex: {
        type: Number,
        default: 1,
      },

      className: {
        type: String,
        default: '',
      },
    },

    data() {
      return {
        active: false,
        position: '',
        currentTop: '',
        width: undefined,
        height: undefined,
        child: null,
        stickyHeight: 0,
        boxShadow: '0px 2px 10px 4px rgba(0,0,0, .1)',
      }
    },

    computed: {
      divHeight() {
        return `${this.height}px`
      },
    },

    mounted() {
      this.calcHeight()
      window.addEventListener('scroll', this.handleScroll)
    },

    activated() {
      this.handleScroll()
    },

    destroyed() {
      window.removeEventListener('scroll', this.handleScroll)
    },

    methods: {
      calcHeight() {
        // this.$el.style.height = 'auto'
        this.height = this.$el.getBoundingClientRect().height
        console.log(this.height)
      },

      sticky() {
        if (this.active) {
          return
        }
        this.position = 'fixed'
        this.active = true
        this.width = `${this.width}px`
      },

      reset() {
        if (!this.active) {
          return
        }
        this.position = ''
        this.width = 'auto'
        this.active = false
      },

      handleScroll() {
        this.width = this.$el.getBoundingClientRect().width
        const offsetTop = this.$el.getBoundingClientRect().top
        if (offsetTop <= this.stickyTop) {
          this.sticky()
          return
        }
        this.reset()
      },
    },
  }
</script>
