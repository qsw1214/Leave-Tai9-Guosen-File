<template>
  <el-dialog
    title="员工信息审核"
    class="employee--dialog"
    append-to-body
    fullscreen
    id="printable"
    :visible.sync="show"
    :close="close">

    <div
      class="dialog--content"
      v-if="!loading"
      ref="content">

      <!-- 头像和联系方式 -->
      <div class="userinfo--wrap">
        <div class="m-userinfo">
          <div class="m-userinfo--avatar">
            <div class="img">
              <img
                style="border-radius: 100%; width: 100px; height: 100px;"
                alt=""
                :src="avatar">
            </div>
          </div>
        </div>
      </div>

      <!-- 个人信息 -->
      <div
        class="info-title"
        ref="titleBase">
        <div class="line" />
        <div class="name">
          <div class="value">个人信息</div>
        </div>
        <a
          class="fold"
          :class="{'close' : fold.base_info}"
          @click="open('base_info')">
          {{ fold.base_info ? '折叠' : '展开' }}
        </a>
      </div>

      <div
        v-show="fold.base_info"
        ref="baseInfo">
        <m-section
          autotest="baseinfo"
          title="基本信息"
          :style-object="styleObject"
          :data="data.base_info">

          <m-section-row>
            <m-section-cell
              title="姓名"
              prop="name" />
            <m-section-cell
              title="姓名拼音"
              prop="name_pinyin" />
          </m-section-row>

          <m-section-row>
            <m-section-cell
              title="曾用名"
              prop="name_used" />
            <m-section-cell
              title="性别"
              prop="sex_name" />
          </m-section-row>

          <m-section-row>
            <m-section-cell
              title="出生日期"
              prop="birthday" />
            <m-section-cell
              title="年龄"
              prop="age" />
          </m-section-row>

          <m-section-row>
            <m-section-cell
              title="个人身份"
              prop="identity_name" />
            <m-section-cell
              title="民族"
              prop="nation" />
          </m-section-row>

          <m-section-row>
            <m-section-cell
              title="健身状况"
              prop="health_status_name" />
            <m-section-cell
              title="国籍"
              prop="nationality" />
          </m-section-row>

          <m-section-row>
            <m-section-cell
              title="籍贯"
              prop="hometown_name" />
            <m-section-cell
              title="出生地"
              prop="homeplace_name" />
          </m-section-row>

          <m-section-row>
            <m-section-cell
              title="户口性质"
              prop="hukou_nature_name" />
            <m-section-cell
              title="户口所在地"
              prop="hukou_district_name" />
          </m-section-row>

          <m-section-row>
            <m-section-cell
              title="星座"
              prop="constellation" />
            <m-section-cell
              title="血型"
              prop="blood_type" />
          </m-section-row>

          <m-section-row>
            <m-section-cell
              title="招聘渠道"
              prop="recruit_channel_name" />
            <m-section-cell
              title="招聘渠道具体说明"
              prop="recruit_channel_remark" />
          </m-section-row>

          <m-section-row>
            <m-section-cell
              title="政治面貌"
              prop="political_status_name" />
            <m-section-cell
              title="入党（团）日期"
              prop="entry_party_date" />
          </m-section-row>
        </m-section>

        <m-section
          autotest="credential"
          title="证件信息"
          :style-object="styleObject"
          :data="data.base_info">
          <m-section-row>
            <m-section-cell
              title="证件类型"
              prop="credential_type_name" />
            <m-section-cell
              title="证件号码"
              prop="credential_num" />
          </m-section-row>

          <m-section-row>
            <m-section-cell
              title="社保电脑号"
              prop="sb_num" />
            <m-section-cell
              title="公积金账号"
              prop="gjj_num" />
          </m-section-row>

          <m-section-row>
            <m-section-cell
              title="护照号"
              prop="passport_num" />
            <m-section-cell
              title="护照有效期"
              prop="passport_valided_date" />
          </m-section-row>

          <m-section-row>
            <m-section-cell
              title="证件保管人"
              prop="credential_keeper_name" />
          </m-section-row>
        </m-section>

        <m-section
          autotest="communication"
          title="通讯信息"
          :style-object="styleObject"
          :data="data.base_info">
          <m-section-row>
            <m-section-cell
              title="手机号码"
              prop="mobile" />
            <m-section-cell
              title="个人邮箱"
              prop="email" />
          </m-section-row>

          <m-section-row>
            <m-section-cell
              title="微信"
              prop="weixin_num" />
            <m-section-cell
              title="家庭地址"
              prop="family_address" />
          </m-section-row>

          <m-section-row>
            <m-section-cell
              title="家庭电话"
              prop="family_phone" />
            <m-section-cell
              title="紧急联系人"
              prop="urgent_person_name" />
          </m-section-row>

          <m-section-row>
            <m-section-cell
              title="紧急联系人电话"
              prop="urgent_person_phone" />
          </m-section-row>
        </m-section>

        <m-section
          autotest="bank"
          title="银行卡信息"
          :style-object="styleObject"
          :data="data.base_info">
          <m-section-row>
            <m-section-cell
              title="工行卡号"
              prop="gh_bank_num" />
            <m-section-cell
              title="建行卡号"
              prop="jh_bank_num" />
          </m-section-row>
        </m-section>
      </div>

      <!-- 履历信息 -->
      <div
        class="info-title"
        ref="titleResumeInfo">
        <div class="line" />
        <div class="name">
          <div class="value">履历信息</div>
        </div>
        <a
          class="fold"
          :class="{'close' : fold.resume_info}"
          @click="open('resume_info')">
          {{ fold.resume_info ? '折叠' : '展开' }}
        </a>
      </div>
      <div v-show="fold.resume_info">
        <m-section
          autotest="baseResumeInfo"
          title="基本履历信息"
          :style-object="styleObject"
          :data="data.resume_info">
          <m-section-row>
            <m-section-cell
              title="参加工作日期"
              prop="begin_work_date" />
            <m-section-cell
              title="工龄"
              prop="work_age" />
          </m-section-row>

          <m-section-row>
            <m-section-cell
              title="证券从业起始日期"
              prop="begin_broker_date" />
            <m-section-cell
              title="证券从业年限"
              prop="broker_work_year" />
          </m-section-row>
        </m-section>
      </div>

      <div v-show="fold.resume_info">
        <m-section
          autotest="resumeExperience"
          title="工作经历"
          :style-object="styleObject">

          <div
            class="m-section--border"
            v-for="(item, index) in data.resume_info.list"
            :autotest="'resume-item-' + index"
            :key="index">
            <m-section-row>
              <m-section-cell
                title="履历开始日期"
                :content="item.begin_date" />
              <m-section-cell
                title="履历终止日期"
                :content="item.end_date" />
            </m-section-row>
            <m-section-row>
              <m-section-cell
                title="工作单位"
                :content="item.work_unit" />
              <m-section-cell
                title="所在部门"
                :content="item.org_name" />
            </m-section-row>
            <m-section-row>
              <m-section-cell
                title="所任职位"
                :content="item.job_name" />
              <m-section-cell
                title="证明人"
                :content="item.reference" />
            </m-section-row>
            <m-section-row>
              <m-section-cell
                title="证明人电话"
                :content="item.reference_phone" />
              <m-section-cell
                title="离职原因"
                :content="item.quit_reason" />
            </m-section-row>
          </div>
        </m-section>
      </div>

      <!-- 学历信息 -->
      <div
        class="info-title"
        ref="titleEducationInfo">
        <div class="line" />
        <div class="name">
          <div class="value">
            学历信息
          </div>
        </div>
        <a
          class="fold"
          :class="{'close' : fold.education_info}"
          @click="open('education_info')">
          {{ fold.education_info ? '折叠' : '展开' }}
        </a>
      </div>

      <div v-show="fold.education_info">
        <m-section
          autotest="education"
          title="学习经历"
          :style-object="styleObject">

          <div
            class="m-section--border"
            v-for="(item, index) in data.education_info.list || []"
            :key="index"
            :autotest="'education-item-' + index">
            <m-section-row>
              <m-section-cell
                title="入学日期"
                :content="item.begin_date" />
              <m-section-cell
                title="毕业日期"
                :content="item.end_date" />
            </m-section-row>

            <m-section-row>
              <m-section-cell
                title="学校"
                :content="item.school_name" />
              <m-section-cell
                title="是否海外留学经历"
                :content="item.is_study_abroad_name" />
            </m-section-row>

            <m-section-row>
              <m-section-cell
                title="专业"
                :content="item.major" />
              <m-section-cell
                title="学历"
                :content="item.education_name" />
            </m-section-row>

            <m-section-row>
              <m-section-cell
                title="是否最高学历"
                :content="item.is_top_education_name" />
              <m-section-cell
                title="学位"
                :content="item.degree_name" />
            </m-section-row>

            <m-section-row>
              <m-section-cell
                title="是否最高学位"
                :content="item.is_top_degree_name" />
              <m-section-cell
                title="学习方式"
                :content="item.learning_style_name" />
            </m-section-row>
          </div>
        </m-section>
      </div>

      <!-- 家庭信息 -->
      <div
        class="info-title"
        ref="titleFamilyInfo">
        <div class="line" />
        <div class="name">
          <div class="value">家庭信息</div>
        </div>
        <a
          class="fold"
          :class="{'close' : fold.family_info}"
          @click="open('family_info')">
          {{ fold.family_info ? '折叠' : '展开' }}
        </a>
      </div>

      <div v-show="fold.family_info">
        <m-section
          autotest="family"
          title="配偶信息"
          :style-object="styleObject"
          :data="data.family_info">
          <m-section-row>
            <m-section-cell
              title="婚姻状况"
              prop="marriage_status_name" />
          </m-section-row>

          <template v-if="data.family_info.marriage_status == 2">
            <m-section-row>
              <m-section-cell
                title="配偶姓名"
                prop="spouse_name" />
              <m-section-cell
                title="配偶证件类型"
                prop="spouse_credential_type_name" />
            </m-section-row>

            <m-section-row>
              <m-section-cell
                title="配偶证件号码"
                prop="spouse_credential_num" />
              <m-section-cell
                title="配偶工作单位"
                prop="spouse_work_unit" />
            </m-section-row>

            <m-section-row>
              <m-section-cell
                title="配偶职务"
                prop="spouse_duty" />
              <m-section-cell
                title="配偶联系电话"
                prop="spouse_phone" />
            </m-section-row>

            <m-section-row>
              <m-section-cell
                title="是否有独生子女"
                prop="spouse_only_child_name" />
              <m-section-cell
                title="独生子女出生日期"
                prop="spouse_only_child_birthday" />
            </m-section-row>
          </template>
        </m-section>

        <div v-show="fold.family_info">
          <m-section
            autotest="familyMember"
            title="家庭信息"
            :style-object="styleObject">
            <div class="m-section--table">
              <el-table
                border
                stripe
                :data="data.family_info.list">
                <el-table-column
                  label="姓名"
                  align="center"
                  prop="name" />
                <el-table-column
                  label="与本人关系"
                  align="center"
                  prop="relationship_name" />
                <el-table-column
                  label="证件类型"
                  align="center"
                  prop="credential_type_name" />
                <el-table-column
                  label="证件号码"
                  width="180"
                  align="center"
                  prop="credential_num" />
                <el-table-column
                  label="工作单位"
                  align="center"
                  prop="work_unit" />
                <el-table-column
                  label="职务"
                  align="center"
                  prop="duty_name" />
                <el-table-column
                  label="联系电话"
                  align="center"
                  prop="phone" />
                <el-table-column
                  label="联系地址"
                  align="center"
                  prop="address" />
              </el-table>
            </div>
          </m-section>
        </div>
      </div>

      <!-- 资格信息 -->
      <div
        class="info-title"
        ref="titleExamInfo">
        <div class="line" />
        <div class="name">
          <div class="value">资格信息</div>
        </div>
        <a
          class="fold"
          :class="{'close' : fold.exam_info}"
          @click="open('exam_info')">
          {{ fold.exam_info ? '折叠' : '展开' }}
        </a>
      </div>
      <div v-show="fold.exam_info">
        <m-section
          autotest="exam"
          title="金融类考试信息"
          :style-object="styleObject">
          <div
            class="m-section--border"
            v-for="(item, index) in data.exam_info.finc_list"
            :key="index">
            <m-section-row>
              <m-section-cell
                title="金融资格考试类型"
                :content="item.type_name" />
              <m-section-cell
                title="金融类证书编号"
                :content="item.code" />
            </m-section-row>

            <m-section-row>
              <m-section-cell
                title="通过时间"
                :content="item.pass_date" />
            </m-section-row>

            <m-section-row>
              <m-section-cell
                title="备注"
                :content="item.remark" />
            </m-section-row>

            <div class="exam-table">
              <el-table
                border
                stripe
                :data="item.list || []">
                <el-table-column
                  label="通过科目"
                  align="center"
                  prop="subject" />
                <el-table-column
                  label="考试成绩"
                  align="center"
                  width="200"
                  prop="achievement" />
              </el-table>
            </div>
          </div>
        </m-section>

        <m-section
          autotest="broker"
          title="券商资格信息"
          :style-object="styleObject">
          <div class="m-section--table">
            <el-table
              border
              stripe
              :data="data.exam_info.broker_list">
              <el-table-column
                label="取得券商执业资格类型"
                align="center"
                width="280"
                prop="type_name" />
              <el-table-column
                label="券商资格类证书编号"
                align="center"
                width="240"
                prop="code" />
              <el-table-column
                label="取得券商资格时间"
                align="center"
                width="200"
                prop="pass_date" />
              <el-table-column
                label="备注"
                align="center"
                prop="remark" />
            </el-table>
          </div>
        </m-section>

        <m-section
          autotest="lang"
          title="语言水平证书"
          :style-object="styleObject">
          <div class="m-section--table">
            <el-table
              border
              stripe
              :data="data.exam_info.lang_list">
              <el-table-column
                label="语言"
                align="center"
                prop="language" />
              <el-table-column
                label="等级"
                align="center"
                width="240"
                prop="level" />
            </el-table>
          </div>
        </m-section>

        <m-section
          autotest="computer"
          title="计算机水平证书"
          :style-object="styleObject">
          <div class="m-section--table">
            <el-table
              border
              stripe
              :data="data.exam_info.computer_list">
              <el-table-column
                label="计算机水平"
                align="center"
                prop="level" />
              <el-table-column
                label="证书名称"
                align="center"
                width="240"
                prop="name" />
            </el-table>
          </div>
        </m-section>

        <m-section
          autotest="attchment"
          title="附件列表"
          :style-object="styleObject">
          <m-section-row style="padding-bottom: 20px;">
            <m-attachment
              :is-can-down-all="false"
              :is-can-preview="false"
              :data="data.attachments" />
          </m-section-row>
        </m-section>
      </div>
    </div>

    <div
      class="loading--wrap"
      v-else>
      <i class="el-icon-loading" />
    </div>

    <div slot="footer">
      <el-button
        type="primary"
        @click="close">关闭</el-button>
      <el-button
        type="primary"
        @click="print">打印</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'EmployeeBaseinfoDialog',

    props: {
      credentialNum: {
        type: String,
        required: true,
      },
      credentialType: {
        type: String,
        required: true,
      },
    },

    data() {
      return {
        show: false,
        loading: true,
        data: null,
        styleObject: {
          fontSize: '15px',
        },
        fold: {
          // 个人信息
          base_info: true,
          // 任职信息
          job_info: true,
          // 履历信息
          resume_info: true,
          // 学历信息
          education_info: true,
          // 家庭信息
          family_info: true,
          // 资格信息
          exam_info: true,
        },
      }
    },

    computed: {
      avatar() {
        return this.data.base_info.avatar_url
      },
    },

    watch: {
      show(newVal) {
        if (newVal) this.fetch()
      },
    },

    methods: {
      close() {
        this.show = false
      },

      print() {
        Object
          .keys(this.fold)
          .forEach((item) => {
            this.fold[item] = true
          })
        this.$nextTick(() => {
          window.print()
        })
      },

      fetch() {
        if (this.data) return
        this.loading = true
        this
          .$axios({
            url: this.$api.employee.toEntry.getEmployeeBaseinfo,
            params: {
              credential_num: this.credentialNum,
              credential_type: this.credentialType,
            },
          })
          .then((data) => {
            this.loading = false
            this.data = data.data
          })
          .catch(() => {
            setTimeout(() => {
              this.show = false
            }, 3000)
          })
      },

      open(type) {
        this.fold[type] = !this.fold[type]
      },
    },
  }
