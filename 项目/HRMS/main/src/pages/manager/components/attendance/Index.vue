<template>
  <div class="page">
    <m-breadcrumb :items="breadcrumb" />

    <Board />

    <Statistics />

  </div>
</template>

<script>
  import Board from './Board'
  import Statistics from './Statistics'

  export default {
    name: 'Attendance',

    components: {
      Board,
      Statistics,
    },

    data() {
      return {
        breadcrumb: [
          { name: '经理自助', to: '/attendance' },
          { name: '考勤管理' },
        ],
      }
    },
  }
</script>
