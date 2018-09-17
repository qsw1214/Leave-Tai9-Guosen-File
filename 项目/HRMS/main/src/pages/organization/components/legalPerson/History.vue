<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="page legal-person-history">

    <m-breadcrumb :items="breadcrumb" />

    <template v-for="(item, index) in data">
      <m-section
        title="营业执照信息"
        :class="{ 'section-top': index }"
        :key="index + '1'">
        <m-section-row>
          <m-section-cell
            title="生效日期"
            :content="item.yyzz_valid_date" />
        </m-section-row>

        <m-section-row>
          <m-section-cell
            title="统一社会信用代码"
            :content="item.yyzz_credit_code" />

          <m-section-cell
            title="主体类型"
            :content="item.yyzz_entity_type" />
        </m-section-row>

        <m-section-row>
          <m-section-cell
            title="法人名称"
            :content="item.yyzz_legal_name" />

          <m-section-cell
            title="负责人"
            :content="item.yyzz_charge" />
        </m-section-row>

        <m-section-row>
          <m-section-cell
            title="成立日期"
            :content="item.yyzz_es_date" />
        </m-section-row>

        <m-section-row>
          <m-section-cell
            title="经营场所"
            :content="item.yyzz_address.replace(/\n/g, '<br>')" />
        </m-section-row>
      </m-section>

      <m-section
        title="经营许可证信息"
        :key="index + '2'">
        <m-section-row>
          <m-section-cell
            title="生效日期"
            :content="item.jyxkz_valid_date" />
        </m-section-row>

        <m-section-row>
          <m-section-cell
            title="统一社会信用代码"
            :content="item.jyxkz_credit_code" />

          <m-section-cell
            title="注册资本"
            :content="item.jyxkz_capital" />
        </m-section-row>

        <m-section-row>
          <m-section-cell
            title="法人名称"
            :content="item.jyxkz_legal_name" />

          <m-section-cell
            title="负责人"
            :content="item.jyxkz_charge" />
        </m-section-row>

        <m-section-row>
          <m-section-cell
            title="经营场所"
            :content="item.jyxkz_address.replace(/\n/g, '<br>')" />
        </m-section-row>

        <m-section-row>
          <m-section-cell
            title="业务范围"
            :content="item.jyxkz_business_scope.replace(/\n/g, '<br>')" />
        </m-section-row>
      </m-section>

      <m-section
        title="附件"
        :key="index + '3'">
        <m-section-row>
          <m-section-cell
            title="附件列表">
            <m-attachment :data="item.attachment_list" />
          </m-section-cell>
        </m-section-row>
      </m-section>
    </template>
  </div>
</template>

<script>
  /**
   * @description 法人单位信息
   * @route /legalperson/details/:id
   */
  import { mapMutations, mapState } from 'vuex'
  import { legalPerson } from '~organization/store/mutationTypes'

  export default {
    name: 'LegalPersonHistory',
    data() {
      return {
        loading: false,
        pageTitle: '',
        annexs: [],
        id: '',
        data: [],
      }
    },
    computed: {
      ...mapState({
        current: state => state.legalPerson.current || {},
      }),
      breadcrumb() {
        const defaultBC = [
          { name: '组织管理' },
          { name: '法人单位设置', to: '/legalperson' },
          { name: '变更记录' },
        ]

        if (!this.id) return defaultBC

        const name = {
          name: this.pageTitle,
          to: {
            name: 'legal-person-details',
            params: { id: this.id },
          },
        }

        defaultBC.splice(2, 0, name)
        return defaultBC
      },
    },
    created() {
      this.pageTitle = this.current.yyzz_legal_name || ''
      this.id = this.$route.params.id
      this.getData()
    },
    methods: {
      ...mapMutations({
        updateCurrent: legalPerson.updateCurrent,
      }),
      // 获取修改数据
      getData() {
        this.loading = true
        this.$axios({
          url: this.$api.organization.legalPersonHistory,
          params: {
            id: this.$route.params.id,
          },
        }).then((data) => {
          switch (data.code) {
          case 0:
            this.data = data.data.list
            if (!this.pageTitle && data.data.list.length > 0) {
              this.updateCurrent(data.data.list[0])
              this.pageTitle = data.data.list[0].yyzz_legal_name
            }
            break
          default:
            this.$message({
              type: 'error',
              message: data.msg,
            })
            break
          }
          this.loading = false
        }).catch(() => {})
      },
      // 下载附件
      download(item) {
        this.$utils.tools.windowOpen(item.url)
      },
    },
  }
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
.legal-person-history {
  .section-top {
    margin-top: 50px;
  }
}
</style>
