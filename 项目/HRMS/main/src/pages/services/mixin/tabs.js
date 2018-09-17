const mixin = (name) => {
  const res = {
    created() {
      let upperName = name.split('')
      upperName[0] = upperName[0].toUpperCase()
      upperName = upperName.join('')

      this.$store.dispatch(`fetch${upperName}TabsBadge`)
    },

    computed: {
      tabs() {
        return this.$store.state[name].tabs
      },
    },
  }

  return res
}


export default {
  attendance: mixin('attendance'),
}
