<template>
  <div class="page">

    <m-breadcrumb :items="breadcrumb" />
    <user :data="info.applier_user_info" />
    <static-form :data="detail" />
    <logs-and-path :data="logsAndPath" />

  </div>
</template>

<script>
  import LogsAndPath from '@/components/logsAndPath'
  import mixins from '~employee/mixins'
  import User from '../common/User'
  import StaticForm from './common/Form'

  export default {
    name: 'EmployeeBecomeRegularApplicationDetail',
    components: { User, LogsAndPath, StaticForm },
    mixins: [mixins.flow, mixins.application, mixins.breadcrumb],

    data() {
      return {
        breadcrumb: [
          { name: '员工管理' },
          { name: '转正管理', to: '/become-regular/application' },
          { name: '已发起的', to: '/become-regular/application' },
        ],
      }
    },
  }
</script>
