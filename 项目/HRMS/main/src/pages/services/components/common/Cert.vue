<!-- eslint-disable max-len -->
<template>
  <section class="cert">
    <div class="cert--content">
      <h2>{{ title }}</h2>
      <div
        class="edit"
        v-if="isEdit">
        <template v-if="type === '1'">
          <b class="unit">{{ form.rszm_work_unit }}</b><b v-if="form.rszm_work_unit">:</b>
          <p class="body">兹证明<span>{{ data.name }}</span>性别：<span>{{ data.sex_name }}</span>身份证号码：<span>{{ data.credential_num }}</span> 系本单位员工，于 <span>{{ data.enter_date | toCNDate }}</span>
            入职 <span>{{ data.finance_attribute }}</span>(该营业部归属于国信证券股份有限公司深圳泰九分公司），该员工在本单位工资月收入人民币<span>{{ form.rszm_money }}</span>元（金额大写人民币： <span>{{ form.rszm_money | digitUppercase }}</span> ），本收入证明仅限于本人申请<span>{{ form.rszm_userful }}</span>使用，本单位不承担任何法律责任。</p>
        </template>
        <template v-if="type === '2'">
          <p class="body">兹证明<span>{{ data.name }}</span>， 身份证号码： <span>{{ data.credential_num }}</span>， 于  <span>{{ data.enter_date | toCNDate }}</span>入职 <span>{{ data.finance_attribute }}</span>(该营业部归属于国信证券股份有限公司深圳泰九分公司)，任职 <span>{{ data.job_name }}</span>。本证明仅限于其本人办理 <span>{{ form.rszm_userful }}</span>，请予以支持。</p>
        </template>
        <template v-if="type === '4'">
          <p class="body">兹有<span>{{ form.rszm_school_name }}</span>,<span>{{ form.rszm_name }}</span>身份证号码：<span>{{ form.rszm_credential_num }}</span>, 在我单位<span>{{ form.rszm_org_name }}</span>实习，实习期<span>{{ form.rszm_begin_date | toCNDate }}</span>至 <span>{{ form.rszm_end_date | toCNDate }}</span>
            该生实习期间表现优秀，完全能够胜任本职岗位的工作。现在该生在我单位已经实习结束。
          </p>
        </template>
        <div class="footer">
          <p class="left">特此证明</p>
          <p class="right">{{ data.finance_attribute }}<br><span class="date">{{ date }}</span></p>
        </div>
      </div>
      <div
        class="detail"
        v-else>
        <template v-if="type === '1'">
          <b class="unit">{{ form.rszm_work_unit }}</b><b v-if="form.rszm_work_unit">:</b>
          <p class="body">兹证明<span>{{ form.rszm_applier_name }}</span>性别：<span>{{ form.rszm_applier_sex_name }}</span>身份证号码：<span>{{ form.rszm_applier_credential_num }}</span> 系本单位员工，于 <span>{{ form.rszm_applier_enter_date }}</span>
            入职 <span>{{ form.rszm_applier_finance_attribute }}</span>(该营业部归属于国信证券股份有限公司深圳泰九分公司），该员工在本单位工资月收入人民币<span>{{ form.rszm_money }}</span>元（金额大写人民币： <span>{{ form.rszm_money | digitUppercase }}</span> ），本收入证明仅限于本人申请<span>{{ form.rszm_userful }}</span>使用，本单位不承担任何法律责任。</p>
        </template>
        <template v-if="type === '2'">
          <p class="body">兹证明<span>{{ form.rszm_applier_name }}</span>， 身份证号码： <span>{{ form.rszm_applier_credential_num }}</span>，于<span>{{ form.rszm_applier_enter_date }}</span>入职 <span>{{ form.rszm_applier_finance_attribute }}</span>(该营业部归属于国信证券股份有限公司深圳泰九分公司)，任职 <span>{{ form.rszm_applier_job_name }}</span>。本证明仅限于其本人办理 <span>{{ form.rszm_userful }}</span>，请予以支持。</p>
        </template>
        <template v-if="type === '4'">
          <p class="body">兹有<span>{{ form.rszm_school_name }}</span>,<span>{{ form.rszm_name }}</span>身份证号码：<span>{{ form.rszm_credential_num }}</span>, 在我单位<span>{{ form.rszm_org_name }}</span>实习，实习期<span>{{ form.rszm_begin_date | toCNDate }}</span>至 <span>{{ form.rszm_end_date | toCNDate }}</span>
            该生实习期间表现优秀，完全能够胜任本职岗位的工作。现在该生在我单位已经实习结束。
          </p>
        </template>
        <div class="footer">
          <p class="left">特此证明</p>
          <p class="right">{{ form.rszm_applier_finance_attribute }}<br><span class="date">{{ form.rszm_applier_apply_date }}</span></p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'Cert',
    filters: {
      toCNDate(val) {
        if (!val) return ''
        return `${val.replace('-', '年').replace('-', '月')}日`
      },
    },
    props: {
      data: {
        type: Object,
        default: () => ({}),
      },
      form: {
        type: Object,
        default: () => ({}),
      },
      isEdit: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        test: '',
        date: this.$utils.tools.formatDate(new Date().getTime(), null, true),
      }
    },
    computed: {
      type() {
        return this.form.rszm_type
      },
      title() {
        return { 1: '收入证明', 2: '在职证明', 4: '实习证明' }[this.form.rszm_type]
      },
    },
  }
</script>

<style lang="scss" rel="text/scss">
  .cert {
    background-color: #fff;
    border: 1px solid #e9e9e9;
    margin-top: 14px;
    margin-bottom: 14px;
    padding: 0 20px 20px;
    font-size: 14px;
    color: #333;

    .unit {
      color: #74a8f8;
      text-decoration: underline;
    }

    h2 {
      text-align: center;
      font-size: 18px;
      line-height: 1;
      margin-top: 32px;
      margin-bottom: 32px;
    }

    p.body {
      text-indent: 2em;
      line-height: 1.875;

      span {
        min-width: 20px;
        margin: 0 3px;
        text-decoration: underline;
        color: #74a8f8;
      }
    }

    div.footer {
      margin-top: 18px;
      font-weight: bold;

      .right {
        text-align: right;
      }
    }

    p.date {
      text-align: right;
      margin-top: 10px;
      margin-bottom: 0;
    }
  }
</style>
