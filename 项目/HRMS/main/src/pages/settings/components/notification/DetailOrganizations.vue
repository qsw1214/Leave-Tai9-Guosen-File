<template>
  <m-section-row>
    <el-tree
      class="tree"
      default-expand-all
      node-key="id"
      ref="tree"
      :data="tree"
      :props="treeProps"
      :indent="16"
      :filter-node-method="filter"
      :default-checked-keys="checkedKeys" />
  </m-section-row>
</template>

<script>
  export default {
    name: 'NotificationOrganizations',

    props: {
      tree: {
        type: Array,
        required: true,
      },
      checked: {
        type: Array,
        required: true,
      },
    },

    data() {
      return {
        treeProps: {
          children: 'children',
          label: 'name',
        },
      }
    },

    computed: {
      expandedTreeKeys() {
        return this.tree.map(item => item.id)
      },

      checkedKeys() {
        return this.checked.map(item => item.id)
      },
    },

    mounted() {
      this.$nextTick(() => {
        this.$refs.tree.filter()
      })
    },

    methods: {
      filter(value, data) {
        return this.checkedKeys.includes(data.id)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .tree {
    border: 1px solid #e5e5e5;
    margin-right: 15px;
  }
</style>

