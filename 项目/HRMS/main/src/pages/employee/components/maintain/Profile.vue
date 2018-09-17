<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="page page-employee-profile"
    ref="page">

    <m-breadcrumb :items="breadcrumb" />

    <div
      class="page--content"
      ref="content">
      <template v-if="init">
        <action-bar
          :is-info="isInfo"
          :id="id"
          :fold="fold"
          :is-created="isCreated"
          @toggleCollapse="open" />

        <!-- 头像和联系方式 -->
        <div class="userinfo--wrap">
          <m-userinfo
            :userinfo="userinfo" />
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
            :class="{'close' : fold.base_info, 'isInfo': isInfo}"
            @click="open('base_info')">
            {{ fold.base_info ? '折叠' : '展开' }}
          </a>
          <el-button
            v-permission="1030001"
            type="text"
            icon="el-icon-edit"
            v-if="!isInfo"
            @click="edit('base_info')">
            编辑
          </el-button>
        </div>
        <div
          v-show="fold.base_info"
          ref="baseInfo">
          <m-section
            autotest="baseinfo"
            title="基本信息">
            <m-section-row>
              <m-section-cell
                title="系统编码"
                :content="data.base_info.code" />
            </m-section-row>
            <m-section-row>
              <m-section-cell
                title="员工ID"
                :content="data.base_info.emp_code" />
              <m-section-cell
                title="姓名"
                :content="data.base_info.name" />
            </m-section-row>
            <m-section-row>
              <m-section-cell
                title="姓名拼音"
                :content="data.base_info.name_pinyin" />
              <m-section-cell
                title="曾用名"
                :content="data.base_info.name_used" />
            </m-section-row>
            <m-section-row>
              <m-section-cell
                title="经纪号"
                :content="data.base_info.broker_code" />
              <m-section-cell
                title="性别"
                :content="data.base_info.sex_name" />
            </m-section-row>
            <m-section-row>
              <m-section-cell
                title="出生日期"
                :content="data.base_info.birthday" />
              <m-section-cell
                title="年龄"
                :content="data.base_info.age" />
            </m-section-row>
            <m-section-row>
              <m-section-cell
                title="个人身份"
                :content="data.base_info.identity_name" />
              <m-section-cell
                title="民族"
                :content="data.base_info.nation" />
            </m-section-row>
            <m-section-row>
              <m-section-cell
                title="健身状况"
                :content="data.base_info.health_status_name" />
              <m-section-cell
                title="国籍"
                :content="data.base_info.nationality" />
            </m-section-row>
            <m-section-row>
              <m-section-cell
                title="籍贯"
                :content="data.base_info.hometown_name" />
              <m-section-cell
                title="出生地"
                :content="data.base_info.homeplace_name" />
            </m-section-row>
            <m-section-row>
              <m-section-cell
                title="户口性质"
                :content="data.base_info.hukou_nature_name" />
              <m-section-cell
                title="户口所在地"
                :content="data.base_info.hukou_district_name" />
            </m-section-row>
            <m-section-row>
              <m-section-cell
                title="星座"
                :content="data.base_info.constellation" />
              <m-section-cell
                title="血型"
                :content="data.base_info.blood_type" />
            </m-section-row>
            <m-section-row>
              <m-section-cell
                title="招聘渠道"
                :content="data.base_info.recruit_channel_name" />
              <m-section-cell
                title="招聘渠道具体说明"
                :content="data.base_info.recruit_channel_remark" />
            </m-section-row>
            <m-section-row>
              <m-section-cell
                title="薪资类别"
                :content="data.base_info.salary_type_name" />
              <m-section-cell
                title="政治面貌"
                :content="data.base_info.political_status_name"
                :span="12" />
            </m-section-row>
            <m-section-row
              v-if="
                data.base_info.political_status !== ''
                  && data.base_info.political_status !== 4
              ">
              <m-section-cell
                title="入党（团）日期"
                :content="data.base_info.entry_party_date"
                :span="12" />
            </m-section-row>
          </m-section>

          <m-section
            autotest="credential"
            title="证件信息">
            <m-section-row>
              <m-section-cell
                title="证件类型"
                :content="data.base_info.credential_type_name" />
              <m-section-cell
                title="证件号码"
                :content="data.base_info.credential_num" />
            </m-section-row>

            <m-section-row>
              <m-section-cell
                title="社保电脑号"
                :content="data.base_info.sb_num" />
              <m-section-cell
                title="公积金账号"
                :content="data.base_info.gjj_num" />
            </m-section-row>

            <m-section-row>
              <m-section-cell
                title="护照号"
                :content="data.base_info.passport_num" />
              <m-section-cell
                title="护照有效期"
                :content="data.base_info.passport_valided_date" />
            </m-section-row>

            <m-section-row>
              <m-section-cell
                title="证件保管人"
                :content="data.base_info.credential_keeper_name" />
            </m-section-row>
          </m-section>

          <m-section
            autotest="communication"
            title="通讯信息">
            <m-section-row>
              <m-section-cell
                title="手机号码"
                :content="data.base_info.mobile" />
              <m-section-cell
                title="短号"
                :content="data.base_info.mobile_short" />
            </m-section-row>

            <m-section-row>
              <m-section-cell
                title="个人邮箱"
                :content="data.base_info.email" />
              <m-section-cell
                title="内网邮箱"
                :content="data.base_info.email_inside" />
            </m-section-row>
            <m-section-row>
              <m-section-cell
                title="外网邮箱"
                :content="data.base_info.email_outside" />
              <m-section-cell
                title="微信"
                :content="data.base_info.weixin_num" />
            </m-section-row>

            <m-section-row>
              <m-section-cell
                title="办公电话"
                :content="data.base_info.office_phone" />
              <m-section-cell
                title="家庭地址"
                :content="data.base_info.family_address" />
            </m-section-row>

            <m-section-row>
              <m-section-cell
                title="家庭电话"
                :content="data.base_info.family_phone" />
              <m-section-cell
                title="紧急联系人"
                :content="data.base_info.urgent_person_name" />
            </m-section-row>

            <m-section-row>
              <m-section-cell
                title="紧急联系人电话"
                :content="data.base_info.urgent_person_phone" />
            </m-section-row>
          </m-section>

          <m-section
            autotest="bank"
            title="银行卡信息">
            <m-section-row>
              <m-section-cell
                title="工行卡号"
                :content="data.base_info.gh_bank_num" />
              <m-section-cell
                title="建行卡号"
                :content="data.base_info.jh_bank_num" />
            </m-section-row>
          </m-section>
        </div>

        <!-- 任职信息 -->
        <div
          class="info-title"
          ref="titleJobInfo">
          <div class="line" />
          <div class="name">
            <div class="value">任职信息</div>
          </div>
          <a
            class="fold"
            :class="{'close' : fold.job_info, 'isInfo': isInfo}"
            @click="open('job_info')">
            {{ fold.job_info ? '折叠' : '展开' }}
          </a>
          <el-button
            v-permission="1030001"
            type="text"
            icon="el-icon-edit"
            v-if="!isInfo"
            @click="edit('job_info')">
            编辑
          </el-button>
        </div>
        <div v-show="fold.job_info">
          <m-section
            autotest="baseJobInfo"
            title="基本任职信息">
            <m-section-row>
              <m-section-cell
                title="用友人员编码"
                :content="data.job_info.yonyou_code" />
              <m-section-cell
                title="进入集团日期"
                :content="data.job_info.enter_group_date" />
            </m-section-row>

            <m-section-row>
              <m-section-cell
                title="到职日期"
                :content="data.job_info.enter_date" />
              <m-section-cell
                title="工作所在地"
                :content="data.job_info.work_address_name" />
            </m-section-row>

            <m-section-row>
              <m-section-cell
                title="人员类别"
                :content="data.job_info.renyuan_type_name" />
              <m-section-cell
                title="最新到职日期"
                :content="data.job_info.job_valid_date" />
            </m-section-row>
          </m-section>
          <m-section
            autotest="baseJobExperience"
            title="任职经历">
            <div
              class="m-section--border"
              v-for="(item, index) in data.job_info.list"
              :key="index">
              <m-section-row>
                <m-section-cell
                  title="生效日期"
                  :content="item.valid_date" />
                <m-section-cell
                  title="操作类型"
                  :content="item.type_name" />
              </m-section-row>

              <m-section-row>
                <m-section-cell
                  title="操作原因"
                  :content="item.reason_name" />
                <m-section-cell
                  title="离职原因"
                  v-if="item.type == 2"
                  :content="item.quit_reason_name" />
              </m-section-row>

              <m-section-row v-if="item.type == 2">
                <m-section-cell
                  title="离职去向"
                  :content="item.quit_goto_name" />
                <m-section-cell
                  title="去向具体说明"
                  :content="item.quit_goto_explain" />
              </m-section-row>

              <m-section-row v-if="item.type == 2">
                <m-section-cell
                  title="离职面谈记录"
                  :content="item.quit_chat_record" />
              </m-section-row>

              <m-section-row v-if="item.type == 2">
                <m-section-cell
                  title="备注"
                  :content="item.remark" />
              </m-section-row>

              <m-section-row>
                <m-section-cell
                  title="部门"
                  :content="item.org_name" />
                <m-section-cell
                  title="职位"
                  :content="item.job_name" />
              </m-section-row>

              <m-section-row>
                <m-section-cell
                  title="职等"
                  :content="item.job_level" />
                <m-section-cell
                  title="职务类别"
                  :content="item.duty_type_name" />
              </m-section-row>

              <m-section-row>
                <m-section-cell
                  title="员工状态"
                  :content="item.status_name" />
              </m-section-row>
            </div>
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
            :class="{'close' : fold.resume_info, 'isInfo': isInfo}"
            @click="open('resume_info')">
            {{ fold.resume_info ? '折叠' : '展开' }}
          </a>
          <el-button
            v-permission="1030001"
            type="text"
            icon="el-icon-edit"
            v-if="!isInfo"
            @click="edit('resume_info')">
            编辑
          </el-button>
        </div>
        <div v-show="fold.resume_info">
          <m-section
            autotest="baseResumeInfo"
            title="基本履历信息">
            <m-section-row>
              <m-section-cell
                title="参加工作日期"
                :content="data.resume_info.begin_work_date" />
              <m-section-cell
                title="工龄"
                :content="data.resume_info.work_age" />
            </m-section-row>
            <m-section-row>
              <m-section-cell
                title="证券从业起始日期"
                :content="data.resume_info.begin_broker_date" />
              <m-section-cell
                title="证券从业年限"
                :content="data.resume_info.broker_work_year" />
            </m-section-row>
          </m-section>
        </div>
        <div v-show="fold.resume_info">
          <m-section
            autotest="resumeExperience"
            title="工作经历">
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
            <div class="value">学历信息</div>
          </div>
          <a
            class="fold"
            :class="{'close' : fold.education_info, 'isInfo': isInfo}"
            @click="open('education_info')">
            {{ fold.education_info ? '折叠' : '展开' }}
          </a>
          <el-button
            v-permission="1030001"
            type="text"
            icon="el-icon-edit"
            v-if="!isInfo"
            @click="edit('education_info')">
            编辑
          </el-button>
        </div>
        <div v-show="fold.education_info">
          <m-section
            autotest="education"
            title="学习经历">
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
            :class="{'close' : fold.family_info, 'isInfo': isInfo}"
            @click="open('family_info')">
            {{ fold.family_info ? '折叠' : '展开' }}
          </a>
          <el-button
            v-permission="1030001"
            type="text"
            icon="el-icon-edit"
            v-if="!isInfo"
            @click="edit('family_info')">
            编辑
          </el-button>
        </div>
        <div v-show="fold.family_info">
          <m-section
            autotest="family"
            title="配偶信息">
            <m-section-row>
              <m-section-cell
                title="婚姻状况"
                :content="data.family_info.marriage_status_name" />
            </m-section-row>
            <template v-if="data.family_info.marriage_status == 2">
              <m-section-row>
                <m-section-cell
                  title="配偶姓名"
                  :content="data.family_info.spouse_name" />
                <m-section-cell
                  title="配偶证件类型"
                  :content="data.family_info.spouse_credential_type_name" />
              </m-section-row>
              <m-section-row>
                <m-section-cell
                  title="配偶证件号码"
                  :content="data.family_info.spouse_credential_num" />
                <m-section-cell
                  title="配偶工作单位"
                  :content="data.family_info.spouse_work_unit" />
              </m-section-row>
              <m-section-row>
                <m-section-cell
                  title="配偶职务"
                  :content="data.family_info.spouse_duty" />
                <m-section-cell
                  title="配偶联系电话"
                  :content="data.family_info.spouse_phone" />
              </m-section-row>
              <m-section-row>
                <m-section-cell
                  title="是否有独生子女"
                  :span="12"
                  :content="data.family_info.spouse_only_child_name" />
                <m-section-cell
                  title="独生子女出生日期"
                  v-if="data.family_info.spouse_only_child"
                  :span="12"
                  :content="data.family_info.spouse_only_child_birthday" />
              </m-section-row>
            </template>
          </m-section>
          <div v-show="fold.family_info">
            <m-section
              autotest="familyMember"
              title="家庭信息">
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
            :class="{'close' : fold.exam_info, 'isInfo': isInfo}"
            @click="open('exam_info')">
            {{ fold.exam_info ? '折叠' : '展开' }}
          </a>
          <el-button
            v-permission="1030001"
            type="text"
            icon="el-icon-edit"
            v-if="!isInfo"
            @click="edit('exam_info')">
            编辑
          </el-button>
        </div>
        <div v-show="fold.exam_info">
          <m-section
            autotest="exam"
            title="金融类考试信息">
            <div
              class="m-section--border"
              v-for="(item, index) in data.exam_info.finc_list"
              :key="index">
              <m-section-row>
                <m-section-cell
                  title="金融资格考试类型"
                  :content="item.type_name" />
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
                  <el-table-column
                    label="通过时间"
                    align="center"
                    prop="pass_date" />
                </el-table>
              </div>
            </div>
          </m-section>
          <m-section
            autotest="broker"
            title="券商资格信息">
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
            autotest="brokerOther"
            title="其他专业资格信息">
            <div class="m-section--table">
              <el-table
                border
                stripe
                :data="data.exam_info.other_list">
                <el-table-column
                  label="其他专业类资格名称"
                  align="center"
                  width="280"
                  prop="name" />
                <el-table-column
                  label="取得其他专业资格时间"
                  align="center"
                  width="240"
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
            title="语言水平证书">
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
            title="计算机水平证书">
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
        </div>

        <!-- 合同信息 -->
        <div
          class="info-title"
          ref="titleContractInfo">
          <div class="line" />
          <div class="name">
            <div class="value">合同信息</div>
          </div>
          <a
            class="fold"
            :class="{'close' : fold.contract_info, 'isInfo': isInfo}"
            @click="open('contract_info')">
            {{ fold.contract_info ? '折叠' : '展开' }}
          </a>
          <el-button
            v-permission="1030001"
            type="text"
            icon="el-icon-edit"
            v-if="!isInfo"
            @click="edit('contract_info')">
            编辑
          </el-button>
        </div>
        <div v-show="fold.contract_info">
          <m-section
            autotest="contract"
            title="合同信息">
            <m-section-row class="row-not-border">
              <m-section-cell
                title="档案编号"
                :content="data.contract_info.file_code" />
            </m-section-row>
            <div
              class="m-section--border"
              v-for="(item, index) in data.contract_info.list"
              :key="index">
              <template v-if="index === 0">
                <m-section-row>
                  <m-section-cell
                    title="合同起始日期"
                    :content="item.begin_date" />
                  <m-section-cell
                    title="合同终止日期"
                    :content="item.end_date" />
                </m-section-row>
                <m-section-row>
                  <m-section-cell
                    title="用工形式"
                    :content="item.employment_form_name" />
                  <m-section-cell
                    title="合同主体单位"
                    :content="item.subject_unit_name" />
                </m-section-row>
                <m-section-row>
                  <m-section-cell
                    title="合同期限类型"
                    :content="item.term_type_name" />
                  <m-section-cell
                    title="签订日期"
                    :content="item.sign_date" />
                </m-section-row>
                <m-section-row>
                  <m-section-cell
                    title="试用开始日期"
                    :content="item.probation_begin_date" />
                  <m-section-cell
                    title="试用结束日期"
                    :content="item.probation_end_date" />
                </m-section-row>
                <m-section-row>
                  <m-section-cell
                    title="试用期限"
                    :content="item.probation_term" />
                  <m-section-cell
                    title="拟转正日期"
                    :content="item.plan_regular_date" />
                </m-section-row>
                <m-section-row>
                  <m-section-cell
                    title="财务属性"
                    :content="item.finance_attribute_name" />
                </m-section-row>
              </template>
              <template v-else>
                <m-section-row>
                  <m-section-cell
                    title="合同起始日期"
                    :content="item.begin_date" />
                  <m-section-cell
                    title="合同终止日期"
                    :content="item.end_date" />
                </m-section-row>
                <m-section-row>
                  <m-section-cell
                    title="用工形式"
                    :content="item.employment_form_name" />
                  <m-section-cell
                    title="合同主体单位"
                    :content="item.subject_unit_name" />
                </m-section-row>
                <m-section-row>
                  <m-section-cell
                    title="合同期限类型"
                    :content="item.term_type_name" />
                  <m-section-cell
                    title="签订日期"
                    :content="item.sign_date" />
                </m-section-row>
                <m-section-row>
                  <m-section-cell
                    title="财务属性"
                    :content="item.finance_attribute_name" />
                </m-section-row>
              </template>
            </div>
          </m-section>
        </div>

        <!-- 奖惩信息 -->
        <div
          class="info-title"
          ref="titleJcInfo">
          <div class="line" />
          <div class="name">
            <div class="value">奖惩信息</div>
          </div>
          <a
            class="fold"
            :class="{'close' : fold.jc_info, 'isInfo': isInfo}"
            @click="open('jc_info')">
            {{ fold.jc_info ? '折叠' : '展开' }}
          </a>
          <el-button
            v-permission="1030001"
            type="text"
            icon="el-icon-edit"
            v-if="!isInfo"
            @click="edit('jc_info')">
            编辑
          </el-button>
        </div>
        <div v-show="fold.jc_info">
          <m-section
            autotest="reward"
            title="奖励信息">
            <div class="m-section--table">
              <el-table
                border
                stripe
                :data="data.jc_info.reward_list">
                <el-table-column
                  label="奖励日期"
                  align="center"
                  prop="date" />
                <el-table-column
                  label="奖励名称"
                  align="center"
                  prop="name" />
                <el-table-column
                  label="奖励机构"
                  align="center"
                  prop="mechanism_name" />
                <el-table-column
                  label="奖励措施"
                  align="center"
                  prop="measure" />
                <el-table-column
                  label="奖励事由"
                  align="center"
                  prop="reason" />
                <el-table-column
                  label="备注"
                  align="center"
                  prop="remark" />
              </el-table>
            </div>
          </m-section>
          <m-section
            autotest="punish"
            title="处罚信">
            <div class="m-section--table">
              <el-table
                border
                stripe
                :data="data.jc_info.punish_list">
                <el-table-column
                  label="处罚日期"
                  align="center"
                  prop="date" />
                <el-table-column
                  label="处罚类型"
                  align="center"
                  prop="type" />
                <el-table-column
                  label="处罚机构"
                  align="center"
                  prop="mechanism_name" />
                <el-table-column
                  label="处罚措施"
                  align="center"
                  prop="measure" />
                <el-table-column
                  label="处罚事由"
                  align="center"
                  prop="reason" />
                <el-table-column
                  label="备注"
                  align="center"
                  prop="remark" />
              </el-table>
            </div>
          </m-section>
          <m-section
            autotest="compliance"
            title="合规诚信">
            <div class="m-section--table">
              <el-table
                border
                stripe
                :data="data.jc_info.compliance_list">
                <el-table-column
                  label="通报日期"
                  align="center"
                  prop="date" />
                <el-table-column
                  label="违规类型"
                  align="center"
                  prop="type" />
                <el-table-column
                  label="通报机构"
                  align="center"
                  prop="mechanism_name" />
                <el-table-column
                  label="通报内容"
                  align="center"
                  prop="content" />
                <el-table-column
                  label="问责措施"
                  align="center"
                  prop="measure" />
                <el-table-column
                  label="备注"
                  align="center"
                  prop="remark" />
              </el-table>
            </div>
          </m-section>
          <m-section
            autotest="complaint"
            title="客户投诉记录">
            <div class="m-section--table">
              <el-table
                border
                stripe
                :data="data.jc_info.complaint_list">
                <el-table-column
                  label="投诉日期"
                  align="center"
                  prop="date" />
                <el-table-column
                  label="投诉人"
                  align="center"
                  prop="complaint_name" />
                <el-table-column
                  label="投诉人资金账号"
                  align="center"
                  width="140"
                  prop="complaint_num" />
                <el-table-column
                  label="投诉人联系方式"
                  align="center"
                  width="140"
                  prop="complaint_phone" />
                <el-table-column
                  label="投诉类型"
                  align="center"
                  prop="type" />
                <el-table-column
                  label="投诉事项"
                  align="center"
                  prop="matter" />
                <el-table-column
                  label="处理结果"
                  align="center"
                  prop="result" />
                <el-table-column
                  label="投诉来源"
                  align="center"
                  prop="source" />
                <el-table-column
                  label="备注"
                  align="center"
                  prop="remark" />
              </el-table>
            </div>
          </m-section>
        </div>

        <!-- 团队信息 -->
        <div
          class="info-title"
          ref="titleTeamInfo">
          <div class="line" />
          <div class="name">
            <div class="value">团队信息</div>
          </div>
          <a
            class="fold"
            :class="{'close' : fold.team_info, 'isInfo': isInfo}"
            @click="open('team_info')">
            {{ fold.team_info ? '折叠' : '展开' }}
          </a>
          <el-button
            v-permission="1030001"
            type="text"
            icon="el-icon-edit"
            v-if="!isInfo"
            @click="edit('team_info')">
            编辑
          </el-button>
        </div>
        <div v-show="fold.team_info">
          <m-section
            autotest="team"
            title="团队信息">
            <m-section-row>
              <m-section-cell
                title="员工ID"
                :content="data.team_info.emp_code" />
              <m-section-cell
                title="经纪号"
                :content="data.team_info.broker_code" />
            </m-section-row>
            <m-section-row>
              <m-section-cell
                title="员工姓名"
                :content="data.team_info.name" />
              <m-section-cell
                title="所属部门"
                :content="data.team_info.org_name" />
            </m-section-row>
            <m-section-row>
              <m-section-cell
                title="角色标签"
                :content="data.team_info.role_tag" />
              <m-section-cell
                title="团队名称"
                :content="data.team_info.team_name" />
            </m-section-row>
            <m-section-row>
              <m-section-cell
                title="团队系数"
                :content="data.team_info.team_ratio_name" />
              <m-section-cell
                title="业务方向"
                :content="data.team_info.business_direction_name" />
            </m-section-row>
            <m-section-row>
              <m-section-cell
                title="属性"
                :content="data.team_info.team_attribute_name" />
              <m-section-cell
                title="职能"
                :content="data.team_info.function_name" />
            </m-section-row>
            <m-section-row>
              <m-section-cell
                title="团队长经纪号"
                :content="data.team_info.team_leader_broker_code" />
              <m-section-cell
                title="团队长姓名"
                :content="data.team_info.team_leader_name" />
            </m-section-row>
            <m-section-row>
              <m-section-cell
                title="有效人力系数"
                :content="data.team_info.people_ratio_name" />
              <m-section-cell
                title="非有效人力备注"
                :content="data.team_info.people_remark_name" />
            </m-section-row>
          </m-section>
        </div>
      </template>
    </div>

    <div
      data-tag="test"
      class="page--navigation"
      ref="navigation"
      :class="{'show': navigation.show, 'scroll': navigation.scroll}"
      :style="{left: navigation.left + 'px', top: navigation.top + 'px'}">
      <div class="line-left" />
      <div
        class="item"
        data-tag="base_info"
        :class="{'active': navigation.index === 0}"
        @click="clickNavigationTag(0, 'base_info')">
        <div class="circle" />
        <div class="tag">个人信息</div>
      </div>
      <div
        class="item"
        data-tag="job_info"
        :class="{'active': navigation.index === 1}"
        @click="clickNavigationTag(1, 'job_info')">
        <div class="circle" />
        <div class="tag">任职信息</div>
      </div>
      <div
        class="item"
        data-tag="resume_info"
        :class="{'active': navigation.index === 2}"
        @click="clickNavigationTag(2, 'resume_info')">
        <div class="circle" />
        <div class="tag">履历信息</div>
      </div>
      <div
        class="item"
        data-tag="education_info"
        :class="{'active': navigation.index === 3}"
        @click="clickNavigationTag(3, 'education_info')">
        <div class="circle" />
        <div class="tag">学历信息</div>
      </div>
      <div
        class="item"
        data-tag="family_info"
        :class="{'active': navigation.index === 4}"
        @click="clickNavigationTag(4, 'family_info')">
        <div class="circle" />
        <div class="tag">家庭信息</div>
      </div>
      <div
        class="item"
        data-tag="exam_info"
        :class="{'active': navigation.index === 5}"
        @click="clickNavigationTag(5, 'exam_info')">
        <div class="circle" />
        <div class="tag">资格信息</div>
      </div>
      <div
        class="item"
        data-tag="contract_info"
        :class="{'active': navigation.index === 6}"
        @click="clickNavigationTag(6, 'contract_info')">
        <div class="circle" />
        <div class="tag">合同信息</div>
      </div>
      <div
        class="item"
        data-tag="jc_info"
        :class="{'active': navigation.index === 7}"
        @click="clickNavigationTag(7, 'jc_info')">
        <div class="circle" />
        <div class="tag">奖惩信息</div>
      </div>
      <div
        class="item"
        data-tag="team_info"
        :class="{'active': navigation.index === 8}"
        @click="clickNavigationTag(8, 'team_info')">
        <div class="circle" />
        <div class="tag">团队信息</div>
      </div>
    </div>
  </div>
