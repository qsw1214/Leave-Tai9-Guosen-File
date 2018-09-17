<template>
  <div id="dashboard">
    <svg
      width="140"
      height="140"
      viewBox="0 0 140 140">
      <defs>
        <linearGradient
          x1="1"
          y1="0"
          x2="0"
          y2="0"
          id="gradient1">
          <stop
            offset="0%"
            stop-color="#5090F7" />
          <stop
            offset="100%"
            stop-color="#47CEFF" />
        </linearGradient>
      </defs>

      <g transform="matrix(0,-1,1,0,0,140)">
        <circle
          cx="70"
          cy="70"
          r="60"
          stroke-width="10"
          stroke="#FF8B5F"
          fill="none"
          stroke-dasharray="1069 1069" />
        <circle
          cx="70"
          cy="70"
          r="60"
          stroke-width="10"
          stroke="url('#gradient1')"
          fill="none"
          stroke-dasharray="0 1069" />
      </g>
    </svg>
  </div>
</template>

<script>

  export default {
    name: 'Dashboard',

    props: {
      precent: {
        required: true,
        type: Number,
        default: 0,
      },
      animation: {
        type: Boolean,
        default: false,
      },
    },

    watch: {
      /* eslint func-names: 0 */
      /* eslint object-shorthand: 0 */
      precent: function () {
        this.init()
      },
    },

    mounted() {
      this.init()
    },

    methods: {
      init() {
        const eleCircles = document.querySelectorAll('#dashboard circle')
        const circle = eleCircles[1]
        const perimeter = Math.PI * 2 * 60
        const morePerimeter = perimeter + 2000
        const distance = parseInt(perimeter * this.precent, 10)

        if (this.animation) {
          // todo 有需求再写了
        } else {
          circle.setAttribute('stroke-dasharray', `${distance} ${morePerimeter}`)
        }
      },
    },
  }
</script>
