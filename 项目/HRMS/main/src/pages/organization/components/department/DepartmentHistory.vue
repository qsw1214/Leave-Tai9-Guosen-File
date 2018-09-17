<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="page page__department_history">

    <!-- 面包屑，固定层级 -->
    <m-breadcrumb :items="breadcrumb" />

    <!-- 内容部分 -->
    <m-section
      v-for="(detData, index) in list"
      :class="{ 'section-top': !index }"
      :autotest="'item-'+ index"
      :key="detData.id">
      <m-section-row>
        <m-section-cell
          title="生效日期"
          :content="getDate(detData.valid_date)" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="组织编码"
          :content="detData.code" />

        <m-section-cell
          title="组织名称"
          :content="detData.name" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="简称"
          :content="detData.short_name" />

        <m-section-cell
          title="上级组织"
          :content="detData.pname" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="组织层级"
          :content="detData.level_name" />

        <m-section-cell
          title="组织属性"
          :content="
            1 > detData.flag || detData.line === undefined
              ? ''
              : dictionary.flagList[detData.flag].label
          " />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="组织类型"
          :content="
            1 > detData.type || detData.line === undefined
              ? ''
              : dictionary.typeList[detData.type].label
          " />

        <m-section-cell
          title="所属成本中心"
          :content="detData.legal_entity_name" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="负责人"
          :content="detData.leader_name" />

        <m-section-cell
          title="分管领导"
          :content="detData.charge_name" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="部门编制"
          :content="(detData.emp_count || 0) + '人'" />

        <m-section-cell
          title="所属条线"
          :content="
            1 > detData.line || detData.line === undefined
              ? ''
              : dictionary.lineList[detData.line].label
          " />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="联系人"
          :content="detData.contacts_name" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="地址信息"
          :content="detData.address.replace(/\n/g, '<br>')" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="部门职责说明书"
          :content="detData.remark.replace(/\n/g, '<br>')" />
      </m-section-row>
    </m-section>
  </div>
</template>

<script>
  export default {
    name: 'DepartmentHistory',
    data() {
      return {
        loading: false,
        list: [],
      }
    },
    computed: {
      dictionary() {
        return this.$utils.config.dictionary.org
      },
      ajaxPath() {
        return this.$api.organization.org
      },
      breadcrumb() {
        const defaultBC = [
          { name: '组织管理' },
          { name: '组织维护', to: '/query' },
          { name: '变更记录' },
        ]
        if (!this.$route.query.name) return defaultBC

        const name = {
          name: this.$route.query.name,
          to: {
            name: 'Department',
            params: Object.assign({}, this.$route.params),
            query: Object.assign({}, this.$route.query),
          },
        }

        defaultBC.splice(2, 0, name)
        return defaultBC
      },
    },
    watch: {
      $route() {
        this.getRouteChange()
      },
    },
    created() {
      this.getRouteChange()
    },
    methods: {
      getRouteChange() {
        if (this.$route.params.id) this.getList()
      },
      async getList() {
        if (!this.$route.params.id) return

        // 获取数据
        this.loading = true
        try {
          const { data: detData } = await this.$axios
            .post(this.ajaxPath.history, { id: this.$route.params.id })
          this.list = detData.list
          this.loading = false
        } catch (err) {
          this.loading = false
          console.log(err)
        }
      },
      getDate(v) {
        return !v
          ? ''
          : this.$utils.tools.formatDate(new Date(v), 'YYYY-MM-DD')
      },
    },
  }
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
.page__department_history {
  .m-section:not(.section-top) {
    margin-top: 50px;
  }
}
</style>
