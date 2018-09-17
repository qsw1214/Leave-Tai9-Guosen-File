<template>
  <div class="room-edit">
    <el-dialog
      autotest="edit"
      custom-class="room-edit__dialog"
      lock-scroll
      :title="!room.id ? '新建' : '修改'"
      :visible.sync="show"
      :modal-append-to-body="false"
      :show-close="false"
      :close-on-click-modal="false">

      <el-form
        v-loading="preloading"
        label-position="right"
        label-width="115px"
        ref="room"
        :model="room"
        :rules="roomRules">

        <el-form-item
          label="会议室区域"
          prop="district">
          <el-select
            autotest="edit-roomDistrict"
            placeholder="请选择"
            v-model="room.district">
            <el-option
              :value="256"
              :label="dictionary.officeSpace[256].label" />
            <el-option
              :value="128"
              :label="dictionary.officeSpace[128].label" />
            <el-option
              v-for="(district, index) in dictionary.officeSpace"
              v-if="district.value !== 128 && district.value !== 256"
              :autotest="'edit-roomDistrict-' + index"
              :key="district.value"
              :value="district.value"
              :label="district.label" />
          </el-select>
        </el-form-item>

        <el-form-item
          label="会议室名称"
          prop="name">
          <el-input
            autotest="edit-roomName"
            v-model="room.name" />
        </el-form-item>

        <el-form-item
          label="会议室状态"
          prop="status">
          <el-select
            autotest="edit-roomStatus"
            placeholder="请选择"
            v-model="room.status">
            <el-option
              label="禁用"
              :autotest="'edit-roomStatus-2'"
              :value="2" />
            <el-option
              label="启用"
              :autotest="'edit-roomStatus-1'"
              :value="1" />
          </el-select>
        </el-form-item>

        <el-form-item
          label="可容纳人数"
          prop="capacity"
          required>
          <el-input
            autotest="edit-roomCapacity"
            v-model="room.capacity" />
        </el-form-item>

        <el-form-item
          label="配套设备"
          prop="equipments">
          <multiple-select
            multiple
            autotest="edit-roomEquipments"
            placeholder="请选择"
            v-model="room.equipments">
            <el-option
              v-for="(equip, index) in equipList"
              :autotest="'edit-roomEquipments-' + index"
              :key="equip.id"
              :value="equip.id"
              :label="equip.name" />
          </multiple-select>
        </el-form-item>

        <el-form-item>
          <div class="room-edit__btn">
            <el-button
              autotest="btn-saveAndContinue"
              type="primary"
              v-if="!room.id && show"
              :loading="loading"
              @click="save($event, true)">保存并继续新增
            </el-button>
            <el-button
              autotest="btn-save"
              :type="!room.id && show ? '' : 'primary'"
              :loading="loading"
              @click="save">保存
            </el-button>
            <el-button
              autotest="btn-cancel"
              type="info"
              @click="cancel">取消
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'RoomEdit',
    data() {
      const capacityValid = (rule, value, callback) => {
        const reg = /^([1-9]\d*|[0]{1,1})$/
        if (!value) {
          return callback(new Error('请输入可容纳人数'))
        } else if (!reg.test(String(value))) {
          return callback(new Error('请输入正整数'))
        }
        return callback()
      }

      return {
        show: false,
        isSave: false,
        preloading: false,
        loading: false,
        equipList: [],

        room: {
          id: '',
          district: '',
          name: '',
          status: 1,
          capacity: '',
          equipments: [],
        },
        roomTemp: {},

        roomRules: {
          name: [
            { required: true, message: '请输入会议室名称', trigger: ['blur', 'change'] },
            { max: 30, message: '不超过30个字符', trigger: ['blur', 'change'] },
          ],
          status: [
            { required: true, message: '请选择会议室状态', trigger: ['blur', 'change'] },
          ],
          district: [
            { required: true, message: '请选择会议室区域', trigger: ['blur', 'change'] },
          ],
          capacity: [
            { validator: capacityValid, trigger: ['blur', 'change'] },
          ],
          equipments: [
            { required: true, type: 'array', message: '请选择配套设备', trigger: ['blur', 'change'] },
          ],
        },
      }
    },
    computed: {
      dictionary() {
        return this.$utils.config.dictionary.settings
      },
    },
    created() {
      // 初始化数据
      if (!Object.keys(this.roomTemp).length) {
        Object.assign(this.roomTemp, this.room)
      }

      // 本页面执行错误处理
      this.$on('error', this.$message.error)
      this.$on('ok', this.$message.success)
    },
    methods: {
      // 获取设备列表
      async getEquip(page = 1) {
        this.preloading = true
        await this.$axios({
          url: this.$api.settings.meeting.eGetList,
          params: {
            per_page: 10,
            page,
          },
        }).then(async ({ code, data }) => {
          if (code === 0) {
            this.equipList.push(...data.list)
            if (data.count > this.equipList.length) {
              await this.getEquip(page + 1)
            }
          }
        })
        this.preloading = false
      },

      // 获取详情
      async getDetail() {
        this.preloading = true
        await this.$axios({
          url: this.$api.settings.meeting.mDetail,
          params: { id: this.room.id },
        }).then((data) => {
          if (data.code === 0) {
            data.data.equipments = data.data.equipments.map(_ => _.id)
            Object.keys(this.room).forEach((key) => {
              this.room[key] = data.data[key]
            })
          }
        }).catch(() => {})
        this.preloading = false
      },

      // 打开方法
      open(id) {
        this.show = true
        // 获取配置数据
        if (!this.equipList.length) {
          this.getEquip()
        }

        // 获取详情信息
        if (id) {
          this.$nextTick(() => {
            this.room.id = id
            this.getDetail()
          })
        }
      },

      // 保存
      async save(e, type) {
        // 表单校验
        try {
          await this.$refs.room.validate()
        } catch (err) {
          console.log(err)
          return
        }

        // 提交确认
        try {
          await this.$confirm('是否确认保存？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
        } catch (err) {
          console.log(err)
          return
        }

        // 提交表单
        if (this.loading) return
        this.loading = true

        try {
          const url = !this.room.id
            ? this.$api.settings.meeting.mAdd
            : this.$api.settings.meeting.mEdit
          const tips = !this.room.id ? '新建成功' : '修改成功'
          const data = Object.assign({}, this.room)
          const { code, msg } = await this.$axios
            .post(url, data)
          // 失败
          if (code) await Promise.reject(msg)
          // 成功
          this.$emit('ok', tips)
          this.isSave = true
          this.resetForm()
          if (!type) this.close()
        } catch (err) {
          console.log(err)
        }

        this.loading = false
      },

      // 取消
      async cancel() {
        this.close()
        this.resetForm()
      },

      // 重置表单
      resetForm() {
        setTimeout(() => {
          Object.assign(this.room, this.roomTemp)
          this.$refs.room.resetFields()
        }, 500)
      },

      // 关闭表单
      close() {
        this.show = false
        this.$emit('end', this.isSave)
        this.isSave = false
      },
    },
  }
</script>

<style lang="scss">
  .room-edit {
    &__dialog {
      min-width: 650px !important;
      width: 650px !important;
    }

    .el-form {
      margin-left: 40px;
      padding-top: 10px;
    }

    .el-form-item__content {
      width: 353px;
    }

    .el-select {
      width: 100%;
    }

    &__btn {
      white-space: nowrap;
      padding-top: 18px;
      margin-bottom: -12px;
    }
  }
</style>