</script>

<style type="text/scss" lang="scss">
  .employee--dialog {
    .el-dialog__body {
      background: #f7f7f7;
      height: calc(100vh - 110px);
      padding: 0;
      overflow-y: scroll;

      .loading--wrap {
        text-align: center;

        .el-icon-loading {
          font-size: 40px;
          margin-top: 200px;
        }
      }
    }

    .el-dialog__title {
      font-weight: bold;
    }

    .dialog--content {
      width: 900px;
      margin: 0 auto;

      .m-section--border {
        border: 1px solid #e9e9e9;
        margin: 0 20px 22px 20px;

        &:first-child {
          margin-top: 18px;
        }
      }

      .m-section--table {
        margin: 18px 20px 22px 20px;
      }

      .exam-table {
        margin: 14px 20px 14px 20px;
      }

      .row-not-border {
        border: 0;
      }

      .info-title {
        padding: 31px 0 14px 0;
        position: relative;
        height: 17px;
        margin-top: 10px;

        .line {
          border-bottom: 1px solid #e1e1e1;
        }

        .name {
          bottom: 0;
          left: 50%;
          margin-left: -68px;
          position: absolute;
          font-size: 18px;
          width: 136px;
          padding: 0 10px;
          text-align: center;
          background-color: #f7f7f7;

          .value {
            background-color: #eaeaea;
            height: 34px;
            border-radius: 17px;
            line-height: 34px;
          }
        }

        .fold {
          position: absolute;
          font-size: 16px;
          line-height: 16px;
          height: 16px;
          background-color: #f7f7f7;
          right: -40px;
          bottom: 5px;
          width: 115px;
          padding-left: 20px;
          cursor: pointer;
          color: #333;

          &:hover {
            color: #5090f7;
          }

          &::before {
            content: ' ';
            position: absolute;
            width: 10px;
            height: 7px;
            left: 60px;
            top: 5px;
            background-repeat: no-repeat;
            background-size: 10px 7px;
            background-image: url(../../../assets/images/arrow_gray_down.png);
          }

          &.close {
            &::before {
              transform: rotate(180deg);
            }
          }
        }
      }

      .userinfo--wrap {
        margin-top: 14px;
        margin-bottom: 14px;
        background: #fff;
        border: 1px solid #e9e9e9;
        padding: 20px 0;
      }
    }

    .el-dialog__footer {
      text-align: center;
      padding: 15px;
      border-top: 1px solid #dadada;
    }
  }

  @media print {
    body {
      overflow: scroll;
    }

    .container {
      height: 0;
      visibility: hidden;
    }

    body * {
      visibility: hidden;
    }

    #printable {
      position: relative;
      height: auto;
    }

    #printable,
    #printable * {
      visibility: visible;
    }

    #printable .el-dialog.is-fullscreen {
      overflow: scroll;
    }

    #printable .el-dialog__body {
      height: auto;
      overflow-y: scroll;
      padding: 0;
      margin: 0;
    }

    #printable .el-dialog__body .dialog--content {
      height: auto;
      margin: 0;
      width: 100%;
    }

    #printable .el-dialog__footer,
    #printable .el-dialog__header,
    #printable .fold {
      visibility: hidden;
      display: none;
    }
  }
</style>
