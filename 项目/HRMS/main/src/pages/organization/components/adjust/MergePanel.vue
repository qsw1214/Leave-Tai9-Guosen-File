<template>
  <div class="merge-panel">
    <div class="page-adjust--box">
      <div class="page-adjust--box-item">
        <label class="page-adjust--box-label">被合并的组织</label>
        <ul class="merge-panel--merge-organizations">
          <li
            v-for="(item, index) in merges"
            :key="index">
            <m-cascader
              store-name="orgMergePanelMergeSelect"
              change-on-select
              :organization.sync="item.id"
              :value-disabled="mergeIds"
              :show-all-levels="false"
              :width="260"
              @change="callback" />

            <div class="merge-panel--icon-wrap">
              <el-button
                type="text"
                icon="el-icon-circle-plus"
                v-if="index === merges.length - 1"
                @click="addMerge" />

              <el-button
                type="text"
                class="error"
                icon="el-icon-circle-close"
                v-if="merges.length > 1"
                @click="removeMerge(index)" />
            </div>
          </li>
        </ul>
      </div>

      <div class="page-adjust--box-item spliter">
        <m-icon-next style="padding-left: 16px;" />
      </div>

      <div class="page-adjust--box-item">
        <label
          style="padding-left: 20px;"
          class="page-adjust--box-label">接收组织</label>
        <m-cascader
          store-name="orgMergePanelAcceptSelect"
          change-on-select
          :organization.sync="accept"
          :value-disabled="acceptDisabled"
          :show-all-levels="false"
          :width="260"
          @change="callback" />
      </div>
    </div>

    <el-button
      class="new-organization"
      plain
      @click="toCreateOrganization">新建组织？</el-button>
  </div>
</template>

<script>
  /*
   * 合并组织选择项
   */

  export default {
    name: 'OrganizationMergePanel',
    props: {
      // 索引值
      renderKey: {
        required: true,
        type: Number,
      },
      /*
       * 合并项数据
       * @example {
       *  merge: [], // 被合并id
       *  accept: '', // 接收组织id
       * }
       */
      // initData
      data: {
        type: Object,
        default: () => ({}),
      },
      // 被合并组织的所有id
      mergeIds: {
        required: true,
        type: Array,
      },
      // 接收组织的所有id
      acceptIds: {
        required: true,
        type: Array,
      },
    },
    data() {
      return {
        // 接收组织禁选id
        acceptDisabled: [],
        // 接收组织选择id
        accept: '',
        // 被合并id
        merges: [{ id: '' }],
      }
    },
    watch: {
      data(newVal) {
        if (newVal) {
          this.updateData()
        }
      },
    },
    created() {
      if (this.data) {
        this.updateData()
      }
    },
    methods: {
      // 初始数据处理
      updateData() {
        this.accept = this.data.accept
        if (this.data.merge.length > 0) {
          this.merges = this.data.merge.map(id => ({
            id,
            disabled: [],
          }))
        }
      },
      // 新增被合并组织
      addMerge() {
        this.merges.push({ id: '' })
      },
      // 移除被合并组织
      removeMerge(index) {
        this.merges.splice(index, 1)
        this.callback()
      },
      // 合并项发生修改回调父组件
      callback() {
        const mergeIds = this.merges.map(item => item.id)
        this.$emit('change', {
          accept: this.accept,
          merge: mergeIds,
          renderKey: this.renderKey,
        })
      },
      // 跳转至创建组织
      toCreateOrganization() {
        this.$emit('jump')
      },
    },
  }
</script>
