<template>
  <index-item
    title="待办待阅"
    is-list
    :uri="$api.index.index.todo"
    @jump="jump" />
</template>

<script>
  import IndexItem from './IndexItem'
  import map from './todoMap'

  export default {
    name: 'Todo',
    components: { IndexItem },

    methods: {
      jump({ id, status, type, quote_id }) {
        // 非流程根据 type 判断需不需要通知后端
        // refer to: http://gitlab.gxtr9.com:8980/t9/hr/wikis/消息类型表
        const notifyList = [100001, 100002]
        const isReport = !status ||
          (status && ['94', '93', '99', '90'].includes(status)) ||
          notifyList.includes(type)

        if (isReport) {
          console.log('report todo: ', id)
          this.markAsRead(id).then(() => {
            this.jumpAction({ type, status, quote_id })
          })
        } else {
          this.jumpAction({ type, status, quote_id })
        }
      },

      jumpAction({ type, status, quote_id }) {
        const path = this.$utils.env === 'development' ? '' : '/web'
        const from = encodeURIComponent(`${path}/index.html#/index`)
        let uri = path

        if (typeof map[type] === 'string') {
          if (type === 100002) uri += map[type]
          else uri += `${map[type]}/${quote_id}`
        } else if (typeof map[type] === 'object') {
          // eslint-disable-next-line prefer-destructuring
          uri += map[type].uri
          uri = uri.replace('{{status}}', map[type].status[status])
          uri += `/${quote_id}`
        }

        uri += `?status=${status}&from=${from}`
        window.location.href = uri
      },

      markAsRead(id) {
        return this.$axios
          .post(
            this.$api.index.index.readed,
            { id },
            { showProgressBar: false }
          )
      },
    },
  }
</script>
