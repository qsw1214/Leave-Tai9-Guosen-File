<template>
  <ul class="list">
    <li
      class="list--item"
      v-for="(item, index) in items"
      :key="index"
      @click="jump(item)">
      <div class="list--item-title">{{ item.title }}</div>
      <div class="list--item-meta">
        <span class="department">{{ item.org_name }}</span>
        <span class="date">{{ item.date }}</span>
      </div>
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'ItemList',
    props: {
      items: {
        type: Array,
        required: true,
      },
    },

    methods: {
      jump(item) {
        this.$emit('jump', item)
      },
    },
  }
</script>
