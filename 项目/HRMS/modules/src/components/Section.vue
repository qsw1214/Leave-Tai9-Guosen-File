<template>
  <div
    class="container section"
    style="max-width:1280px">
    <m-section
      title="营业执照信息"
      :data="data">
      <m-section-row>
        <m-section-cell
          title="生效日期"
          prop="date" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="地址"
          prop="address" />
        <m-section-cell
          title="经营范围"
          prop="scope" />
      </m-section-row>
    </m-section>
  </div>
</template>

<script>
  export default {
    name: 'Section',
    data() {
      return {
        data: {
          date: '2017-12-01',
          address: '深圳市罗湖区红岭中路1012号国信证券大厦2221123楼1200989号-12098889号',
          scope: '证券经纪；证券投资咨询；与证券交易，证券投资活动有关的财务顾问；证券承销与保荐；证券自营；证券资产管理；融资融券；证券投资基金代销；金融产品代销；为期货公司提供中间介绍业务；证券投资基金托管业务。股票期权做市。',
        },

        form: {
          user: '',
          region: '',
        },
      }
    },
  }
</script>

<style lang="scss" scoped>
  .section {
    margin: 10px;
  }
</style>
