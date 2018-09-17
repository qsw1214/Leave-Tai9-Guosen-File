<template>
  <el-row v-if="status">
    <el-col
      class="row--cell"
      v-if="status == 94 || status == 92"
      :span="24">
      <el-button
        type="primary"
        :loading="btn_loading"
        @click="reSubmit">提交</el-button>
      <el-button
        type="info"
        @click="onCancle">取消</el-button>
    </el-col>
    <el-col
      class="row--cell"
      v-if="status == 93"
      :span="24">
      <span style="color: #f00;">Tips:审批节点不存在/已离职/已退休/已锁定，系统无法自动发起，请调整审批链设置后手动提交。</span>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: 'StatusButton',
    data() {
      return {
        status: this.$route.query.status,
        btn_loading: false,
      }
    },
    methods: {
      reSubmit() {
        this
          .$confirm('是否重新提交？', '提示', {
            type: 'warning',
          })
          .then(() => {
            this.submitPost()
          })
          .catch(() => {})
      },

      submitPost() {
        const url = '/flow/edit'
        const { id } = this.$route.params
        this.btn_loading = true
        const params = this.$parent.info.flow_form_data

        this.$axios
          .post(url, {
            id,
            status: '30',
            flow_form_data: JSON.stringify(params),
          })
          .then((res) => {
            const { status, message } = res.data
            const success = Number(status) !== 92
            if (success) {
              this.$message({
                type: 'success',
                message: '提交成功！',
                duration: 2000,
                onClose: () => {
                  this.$router.replace('/entry/application')
                },
              })
            } else {
              this.$utils.tools.messageHandler(message, () => {
                this.$router.replace('/entry/application')
              })
            }
          })
          .catch(() => {
            this.btn_loading = false
          })
      },

      onCancle() {
        this.$router.go(-1)
      },
    },
  }
</script>

