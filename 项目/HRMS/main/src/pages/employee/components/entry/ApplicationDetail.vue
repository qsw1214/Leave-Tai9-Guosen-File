<template>
  <section
    v-loading.fullscreen.lock="loading"
    class="page page--application-business__card">

    <m-breadcrumb :items="breadcrumb" />

    <entry-form :data="detail" />

    <logs-and-path :data="logsAndPath" />

    <StatusButton />
  </section>
</template>

<script>
  import mixins from '~employee/mixins'
  import LogsAndPath from '@/components/logsAndPath'
  import EntryForm from '../common/EntryForm'
  import StatusButton from './StatusButton'

  export default {
    name: 'ToEntryApplication',

    components: {
      LogsAndPath,
      EntryForm,
      StatusButton,
    },

    mixins: [mixins.application, mixins.flow, mixins.breadcrumb],

    data() {
      return {
        breadcrumb: [
          { name: '员工服务' },
          { name: '入职管理', to: '/entry/application' },
          { name: '我已发起', to: '/entry/approved' },
        ],
      }
    },

    methods: {
      fetch() {
        this
          .getInfo()
          .then(({ data }) => {
            const name = data.flow_form_data.rsrzgl_name
            this.breadcrumb.push({ name })
            this.getLogsAndPath()
              .then(() => {})
              .catch(() => {})
          })
      },
    },
  }
</script>
