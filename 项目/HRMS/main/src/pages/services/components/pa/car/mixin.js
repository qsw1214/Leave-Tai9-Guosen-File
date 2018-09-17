export default {
  props: {
    data: {
      type: Object,
      required: true,
    },

    serviceTypes: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      serviceType: this.data.clfw_type,
    }
  },

  methods: {
    changeServiceType() {
      this.$emit('changeServiceType', this.serviceType)
    },

    validate() {
      return this.$refs.form.validate()
    },
  },
}