</template>

<script>
  /*
  * 员工详情页面
  * @router /maintain/profile/:id/:type?
  * @routerParams type 显示内容块，引用准则：变量fold所包含key且不等于默认值 base_info
  */

  import ActionBar from './profile/ActionBar'

  export default {
    name: 'Profile',
    components: { ActionBar },

    data() {
      const isIndex = this.$route.name === 'IndexProfile'
      let breadcrumb = [
        { name: '员工管理' },
        { name: '员工信息维护', to: '/maintain' },
        { name: '员工信息' },
      ]

      if (isIndex) {
        breadcrumb = [
          { name: '主页', to: '/' },
          { name: '个人信息' },
        ]
      }

      return {
        breadcrumb,
        loading: false,
        isInfo: isIndex,
        init: false,
        // 请求数据ID
        id: '',
        isCreated: false,
        data: {},
        // 折叠展开控制
        fold: {
          // 全部
          all: false,
          // 个人信息
          base_info: true,
          // 任职信息
          job_info: false,
          // 履历信息
          resume_info: false,
          // 学历信息
          education_info: false,
          // 家庭信息
          family_info: false,
          // 资格信息
          exam_info: false,
          // 合同信息
          contract_info: false,
          // 奖惩信息
          jc_info: false,
          // 团队信息
          team_info: false,
        },
        navigation: {
          // 导航距离窗口上边距离
          top: 0,
          // 导航距离窗口左边距离
          left: 0,
          // 选择索引值
          index: 0,
          // 初始化之后，控制显示
          show: false,
          // 是否点击标签
          clickTag: false,
          // 是否滚动
          scroll: false,
          // 折叠初始化值
          initFoldKey: '',
        },
        userinfo: {},
      }
    },

    created() {
      const { isCreated } = this.$route.query
      const { id } = this.$route.params

      if (isCreated === '1') this.isCreated = true
      this.id = id
      this.open('all')
      window.addEventListener('resize', this.setNavigationPosition, false)
      this.getData()
    },

    beforeRouteLeave(to, from, next) {
      window.removeEventListener('resize', this.setNavigationPosition, false)
      window.removeEventListener('resize', this.windowScroll, false)
      next()
    },

    beforeRouteUpdate(to, from, next) {
      if (to.params.id !== this.id) {
        this.id = to.params.id
        this.getData()
      }
      next()
    },

    methods: {
      // 获取数据
      getData() {
        this.loading = true
        this.$axios({
          url: '/user/get-detail',
          params: {
            id: this.id,
          },
        }).then(({ data }) => {
          this.loading = false
          const {
            avatar_url,
            name,
            org_name,
            job_name,
            mobile,
            email_inside,
          } = data

          this.userinfo = {
            avatar_url,
            name,
            org_name,
            job_name,
            mobile,
            email_inside,
          }

          this.data = data

          if (this.data.education_info.list.length === 0) {
            this.data.education_info.list.push({})
          }

          if (this.data.exam_info.finc_list.length === 0) {
            this.data.exam_info.finc_list.push({})
          }

          if (this.data.job_info.list.length === 0) {
            this.data.job_info.list.push({})
          }

          if (this.data.contract_info.list.length === 0) {
            this.data.contract_info.list.push({})
          }

          if (!this.isInfo) this.breadcrumb[2].name = this.data.name

          if (!this.init) {
            this.init = true
            this.$nextTick(() => {
              this.setNavigationPosition(true)
            })
          }
        }).catch(() => {
          this.loading = false
        })
      },
      edit(type) {
        this.$router.push({
          path: `/maintain/create/${type}/${this.$route.params.id}`,
        })
      },
      // 折叠或展开
      open(type) {
        if (type === 'all') {
          this.fold.all = !this.fold.all
          Object.keys(this.fold).forEach((key) => {
            this.fold[key] = this.fold.all
          })
        } else {
          this.fold[type] = !this.fold[type]
          const values = Object.values(this.fold)
          const showLength = values.filter(value => value).length
          if (showLength === values.length - 1) {
            this.fold.all = true
          } else if (showLength === 0) {
            this.fold.all = false
          }
        }
      },
      /*
      * 设置导航位置
      * @params isInit {Boolean} 是否初始化
      */
      setNavigationPosition(isInit) {
        if (!this.$refs.content) return
        this.navigation.left = (this.$refs.content.offsetLeft + this.$refs.content.clientWidth)
          - this.$refs.navigation.clientWidth
        this.navigation.show = true
        this.navigation.top = this.$refs.baseInfo.offsetTop + this.$refs.content.offsetTop
        window.addEventListener('scroll', this.windowScroll, false)
        if (isInit) {
          window.setTimeout(() => {
            const { type } = this.$route.params
            if (type) {
              const elmNavigation = this.$refs.navigation
              const elmTags = elmNavigation.getElementsByClassName('item')
              for (let i = 0; i < elmTags.length; i += 1) {
                if (elmTags[i].getAttribute('data-tag') === type) {
                  this.clickNavigationTag(i, type)
                  break
                }
              }
            }
          }, 150)
        }
      },
      // 点击导航标签
      clickNavigationTag(index, name) {
        this.fold[name] = true
        this.navigation.clickTag = true
        this.$nextTick(() => {
          const elmContent = this.$refs.content
          const elmTitle = elmContent.getElementsByClassName('info-title')[index]
          window.scrollTo(0, elmContent.offsetTop + (elmTitle.offsetTop - 100))
          this.navigation.index = index
        })
      },
      // 页面滚动事件
      windowScroll() {
        const elmContent = this.$refs.content
        if (!elmContent || !elmContent.getElementsByClassName) return
        const elmTitles = elmContent.getElementsByClassName('info-title')
        const y = elmTitles[0].offsetTop + elmContent.offsetTop
        if (window.scrollY > y) {
          const scrollY = window.scrollY + 100
          this.navigation.scroll = true
          if (this.navigation.clickTag) {
            this.navigation.clickTag = false
            return
          }
          const lastIndex = elmTitles.length - 1
          for (let i = 0; i < elmTitles.length; i += 1) {
            if (i < lastIndex) {
              const currentY = elmTitles[i].offsetTop + elmContent.offsetTop
              const nextY = elmTitles[i + 1].offsetTop + elmContent.offsetTop
              if (scrollY > currentY && scrollY < nextY) {
                this.navigation.index = i
                break
              }
            } else {
              this.navigation.index = i
            }
          }
        } else {
          this.navigation.scroll = false
        }
      },
    },
  }
