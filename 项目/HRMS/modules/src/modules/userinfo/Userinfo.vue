<template>
  <div
    class="m-userinfo"
    :class="{ horizontal: isHorizontal }">
    <div
      class="m-userinfo--avatar"
      v-if="userinfo.avatar_url">
      <div
        class="img"
        :style="{ 'background-image': 'url('+ userinfo.avatar_url +')' }" />
    </div>
    <div
      class="m-userinfo--avatar"
      v-else>
      <div class="img empty" />
    </div>
    <div class="m-userinfo--content">
      <p
        title="员工姓名"
        class="m-userinfo--name">{{ userinfo.name }}</p>
      <p class="m-userinfo--position">
        <span title="所属组织">{{ userinfo.org_name }}</span>
        <span v-if="userinfo.org_name && userinfo.job_name">•</span>
        <span title="职务">{{ userinfo.job_name }}</span>
      </p>
      <div class="m-userinfo--contact">
        <span
          class="field"
          title="手机号码"
          v-if="userinfo.mobile">
          <i class="el-icon-phone" />{{ userinfo.mobile }}
        </span>

        <span
          class="field"
          title="员工ID"
          v-if="userinfo.emp_code">
          <m-icon-id-card />{{ userinfo.emp_code }}
        </span>

        <span
          class="field broker"
          title="经纪号"
          v-if="userinfo.broker_code">
          <i class="el-icon-service" />{{ userinfo.broker_code }}
        </span>

        <span
          class="field email"
          title="内网邮箱"
          v-if="userinfo.email_inside">
          <i class="el-icon-message" />{{ userinfo.email_inside }}
        </span>

      </div>
    </div>
  </div>
</template>

<script>
  /**
   * @description 用户信息详情概览
   * @prop userinfo {Object} 用户信息
   * @example <m-userinfo :userinfo="userinfo" />
   * 传入指定字段才显示对应字段
   */
  export default {
    name: 'MUserinfo',
    props: {
      userinfo: {
        type: Object,
        default: () => ({}),
      },
      isHorizontal: {
        type: Boolean,
        default: false,
      },
    },
  }
</script>
