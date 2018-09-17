<template>
  <!-- 异常考勤规则编辑 -->
  <div
    v-loading="loading"
    class="attendance-rules-edit">

    <m-section
      class="inside-section"
      is-form>
      <!-- 迟到 -->
      <el-form
        class="wrap m-section--form"
        label-position="right"
        label-width="140px"
        ref="detData"
        :model="detData"
        :rules="detDataRules">
        <template v-for="(rule, index) in detData">

          <m-section-row
            v-if="rule.rule_type !== 5"
            :key="rule.id">

            <m-section-cell
              title="异常类型"
              :content="ruleType[rule.rule_type]" />

            <el-form-item
              label="当月免责次数"
              :prop="`${index}.exempt_times`"
              :rules="detDataRules.exempt_times">
              <el-select
                v-model="rule.exempt_times">
                <el-option
                  v-for="n in 32"
                  :value="n - 1"
                  :key="n - 1"
                  :label="`${n - 1}次`" />
              </el-select>
            </el-form-item>
          </m-section-row>
          <m-section-row
            v-if="rule.rule_type !== 5"
            :key="rule.id + 'min'">
            <el-form-item
              :label="rule.time_type === 1 ? '上班时间之后' : '下班时间之前'"
              :prop="`${index}.min_second`"
              :rules="listItemValidTimeRules(
                rule.time_type,
                rule.rule_type,
                index,
                'min_second'
              )">
              <el-input-number
                controls-position="right"
                v-model="rule.min_second"
                :min="0"
                @change="listItemValidTimeValidated(
                  rule.time_type,
                  rule.rule_type,
                  index,
                  'min_second'
                )" />
              分钟
            </el-form-item>

            <el-form-item
              label="到"
              :prop="`${index}.max_second`"
              :rules="listItemValidTimeRules(
                rule.time_type,
                rule.rule_type,
                index,
                'max_second'
              )">
              <el-input-number
                controls-position="right"
                v-model="rule.max_second"
                :min="0"
                @change="listItemValidTimeValidated(
                  rule.time_type,
                  rule.rule_type,
                  index,
                  'max_second'
                )" />
              分钟
            </el-form-item>
          </m-section-row>

          <!-- 旷工 -->
          <m-section-row
            v-if="rule.rule_type === 5 && rule.time_type === 1"
            :key="rule.id">
            <m-section-cell
              title="异常类型"
              content="旷工" />

            <el-form-item
              label="当月免责次数"
              :prop="`${index}.exempt_times`"
              :rules="detDataRules.exempt_times">
              <el-select
                v-model="rule.exempt_times">
                <el-option
                  v-for="n in 32"
                  :value="n - 1"
                  :key="n - 1"
                  :label="`${n - 1}次`" />
              </el-select>
            </el-form-item>
          </m-section-row>

          <m-section-row
            v-if="rule.rule_type === 5 && rule.time_type === 1"
            :key="rule.id + '1'">
            <el-form-item
              label="上班时间之后"
              :prop="`${index}.min_second`"
              :rules="listItemValidTimeRules(
                rule.time_type,
                rule.rule_type,
                index,
                'min_second'
              )">
              <el-input-number
                controls-position="right"
                v-model="rule.min_second"
                :min="0" />
              分钟则计为上午旷工
            </el-form-item>
          </m-section-row>

          <m-section-row
            v-if="rule.rule_type === 5 && rule.time_type === 2"
            :key="rule.id + '1'">
            <el-form-item
              label="下班时间之前"
              :prop="`${index}.min_second`"
              :rules="listItemValidTimeRules(
                rule.time_type,
                rule.rule_type,
                index,
                'min_second'
              )">
              <el-input-number
                controls-position="right"
                v-model="rule.min_second"
                :min="0"
                @change="listItemValidTimeValidated(
                  rule.time_type,
                  rule.rule_type,
                  index,
                  'max_second'
                )" />
              分钟则计为下午旷工
            </el-form-item>
          </m-section-row>

        </template>

        <m-section-row>
          <m-section-cell
            title=" ">
            <el-button
              type="primary"
              :loading="loading"
              @click="update">保存</el-button>
            <el-button
              type="info"
              @click="cancel">取消</el-button>
          </m-section-cell>
        </m-section-row>
      </el-form>
    </m-section>
  </div>
</template>

