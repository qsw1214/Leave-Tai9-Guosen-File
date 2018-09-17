<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="page process-details">

    <!-- 面包屑，固定层级 -->
    <m-breadcrumb :items="breadcrumb" />

    <!-- 顶部按钮 -->
    <div
      class="block-margin-bottom"
      v-if="!edit">
      <el-button
        v-permission="1040003"
        type="primary"
        icon="el-icon-edit"
        @click="getEditChange">编辑
      </el-button>
      <el-button
        icon="el-icon-d-arrow-left"
        v-if="redirect"
        @click="getTo('back')">返回
      </el-button>
      <el-button
        icon="el-icon-caret-left"
        v-if="!redirect"
        :disabled="!toPrevId"
        @click="getTo('prev')">上一条
      </el-button>
      <el-button
        v-if="!redirect"
        :disabled="!toNextId"
        @click="getTo('next')">下一条<i class="el-icon-caret-right el-icon--right" />
      </el-button>
    </div>

    <!-- 内容部分 -->
    <el-form
      class="wrap"
      label-width="140px"
      ref="detData"
      :model="detData"
      :rules="detDataRules">

      <!-- 基础设置 -->
      <m-section
        title="基础设置"
        :is-form="edit">
        <div
          class="m-section--form"
          v-if="edit">
          <m-section-row>

            <el-form-item
              label="审批人重复设置"
              prop="is_skip_duplicate"
              :rules="detDataRules.is_skip_duplicate">
              <el-select
                v-model="detData.is_skip_duplicate">
                <el-option
                  v-for="item in dictionary.isSkipDuplicate"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" />
              </el-select>
            </el-form-item>

            <el-form-item
              label="是否需申请者确认"
              prop="is_need_confirm"
              :rules="detDataRules.is_need_confirm">
              <el-select
                v-model="detData.is_need_confirm">
                <el-option
                  label="是"
                  :value="1" />
                <el-option
                  label="否"
                  :value="0" />
              </el-select>
            </el-form-item>
          </m-section-row>
        </div>

        <m-section-row
          v-else>

          <m-section-cell
            title="审批人重复设置"
            :content="detData.is_skip_duplicate !== ''
              ? dictionary.isSkipDuplicate[detData.is_skip_duplicate].label
            : ''" />

          <m-section-cell
            title="是否需申请者确认"
            :content="detData.is_need_confirm !== ''
              ? (detData.is_need_confirm === 1 ? '是' : '否')
            : ''" />
        </m-section-row>
      </m-section>

      <!-- 审批流设置 -->
      <m-section
        title="审批流设置">

        <div
          class="point-wrap">
          <template
            v-for="(item, index) in detData.approval_list">
            <div
              class="point-item"
              :key="`${item.renderKey}bottom`">
              <el-button
                :type="select === index ? 'primary' : 'info'"
                :plain="!select === index"
                @click="selectPoint(index)">{{ `审批节点${index + 1}` }}
              </el-button>
              <el-button
                class="error approval-reomve"
                type="text"
                icon="el-icon-circle-close"
                v-if="edit"
                @click="approvalItemRemove(
                  detData.approval_list,
                  index,
                  'approval_list'
                )" />
              <i
                class="el-icon-circle-plus el-icon--right"
                v-if="edit && index + 1 !== detData.approval_list.length"
                @click="approvalItemPlus(
                  detData.approval_list,
                  index
                )" />
            </div>

            <m-icon-next
              v-if="edit || index + 1 !== detData.approval_list.length"
              :class="{ edit: index + 1 === detData.approval_list.length }"
              :key="`${item.renderKey}step`" />
          </template>

          <el-button
            class="point-add"
            type="primary"
            icon="el-icon-plus"
            plain
            v-if="edit"
            @click="approvalItemPlus(
              detData.approval_list,
              detData.approval_list.length - 1
            )">添加
          </el-button>
        </div>
      </m-section>

      <!-- 审批节点设置 -->
      <m-section
        v-if="calFormItem"
        :title="`审批节点${select + 1}设置`"
        :is-form="edit">

        <!-- 流转方式 -->
        <div
          class="m-section--form"
          v-if="edit">
          <m-section-row>

            <el-form-item
              label="流转方式"
              :key="`${detData.approval_list[select].renderKey}type`"
              :prop="`approval_list.${select}.type`"
              :rules="detDataRules.approvalType">
              <el-select
                v-model="calFormItem.type">
                <el-option
                  v-for="item in dictionary.approvalType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" />
              </el-select>
            </el-form-item>
          </m-section-row>
        </div>

        <div
          v-else>
          <m-section-row>

            <m-section-cell
              title="流转方式"
              :content="dictionary.approvalType[calFormItem.type].label" />
          </m-section-row>
        </div>

        <!-- 审批者&审批条件块 -->
        <template
          v-for="(item, index) in calFormItem.approvaler_list">

          <!-- 审批者 - title -->
          <div
            class="border-block"
            v-if="edit"
            :key="`${item.renderKey}border1`" />

          <div
            class="subtitle-wrap"
            :key="`${item.renderKey}title1`">
            <div class="m-section--title subtitle">审批者{{ index + 1 }}</div>
            <el-button
              class="approvaler-remove error"
              type="text"
              icon="el-icon-delete"
              v-if="edit"
              @click="approvalerItemRemove(
                calFormItem.approvaler_list,
                index
              )">删除
            </el-button>
          </div>

          <!-- 审批者编辑 -->
          <div
            class="m-section--form"
            v-if="edit"
            :key="`${item.renderKey}itemLine1`">
            <m-section-row>

              <el-form-item
                label="审批者分配方式"
                :key="`${item.renderKey}type`"
                :prop="`${calFormPropPath}${index}.type`"
                :rules="detDataRules.approvalerType">
                <el-select
                  v-model="item.type">
                  <el-option
                    v-for="item in dictionary.approvalerType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value" />
                </el-select>
              </el-form-item>

              <el-form-item
                label="审批人"
                v-if="item.type === 1"
                :key="`${item.renderKey}uid`"
                :prop="`${calFormPropPath}${index}.uid`"
                :rules="detDataRules.uid">
                <m-employee-select
                  class="employee-select"
                  store-name="proEmployeeSelect"
                  init-change
                  cached
                  :employees.sync="item.uid"
                  :width="260"
                  @change="getEmployeeApprovaler($event, index)" />
              </el-form-item>

              <el-form-item
                label="审批者职位"
                v-if="item.type === 2"
                :key="`${item.renderKey}job_id`"
                :prop="`${calFormPropPath}${index}.job_id`"
                :rules="detDataRules.job_id">
                <m-position-select
                  class="job-select"
                  store-name="proJobSelect"
                  init-change
                  cached
                  :positions.sync="item.job_id"
                  :width="260"
                  @change="getPositionApprovaler($event, index)" />
              </el-form-item>

              <el-form-item
                label="角色名称"
                v-if="item.type === 4"
                :key="`${item.renderKey}org_role`"
                :prop="`${calFormPropPath}${index}.org_role`"
                :rules="detDataRules.org_role">
                <el-select
                  v-model="item.org_role">
                  <el-option
                    v-for="item in dictionary.approvalerOrgRole"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value" />
                </el-select>
              </el-form-item>
            </m-section-row>

            <m-section-row
              v-if="
                detDataTemp.code === '200016' ||
                  detDataTemp.code === '200017' ||
                  detDataTemp.code === '200013' ||
                  detDataTemp.code === '200014' ||
                  detDataTemp.code === '200015'
              ">

              <!-- 人事待入离调转管理添加判断条件 -->
              <el-form-item
                label="审批表单类型"
                :key="`${item.renderKey}approval_form_type`"
                :prop="`${calFormPropPath}${index}.approval_form_type`"
                :rules="detDataRules.approval_form_type">
                <multiple-select v-model="item.approval_form_type">
                  <el-option
                    v-for="(item, index) in approval_form_type_selectList"
                    :key="index"
                    :label="item"
                    :value="index" />
                </multiple-select>
              </el-form-item>
            </m-section-row>
          </div>

          <!-- 审批者显示 -->
          <div
            v-else
            :key="`${item.renderKey}itemLine1`">
            <m-section-row>

              <m-section-cell
                title="审批者分配方式"
                :content="dictionary.approvalerType[item.type].label" />

              <m-section-cell
                title="审批人"
                v-if="item.type === 1"
                :content="`${item.user_name}(${item.emp_code})`" />

              <m-section-cell
                title="审批者职位"
                v-if="item.type === 2"
                :content="`${item.job_name}(${item.job_code})`" />

              <m-section-cell
                title="角色名称"
                v-if="item.type === 4"
                :content="dictionary.approvalerOrgRole[item.org_role].label" />
            </m-section-row>

            <m-section-row
              v-if="
                detDataTemp.code === '200016' ||
                  detDataTemp.code === '200017' ||
                  detDataTemp.code === '200013' ||
                  detDataTemp.code === '200014' ||
                  detDataTemp.code === '200015'
              ">

              <!-- 人事待入离调转管理添加判断条件 -->
              <m-section-cell
                title="审批表单类型"
                :content="approval_form_type_selectList[item.approval_form_type]" />
            </m-section-row>

          </div>

          <!-- 审批条件 - title -->
          <div
            class="subtitle-wrap"
            :key="`${item.renderKey}title2`">
            <div class="m-section--title subtitle">审批条件{{ index + 1 }}</div>
          </div>

          <!-- 审批条件编辑 -->
          <div
            class="m-section--form"
            v-if="edit"
            :key="`${item.renderKey}itemLine2`">

            <m-section-row>
              <el-form-item
                label="申请者所属组织"
                :key="`${item.renderKey}applier_org_id`"
                :prop="`${calFormPropPath}${index}.applier_org_id`"
                :rules="detDataRules.applier_org_id">
                <m-cascader
                  class="org-select"
                  store-name="proOrgSelect"
                  glass
                  clearable
                  init-change
                  cached
                  :organization.sync="item.applier_org_id"
                  :width="260"
                  @change="getOrgRange($event, index)" />
              </el-form-item>

              <m-section-cell
                title="组织编码"
                :content="item.org_code || '由申请者所属组织指定'" />
            </m-section-row>

            <m-section-row>
              <el-form-item
                label="是否包含下级"
                :key="`${item.renderKey}has_child_org`"
                :prop="`${calFormPropPath}${index}.has_child_org`"
                :rules="detDataRules.has_child_org">
                <el-select
                  v-model="item.has_child_org">
                  <el-option
                    label="是"
                    :value="1" />
                  <el-option
                    label="否"
                    :value="0" />
                </el-select>
              </el-form-item>

              <!-- 人事证明添加判断条件 -->
              <el-form-item
                label="证明类型"
                v-if="detDataTemp.code === '200001'"
                :key="`${item.renderKey}rszm_type`"
                :prop="`${calFormPropPath}${index}.rszm_type`"
                :rules="detDataRules.rszm_type">
                <multiple-select
                  multiple
                  v-model="item.rszm_type">
                  <el-option
                    v-for="item in dictionary.process200001RszmType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value" />
                </multiple-select>
              </el-form-item>

              <!-- 宣传品印刷制作添加判断条件 -->
              <el-form-item
                label="是否需要制作"
                v-if="detDataTemp.code === '200005'"
                :key="`${item.renderKey}is_need_make`"
                :prop="`${calFormPropPath}${index}.is_need_make`"
                :rules="detDataRules.is_need_make">
                <el-select
                  v-model="item.is_need_make">
                  <el-option
                    label="是"
                    :value="1" />
                  <el-option
                    label="否"
                    :value="0" />
                </el-select>
              </el-form-item>

              <!-- 行政运营支持办公费申请添加判断条件 -->
              <el-form-item
                label="预算金额"
                v-if="detDataTemp.code === '200007'"
                :key="`${item.renderKey}money_range`"
                :prop="`${calFormPropPath}${index}.money_range`"
                :rules="detDataRules.money_range2">
                <multiple-select
                  multiple
                  v-model="item.money_range">
                  <el-option
                    v-for="(item, index) in dictionary.process200007MoneyRange"
                    :key="index"
                    :label="item"
                    :value="index" />
                </multiple-select>
              </el-form-item>

              <!-- 人事调动管理添加判断条件 -->
              <el-form-item
                label="异动类型"
                v-if="detDataTemp.code === '200016'"
                :key="`${item.renderKey}rsddgl_job_reason`"
                :prop="`${calFormPropPath}${index}.rsddgl_job_reason`"
                :rules="detDataRules.rsddgl_job_reason">
                <multiple-select
                  multiple
                  v-model="item.rsddgl_job_reason">
                  <el-option
                    v-for="item in dictionary.process200016RsddglJobReason"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value" />
                </multiple-select>
              </el-form-item>

              <!-- 200018请假、200019因公外出、200020未打卡申诉、200021出差、200023集体报备
                   添加判断条件 -->
              <el-form-item
                label="是否为部门负责人"
                v-if="
                  ['200018', '200019', '200020', '200021', '200023']
                    .includes(detDataTemp.code)
                "
                :key="`${item.renderKey}is_org_leader`"
                :prop="`${calFormPropPath}${index}.is_org_leader`"
                :rules="detDataRules.is_org_leader">
                <el-select
                  v-model="item.is_org_leader">
                  <el-option
                    v-for="item in dictionary.process2000YesOrNo"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value" />
                </el-select>
              </el-form-item>
            </m-section-row>

            <m-section-row
              v-if="item.is_need_make === 1 && detDataTemp.code === '200005'">

              <!-- 宣传品印刷制作添加判断条件 -->
              <el-form-item
                label="核价结果"
                :key="`${item.renderKey}money_range`"
                :prop="`${calFormPropPath}${index}.money_range`"
                :rules="detDataRules.money_range">
                <multiple-select
                  multiple
                  v-model="item.money_range">
                  <el-option
                    v-for="(item, index) in dictionary.process200005MoneyRange"
                    :key="index"
                    :label="item"
                    :value="index" />
                </multiple-select>
              </el-form-item>
            </m-section-row>

            <m-section-row
              v-if="detDataTemp.code === '200016'">

              <!-- 人事调动管理添加判断条件 -->
              <el-form-item
                label="是否判断调入部门"
                :key="`${item.renderKey}is_move_in_org`"
                :prop="`${calFormPropPath}${index}.is_move_in_org`"
                :rules="detDataRules.is_move_in_org">
                <el-select
                  v-model="item.is_move_in_org">
                  <el-option
                    label="是"
                    :value="1" />
                  <el-option
                    label="否"
                    :value="0" />
                </el-select>
              </el-form-item>

              <el-form-item
                label="是否判断调出部门"
                :key="`${item.renderKey}is_move_out_org`"
                :prop="`${calFormPropPath}${index}.is_move_out_org`"
                :rules="detDataRules.is_move_out_org">
                <el-select
                  v-model="item.is_move_out_org">
                  <el-option
                    label="是"
                    :value="1" />
                  <el-option
                    label="否"
                    :value="0" />
                </el-select>
              </el-form-item>
            </m-section-row>

            <m-section-row
              v-if="detDataTemp.code === '200017'">

              <!-- 人事转正管理添加判断条件 -->
              <el-form-item
                label="异动类型"
                v-if="detDataTemp.code === '200017'"
                :key="`${item.renderKey}rszzgl_type`"
                :prop="`${calFormPropPath}${index}.rszzgl_type`"
                :rules="detDataRules.rszzgl_type">
                <multiple-select
                  multiple
                  v-model="item.rszzgl_type">
                  <el-option
                    v-for="item in dictionary.process200017RszzglType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value" />
                </multiple-select>
              </el-form-item>

              <el-form-item
                label="是否终止转正"
                :key="`${item.renderKey}approval_is_end_zz`"
                :prop="`${calFormPropPath}${index}.approval_is_end_zz`"
                :rules="detDataRules.approval_is_end_zz">
                <el-select
                  v-model="item.approval_is_end_zz">
                  <el-option
                    v-for="item in dictionary.process2000YesOrNo"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value" />
                </el-select>
              </el-form-item>
            </m-section-row>

            <m-section-row
              v-if="
                (
                  item.is_move_in_org === 1 ||
                  item.is_move_out_org === 1
                ) &&
                  detDataTemp.code === '200016'
              ">

              <!-- 人事调动管理添加判断条件 -->
              <el-form-item
                label="组织条线"
                :key="`${item.renderKey}move_org_line`"
                :prop="`${calFormPropPath}${index}.move_org_line`"
                :rules="detDataRules.move_org_line">
                <multiple-select
                  multiple
                  v-model="item.move_org_line">
                  <el-option
                    v-for="item in dictionary.process2000MoveOrgLine"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value" />
                </multiple-select>
              </el-form-item>

              <el-form-item
                label="组织属性"
                :key="`${item.renderKey}move_org_flag`"
                :prop="`${calFormPropPath}${index}.move_org_flag`"
                :rules="detDataRules.move_org_flag">
                <multiple-select
                  multiple
                  v-model="item.move_org_flag">
                  <el-option
                    v-for="item in dictionary.process2000OrgFlag"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value" />
                </multiple-select>
              </el-form-item>
            </m-section-row>

            <m-section-row
              v-if="detDataTemp.code === '200017'">

              <!-- 人事转正管理添加判断条件 -->
              <el-form-item
                label="组织条线"
                :key="`${item.renderKey}zz_org_line`"
                :prop="`${calFormPropPath}${index}.zz_org_line`"
                :rules="detDataRules.zz_org_line">
                <multiple-select
                  multiple
                  v-model="item.zz_org_line">
                  <el-option
                    v-for="item in dictionary.process2000MoveOrgLine"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value" />
                </multiple-select>
              </el-form-item>

              <el-form-item
                label="组织属性"
                :key="`${item.renderKey}zz_org_flag`"
                :prop="`${calFormPropPath}${index}.zz_org_flag`"
                :rules="detDataRules.zz_org_flag">
                <multiple-select
                  multiple
                  v-model="item.zz_org_flag">
                  <el-option
                    v-for="item in dictionary.process2000OrgFlag"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value" />
                </multiple-select>
              </el-form-item>
            </m-section-row>

            <m-section-row
              v-if="detDataTemp.code === '200016'">

              <!-- 人事调动管理添加判断条件 -->
              <el-form-item
                label="是否需要划转客户"
                :key="`${item.renderKey}is_need_move_customers`"
                :prop="`${calFormPropPath}${index}.is_need_move_customers`"
                :rules="detDataRules.is_need_move_customers">
                <el-select
                  v-model="item.is_need_move_customers">
                  <el-option
                    v-for="item in dictionary.process2000YesOrNo"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value" />
                </el-select>
              </el-form-item>

              <el-form-item
                label="是否跨业务线"
                :key="`${item.renderKey}is_diff_line`"
                :prop="`${calFormPropPath}${index}.is_diff_line`"
                :rules="detDataRules.is_diff_line">
                <el-select
                  v-model="item.is_diff_line">
                  <el-option
                    v-for="item in dictionary.process2000YesOrNo"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value" />
                </el-select>
              </el-form-item>
            </m-section-row>

            <m-section-row
              v-if="
                ['200018', '200019', '200020', '200021', '200023']
                  .includes(detDataTemp.code)
              ">

              <!-- 200018请假、200019因公外出、200020未打卡申诉、200021出差、200023集体报备
                   添加判断条件 -->
              <el-form-item
                label="组织条线"
                :key="`${item.renderKey}org_line`"
                :prop="`${calFormPropPath}${index}.org_line`"
                :rules="detDataRules.org_line">
                <multiple-select
                  multiple
                  v-model="item.org_line">
                  <el-option
                    v-for="item in dictionary.process2000MoveOrgLine"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value" />
                </multiple-select>
              </el-form-item>

              <el-form-item
                label="组织属性"
                :key="`${item.renderKey}org_flag`"
                :prop="`${calFormPropPath}${index}.org_flag`"
                :rules="detDataRules.org_flag">
                <multiple-select
                  multiple
                  v-model="item.org_flag">
                  <el-option
                    v-for="item in dictionary.process2000OrgFlag"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value" />
                </multiple-select>
              </el-form-item>
            </m-section-row>

            <m-section-row
              v-if="
                ['200018', '200021', '200023']
                  .includes(detDataTemp.code)
              ">

              <!-- 200018请假、200021出差、200023集体报备添加判断条件 -->
              <el-form-item
                :label="detDataTemp.code === '200021' ? '出差天数' : '请假天数'"
                :key="`${item.renderKey}day_range`"
                :prop="`${calFormPropPath}${index}.day_range`"
                :rules="detDataRules.day_range">
                <multiple-select
                  multiple
                  v-model="item.day_range">
                  <el-option
                    v-for="(item, index) in dictionary.process2000DayRange"
                    :key="index"
                    :label="item"
                    :value="index" />
                </multiple-select>
              </el-form-item>

              <!-- 200018请假添加判断条件 -->
              <el-form-item
                label="请假类型"
                v-if="detDataTemp.code === '200018'"
                :key="`${item.renderKey}kqqj_type`"
                :prop="`${calFormPropPath}${index}.kqqj_type`"
                :rules="detDataRules.kqqj_type">
                <multiple-select
                  multiple
                  v-model="item.kqqj_type">
                  <el-option
                    v-for="item in dictionary.process200018KqqjType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value" />
                </multiple-select>
              </el-form-item>
            </m-section-row>
          </div>

          <!-- 审批条件显示 -->
          <div
            v-else
            :key="`${item.renderKey}itemLine2`">
            <m-section-row>
              <m-section-cell
                title="申请者所属组织"
                :content="item.org_name" />

              <m-section-cell
                title="组织编码"
                :content="item.org_code" />
            </m-section-row>

            <m-section-row>
              <m-section-cell
                title="是否包含下级"
                :content="item.has_child_org === 1 ? '是' : '否'" />

              <!-- 特殊流程额外添加字段 -->
              <m-section-cell
                title="证明类型"
                v-if="detDataTemp.code === '200001'"
                :content="viewMultipleValue(
                  dictionary.process200001RszmType,
                  'label',
                  item.rszm_type
                )" />

              <!-- 特殊流程额外添加字段 -->
              <m-section-cell
                title="是否需要制作"
                v-if="detDataTemp.code === '200005'"
                :content="item.is_need_make === 1 ? '是' : '否'" />

              <!-- 特殊流程额外添加字段 -->
              <m-section-cell
                title="预算金额"
                v-if="detDataTemp.code === '200007'"
                :content="viewMultipleValue(
                  dictionary.process200007MoneyRange,
                  '',
                  item.money_range
                )" />

              <!-- 特殊流程额外添加字段 -->
              <m-section-cell
                title="异动类型"
                v-if="detDataTemp.code === '200016'"
                :content="viewMultipleValue(
                  dictionary.process200016RsddglJobReason,
                  'label',
                  item.rsddgl_job_reason
                )" />

              <!-- 200018请假、200019因公外出、200020未打卡申诉、200021出差、200023集体报备
                   添加判断条件 -->
              <m-section-cell
                title="是否为部门负责人"
                v-if="
                  ['200018', '200019', '200020', '200021', '200023']
                    .includes(detDataTemp.code)
                "
                :content="dictionary.process2000YesOrNo[item.is_org_leader].label" />
            </m-section-row>

            <m-section-row
              v-if="item.is_need_make === 1 && detDataTemp.code === '200005'">

              <!-- 特殊流程额外添加字段 -->
              <m-section-cell
                title="核价结果"
                :content="viewMultipleValue(
                  dictionary.process200005MoneyRange,
                  '',
                  item.money_range
                )" />
            </m-section-row>

            <m-section-row
              v-if="detDataTemp.code === '200016'">

              <!-- 特殊流程额外添加字段 -->
              <m-section-cell
                title="是否判断调入部门"
                :content="item.is_move_in_org === 1 ? '是' : '否'" />

              <m-section-cell
                title="是否判断调出部门"
                :content="item.is_move_out_org === 1 ? '是' : '否'" />
            </m-section-row>

            <m-section-row
              v-if="detDataTemp.code === '200017'">

              <!-- 特殊流程额外添加字段 -->
              <m-section-cell
                title="异动类型"
                :content="viewMultipleValue(
                  dictionary.process200017RszzglType,
                  'label',
                  item.rszzgl_type
                )" />

              <m-section-cell
                title="是否终止转正"
                :content="dictionary.process2000YesOrNo[item.approval_is_end_zz].label" />
            </m-section-row>

            <m-section-row
              v-if="
                (
                  item.is_move_in_org === 1 ||
                  item.is_move_out_org === 1
                ) &&
                  detDataTemp.code === '200016'
              ">

              <!-- 特殊流程额外添加字段 -->
              <m-section-cell
                title="组织条线"
                :content="viewMultipleValue(
                  dictionary.process2000MoveOrgLine,
                  'label',
                  item.move_org_line
                )" />

              <m-section-cell
                title="组织属性"
                :content="viewMultipleValue(
                  dictionary.process2000OrgFlag,
                  'label',
                  item.move_org_flag
                )" />
            </m-section-row>

            <m-section-row
              v-if="detDataTemp.code === '200017'">

              <!-- 特殊流程额外添加字段 -->
              <m-section-cell
                title="组织条线"
                :content="viewMultipleValue(
                  dictionary.process2000MoveOrgLine,
                  'label',
                  item.zz_org_line
                )" />

              <m-section-cell
                title="组织属性"
                :content="viewMultipleValue(
                  dictionary.process2000OrgFlag,
                  'label',
                  item.zz_org_flag
                )" />
            </m-section-row>

            <m-section-row
              v-if="detDataTemp.code === '200016'">

              <!-- 特殊流程额外添加字段 -->
              <m-section-cell
                title="是否需要划转客户"
                :content="dictionary.process2000YesOrNo[item.is_need_move_customers].label" />

              <m-section-cell
                title="是否跨业务线"
                :content="dictionary.process2000YesOrNo[item.is_diff_line].label" />
            </m-section-row>

            <m-section-row
              v-if="
                ['200018', '200019', '200020', '200021', '200023']
                  .includes(detDataTemp.code)
              ">

              <!-- 特殊流程额外添加字段 -->
              <m-section-cell
                title="组织条线"
                :content="viewMultipleValue(
                  dictionary.process2000MoveOrgLine,
                  'label',
                  item.org_line
                )" />

              <m-section-cell
                title="组织属性"
                :content="viewMultipleValue(
                  dictionary.process2000OrgFlag,
                  'label',
                  item.org_flag
                )" />
            </m-section-row>

            <m-section-row
              v-if="
                ['200018', '200021', '200023']
                  .includes(detDataTemp.code)
              ">

              <!-- 特殊流程额外添加字段 -->
              <m-section-cell
                :title="detDataTemp.code === '200021' ? '出差天数' : '请假天数'"
                :content="viewMultipleValue(
                  dictionary.process2000DayRange,
                  '',
                  item.day_range
                )" />

              <m-section-cell
                title="请假类型"
                v-if="detDataTemp.code === '200018'"
                :content="viewMultipleValue(
                  dictionary.process200018KqqjType,
                  'label',
                  item.kqqj_type
                )" />
            </m-section-row>
          </div>
        </template>

        <!-- 添加审批者 -->
        <div
          class="border-block"
          v-if="edit" />

        <div
          class="m-section--form"
          v-if="edit">

          <m-section-row>
            <el-button
              class="approvaler-plus"
              type="text"
              icon="el-icon-plus"
              @click="approvalerItemPlus(
                calFormItem.approvaler_list,
                calFormItem.approvaler_list.length - 1
              )">添加审批者
            </el-button>
          </m-section-row>
        </div>
      </m-section>
    </el-form>

    <!-- 提交返回 -->
    <div
      v-show="edit && detDataTemp.name">
      <el-button
        type="primary"
        :disabled="loading"
        @click="update">保存
      </el-button>
      <el-button
        type="info"
        @click="cancel">取消
      </el-button>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import processSpecialSet from './processSpecialSet'

  export default {
    // 特殊流程编辑字段配置
    mixins: [{ data: processSpecialSet.data }],

    data() {
      return {
        edit: false,
        noConfirm: false,
        loading: false,
        redirect: this.$route.query.redirect,

        // --添加接口要求字段
        // 默认字段，用于恢复默认
        clearDetData: {},
        // 接口字段，用于显示
        queryDetData: {},
        // 编辑字段，用于编辑绑定
        detData: {
          is_skip_duplicate: '',
          is_need_confirm: '',
          approval_list: [],
        },
        approval_list_item: {
          order: 0,
          type: '',
          approvaler_list: [],
        },
        approvaler_list_item: {
          type: '',
          uid: '',
          user_name: '',
          emp_code: '',

          job_id: '',
          job_name: '',
          job_code: '',

          org_role: '',

          applier_org_id: '',
          org_name: '',
          org_code: '',

          has_child_org: '',
        },

        // --其他显示字段
        // 默认字段，用于恢复默认
        clearDetDataTemp: {},
        // 接口字段，用于显示
        queryDetDataTemp: {},
        // 编辑显示字段，用于编辑绑定
        detDataTemp: {
          id: '',
          name: '',
          code: '',
          config_approval_select_id: 0,
        },

        // 表单校验条件
        detDataRules: {
          is_skip_duplicate: [{
            required: true, message: '请选择审批人重复设置', trigger: ['blur', 'change'],
          }],
          is_need_confirm: [{
            required: true, message: '请选择是否需申请者确认', trigger: ['blur', 'change'],
          }],
          approvalType: [{
            required: true, message: '请选择流转方式', trigger: ['blur', 'change'],
          }],
          approvalerType: [{
            required: true, message: '请选择审批者分配方式', trigger: ['blur', 'change'],
          }],
          uid: [{
            required: true, message: '请选择审批人', trigger: ['blur', 'change'],
          }],
          job_id: [{
            required: true, message: '请选择审批者职位', trigger: ['blur', 'change'],
          }],
          org_role: [{
            required: true, message: '请选择角色', trigger: ['blur', 'change'],
          }],
          applier_org_id: [{
            required: true, message: '请选择包含申请者组织', trigger: ['blur', 'change'],
          }],
          has_child_org: [{
            required: true, message: '请选择是否含下级组织申请者', trigger: ['blur', 'change'],
          }],

          // 表单特殊字段表单校验
          ...processSpecialSet.detDataRules,
        },
      }
    },
    computed: {
      dictionary() {
        return this.$utils.config.dictionary.settings
      },
      ajaxPath() {
        return this.$api.settings.process
      },
      breadcrumb() {
        const defaultBC = [
          { name: '基础配置' },
          { name: '流程管理', to: '/process/index/settings' },
          { name: '流程详情' },
        ]

        const status = {
          name: this.detDataTemp.id ? '修改' : '新建',
        }
        if (!this.detDataTemp.id) defaultBC.pop()
        if (this.edit) defaultBC.push(status)
        if (!this.detDataTemp.name) return defaultBC

        const name = {
          name: this.detDataTemp.name,
        }

        if (this.edit) {
          name.to = {
            name: this.$route.name,
            params: { id: this.detDataTemp.id },
          }
        }

        defaultBC.splice(2, 1, name)
        return defaultBC
      },
      select() {
        return this.detDataTemp.config_approval_select_id
      },
      calFormPropPath() {
        return `approval_list.${this.select}.approvaler_list.`
      },
      calFormItem() {
        return this.detData.approval_list[this.select]
      },
      ...mapState({
        ids: state => state.process.settingList || [],
      }),
      toNextId() {
        if (!this.detDataTemp.id || !this.ids) return ''
        const thisIndex = this.ids.findIndex(v => v.id === this.detDataTemp.id)
        if (thisIndex === this.ids.length - 1) return ''
        if (!this.ids[thisIndex + 1]) return ''
        return this.ids[thisIndex + 1].id
      },
      toPrevId() {
        if (!this.detDataTemp.id || !this.ids) return ''
        const thisIndex = this.ids.findIndex(v => v.id === this.detDataTemp.id)
        if (thisIndex === 0) return ''
        if (!this.ids[thisIndex - 1]) return ''
        return this.ids[thisIndex - 1].id
      },
    },
    watch: {
      // 如果路由发生变化，拉取新数据，更新编辑状态
      $route(to, from) {
        this.edit = !!to.query.edit
        // 1、从无ID跳转到其他ID
        // 2、ID发生变化
        // 3、从已有ID跳无ID
        const case1 = !from.params.id && String(to.params.id) !== String(this.detDataTemp.id)
        const case2 = to.params.id &&
          from.params.id &&
          String(to.params.id) !== String(from.params.id)
        const case3 = from.params.id && !to.params.id
        if (case1 || case2 || case3) this.getRouteChange()
        if (!this.edit) {
          // 重置页面
          this.$refs.detData.resetFields()
          // 恢复了页面选择状态及各种数据重置
          Object.assign(this.detData, JSON.parse(JSON.stringify(this.queryDetData)))
          Object.assign(this.detDataTemp, JSON.parse(JSON.stringify(this.queryDetDataTemp)))
        }
      },
    },
    created() {
      // 数据初始化和缓存
      Object.assign(this.clearDetData, JSON.parse(JSON.stringify(this.detData)))
      Object.assign(this.clearDetDataTemp, JSON.parse(JSON.stringify(this.detDataTemp)))
      this.edit = !!this.$route.query.edit
      this.getRouteChange()
      // 本页面执行错误处理
      this.$on('error', this.$message.error)
      this.$on('ok', this.$message.success)
    },
    methods: {
      getRouteChange() {
        // 恢复原始状态，获取routeID和数据
        Object.assign(this.detData, JSON.parse(JSON.stringify(this.clearDetData)))
        Object.assign(this.detDataTemp, JSON.parse(JSON.stringify(this.clearDetDataTemp)))
        Object.assign(this.queryDetData, JSON.parse(JSON.stringify(this.clearDetData)))
        Object.assign(this.queryDetDataTemp, JSON.parse(JSON.stringify(this.clearDetDataTemp)))
        this.detDataTemp.id = this.$route.params.id || ''
        if (this.detDataTemp.id) this.getProcess()
      },

      getEditChange(flag) {
        // 调整模式，手动触发路由变化
        const query = Object.assign({}, this.$route.query)
        if (this.edit || !flag) {
          if (query.edit) delete query.edit
          this.$router.push({
            name: this.$route.name,
            params: { id: this.detDataTemp.id },
            query,
          })
        } else {
          this.$router.push({
            path: this.$route.path,
            query: Object.assign(query, { edit: true }),
          })
        }
      },

      getTo(type) {
        // 其他形式的页面跳转
        switch (type) {
        // 返回回传地址
        case 'back':
          window.location.href = this.redirect
          break
        default:
          // 上一条下一条
          this.$router.replace({
            name: this.$route.name,
            params: { id: type === 'prev' ? this.toPrevId : this.toNextId },
            query: Object.assign({}, this.$route.query),
          })
          break
        }
      },

      async getProcess() {
        // 获取数据
        if (!this.detDataTemp.id) return
        if (this.loading) return
        this.loading = true
        try {
          const { id } = this.detDataTemp
          const { detail } = this.ajaxPath
          const { data: detData } = await this.$axios
            .post(detail, { id })

          // 处理编辑字段
          this.detData.is_skip_duplicate = detData.is_skip_duplicate
          this.detData.is_need_confirm = detData.is_need_confirm
          // 字段处理
          const timer = Date.now()
          detData.approval_list.forEach((item, index) => {
            item.renderKey = timer + index
            item.type = Number(item.type)
            item.approvaler_list.forEach((itemer, indexer) => {
              itemer.renderKey = timer + index + indexer
              itemer.type = Number(itemer.type)
              itemer.has_child_org =
                itemer.has_child_org === '' ? '' : Number(itemer.has_child_org)
              // 处理流程额外增加字段
              if (this[`F${detData.code}`]) {
                Object.keys(this[`F${detData.code}`]).forEach((key) => {
                  const { format } = this[`F${detData.code}`][key]
                  itemer[key] = format(itemer[key] === ''
                    ? this[`F${detData.code}`][key].output
                    : itemer[key])
                })
              }
            })
          })
          // 赋值
          this.detData.approval_list = JSON.parse(JSON.stringify(detData.approval_list))

          // 首个审批节点没有审批人处理
          if (
            this.edit &&
            this.detData.approval_list[0] &&
            !this.detData.approval_list[0].approvaler_list.length
          ) {
            this.approvalerItemPlus(this.detData.approval_list[0].approvaler_list)
          }

          // 处理用于显示的非编辑数据
          this.detDataTemp.id = id
          this.detDataTemp.name = detData.name
          this.detDataTemp.code = detData.code
          this.loading = false

          // 处理流程额外增加字段的选项列表
          if (
            this[`F${detData.code}`] &&
            Object.keys(this[`F${detData.code}`]).includes('approval_form_type')
          ) {
            this.getFlowConfig().then((list) => {
              this.approval_form_type_selectList = list
            })
          }
        } catch (err) {
          this.loading = false
          console.log(err)
          return
        }

        // 备份数据
        Object.assign(this.queryDetData, JSON.parse(JSON.stringify(this.detData)))
        Object.assign(this.queryDetDataTemp, JSON.parse(JSON.stringify(this.detDataTemp)))
      },

      async getFlowConfig() {
        this.loading = true
        try {
          const { data } = await this.$axios
            .post(this.ajaxPath.flowConfig, { code: this.detDataTemp.code })

          this.loading = false
          return data[Object.keys(data)[0]]
        } catch (err) {
          this.loading = false
          console.log(err)
          return {}
        }
      },

      async selectPoint(index) {
        // 表单校验
        try {
          await this.$refs.detData.validate()
        } catch (err) {
          this.$emit('error', '请先完善本节点内容')
          console.log(err)
          return
        }

        // 选中字段
        this.detDataTemp.config_approval_select_id = index
      },

      async approvalItemPlus(arr, index = 0) {
        // 表单校验
        try {
          await this.$refs.detData.validate()
        } catch (err) {
          this.$emit('error', '请先完善本节点内容')
          console.log(err)
          return
        }

        // 增加一项
        const item = Object.assign(
          {},
          JSON.parse(JSON.stringify(this.approval_list_item)),
          {
            renderKey: Date.now(),
          }
        )
        arr.splice(index + 1, 0, item)

        // 选中增加项
        this.selectPoint(index + 1)

        // 增加项需要添加一条审批者
        this.approvalerItemPlus(arr[index + 1].approvaler_list)
      },

      async approvalerItemPlus(arr, index = 0) {
        // 增加一项
        const item = Object.assign(
          {},
          JSON.parse(JSON.stringify(this.approvaler_list_item)),
          {
            renderKey: Date.now(),
          }
        )
        // 处理流程额外增加字段
        const codeAddedSet = this[`F${this.detDataTemp.code}`]
        if (codeAddedSet) {
          Object.keys(codeAddedSet).forEach((key) => {
            item[key] = JSON.parse(JSON.stringify(codeAddedSet[key].default))
          })
        }
        arr.splice(index + 1, 0, item)
      },

      async approvalItemRemove(arr, index = 0) {
        try {
          await this.$confirm('确认删除所选数据？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
        } catch (err) {
          console.log(err)
          return
        }

        // 删除一项
        arr.splice(index, 1)

        // 调整选择位置
        let selectId = this.select
        if (index < selectId) selectId -= 1
        selectId = Math.max(0, Math.min(this.detData.approval_list.length - 1, selectId))
        this.detDataTemp.config_approval_select_id = selectId
      },

      async approvalerItemRemove(arr, index = 0) {
        const type = arr.length === 1
        try {
          await this.$confirm(`确认${type ? '清空' : '删除'}所选数据？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
        } catch (err) {
          console.log(err)
          return
        }

        // 删除一项
        arr.splice(index, 1)

        if (!arr.length) {
          this.approvalerItemPlus(arr)
        }
      },

      getEmployeeApprovaler(data, index) {
        const item = this.calFormItem.approvaler_list[index]
        if (data[0]) {
          item.user_name = data[0].name
          item.emp_code = data[0].emp_code
        } else {
          item.user_name = ''
          item.emp_code = ''
        }
      },

      getPositionApprovaler(data, index) {
        const item = this.calFormItem.approvaler_list[index]
        if (data[0]) {
          item.job_name = data[0].name
          item.job_code = data[0].code
        } else {
          item.job_name = ''
          item.job_code = ''
        }
      },

      getOrgRange(data, index) {
        const item = this.calFormItem.approvaler_list[index]
        if (data.length) {
          item.org_name = data[data.length - 1].name
          item.org_code = data[data.length - 1].code
        } else {
          item.org_name = ''
          item.org_code = ''
        }
      },

      viewMultipleValue(dictionary, key, item) {
        let value = ''
        item.forEach((option) => {
          if (value) value += '，'
          if (!key) {
            value += dictionary[option]
          } else {
            value += dictionary[option][key]
          }
        })
        return value
      },

      async update() {
        if (!this.detDataTemp.id) return
        if (this.loading) return
        this.loading = true
        await this.$nextTick().then(() => new Promise((reslove) => {
          setTimeout(reslove, 500)
        }))

        // 表单校验
        try {
          for (let i = 0; i < this.detData.approval_list.length; i += 1) {
            this.detDataTemp.config_approval_select_id = i
            // eslint-disable-next-line no-await-in-loop
            await this.$nextTick().then(() => this.$refs.detData.validate())
          }
        } catch (err) {
          this.loading = false
          console.log(err)
          return
        }

        // 提交确认
        try {
          await this.$confirm('是否确认提交？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
        } catch (err) {
          this.loading = false
          console.log(err)
          return
        }

        // 提交数据
        try {
          const postData = JSON.parse(JSON.stringify(this.detData))
          postData.approval_list.forEach((approval, index) => {
            approval.order = index + 1
            delete approval.renderKey
            approval.approvaler_list.forEach((approvaler) => {
              if (approvaler.type !== 1) approvaler.uid = ''
              if (approvaler.type !== 2) approvaler.job_id = ''
              if (approvaler.type !== 4) approvaler.org_role = ''
              delete approvaler.user_name
              delete approvaler.emp_code
              delete approvaler.job_name
              delete approvaler.job_code
              delete approvaler.org_name
              delete approvaler.org_code
              delete approvaler.renderKey
              // 处理流程额外增加字段
              const codeAddedSet = this[`F${this.detDataTemp.code}`]
              if (codeAddedSet) {
                Object.keys(codeAddedSet).forEach((key) => {
                  const { formatBack } = codeAddedSet[key]
                  approvaler[key] = formatBack(approvaler[key])
                })

                // 特殊关联字段处理
                if (
                  this.detDataTemp.code === '200005'
                  && approvaler.is_need_make !== 1
                ) {
                  approvaler.money_range = ''
                }

                if (
                  this.detDataTemp.code === '200016'
                  && approvaler.is_move_in_org !== 1
                  && approvaler.is_move_out_org !== 1
                ) {
                  approvaler.move_org_line = ''
                  approvaler.move_org_flag = ''
                }
              }
            })
          })
          postData.approval_list = JSON.stringify(postData.approval_list)
          postData.id = this.detDataTemp.id

          const { edit } = this.ajaxPath
          const { data: postBack } = await this.$axios
            .post(edit, postData)
          if (postBack.id) {
            this.detDataTemp.id = postBack.id
          }
          this.loading = false
        } catch (err) {
          this.loading = false
          console.log(err)
          return
        }

        // 备份数据
        Object.assign(this.queryDetData, JSON.parse(JSON.stringify(this.detData)))
        Object.assign(this.queryDetDataTemp, JSON.parse(JSON.stringify(this.detDataTemp)))
        this.pageBack()
      },

      async cancel() {
        // 取消确认
        try {
          await this.$confirm('系统可能不会保存您所做的更改，确认离开？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
        } catch (err) {
          console.log(err)
          return
        }

        this.pageBack()
      },

      pageBack() {
        // 页面返回
        this.noConfirm = true
        if (this.detDataTemp.id) {
          this.getEditChange()
        } else if (this.redirect) {
          this.getTo('back')
        } else {
          window.history.back()
        }
      },
    },
    beforeRouteUpdate(to, from, next) {
      // 阻止未保存离开
      if (this.noConfirm) {
        this.noConfirm = false
        next()
        return
      }
      // 1、从编辑到非编辑
      // 2、从编辑到编辑但ID变更
      const case1 = from.query.edit && !to.query.edit
      const case2 = from.query.edit &&
        to.query.edit &&
        String(to.params.id) !== String(from.params.id)
      if (case1 || case2) {
        next(false)
        setTimeout(() => {
          this.$confirm('系统可能不会保存您所做的更改，确认离开？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => next()).catch(() => next(false))
        }, 0)
      } else {
        next()
      }
    },
    beforeRouteLeave(to, from, next) {
      // 阻止未保存离开
      if (this.noConfirm) {
        this.noConfirm = false
        next()
        return
      }
      // 1、从编辑到其他
      if (from.query.edit) {
        next(false)
        setTimeout(() => {
          this.$confirm('系统可能不会保存您所做的更改，确认离开？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => next()).catch(() => next(false))
        }, 0)
      } else {
        next()
      }
    },
  }
</script>

<style lang="scss">
  .process-details {
    /* 节点块 */
    .point-wrap {
      margin: 22px 30px 0 20px;
    }

    /* 按钮部分 */
    .point-item {
      position: relative;
      display: inline-block;
      vertical-align: top;
      margin-bottom: 22px;

      /* 复写按钮样式 */
      .el-button {
        font-weight: bold;
        padding: 9px 17px;
      }

      .el-icon-circle-plus,
      .approval-reomve {
        position: absolute;
        right: 0;
        cursor: pointer;
      }

      .approval-reomve {
        top: 0;
        transform: translateX(50%) translateY(-50%);
      }

      .el-icon-circle-plus {
        bottom: 0;
        transform: translateX(50%) translateY(50%);
        display: none;
      }
    }

    /* 右箭头 */
    .m-icon-next {
      vertical-align: top;
      margin: 8px 15px 8px 10px;

      &.edit {
        margin-right: 10px;
      }
    }

    /* 添加按钮 */
    .point-add {
      margin-bottom: 22px;
      font-weight: bold;
      padding: 9px 17px;
    }

    .subtitle-wrap {
      position: relative;
    }

    /* subtitle */
    .subtitle {
      border-left-color: transparent;
      margin-top: 22px;
    }

    /* line */
    .border-block {
      border-width: 0;
      border-top-width: 1px;
    }

    /* plus */
    .approvaler-plus {
      font-size: 16px;
    }

    .approvaler-remove {
      position: absolute;
      top: 50%;
      right: 10px;
      font-size: 16px;
      transform: translateY(-50%);
    }
  }
</style>
