<template>
  <div class="page page--index">
    <div class="page--index-left-side">
      <user />
      <todo />
      <notification />
      <navigator />
    </div>

    <div class="page--index-right-side">
      <calendar />
      <flow />
    </div>
  </div>
</template>

<script>
  import User from './index/UserInfo'
  import Todo from './index/Todo'
  import Notification from './index/Notification'
  import Navigator from './index/Navigator'
  import Flow from './index/Flow'
  import Calendar from './index/Calendar'

  export default {
    name: 'Index',
    components: {
      User,
      Todo,
      Notification,
      Navigator,
      Flow,
      Calendar,
    },
  }
</script>

<style lang="scss">
  .page--index {
    display: flex;

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    &-item {
      border: 1px solid #e9e9e9;
      background-color: #fff;
      position: relative;
      margin-bottom: 14px;
    }

    &-left-side {
      flex: 1;
      margin-right: 14px;
    }

    &-right-side {
      width: 372px;
    }
  }
</style>
