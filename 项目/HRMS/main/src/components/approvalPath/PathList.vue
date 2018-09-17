<template>
  <div
    class="m-approval-path--list"
    :class="classObject">

    <div class="path-title bg-primary">
      {{ title }}
      <template v-if="type_name">({{ type_name }})</template>
    </div>
    <div class="path-list">
      <sub-list
        v-for="(item, index) in approvaler_list"
        :key="index"
        :data="item" />
    </div>

    <m-icon-next />

  </div>
</template>

<script>
  import SubList from './SubPathList'

  export default {
    name: 'ApprovalPathList',
    components: { SubList },

    props: {
      data: {
        type: Object,
        required: true,
      },
    },

    data() {
      return {
        ...this.data,
      }
    },

    computed: {
      classObject() {
        const { is_current, approvaler_list } = this
        let classname = ''

        if (is_current === 1) return 'is-current'

        approvaler_list.some((item) => {
          if (item.is_approval === 4) {
            classname = 'is-reject'
            return true
          }

          return false
        })

        return classname
      },
    },
  }
</script>

<style lang="scss" type="text/scss">
  .m-approval-path {
    &--list {
      padding: 0 25px;
      position: relative;
      width: 24%;
      margin-bottom: 30px;

      &:last-child {
        .m-icon-next {
          display: none;
        }
      }
    }

    .path-title {
      border-radius: 5px;
      color: #fff;
      font-size: 16px;
      font-weight: 500;
      text-align: center;
      line-height: 36px;
      margin-bottom: 12px;
    }

    .path-list {
      border: 1px solid #dbdbdb;
      border-radius: 3px;
    }

    .m-icon-next {
      position: absolute;
      margin-right: 0;
      right: -10px;
      top: 8px;
    }

    .is-reject,
    .is-current {
      & ~ .m-approval-path--list {
        .path-title {
          background-color: #c0ccda;
        }
      }
    }
  }
</style>
