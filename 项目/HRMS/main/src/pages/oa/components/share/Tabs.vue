<template>
  <section class="tabs">
    <el-tabs
      type="border-card"
      :value="activeName"
      @tab-click="link">
      <el-tab-pane
        name="warehouse"
        label="资料仓库"
        v-if="$permission.valid('1070005')">
        <slot name="warehouse" />
      </el-tab-pane>

      <el-tab-pane
        name="mine"
        label="我的资料"
        v-if="$permission.valid('1070006')">
        <slot name="mine" />
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
  export default {
    name: 'Tabs',

    props: {
      activeName: {
        type: String,
        default: '',
      },
    },

    created() {
    },

    methods: {
      link(components) {
        const { name } = components
        this.$router.push(name)
      },
    },
  }
</script>
