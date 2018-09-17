<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="page">

    <m-breadcrumb :items="breadcrumb.concat([{ name: pageTitle }])" />

    <div v-if="!isCreate">
      <el-button
        v-permission="1010003"
        icon="el-icon-edit"
        type="primary"
        @click="clickEdit">编辑
      </el-button>
      <el-button
        v-permission="'1010003,1010004'"
        icon="el-icon-tickets"
        @click="clickHistory">
        查看变更记录
      </el-button>
      <el-button
        icon="el-icon-caret-left"
        :disabled="isPrev"
        @click="clickPrev">上一条
      </el-button>
      <el-button
        :disabled="isNext"
        @click="clickNext">下一条<i class="el-icon-caret-right el-icon--right" />
      </el-button>
    </div>

    <div v-if="isCreate" >
      <el-button
        v-permission="1010003"
        icon="el-icon-edit"
        type="primary"
        @click="clickEdit">编辑
      </el-button>
      <el-button
        v-permission="1010003"
        icon="el-icon-plus"
        @click="clickCreate">继续新建
      </el-button>
    </div>

    <m-section
      title="营业执照信息">
      <m-section-row>
        <m-section-cell
          title="生效日期"
          :content="data.yyzz_valid_date" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="统一社会信用代码"
          :content="data.yyzz_credit_code" />

        <m-section-cell
          title="主体类型"
          :content="data.yyzz_entity_type" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="法人名称"
          :content="data.yyzz_legal_name" />

        <m-section-cell
          title="负责人"
          :content="data.yyzz_charge" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="成立日期"
          :content="data.yyzz_es_date" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="经营场所"
          :content="(data.yyzz_address || '').replace(/\n/g, '<br>')" />
      </m-section-row>
    </m-section>

    <m-section
      title="经营许可证信息">
      <m-section-row>
        <m-section-cell
          title="生效日期"
          :content="data.jyxkz_valid_date" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="统一社会信用代码"
          :content="data.jyxkz_credit_code" />

        <m-section-cell
          title="注册资本"
          :content="data.jyxkz_capital" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="法人名称"
          :content="data.jyxkz_legal_name" />

        <m-section-cell
          title="负责人"
          :content="data.jyxkz_charge" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="经营场所"
          :content="(data.jyxkz_address || '').replace(/\n/g, '<br>')" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="业务范围"
          :content="(data.jyxkz_business_scope || '').replace(/\n/g, '<br>')" />
      </m-section-row>
    </m-section>

    <m-section
      title="附件">
      <m-section-row>
        <m-section-cell
          title="附件列表">
          <m-attachment :data="data.attachment_list" />
        </m-section-cell>
      </m-section-row>
    </m-section>
  </div>
</template>

<script>
  /**
   * @description 法人单位信息
   * @route /legalperson/details/:id
   * @routeQuery create，为 1 则表明创业成功回调
   */

  import { mapMutations, mapState } from 'vuex'
  import { legalPerson } from '~organization/store/mutationTypes'

  export default {
    name: 'LegalPersonDetails',
    data() {
      return {
        pageTitle: '法人信息',
        breadcrumb: [
          { name: '组织管理' },
          { name: '法人单位设置', to: '/legalperson' },
        ],
        loading: false,
        data: {},
        // 是否创建完跳转
        isCreate: false,
      }
    },
    computed: {
      ...mapState({
        current: state => state.legalPerson.current,
        list: state => state.legalPerson.list,
      }),
      detailsIndex() {
        let currentIndex = -1
        this.list.map((item, index) => {
          if (item.id === this.data.id) {
            currentIndex = index
          }
          return item
        })
        return currentIndex
      },
      isPrev() {
        if (this.list.length === 0) return true
        if (this.detailsIndex <= 0) return true
        return false
      },
      isNext() {
        if (this.list.length === 0) return true
        if (this.detailsIndex < 0 || this.detailsIndex === this.list.length - 1) return true
        return false
      },
    },
    created() {
      if (this.$route.params.id) {
        this.getData()
      }
      if (this.current && this.current.id === this.$route.params.id) {
        this.pageTitle = this.current.yyzz_legal_name
      }
      if (String(this.$route.query.create) === '1') {
        this.isCreate = true
      }
    },
    beforeRouteUpdate(to, from, next) {
      if (to.params.id !== this.data.id) {
        this.getData(to.params.id)
      }
      next()
    },
    methods: {
      ...mapMutations({
        updateCurrent: legalPerson.updateCurrent,
      }),
      /*
       * 获取修改数据
       * @params id {String} 为空则从 this.$route.params.id 读取
       */
      getData(id = this.$route.params.id) {
        if (this.current && this.current.id === id && this.current.attachment_list) {
          this.data = Object.assign({}, this.current)
          return
        }
        this.loading = true
        this.$axios({
          url: this.$api.organization.legalPersonDetials,
          params: {
            id,
          },
        }).then((data) => {
          switch (data.code) {
          case 0:
            this.updateCurrent(data.data)
            this.data = data.data
            this.pageTitle = data.data.yyzz_legal_name
            break
          default:
            this.$message({
              type: 'error',
              message: data.msg,
            })
            break
          }
          this.loading = false
        }).catch(() => {
        })
      },
      // 下载附件
      download(item) {
        this.$utils.tools.windowOpen(item.url)
      },
      // 点击编辑
      clickEdit() {
        const id = this.data.id || this.$route.params.id
        this.$router.push({
          path: `/legalperson/create/${id}`,
          query: {
            callback: 'details',
          },
        })
      },
      // 点击上一条
      clickPrev() {
        const prev = this.list[this.detailsIndex - 1]
        this.$router.push({
          path: `/legalperson/details/${prev.id}`,
        })
      },
      // 点击下一条
      clickNext() {
        const prev = this.list[this.detailsIndex + 1]
        this.$router.push({
          path: `/legalperson/details/${prev.id}`,
        })
      },
      // 点击重新创建
      clickCreate() {
        this.$router.push({
          path: '/legalperson/create',
        })
      },
      // 点击查看历史
      clickHistory() {
        this.$router.push({
          path: `/legalperson/history/${this.$route.params.id}`,
        })
      },
    },
  }
</script>
