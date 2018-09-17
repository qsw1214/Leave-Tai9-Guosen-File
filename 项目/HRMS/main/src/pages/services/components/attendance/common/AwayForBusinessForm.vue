
<template>
  <m-section
    title="申请表单"
    :data="data">
    <m-section-row>
      <m-section-cell
        title="流程编码"
        prop="code" />

      <m-section-cell
        title="申请日期"
        prop="apply_date" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="流程状态"
        prop="status_name" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="外出类型"
        prop="kqygwc_type_name" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="开始时间"
        :content="beginTime" />

      <m-section-cell
        title="结束时间"
        :content="endTime" />
    </m-section-row>

    <template v-if="data.kqygwc_type == '1' || data.kqygwc_type == '2' || data.kqygwc_type == '4'">
      <m-section-row>
        <m-section-cell
          title="客户姓名"
          prop="kqygwc_customer_name"
          :span="12" />

        <m-section-cell
          title="客户电话"
          prop="kqygwc_customer_mobile"
          :span="12" />
      </m-section-row>

      <m-section-row v-if="data.kqygwc_type != '2'">
        <m-section-cell
          title="客户代码"
          prop="kqygwc_customer_code"
          v-if="data.kqygwc_type != '2'" />

        <m-section-cell
          title="业务类型"
          prop="kqygwc_business_type"
          v-if="data.kqygwc_type == '4'" />
      </m-section-row>
    </template>

    <template
      v-if="
        data.kqygwc_type == '8'
          || data.kqygwc_type == '16'
          || data.kqygwc_type == '32'
      ">
      <m-section-row>
        <m-section-cell
          title="企业名称"
          prop="kqygwc_enterprise_name"
          v-if="data.kqygwc_type == '32'"
          :span="12"/>

        <m-section-cell
          title="公司名称"
          prop="kqygwc_company_name"
          v-else
          :span="12"/>

        <m-section-cell
          title="联系人姓名"
          prop="kqygwc_contact_name"
          :span="12" />
      </m-section-row>

      <m-section-row>
        <m-section-cell
          title="联系人电话"
          prop="kqygwc_contact_mobile"
          :span="12" />

        <m-section-cell
          title="联系人职位"
          prop="kqygwc_contact_job"
          v-if="data.kqygwc_type != '8'"
          :span="12" />
      </m-section-row>
    </template>

    <m-section-row v-if="data.kqygwc_type !='4' && data.kqygwc_type != '8'">
      <m-section-cell
        title="拜访地点"
        prop="kqygwc_meeting_place" />
    </m-section-row>

    <m-section-row v-if="data.kqygwc_type =='4' || data.kqygwc_type == '8'">
      <m-section-cell
        title="办理地点"
        prop="kqygwc_handling_place" />
    </m-section-row>

    <m-section-row v-if="data.kqygwc_type != '4' && data.kqygwc_type != '8'">
      <m-section-cell
        title="详细事由"
        prop="kqygwc_detail_reason" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="陪同人员">
        <m-tag-multiple
          :attrs="attrs"
          :data="data.kqygwc_entourage_users"
          @more="more" />
      </m-section-cell>
    </m-section-row>

    <m-tags-dialog
      title="陪同人员"
      :tags="tempTags"
      :table-column="['emp_code', 'name']"
      :table-head="['员工ID', '员工姓名']"
      :show-tags-dialog="showTagsDialog"
      @close="close" />
  </m-section>
</template>

<script>
  // 1-拜访名下客户 2-拜访潜在客户 4-陪客户办理业务 8-市内上市公司调研 16-渠道拜访 32-企业客户拜访 1024-其他
  export default {
    name: 'AwayForBusinessForm',

    props: {
      data: {
        type: Object,
        default: () => ({}),
      },
    },

    data() {
      return {
        attrs: [
          'name',
          {
            key: 'emp_code',
            all: true,
            render: (item) => {
              const { emp_code } = item
              return `(${emp_code})`
            },
          },
        ],
        showTagsDialog: false,
        tempTags: [],
      }
    },

    computed: {
      beginTime() {
        return `${this.data.kqygwc_start_date} ${this.data.kqygwc_start_date_time_name}`
      },

      endTime() {
        return `${this.data.kqygwc_end_date} ${this.data.kqygwc_end_date_time_name}`
      },
    },

    methods: {
      more(tags) {
        this.showTagsDialog = true
        this.tempTags = [].concat(tags)
      },

      close() {
        this.showTagsDialog = false
      },
    },
  }
</script>