</script>

<style type="text/scss" lang="scss">
  .page-employee-profile {
    .page--content {
      position: relative;
      padding-right: 150px;
    }

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
        right: 45px;
        bottom: 5px;
        width: 115px;
        padding-left: 20px;
        cursor: pointer;
        color: #333;

        &:hover {
          color: #5090f7;
        }

        &.isInfo {
          width: 95px;
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
          background-image: url(../../assets/images/arrow_gray_down.png);
        }

        &.close {
          &::before {
            transform: rotate(180deg);
          }
        }
      }

      .el-button {
        position: absolute;
        right: 0;
        bottom: 4px;
        background-color: #f7f7f7;
        padding: 0;
      }
    }

    .userinfo--wrap {
      margin-top: 14px;
      margin-bottom: 14px;
      background: #fff;
      border: 1px solid #e9e9e9;
      padding: 20px 0;
    }

    .page--navigation {
      position: absolute;
      right: 0;
      height: 650px;
      width: 132px;
      padding: 48px 16px 20px 16px;
      opacity: 0;
      top: 528px;
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);
      background-color: #fff;
      border-radius: 3px;

      &.scroll {
        position: fixed;
        top: 0 !important;
      }

      &.show {
        opacity: 1;
      }

      .line-left {
        position: absolute;
        top: 20px;
        left: 16px;
        bottom: 20px;
        border-left: 1px solid #e1e1e1;
        z-index: 0;
      }

      .item {
        margin-left: -5.5px;
        margin-bottom: 16px;
        color: #999;
        cursor: pointer;
        position: relative;
        z-index: 2;

        &:not(.active):hover {
          color: #5090f7;
        }

        &.active {
          color: #5090f7;

          .circle {
            border: 1px solid #5090f7;
            background-color: #fff;
          }

          .tag {
            background-image: url(../../assets/images/tag_blue.png);
            background-size: 82px auto;
          }

          &:hover {
            .circle {
              border-color: #66b1ff;
            }

            .tag {
              opacity: 0.7;
            }
          }
        }

        .circle {
          display: inline-block;
          height: 12px;
          width: 12px;
          border-radius: 6px;
          vertical-align: middle;
        }

        .tag {
          display: inline-block;
          vertical-align: middle;
          margin-left: 4px;
          width: 82px;
          height: 31px;
          line-height: 31px;
          text-align: center;
          text-indent: 4px;
        }
      }
    }
  }
</style>
