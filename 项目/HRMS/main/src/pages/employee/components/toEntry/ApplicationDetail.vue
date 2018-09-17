<template>
  <section
    v-loading.fullscreen.lock="loading"
    class="page page--application-business__card">
    <m-breadcrumb :items="breadcrumb" />

    <to-entry-form :data="detail" />

    <logs-and-path :data="logsAndPath" />
  </section>
</template>

<script>
  import mixins from '~employee/mixins'
  import LogsAndPath from '@/components/logsAndPath'
  import ToEntryForm from '../common/ToEntryForm'

  export default {
    name: 'ToEntryApplication',

    components: {
      LogsAndPath,
      ToEntryForm,
    },

    mixins: [mixins.application, mixins.flow, mixins.breadcrumb],

    data() {
      return {
        breadcrumb: [
          { name: '员工管理' },
          { name: '待入职管理', to: '/to-entry/application' },
          { name: '已发起的', to: '/to-entry/application' },
        ],
      }
    },

    methods: {
      fetch() {
        this
          .getInfo()
          .then(({ data }) => {
            const name = data.flow_form_data.rsdrzgl_name
            this.breadcrumb.push({ name })
            this.getLogsAndPath()
              .then(() => {})
              .catch(() => {})
          })
      },
    },
  }
</script>
