<template>
  <div
    v-loading.fullscreen.lock="loading || fetchingOrganization"
    class="page page-adjust page-adjust--transfer">

    <m-breadcrumb :items="breadcrumb" />

    <m-section :data="formData">
      <m-section-row>
        <m-section-cell
          title="拆分方案名称"
          prop="name" />

        <m-section-cell
          title="生效日期"
          prop="valid_date" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          prop="reason"
          title="拆分原因" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          prop="content"
          title="拆分内容" />
      </m-section-row>
    </m-section>

    <m-section
      v-loading="fetchingOrganization"
      v-for="(panel, index) in panels"
      :key="index">

      <split-panel
        disabled
        v-if="panels && original && panel"
        :key="index"
        :index="index"
        :data-index="index"
        :date="formData.valid_date"
        :original="original"
        :source="source"
        :disabled-source="disabledSource"
        :disabled-level="disabledLevel"
        :panels="panels"
        :panel="panel" />
    </m-section>

    <template v-for="(panel, index) in snapshots">
      <m-section
        v-if="snapshots"
        :key="index">
        <snapshot-panel
          :panel="panel"
          :key="index" />
      </m-section>
    </template>

  </div>
</template>

<script>
  /**
   * @description 组织拆分
   * @route '/adjust/split'
   */

  import SplitPanel from './SplitPanel'
  import SnapshotPanel from './SplitSnapshot'

  export default {
    name: 'OrganizationSplit',
    components: { SplitPanel, SnapshotPanel },

    data() {
      // 默认组织拆分面板数据
      const defaultPanel = {
        from: {},
        to: [],
      }

      const { id, status } = this.$route.params
      const formData = { name: '', date: '', reason: '', content: '' }

      return {
        breadcrumb: [
          { name: '组织管理' },
          { name: '组织调整', to: '/adjust' },
          { name: '组织拆分' },
        ],
        formData,
        // 标记获取组织层级状态
        fetchingOrganization: false,
        // 原始组织数据
        original: null,
        // 被拆分组织数据，匹配对应多个接收数组 {Array}
        source: null,
        // 被拆分组织已选中列表
        disabledSource: [],
        // 被拆分组织已选中列表对应层级
        disabledLevel: [],

        snapshots: null,

        defaultPanel,
        // 拆分面板
        panels: null,

        // 方案 id
        id,
        // 方案状态
        status,
        loading: false,
        subLoading: false,

        // 是否已保存状态
        saved: false,
        // 是否前往新建组织页面
        isToCreated: false,
      }
    },

    mounted() {
      this.fetchSnap(this.id)
    },

    methods: {
      fetchSnap(id) {
        this.fetchingOrganization = true
        this.$axios.get(this.$api.organization.adjustSnap, { params: { id } })
          .then((res) => {
            const { data } = res

            this.formData = data
            this.status = data.status
            this.snapshots = data.operation_mark
          })
          .catch(() => {})
          .then(() => {
            this.fetchingOrganization = false
          })
      },
    },
  }
</script>
