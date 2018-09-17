<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="page">

    <m-breadcrumb :items="breadcrumb" />
    <user :data="info.applier_user_info" />
    <static-form :data="detail" />
    <transferir
      v-if="transferirData"
      :data="transferirData" />
    <logs-and-path :data="logsAndPath" />

  </div>
</template>

<script>
  import LogsAndPath from '@/components/logsAndPath'
  import mixins from '~employee/mixins'
  import User from '../common/User'
  import StaticForm from './common/Form'
  import Transferir from './common/Transferir'

  export default {
    name: 'EmployeeLeaveApplicationDetail',
    components: { User, LogsAndPath, StaticForm, Transferir },
    mixins: [mixins.flow, mixins.application, mixins.breadcrumb],

    data() {
      return {
        breadcrumb: [
          { name: '员工管理' },
          { name: '离职管理', to: '/leave/application' },
          { name: '已发起的', to: '/leave/application' },
        ],
      }
    },

    computed: {
      transferirData() {
        const { rslzgl_transfer } = this.info.flow_form_data
        return rslzgl_transfer
      },
    },

    methods: {
    },
  }
</script>
