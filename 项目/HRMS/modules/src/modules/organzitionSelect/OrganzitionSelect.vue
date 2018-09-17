<template>
  <div
    v-loading="loading"
    class="m-organzition-selection">
    <el-tree
      node-key="id"
      highlight-current
      show-checkbox
      ref="selected"
      key="orgs"
      :default-expand-all="defaultExpandAll"
      :default-expanded-keys="defaultExpandedKeys"
      :data="orgs"
      :props="treeProps" />
  </div>
</template>

<script>
  export default {
    name: 'MOrganzitionSelect',

    props: {
      inputOptions: {
        type: Array,
        default: () => [],
      },
      defaultExpandString: {
        type: String,
        default: '2',
      },
    },

    data() {
      let defaultExpandAll
      switch (this.defaultExpandString) {
      case '0':
        defaultExpandAll = false
        break
      case '1':
        defaultExpandAll = true
        break
      case '2':
        defaultExpandAll = false
        break
      default:
      }

      return {
        orgs: [],
        treeProps: {
          label: 'name',
        },
        loading: false,
        defaultExpandAll,
        defaultExpandedKeys: [],
      }
    },

    watch: {
      inputOptions() {
        this.init()
      },
    },

    created() {
      this.init()
    },

    methods: {
      init() {
        if (!this.inputOptions.length) {
          this.fetch()
        } else {
          this.orgs = [].concat(this.inputOptions)
          this.setDefaultExpandeKeys()
        }
      },

      fetch() {
        const validate = this.$utils.tools
          .formatDate(new Date(), 'YYYY-MM-DD')
        this.loading = true

        this
          .$axios
          .post(this.$api.common.organizationLevel, {
            validate,
          })
          .then(({ data }) => {
            this.orgs = [data]
            this.setDefaultExpandeKeys()
          })
          .catch((error) => {
            console.dir(error)
          })
          .then(() => {
            this.loading = false
          })
      },

      setDefaultExpandeKeys() {
        if (this.defaultExpandString === '2') {
          const { id } = this.orgs[0]
          this.defaultExpandedKeys.push(id)
        }
      },
    },
  }
</script>

<style lang="scss">
.m-organzition-selection {
  .el-tree {
    border: 1px solid #e2e2e2;
  }
}
</style>
