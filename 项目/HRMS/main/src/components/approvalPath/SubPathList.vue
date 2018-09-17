<template>
  <div
    class="m-approval-path--item"
    :class="itemClass">

    <div class="m-approval-path--item-icon">
      <i
        v-if="icon"
        :class="icon" />
    </div>
    <div class="m-approval-path--item-content">
      <h4 class="m-approval-path--item-name">{{ name }}</h4>
      <p class="m-approval-path--item-org">{{ org_name }}</p>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'ApprovalPathSubList',

    props: {
      data: {
        type: Object,
        required: true,
      },
    },

    data() {
      return { ...this.data }
    },

    computed: {
      itemClass() {
        const { is_approval } = this.data
        if (is_approval === 2 || is_approval === 4) return 'is-approve'
        return ''
      },

      icon() {
        const { is_approval } = this.data

        if (is_approval === 2) return 'el-icon-success color-primary'
        else if (is_approval === 4) return 'el-icon-error color-error'

        return null
      },
    },
  }
</script>

<style lang="scss" type="text/scss">
  .m-approval-path {
    &--item {
      margin-left: 14px;
      border-bottom: 1px dashed #e5e5e5;
      padding: 8px 14px 8px 0;
      color: #999;
      display: flex;

      &:last-child {
        border-bottom: 0;
      }

      &-icon {
        margin-top: 10px;
        margin-right: 10px;
        width: 18px;

        i {
          font-size: 18px;
        }
      }

      &-content {
        flex: 1;
      }

      &-name {
        font-weight: 500;
        margin: 0;
      }

      &-org {
        margin: 0;
      }

      &.is-approve {
        .m-approval-path--item-name {
          color: #333;
        }
      }
    }
  }
</style>