<script>
  export default {
    data() {
      const findO = (rule, value, t) => Object
        .values(this.detData).find(_ => (
          // 同一时间类型
          _.time_type === rule.timeType
          // 的另外一个
          && _.id !== t.id
          // 如果是目标矿工仅比较开始时间
          && ((
            _.rule_type === 5
          && value >= _.min_second
          ) || (
            // 否则就比较整个区间
            _.rule_type !== 5
          && value >= _.min_second
          && value <= _.max_second
          ))
        ))

      const beginTimeValidate = (rule, value, callback) => {
        // itemValidThis
        const t = this.detData[rule.index]
        // itemValidOther
        const o = findO(rule, value, t)

        if (o) {
          this.beginValidErr.add(rule.index)
          const tip = `当前开始分钟数与${this.ruleType[o.rule_type]}区间存在交叉`
          return callback(new Error(tip))
        } else if (rule.ruleType !== 5 && value > t.max_second) {
          this.beginValidErr.add(rule.index)
          return callback(new Error('开始分钟数不能大于结束分钟数'))
        }

        this.beginValidErr.delete(rule.index)
        return callback()
      }

      const endTimeValidate = (rule, value, callback) => {
        // itemValidThis
        const t = this.detData[rule.index]
        // itemValidOther
        const o = findO(rule, value, t)

        if (o) {
          this.endValidErr.add(rule.index)
          const tip = `当前结束分钟数与${this.ruleType[o.rule_type]}区间存在交叉`
          return callback(new Error(tip))
        } else if (rule.ruleType !== 5 && value < t.min_second) {
          this.endValidErr.add(rule.index)
          return callback(new Error('结束分钟数不能小于开始分钟数'))
        }

        this.endValidErr.delete(rule.index)
        return callback()
      }

      // 数字校验器
      const secondCheck = (rule, value, callback) => {
        if (!value && value !== 0) {
          return callback(new Error('请输入分钟数'))
        } else if (!Number.isFinite(value * 1)) {
          return callback(new Error('请仅输入数字'))
        } else if (value < 0 || value % 1 !== 0 || value.toString().includes('.')) {
          return callback(new Error('请输入正整数'))
        } else if (value.toString().length > 10) {
          return callback(new Error('最长10个字符'))
        }
        return callback()
      }

      return {
        loading: false,
        beginValidErr: new Set(),
        endValidErr: new Set(),
        detData: {},
        ruleType: {
          1: '迟到',
          2: '超时迟到',
          3: '早退',
          4: '超时早退',
          5: '旷工',
        },

        detDataRules: {
          exempt_times: [
            { required: true, type: 'number', message: '请选择当月免责次数', trigger: ['blur', 'change'] },
          ],
          min_second: [
            { required: true, type: 'number', message: '请输入分钟数', trigger: ['blur', 'change'] },
            { validator: secondCheck, type: 'number', trigger: ['blur', 'change'] },
            { validator: beginTimeValidate, type: 'number', trigger: ['blur', 'change'] },
          ],
          max_second: [
            { required: true, type: 'number', message: '请输入分钟数', trigger: ['blur', 'change'] },
            { validator: secondCheck, type: 'number', trigger: ['blur', 'change'] },
            { validator: endTimeValidate, type: 'number', trigger: ['blur', 'change'] },
          ],
        },
      }
    },
    created() {
      this.getData()
      this.$on('error', this.$message.error)
      this.$on('ok', this.$message.success)
    },
    methods: {
      // 获取数据
      async getData() {
        this.loading = true
        await this.$axios({
          url: this.$api.settings.attendance.ruleDet,
        }).then(({ code, data }) => {
          if (code === 0) {
            // 根据后端要求要换一下值，方便取数据
            data.list.forEach((rule) => {
              if (rule.rule_type === 5) rule.min_second = rule.max_second
            })
            this.detData = { ...data.list }
          }
        }).catch(() => {})
        this.loading = false
      },

      // listItemValidTimeRules
      listItemValidTimeRules(timeType, ruleType, index, key) {
        const push = { timeType, ruleType, index, key }
        const newRules = []
        newRules.push(
          Object.assign({}, this.detDataRules[key][0]),
          Object.assign({}, this.detDataRules[key][1]),
          Object.assign({}, this.detDataRules[key][2], push)
        )
        return newRules
      },

      // listItemValidTimeValidated
      listItemValidTimeValidated(timeType, ruleType, index, key) {
        this.beginValidErr.forEach((item) => {
          if (key === 'min_second' && item === index) return
          this.$refs.detData.validateField(`${item}.min_second`)
        })
        this.endValidErr.forEach((item) => {
          if (key === 'max_second' && item === index) return
          this.$refs.detData.validateField(`${item}.max_second`)
        })
      },

      // 保存
      async update() {
        if (this.loading) return
        // 表单校验
        try {
          await this.$refs.detData.validate()
        } catch (err) {
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
          console.log(err)
          return
        }

        // 数据提交
        try {
          const url = this.$api.settings.attendance.ruleEdit
          const data = {
            body: Object.values(this.detData),
          }
          // 根据后端要求要换一下值，方便取数据
          data.body.forEach((rule) => {
            if (rule.rule_type === 5) {
              rule.max_second = rule.min_second
              rule.min_second = 0
            }
          })
          data.body = JSON.stringify(data.body)

          const { code, msg } = await this.$axios
            .post(url, data)
          // 失败
          if (code) await Promise.reject(msg)
          // 成功
          this.$emit('ok', '保存成功')
        } catch (err) {
          this.loading = false
          console.log(err)
          return
        }

        this.loading = false
        this.$emit('canRedirect')
        window.history.go(-1)
      },

      // 取消
      cancel() {
        window.history.go(-1)
      },
    },
  }
</script>

<style lang="scss">
.attendance-rules-edit {
  .inside-section {
    border: 0;
    margin-top: -15px;
    margin-bottom: -15px;
    margin-right: -15px;
    margin-left: -15px;
  }
}
</style>
