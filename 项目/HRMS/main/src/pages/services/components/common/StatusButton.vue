<template>
  <el-row v-if="status">
    <el-col
      class="row--cell"
      v-if="status == 91"
      :span="24">
      <el-button
        type="primary"
        :loading="btn_loading"
        @click="onConfirm">确认</el-button>
      <el-button
        type="info"
        @click="onCancle">取消</el-button>
    </el-col>
    <el-col
      class="row--cell"
      v-if="status == 93"
      :span="24">
      <span style="color: #f00;">Tips:此流程已经作废无法再提交，需重新发起。</span>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: 'StatusButton',

    props: {
      path: {
        type: String,
        // 默认自助服务流程发起
        default: '/application/index',
      },
      module: {
        type: String,
        // 1-员工服务,2-考勤管理
        // 高危字段 感觉接口层面还有其他流程设置大类
        default: '1',
      },
    },

    data() {
      return {
        status: this.$route.query.status,
        btn_loading: false,
      }
    },

    methods: {
      onConfirm() {
        const url = this.$api.services.pa.approval
        const { id } = this.$route.params
        this.btn_loading = true

        this
          .$axios
          .post(url, {
            id,
            step: 32,
          })
          .then(() => {
            this
              .$store
              .dispatch('update_unread_message', {
                type: 1,
                ids: id,
                module: this.module,
              })
              .then(() => {
                this.$message({
                  type: 'success',
                  message: '成功确认该流程。',
                  duration: 2000,
                  onClose: () => {
                    const { from } = this.$route.query
                    if (from) window.location.href = from
                    else this.$router.push(this.path)
                  },
                })
              })
              .then(() => {
                this.btn_loading = false
              })
          })
          .catch((error) => {
            console.log(error)
          })
          .then(() => {
            this.btn_loading = false
          })
      },
      onCancle() {
        const { from } = this.$route.query
        if (from) window.location.href = from
        else this.$router.go(-1)
      },
    },
  }
</script>

