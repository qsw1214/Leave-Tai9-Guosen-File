<template>
  <div
    class="m-approval m-approval__empty"
    v-if="!data || !data.length">
    暂无审批记录
  </div>

  <el-steps
    class="m-approval"
    v-else
    :active="data.length">

    <el-step
      v-for="(step, index) in data"
      :key="index"
      :class="{ 'is-reject': step.approval_status === 4 }"
      :icon="step.approval_status === 4 ? 'el-icon-error' : ''"
      :title="step.approval_status_name">
      <template slot="description">
        <strong class="m-approval--name">{{ step.approvaler_name }}</strong>
        <span class="m-approval--subject">{{ step.approval_subject }}</span>
        <span class="m-approval--date">{{ getDate(step.approval_time) }}</span>
        <span class="m-approval--time">{{ getTime(step.approval_time) }}</span>
      </template>
    </el-step>

  </el-steps>
</template>

<script>
  export default {
    name: 'ApprovalSteps',

    props: {
      data: {
        type: Array,
        required: true,
        default() { return [] },
      },
    },

    methods: {
      getDate(val) {
        return val.split(' ')[0]
      },

      getTime(val) {
        return val.split(' ')[1]
      },
    },
  }
</script>

<style lang="scss" type="text/scss">
  .m-approval {
    &__empty {
      padding: 14px 20px;
    }

    &.el-steps {
      margin: 14px 20px -6px;
      flex-wrap: wrap;
    }

    .el-step {
      max-width: 120px;
      width: 120px;
      min-width: 100px;
      margin-bottom: 20px;

      &__head {
        margin-top: 22px;
        margin-bottom: 8px;
      }

      &__line {
        top: 14px !important;
      }

      &__icon {
        height: 30px;
        width: 30px;

        &.is-text {
          background-color: #20a0ff;
          color: #fff;
          border: 0;
        }

        &.is-icon {
          .el-step__icon-inner {
            font-size: 30px;
          }
        }
      }

      &__title {
        font-size: 14px;
        position: absolute;
        top: 0;
        left: 0;
        line-height: 1;
      }

      &__description {
        > span {
          color: #999;
          display: block;
          line-height: 1.5;
        }
      }

      &.is-reject {
        .el-step__head {
          color: #ff4949;
        }

        .el-step__title {
          color: #ff4949;
        }
      }
    }

    .is-center {
      .el-step__title {
        right: 0;
        text-align: center;
      }
    }

    &--name {
      color: #333;
      display: block;
      font-weight: 400;
    }
  }
</style>
