
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
        title="差旅归属"
        prop="kqcc_line_name" />

      <m-section-cell
        title="差旅类型"
        prop="kqcc_type_name" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="开始时间"
        :content="beginTime" />

      <m-section-cell
        title="结束时间"
        :content="endTime" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="出差天数"
        :content="`${data.kqcc_day_num / 2}天`" />

      <m-section-cell
        title="预算类型"
        prop="kqcc_fee_type_name" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="预算金额"
        :content="`${Number(data.kqcc_fee).toFixed(2)}元`" />

      <m-section-cell
        title="区域范围"
        prop="kqcc_district_type_name" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="交通方式"
        :content="traffic" />

      <m-section-cell
        title="客户名称"
        prop="kqcc_customer_name" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="联系人姓名"
        prop="kqcc_contact_name" />

      <m-section-cell
        title="联系人电话"
        prop="kqcc_contact_mobile" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="目的地"
        prop="kqcc_target_place" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="差旅目的"
        prop="kqcc_target" />
    </m-section-row>

    <m-section-row>
      <m-section-cell
        title="参与人员">
        <m-tag-multiple
          :attrs="attrs"
          :data="data.kqcc_entourage_users"
          @more="more" />
      </m-section-cell>

      <m-section-cell
        title="性别构成">
        <span>{{ combineWith }}</span>
      </m-section-cell>
    </m-section-row>

    <m-tags-dialog
      title="参与人员"
      :tags="tempTags"
      :table-column="['emp_code', 'name', 'sex_name']"
      :table-head="['员工ID', '员工姓名', '性别']"
      :show-tags-dialog="showTagsDialog"
      @close="close" />
  </m-section>
</template>

<script>
  export default {
    name: 'BusinessTravelForm',

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
        return `${this.data.kqcc_start_date} ${this.data.kqcc_start_date_time_name}`
      },

      endTime() {
        return `${this.data.kqcc_end_date} ${this.data.kqcc_end_date_time_name}`
      },

      traffic() {
        if (this.data.kqcc_traffic_type_names) {
          return this.data.kqcc_traffic_type_names.map(item => item.value).join('、')
        }
        return ''
      },

      combineWith() {
        const employee = this.data.kqcc_entourage_users || []
        const boys = employee.filter(item => item.sex === 1)
        const girls = employee.filter(item => item.sex === 2)
        const boyNum = boys.length
        const girlNum = girls.length

        if (girlNum && boyNum) {
          return `${boyNum}男${girlNum}女`
        } else if (boyNum) {
          return `${boyNum}男`
        } else if (girlNum) {
          return `${girlNum}女`
        }

        return '--'
      },
    },

    methods: {
      more(tags) {
        this.showTagsDialog = true
        tags.forEach((item) => {
          if (Number(item.sex) === 1) item.sex_name = '男'
          else item.sex_name = '女'
        })
        this.tempTags = [].concat(tags)
      },

      close() {
        this.showTagsDialog = false
      },
    },
  }
</script>
