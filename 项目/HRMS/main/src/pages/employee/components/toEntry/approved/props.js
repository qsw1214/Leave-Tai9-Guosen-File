export default {
  props: {
    result: Object,

    title: {
      type: String,
      default: '审批表单',
    },

    styleObject: {
      type: Object,
      default: () => ({}),
    },
  },
}
