<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="page page-adjust">

    <m-breadcrumb :items="breadcrumb" />

    <m-section :data="form">
      <m-section-row>
        <m-section-cell
          title="调整方案名称"
          prop="name" />

        <m-section-cell
          title="生效日期"
          prop="valid_date" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          prop="reason"
          title="调整原因" />

        <m-section-cell
          prop="content"
          title="调整内容" />
      </m-section-row>
    </m-section>

    <m-section>
      <div class="page-adjust--box">
        <div class="page-adjust--box-item">
          <el-select
            disabled
            v-model="snapshot.changeName">
            <el-option
              :label="snapshot.changeName"
              :value="snapshot.changeName" />
          </el-select>
        </div>

        <div class="page-adjust--box-item spliter" />

        <div class="page-adjust--box-item">
          <el-select
            disabled
            placeholder=""
            v-model="snapshot.acceptName">
            <el-option
              :label="snapshot.acceptName"
              :value="snapshot.acceptName" />
          </el-select>
        </div>
      </div>

      <div class="transfer-container disabled">
        <el-transfer
          ref="transfer"
          v-model="transferValues"
          :data="transfer" />

        <div
          class="btn-hack is-disabled">
          <el-button
            class="botton-right"
            disabled
            plain>
            <m-icon-next />
          </el-button>
          <el-button
            class="botton-left"
            disabled
            plain>
            <m-icon-next />
          </el-button>
        </div>
      </div>
    </m-section>
  </div>
</template>

<script>
  /**
   * @description 上级组织变更详情
   * @route '/adjust/higher/detail/:id?'
   */

  export default {
    name: 'AdjustHigherDetail',
    data() {
      return {
        breadcrumb: [
          { name: '组织管理' },
          { name: '组织调整', to: '/adjust' },
          { name: '上级组织变更' },
        ],
        loading: false,
        form: {},
        transfer: [],
        transferValues: [],
        snapshot: {},
      }
    },
    created() {
      this.getSnapshot()
    },
    methods: {
      // 获取快照信息
      getSnapshot() {
        this.loading = true
        this.$axios({
          url: '/workorder/get-detail-snap',
          params: {
            id: this.$route.params.id,
          },
        })
          .then(({ data }) => {
            this.snapshot = Object.assign({}, this.snapshot, data)
            this.snapshot.changeName = this.snapshot.operation_mark.from.pname
            this.snapshot.acceptName = this.snapshot.operation_mark.to.pname
            this.form = this.snapshot

            this.snapshot.operation_mark.from.org_names.forEach((item, index) => {
              this.transfer.push({
                key: `from-${index}`,
                label: item,
                disabled: true,
              })
            })

            this.snapshot.operation_mark.to.org_names.forEach((item, index) => {
              const key = `to-${index}`
              this.transfer.push({
                key,
                label: item.name,
                disabled: true,
              })
              this.transferValues.push(key)
              if (item.origin === 'from') {
                this.$nextTick(() => {
                  this.$refs.transfer.rightChecked.push(key)
                })
              }
            })
          })
          .catch(() => {})
          .then(() => {
            this.loading = false
          })
      },
    },
  }
</script>
