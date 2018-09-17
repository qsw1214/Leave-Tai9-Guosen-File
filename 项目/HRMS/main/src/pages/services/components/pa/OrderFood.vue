<template>
  <section class="page page--pa-order-food">
    <m-breadcrumb :items="breadcrumb" />
    <userinfo />

    <m-section
      title="申请表单"
      is-form>
      <m-section-row>
        <m-section-cell
          content="由系统生成"
          title="流程编码" />
        <m-section-cell
          content="提交后由系统生成"
          title="申请日期" />
      </m-section-row>

      <el-form
        class="m-section--form"
        label-width="140px"
        ref="district"
        :model="form"
        :rules="rules">
        <el-form-item
          label="办公地点"
          prop="district">
          <el-select
            placeholder="请选择"
            v-model="form.district"
            @change="districtChange">
            <el-option
              v-for="(item, prop) in districts"
              :key="prop"
              :label="item.value"
              :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>

      <m-section-row>
        <m-section-cell
          title="订餐说明"
          :content="description" />
      </m-section-row>
    </m-section>

    <food-list
      ref="foodList"
      :district="form.district"
      @selectMenuItem="selectMenuItem" />

    <footer class="page--pa-order-food--footer">
      <el-button
        type="primary"
        :loading="submitting"
        @click="submit">提交</el-button>
      <el-button
        type="info"
        @click="cancel">取消</el-button>
    </footer>
  </section>
</template>

<script>
  // 员工服务 -> 订餐
  import mixin from '~services/mixin'
  import Userinfo from '../common/Userinfo'
  import FoodList from './orderFood/FoodList'

  export default {
    name: 'PAOrderFood',
    components: { FoodList, Userinfo },
    mixins: [mixin.router],

    data() {
      const description = '<p>1. 请选择所在办公地点的套餐，跨区域下单无效；</p>'
        + '<p>2. 点击选择商品并提交，完成订餐；</p>'
        + '<p>3. 用餐结束后，请提供餐品小票和商家发票至前台报销。</p>'

      return {
        breadcrumb: this.$breadcrumb([
          { name: '订餐服务' },
        ]),
        form: {
          district: '',
        },
        rules: {
          district: [
            { required: true, message: '请选择办公地点', trigger: 'blur' },
          ],
        },
        description,
        orderId: '',
        submitting: false,
        canRedirect: false,
      }
    },

    computed: {
      districts() {
        return this.$store.state.services.districts
      },
    },

    methods: {
      validator() {
        return new Promise((resolve, reject) => {
          const $district = this.$refs.district
          $district.validate((valid) => {
            if (!valid) {
              window.scrollTo(0, $district.$el.offsetTop)
              return reject()
            }

            if (!this.orderId) {
              this.$message({
                type: 'error',
                message: '请选择一款商品',
              })

              return reject()
            }

            return resolve()
          })
        })
      },

      submitMsg() {
        const ary = [
          '加班辛苦啦！',
          '请安心用餐，补充体力再战！',
          '感谢付出，加油！',
        ]

        this.$message({
          type: 'success',
          message: ary[Math.floor(Math.random() * ary.length)],
          onClose: () => {
            this.submitting = false
            this.$router.replace('/application/index')
          },
        })
      },

      submit() {
        this
          .validator()
          .then(() => {
            this
              .$confirm('是否提交？', '提示', {
                type: 'warning',
              })
              .then(() => {
                this.post()
              })
              .catch(() => {})
          })
          .catch(() => {})
      },

      post() {
        const { orderId } = this
        this.submitting = true
        this.$axios.post(this.$api.services.pa.add, {
          flow_config_code: this.$route.params.code,
          flow_form_data: JSON.stringify({ dcfw_book_dinner_id: orderId }),
          status: 30,
        })
          .then(() => {
            this.canRedirect = true
            this.submitMsg()
          })
          .catch(() => {
            this.submitting = false
          })
      },

      selectMenuItem(val) {
        if (val) this.orderId = val.id
      },

      cancel() {
        this.$router.go(-1)
      },

      districtChange() {
        this.orderId = ''
        this.$refs.foodList.$emit('delMenu')
      },
    },
  }
</script>

