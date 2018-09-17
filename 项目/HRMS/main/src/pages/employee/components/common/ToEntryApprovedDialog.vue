<template>
  <el-dialog
    title="审批记录详情"
    width="660"
    :visible.sync="show"
    :close="close">
    <template v-if="!loading">
      <div
        v-for="(item, index) in data"
        :key="index">
        <component
          :ref="'view'+index"
          :result="item"
          :style-object="styleObject"
          :title="'审批表单-'+item.approvaler_name"
          :is="currentView(item)" />
      </div>
    </template>

    <div
      class="loading--wrap"
      v-else>
      <i class="el-icon-loading" />
    </div>
    <div
      class="dialog-footer"
      slot="footer">
      <el-button
        type="primary"
        @click="close">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import mixins from '~employee/mixins'
  import GTApprovedForm from '../toEntry/approved/GTApprovedForm'
  import RSApprovedForm from '../toEntry/approved/RSApprovedForm'
  import YYApprovedForm from '../toEntry/approved/YYApprovedForm'
  import ZPApprovedForm from '../toEntry/approved/ZPApprovedForm'
  import PAApprovedForm from '../toEntry/approved/PAApprovedForm'

  export default {
    name: 'ToEntryApprovedDialog',

    components: {
      GTApprovedForm,
      RSApprovedForm,
      YYApprovedForm,
      ZPApprovedForm,
      PAApprovedForm,
    },

    mixins: [mixins.formType.toEntryApproved],

    data() {
      return {
        show: false,
        loading: true,
        data: null,
        styleObject: { fontSize: '14px' },
      }
    },

    watch: {
      show() {
        this.fetch()
      },
    },

    methods: {
      close() {
        this.show = false
      },

      fetch() {
        if (this.data) return
        this.loading = true
        this.$axios
          .get(this.$api.employee.flow.approvalLogNodes, {
            params: { id: this.$route.params.id },
          })
          .then(({ data }) => {
            this.data = data.list
          })
          .catch(() => {})
          .then(() => {
            this.loading = false
          })
      },

      currentView(item) {
        const { approval_form_type: type } = item
        return this.formType[type] || 'PAApprovedForm'
      },
    },
  }
</script>

<style scoped lang="scss">
  .loading--wrap {
    text-align: center;

    .el-icon-loading {
      font-size: 40px;
      margin-top: 100px;
    }
  }
</style>
