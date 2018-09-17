<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="page page-adjust page-adjust-merge">

    <m-breadcrumb :items="breadcrumb" />

    <div class="content">
      <m-section :data="form">
        <m-section-row>
          <m-section-cell
            title="合并方案名称"
            prop="name" />

          <m-section-cell
            title="生效日期"
            prop="valid_date" />
        </m-section-row>

        <m-section-row>
          <m-section-cell
            prop="reason"
            title="合并原因" />
        </m-section-row>

        <m-section-row>
          <m-section-cell
            prop="content"
            title="合并内容" />
        </m-section-row>
      </m-section>

      <m-section
        class="disabled"
        v-for="(item, index) in snapshotOrganizations"
        :key="index">

        <div class="merge-panel merge-panel--detail">
          <div class="page-adjust--box">
            <div class="page-adjust--box-item">
              <label class="page-adjust--box-label">被合并的组织：</label>
              <ul class="merge-panel--merge-organizations">
                <li
                  v-for="(m, index) in item.merge"
                  :key="index">
                  <el-select
                    disabled
                    placeholder=""
                    v-model="m.key">
                    <el-option
                      :label="m.label"
                      :value="m.key" />
                  </el-select>
                </li>
              </ul>
            </div>

            <div class="page-adjust--box-item spliter">
              <m-icon-next />
            </div>

            <div class="page-adjust--box-item">
              <label class="page-adjust--box-label">接收组织：</label>
              <el-select
                disabled
                placeholder=""
                v-model="item.accept.key">
                <el-option
                  :label="item.accept.label"
                  :value="item.accept.key" />
              </el-select>
            </div>
          </div>
        </div>
      </m-section>

    </div>
  </div>
</template>

<script>
  /**
   * @description 组织合并详情
   * @route '/adjust/split'
   */
  export default {
    name: 'AdjustSplit',
    data() {
      return {
        breadcrumb: [
          { name: '组织管理' },
          { name: '组织调整', to: '/adjust' },
          { name: '组织合并' },
        ],
        loading: false,

        // 快照组织
        snapshotOrganizations: [],
        form: {},

        // 被合并组织所选择的组织id
        mergeIds: [],

        // 接收组织所选择的组织id
        acceptIds: [],

        // 选择合并组织列表
        mergeList: [
          {
            merge: [],
            accept: '',
            // 初始数据，用于编辑状态赋值
            initData: null,
            errorMessage: '',
          },
        ],
      }
    },

    created() {
      this.fetch()
    },

    methods: {
      fetch() {
        this.loading = true
        this.$axios({
          url: '/workorder/get-detail-snap',
          params: {
            id: this.$route.params.id,
          },
        }).then(({ data }) => {
          this.form = Object.assign({}, this.form, data)
          this.form.operation_mark.forEach((item) => {
            const obj = {
              merge: [],
              accept: {
                key: '0',
                label: item.to.pname,
              },
            }

            item.from.org_names.forEach((name) => {
              obj.merge.push({
                label: name,
                key: '0',
              })
            })

            this.snapshotOrganizations.push(obj)
          })
        }).catch(() => {}).then(() => {
          this.loading = false
        })
      },
    },
  }
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  .page-adjust-merge {
    .merge-panel--detail {
      .page-adjust--box-label {
        padding-left: 0;
      }

      .merge-panel--merge-organizations {
        flex: 1;
      }
    }
  }
</style>
